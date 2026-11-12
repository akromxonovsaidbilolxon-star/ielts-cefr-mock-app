/**
 * Access control for the IELTS mock app.
 *
 * DESIGN
 * ------
 * This is a static app (no backend), so the only place a rule can actually be
 * enforced is the build itself. The authoritative list of allowed people lives
 * in the `VITE_ACCESS_ROSTER` environment variable, which is baked into the
 * deployed JavaScript at build time. Only someone who can rebuild and redeploy
 * can change it — which is exactly "only the owner decides who gets in".
 *
 * Passwords are never stored in plain text: each roster entry holds a
 * PBKDF2-SHA256 hash and a per-user random salt. Login derives the same hash and
 * compares it in constant time.
 *
 * LIMITS (read this before relying on it)
 * ---------------------------------------
 * Because the check runs in the browser, a determined visitor can read the
 * bundle, find the hashes, and bypass the UI. This is a door lock, not a vault:
 * it stops casual sharing and lets you control a class or study group, but it is
 * not suitable for confidential material. For real enforcement, put the app
 * behind a server (see README "Locking it down properly").
 */

export type Role = 'owner' | 'user';
export type UserStatus = 'active' | 'suspended';

export interface RosterUser {
  id: string;
  /** Lower-case unique key used for login. */
  username: string;
  displayName: string;
  role: Role;
  /** Base64 of the random salt. */
  salt: string;
  /** Base64 of the PBKDF2 derived key. */
  hash: string;
  iterations: number;
  status: UserStatus;
  createdAtISO: string;
  /** Optional cut-off date; login is refused after this instant. */
  expiresAtISO?: string | null;
  note?: string;
}

export interface Session {
  userId: string;
  username: string;
  displayName: string;
  role: Role;
  issuedAtISO: string;
  lastSeenISO: string;
  expiresAtISO: string;
  remember: boolean;
}

export interface AuditEntry {
  id: string;
  atISO: string;
  actor: string;
  action: string;
  detail?: string;
}

const KEYS = {
  localRoster: 'ielts-mock:auth:local-roster:v1',
  session: 'ielts-mock:auth:session:v1',
  audit: 'ielts-mock:auth:audit:v1',
  attempts: 'ielts-mock:auth:attempts:v1',
} as const;

export const PBKDF2_ITERATIONS = 210_000;
export const SESSION_HOURS = 12;
export const IDLE_MINUTES = 60;
export const MAX_FAILED_ATTEMPTS = 5;
export const LOCKOUT_MINUTES = 5;
export const AUDIT_LIMIT = 200;

/* ------------------------------------------------------------------ */
/* Encoding helpers                                                    */
/* ------------------------------------------------------------------ */

const encoder = new TextEncoder();

export function bytesToBase64(bytes: Uint8Array): string {
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary);
}

export function base64ToBytes(value: string): Uint8Array<ArrayBuffer> {
  const normalised = value.replace(/-/g, '+').replace(/_/g, '/');
  const binary = atob(normalised);
  // Backed by a plain ArrayBuffer so it satisfies Web Crypto's BufferSource.
  const out = new Uint8Array(new ArrayBuffer(binary.length));
  for (let i = 0; i < binary.length; i += 1) out[i] = binary.charCodeAt(i);
  return out;
}

function utf8ToBase64(text: string): string {
  return bytesToBase64(encoder.encode(text));
}

function base64ToUtf8(value: string): string {
  const normalised = value.replace(/-/g, '+').replace(/_/g, '/');
  const bytes = base64ToBytes(normalised);
  return new TextDecoder().decode(bytes);
}

export function randomId(prefix = ''): string {
  const bytes = new Uint8Array(9);
  crypto.getRandomValues(bytes);
  const hex = [...bytes].map((b) => b.toString(16).padStart(2, '0')).join('');
  return prefix ? `${prefix}_${hex}` : hex;
}

export function makeSalt(): string {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return bytesToBase64(bytes);
}

/* ------------------------------------------------------------------ */
/* Password hashing                                                    */
/* ------------------------------------------------------------------ */

/** True when the browser exposes Web Crypto (requires HTTPS or localhost). */
export function hasStrongCrypto(): boolean {
  return (
    typeof crypto !== 'undefined' &&
    typeof crypto.subtle !== 'undefined' &&
    typeof crypto.subtle.deriveBits === 'function'
  );
}

/**
 * Derive a PBKDF2-SHA256 key. Returns base64.
 *
 * If Web Crypto is unavailable (plain HTTP on a LAN address) we fall back to a
 * deliberately weak iterated hash so the app still works, and the UI shows a
 * warning. The fallback is NOT secure and is flagged in `isDegraded()`.
 */
