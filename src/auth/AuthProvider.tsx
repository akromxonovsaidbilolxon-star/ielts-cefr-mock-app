import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import {
  clearSession,
  isEnforced,
  logEvent,
  readSession,
  saveSession,
  sessionIsStale,
  signIn as authSignIn,
  signOut as authSignOut,
  touchSession,
  type LoginResult,
  type Session,
} from '../lib/auth';

interface AuthContextValue {
  session: Session | null;
  ready: boolean;
  /** True when the deployed build carries a roster (cannot be edited locally). */
  enforced: boolean;
  /** True when no roster exists yet, so the first visitor sets up the owner. */
  needsSetup: boolean;
  signIn: (username: string, password: string, remember: boolean) => Promise<LoginResult>;
  signOut: () => void;
  /** Called after the owner is created during first-run setup. */
  adoptSession: (session: Session) => void;
  /** Persist a session and mark the app as enforced (after owner creation). */
  enforceSetup: (session: Session) => void;
  refreshEnforcement: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const ACTIVITY_EVENTS = ['pointerdown', 'keydown', 'touchstart', 'focus'] as const;

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [ready, setReady] = useState(false);
  const [enforced, setEnforced] = useState(false);
  const [rosterVersion, setRosterVersion] = useState(0);

  /* ---------------- initial load ---------------- */
  useEffect(() => {
    let cancelled = false;

    const boot = async () => {
      const stored = readSession();
      if (stored && sessionIsStale(stored)) {
        clearSession();
        logEvent(stored.username, 'session.expired');
        if (!cancelled) {
          setSession(null);
          setEnforced(isEnforced());
          setReady(true);
        }
        return;
      }
      if (!cancelled) {
        setSession(stored ?? null);
        setEnforced(isEnforced());
        setReady(true);
      }
    };

    void boot();
    return () => {
      cancelled = true;
    };
  }, [rosterVersion]);

  /* ---------------- idle / absolute expiry guard ---------------- */
  useEffect(() => {
    if (!session) return;

    const check = () => {
      const current = readSession();
      if (!current || sessionIsStale(current)) {
        clearSession();
        logEvent(session.username, 'session.expired', 'timed out');
        setSession(null);
      }
    };

    // Re-evaluate on a slow tick and whenever the tab regains focus.
    const interval = window.setInterval(check, 30_000);
    const onVisible = () => {
      if (document.visibilityState === 'visible') check();
    };
    document.addEventListener('visibilitychange', onVisible);
    window.addEventListener('focus', check);

    return () => {
      window.clearInterval(interval);
      document.removeEventListener('visibilitychange', onVisible);
      window.removeEventListener('focus', check);
    };
  }, [session]);

  /* ---------------- idle activity tracking ---------------- */
  useEffect(() => {
    if (!session) return;

    let lastWrite = 0;
    const onActivity = () => {
      const now = Date.now();
      // Throttle writes so pointer/key events cannot hammer storage.
      if (now - lastWrite < 15_000) return;
      lastWrite = now;
      const current = readSession();
      if (!current) return;
      const touched = touchSession(current);
      setSession((prev) =>
        prev && prev.lastSeenISO !== touched.lastSeenISO
          ? { ...prev, lastSeenISO: touched.lastSeenISO }
          : prev,
      );
    };

    for (const event of ACTIVITY_EVENTS) {
      window.addEventListener(event, onActivity, { passive: true });
    }
    return () => {
      for (const event of ACTIVITY_EVENTS) {
        window.removeEventListener(event, onActivity);
      }
    };
  }, [session]);

  /* ---------------- cross-tab sync ---------------- */
  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key && event.key.includes('ielts-mock:auth:session')) {
        const current = readSession();
        setSession(current && !sessionIsStale(current) ? current : null);
      }
      if (event.key && event.key.includes('ielts-mock:auth:local-roster')) {
        setRosterVersion((v) => v + 1);
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const signIn = useCallback(async (username: string, password: string, remember: boolean) => {
    const result = await authSignIn(username, password, remember);
    if (result.ok) setSession(result.session);
    return result;
  }, []);

  const signOut = useCallback(() => {
    authSignOut(session);
    setSession(null);
  }, [session]);

  const adoptSession = useCallback((next: Session) => {
    saveSession(next);
    setSession(next);
  }, []);

  const refreshEnforcement = useCallback(() => {
    setEnforced(isEnforced());
    setRosterVersion((v) => v + 1);
  }, []);

  const enforceSetup = useCallback((next: Session) => {
    // The owner just created the first account, so the app is now locked.
    saveSession(next);
    setSession(next);
    setEnforced(true);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      ready,
      enforced,
      needsSetup: !enforced && !session,
      signIn,
      signOut,
      adoptSession,
      enforceSetup,
      refreshEnforcement,
    }),
    [session, ready, enforced, signIn, signOut, adoptSession, enforceSetup, refreshEnforcement],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}

/** Convenience guard: redirects callers to /login when signed out. */
export function useRequireAuth(): { session: Session; ready: boolean } {
  const { session, ready } = useAuth();
  return { session: session as Session, ready };
}
