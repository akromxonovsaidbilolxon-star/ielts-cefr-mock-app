import type { Attempt, Skill, SkillResult } from '../types';
import { scopedKey } from './currentUser';

const HISTORY_BASE = 'ielts-mock:history:v1';
const DRAFT_BASE = 'ielts-mock:draft:v1';

/** Keys are namespaced per signed-in user so a shared phone cannot leak results. */
const HISTORY_KEY = () => scopedKey(HISTORY_BASE);
const DRAFT_KEY = () => scopedKey(DRAFT_BASE);

/**
 * Copy pre-namespacing data into the signed-in user's namespace, once.
 * The legacy key is left untouched so the migration stays recoverable.
 */
export function migrateLegacyKeys(): void {
  if (scopedKey('') === ':anon') return;
  for (const base of [HISTORY_BASE, DRAFT_BASE]) {
    try {
      const legacy = localStorage.getItem(base);
      if (legacy && !localStorage.getItem(scopedKey(base))) {
        localStorage.setItem(scopedKey(base), legacy);
      }
    } catch {
      /* ignore */
    }
  }
}

function safeParse<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function loadHistory(): Attempt[] {
  const attempts = safeParse<Attempt[]>(localStorage.getItem(HISTORY_KEY()), []);
  if (!Array.isArray(attempts)) return [];
  return attempts.sort((a, b) => (a.dateISO < b.dateISO ? 1 : -1));
}

export function saveAttempt(attempt: Attempt): Attempt[] {
  const existing = loadHistory();
  const next = [attempt, ...existing.filter((a) => a.id !== attempt.id)].slice(0, 100);
  localStorage.setItem(HISTORY_KEY(), JSON.stringify(next));
  return next;
}

export function clearHistory(): void {
  localStorage.removeItem(HISTORY_KEY());
}

export function newAttempt(partial: Partial<Record<Skill, SkillResult>>): Attempt {
  return {
    id:
      typeof crypto !== 'undefined' && 'randomUUID' in crypto
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    dateISO: new Date().toISOString(),
    scores: partial,
  };
}

/** Latest result for each skill across all attempts. */
export function latestBySkill(attempts: Attempt[]): Partial<Record<Skill, SkillResult & { dateISO: string }>> {
  const out: Partial<Record<Skill, SkillResult & { dateISO: string }>> = {};
  const ordered = [...attempts].sort((a, b) => (a.dateISO < b.dateISO ? 1 : -1));
  for (const attempt of ordered) {
    for (const skill of Object.keys(attempt.scores) as Skill[]) {
      if (!out[skill] && attempt.scores[skill]) {
        out[skill] = { ...attempt.scores[skill]!, dateISO: attempt.dateISO };
      }
    }
  }
  return out;
}

export function bestBand(attempts: Attempt[], skill: Skill): number | null {
  const bands = attempts
    .map((a) => a.scores[skill]?.band)
    .filter((b): b is number => typeof b === 'number');
  if (bands.length === 0) return null;
  return Math.max(...bands);
}

/* ------------------------------------------------------------------ */
/* Drafts (so a refresh during an exam does not lose work)             */
/* ------------------------------------------------------------------ */

export interface Draft {
  answers: Record<number, string>;
  savedAtISO: string;
}

export function saveDraft(skill: Skill, draft: Draft): void {
  try {
    const all = safeParse<Record<string, Draft>>(localStorage.getItem(DRAFT_KEY()), {});
    all[skill] = draft;
    localStorage.setItem(DRAFT_KEY(), JSON.stringify(all));
  } catch {
    /* storage full or unavailable — ignore */
  }
}

export function loadDraft(skill: Skill): Draft | null {
  const all = safeParse<Record<string, Draft>>(localStorage.getItem(DRAFT_KEY()), {});
  return all[skill] ?? null;
}

export function clearDraft(skill: Skill): void {
  const all = safeParse<Record<string, Draft>>(localStorage.getItem(DRAFT_KEY()), {});
  delete all[skill];
  localStorage.setItem(DRAFT_KEY(), JSON.stringify(all));
}