export async function hashPassword(
  password: string,
  saltB64: string,
  iterations = PBKDF2_ITERATIONS,
): Promise<string> {
  if (hasStrongCrypto()) {
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(password),
      'PBKDF2',
      false,
      ['deriveBits'],
    );
    const bits = await crypto.subtle.deriveBits(
      { name: 'PBKDF2', salt: base64ToBytes(saltB64), iterations, hash: 'SHA-256' },
      key,
      256,
    );
    return bytesToBase64(new Uint8Array(bits));
  }
  return weakFallbackHash(password, saltB64, iterations);
}

/** Non-cryptographic fallback used only when Web Crypto is missing. */
function weakFallbackHash(password: string, saltB64: string, iterations: number): string {
  let h1 = 0x811c9dc5;
  let h2 = 0x1000193;
  const input = `${saltB64}:${password}`;
  for (let round = 0; round < Math.min(iterations, 20_000); round += 1) {
    for (let i = 0; i < input.length; i += 1) {
      const code = input.charCodeAt(i) + round;
      h1 ^= code;
      h1 = Math.imul(h1, 0x01000193) >>> 0;
      h2 = (Math.imul(h2 ^ code, 0x85ebca6b) + round) >>> 0;
    }
  }
  const bytes = new Uint8Array(16);
  for (let i = 0; i < 8; i += 1) {
    bytes[i] = (h1 >>> (i * 4)) & 0xff;
    bytes[8 + i] = (h2 >>> (i * 4)) & 0xff;
  }
  return `weak.${bytesToBase64(bytes)}`;
}

/** Constant-time-ish comparison so timing does not leak hash prefixes. */
export function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i += 1) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

/* ------------------------------------------------------------------ */
/* Roster parsing                                                      */
/* ------------------------------------------------------------------ */

/** Accepts either raw JSON or (url-safe) base64-encoded JSON. */
export function parseRoster(raw: string): RosterUser[] {
  const text = (raw ?? '').trim();
  if (!text) return [];
  let json = text;
  if (!text.startsWith('[')) {
    try {
      json = base64ToUtf8(text);
    } catch {
      return [];
    }
  }
  try {
    const parsed: unknown = JSON.parse(json);
    if (!Array.isArray(parsed)) return [];
    return parsed.map(coerceUser).filter((u): u is RosterUser => u !== null);
  } catch {
    return [];
  }
}

function coerceUser(value: unknown): RosterUser | null {
  if (!value || typeof value !== 'object') return null;
  const raw = value as Record<string, unknown>;
  const username = typeof raw.username === 'string' ? raw.username.trim().toLowerCase() : '';
  const salt = typeof raw.salt === 'string' ? raw.salt : '';
  const hash = typeof raw.hash === 'string' ? raw.hash : '';
  if (!username || !salt || !hash) return null;
  return {
    id: typeof raw.id === 'string' && raw.id ? raw.id : `u_${username}`,
    username,
    displayName:
      typeof raw.displayName === 'string' && raw.displayName.trim()
        ? raw.displayName.trim()
        : username,
    role: raw.role === 'owner' ? 'owner' : 'user',
    salt,
    hash,
    iterations: typeof raw.iterations === 'number' ? raw.iterations : PBKDF2_ITERATIONS,
    status: raw.status === 'suspended' ? 'suspended' : 'active',
    createdAtISO:
      typeof raw.createdAtISO === 'string' ? raw.createdAtISO : new Date().toISOString(),
    expiresAtISO: typeof raw.expiresAtISO === 'string' ? raw.expiresAtISO : null,
    note: typeof raw.note === 'string' ? raw.note : undefined,
  };
}

/** Serialise the roster for pasting into `.env`. */
export function rosterToEnvLine(users: RosterUser[]): string {
  const minimal = users.map((u) => ({
    username: u.username,
    displayName: u.displayName,
    role: u.role,
    salt: u.salt,
    hash: u.hash,
    iterations: u.iterations,
    status: u.status,
    createdAtISO: u.createdAtISO,
    ...(u.expiresAtISO ? { expiresAtISO: u.expiresAtISO } : {}),
    ...(u.note ? { note: u.note } : {}),
  }));
  return `VITE_ACCESS_ROSTER=${utf8ToBase64(JSON.stringify(minimal))}`;
}

/* ------------------------------------------------------------------ */
/* Effective roster                                                    */
/* ------------------------------------------------------------------ */

function envRoster(): RosterUser[] {
  // `import.meta.env` is replaced by Vite at build time. Guard it so the module
  // also works in plain Node (tests, scripts) where it is undefined.
  let raw = '';
  try {
    raw = (import.meta.env?.VITE_ACCESS_ROSTER as string | undefined) ?? '';
  } catch {
    raw = '';
  }
  return parseRoster(raw);
}

/** Users baked into the deployed build. Empty when not configured. */
export function bakedRoster(): RosterUser[] {
  return envRoster();
}

/** True when access rules are enforced by the build (cannot be edited locally). */
export function isEnforced(): boolean {
  return envRoster().length > 0;
}

/** Local-only roster, used for development when no env roster exists. */
export function localRoster(): RosterUser[] {
  try {
    const raw = localStorage.getItem(KEYS.localRoster);
    return raw ? parseRoster(raw) : [];
  } catch {
    return [];
  }
}

export function saveLocalRoster(users: RosterUser[]): void {
  try {
    localStorage.setItem(KEYS.localRoster, JSON.stringify(users));
  } catch {
    /* ignore quota errors */
  }
}

/** The roster the app actually authenticates against. */
export function effectiveRoster(): RosterUser[] {
  const baked = envRoster();
  return baked.length > 0 ? baked : localRoster();
}

export function findUser(username: string): RosterUser | undefined {
  const key = username.trim().toLowerCase();
  return effectiveRoster().find((u) => u.username === key);
}

/* ------------------------------------------------------------------ */
/* Login attempt throttling                                            */
/* ------------------------------------------------------------------ */

interface AttemptRecord {
  count: number;
  lockedUntil: number;
}

function readAttempts(): Record<string, AttemptRecord> {
  try {
    const raw = localStorage.getItem(KEYS.attempts);
    return raw ? (JSON.parse(raw) as Record<string, AttemptRecord>) : {};
  } catch {
    return {};
  }
}

function writeAttempts(records: Record<string, AttemptRecord>): void {
  try {
    localStorage.setItem(KEYS.attempts, JSON.stringify(records));
  } catch {
    /* ignore */
  }
}

/** Minutes remaining on a lockout, or 0 when not locked. */
export function lockoutRemaining(username: string): number {
  const record = readAttempts()[username.trim().toLowerCase()];
  if (!record) return 0;
  const left = record.lockedUntil - Date.now();
  return left > 0 ? Math.ceil(left / 60_000) : 0;
}

function recordFailure(username: string): void {
  const key = username.trim().toLowerCase();
  const records = readAttempts();
  const current = records[key] ?? { count: 0, lockedUntil: 0 };
  const count = current.count + 1;
  records[key] = {
    count,
    lockedUntil:
      count >= MAX_FAILED_ATTEMPTS ? Date.now() + LOCKOUT_MINUTES * 60_000 : current.lockedUntil,
  };
  writeAttempts(records);
}

function clearFailures(username: string): void {
  const key = username.trim().toLowerCase();
  const records = readAttempts();
  if (key in records) {
    delete records[key];
    writeAttempts(records);
  }
}

/* ------------------------------------------------------------------ */
/* Audit log                                                           */
/* ------------------------------------------------------------------ */

export function readAudit(): AuditEntry[] {
  try {
    const raw = localStorage.getItem(KEYS.audit);
    const entries = raw ? (JSON.parse(raw) as AuditEntry[]) : [];
    return Array.isArray(entries) ? entries : [];
  } catch {
    return [];
  }
}

export function logEvent(actor: string, action: string, detail?: string): void {
  try {
    const entry: AuditEntry = {
      id: randomId('a'),
      atISO: new Date().toISOString(),
      actor,
      action,
      detail,
    };
    const next = [entry, ...readAudit()].slice(0, AUDIT_LIMIT);
    localStorage.setItem(KEYS.audit, JSON.stringify(next));
  } catch {
    /* ignore */
  }
}

export function clearAudit(): void {
  try {
    localStorage.removeItem(KEYS.audit);
  } catch {
    /* ignore */
  }
}

/* ------------------------------------------------------------------ */
/* Sessions                                                            */
/* ------------------------------------------------------------------ */

function storageFor(remember: boolean): Storage {
  return remember ? localStorage : sessionStorage;
}

export function readSession(): Session | null {
  for (const store of [sessionStorage, localStorage]) {
    try {
      const raw = store.getItem(KEYS.session);
      if (!raw) continue;
      const session = JSON.parse(raw) as Session;
      if (session?.userId && session?.expiresAtISO) return session;
    } catch {
      /* ignore malformed entries */
    }
  }
  return null;
}

export function saveSession(session: Session): void {
  try {
    storageFor(session.remember).setItem(KEYS.session, JSON.stringify(session));
  } catch {
    /* ignore */
  }
}

export function clearSession(): void {
  try {
    sessionStorage.removeItem(KEYS.session);
    localStorage.removeItem(KEYS.session);
  } catch {
    /* ignore */
  }
}

/** True when the session is past its absolute or idle expiry. */
export function sessionIsStale(session: Session): boolean {
  const now = Date.now();
  if (new Date(session.expiresAtISO).getTime() <= now) return true;
  const lastSeen = new Date(session.lastSeenISO).getTime();
  return now - lastSeen > IDLE_MINUTES * 60_000;
}

/** Refresh the idle timer. Returns the updated session. */
export function touchSession(session: Session): Session {
  const next: Session = { ...session, lastSeenISO: new Date().toISOString() };
  saveSession(next);
  return next;
}

/* ------------------------------------------------------------------ */
/* Login / logout                                                      */
/* ------------------------------------------------------------------ */

export type LoginResult =
  | { ok: true; session: Session }
  | { ok: false; error: string };

export async function signIn(
  username: string,
  password: string,
  remember: boolean,
): Promise<LoginResult> {
  const key = username.trim().toLowerCase();
  if (!key || !password) {
    return { ok: false, error: 'Enter both your username and password.' };
  }

  const lockedMinutes = lockoutRemaining(key);
  if (lockedMinutes > 0) {
    return {
      ok: false,
      error: `Too many failed attempts. Try again in ${lockedMinutes} minute${
        lockedMinutes === 1 ? '' : 's'
      }.`,
    };
  }

  const user = findUser(key);
  if (!user) {
    recordFailure(key);
    logEvent(key, 'login.failed', 'unknown username');
    return { ok: false, error: 'Incorrect username or password.' };
  }

  if (user.status === 'suspended') {
    logEvent(key, 'login.blocked', 'account suspended');
    return { ok: false, error: 'This account has been suspended by the owner.' };
  }

  if (user.expiresAtISO && new Date(user.expiresAtISO).getTime() <= Date.now()) {
    logEvent(key, 'login.blocked', 'access expired');
    return { ok: false, error: 'Your access has expired. Ask the owner to extend it.' };
  }

  const candidate = await hashPassword(password, user.salt, user.iterations);
  if (!safeEqual(candidate, user.hash)) {
    recordFailure(key);
    logEvent(key, 'login.failed', 'wrong password');
    return { ok: false, error: 'Incorrect username or password.' };
  }

  clearFailures(key);

  const now = new Date();
  const session: Session = {
    userId: user.id,
    username: user.username,
    displayName: user.displayName,
    role: user.role,
    issuedAtISO: now.toISOString(),
    lastSeenISO: now.toISOString(),
    expiresAtISO: new Date(now.getTime() + SESSION_HOURS * 3_600_000).toISOString(),
    remember,
  };

  saveSession(session);
  logEvent(user.username, 'login.success', remember ? 'remembered device' : 'this session only');
  return { ok: true, session };
}

export function signOut(session: Session | null): void {
  if (session) logEvent(session.username, 'logout');
  clearSession();
}

/* ------------------------------------------------------------------ */
/* Account creation (used by the owner in the admin panel)             */
/* ------------------------------------------------------------------ */

export interface NewUserInput {
  username: string;
  displayName: string;
  password: string;
  role: Role;
  expiresAtISO?: string | null;
  note?: string;
}

export async function createUser(input: NewUserInput): Promise<RosterUser> {
  const salt = makeSalt();
  const hash = await hashPassword(input.password, salt);
  return {
    id: randomId('u'),
    username: input.username.trim().toLowerCase(),
    displayName: input.displayName.trim() || input.username.trim(),
    role: input.role,
    salt,
    hash,
    iterations: PBKDF2_ITERATIONS,
    status: 'active',
    createdAtISO: new Date().toISOString(),
    expiresAtISO: input.expiresAtISO ?? null,
    note: input.note,
  };
}

export async function setPassword(user: RosterUser, password: string): Promise<RosterUser> {
  const salt = makeSalt();
  const hash = await hashPassword(password, salt);
  return { ...user, salt, hash, iterations: PBKDF2_ITERATIONS };
}

/* ------------------------------------------------------------------ */
/* Validation                                                          */
/* ------------------------------------------------------------------ */

export function validateUsername(username: string): string | null {
  const value = username.trim();
  if (value.length < 3) return 'Username must be at least 3 characters.';
  if (value.length > 32) return 'Username must be 32 characters or fewer.';
  if (!/^[a-zA-Z0-9._-]+$/.test(value)) {
    return 'Use only letters, numbers, dot, dash or underscore.';
  }
  return null;
}

export function validatePassword(password: string): string | null {
  if (password.length < 8) return 'Password must be at least 8 characters.';
  if (password.length > 128) return 'Password must be 128 characters or fewer.';
  if (!/[a-zA-Z]/.test(password) || !/[0-9]/.test(password)) {
    return 'Password must contain at least one letter and one number.';
  }
  return null;
}
