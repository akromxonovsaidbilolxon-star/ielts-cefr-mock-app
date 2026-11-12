import type { MlAttempt, MlLevel } from '../content/multilevel/types';
import { averageScore, scoreToAward } from './multilevel';

const HISTORY_KEY = 'ielts-mock:multilevel:history:v1';
const PRACTICE_KEY = 'ielts-mock:multilevel:practice:v1';
const DRAFT_KEY = 'ielts-mock:multilevel:draft:v1';

function safeParse<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

/* ------------------------------------------------------------------ */
/* Attempt history (kept entirely separate from IELTS results)         */
/* ------------------------------------------------------------------ */

export function loadMlHistory(): MlAttempt[] {
  const attempts = safeParse<MlAttempt[]>(localStorage.getItem(HISTORY_KEY), []);
  if (!Array.isArray(attempts)) return [];
  return attempts.sort((a, b) => (a.dateISO < b.dateISO ? 1 : -1));
}

export function saveMlAttempt(attempt: MlAttempt): MlAttempt[] {
  const existing = loadMlHistory();
  const next = [attempt, ...existing.filter((a) => a.id !== attempt.id)].slice(0, 100);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(next));
  return next;
}

export function clearMlHistory(): void {
  localStorage.removeItem(HISTORY_KEY);
}

/**
 * Create an attempt. The overall score is recomputed from whichever sections
 * are present, so partial runs (e.g. Listening only) are still valid.
 */
export function newMlAttempt(partial: Omit<MlAttempt, 'id' | 'dateISO'>): MlAttempt {
  const sections = [
    partial.listening?.score,
    partial.reading?.score,
    partial.writing?.score,
    partial.speaking?.score,
  ];
  const overall = averageScore(
    sections.filter((s): s is number => typeof s === 'number'),
  );
  return {
    ...partial,
    id:
      typeof crypto !== 'undefined' && 'randomUUID' in crypto
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    dateISO: new Date().toISOString(),
    overall: overall ?? undefined,
    award: overall !== null ? scoreToAward(overall) : undefined,
  };
}

/** Latest result per section across all Multilevel attempts. */
export function latestMlSection(attempts: MlAttempt[]) {
  const out: Record<string, { score: number; dateISO: string }> = {};
  const ordered = [...attempts].sort((a, b) => (a.dateISO < b.dateISO ? 1 : -1));
  for (const attempt of ordered) {
    for (const section of ['listening', 'reading', 'writing', 'speaking'] as const) {
      const value = attempt[section];
      if (!out[section] && value) {
        out[section] = { score: value.score, dateISO: attempt.dateISO };
      }
    }
  }
  return out;
}

export function bestMlSection(attempts: MlAttempt[], section: string): number | null {
  const values = attempts
    .map((a) => (a as unknown as Record<string, { score?: number } | undefined>)[section]?.score)
    .filter((v): v is number => typeof v === 'number');
  return values.length ? Math.max(...values) : null;
}

/* ------------------------------------------------------------------ */
/* Practice Mode: chosen starting level, per skill                     */
/* ------------------------------------------------------------------ */

export type PracticeSkill = 'listening' | 'reading' | 'writing' | 'speaking';

export interface PracticeState {
  /** Starting level the learner chose (or that placement suggested). */
  levels: Partial<Record<PracticeSkill, MlLevel>>;
  /** Recently seen part numbers, so the next set can rotate. */
  seen: Partial<Record<PracticeSkill, number[]>>;
  placementDone?: boolean;
}

const DEFAULT_PRACTICE: PracticeState = { levels: {}, seen: {} };

export function loadPractice(): PracticeState {
  return safeParse<PracticeState>(localStorage.getItem(PRACTICE_KEY), DEFAULT_PRACTICE);
}

export function savePractice(state: PracticeState): void {
  try {
    localStorage.setItem(PRACTICE_KEY, JSON.stringify(state));
  } catch {
    /* ignore quota errors */
  }
}

export function setPracticeLevel(skill: PracticeSkill, level: MlLevel): PracticeState {
  const state = loadPractice();
  const next: PracticeState = {
    ...state,
    levels: { ...state.levels, [skill]: level },
  };
  savePractice(next);
  return next;
}

/* ------------------------------------------------------------------ */
/* Drafts for the writing section                                     */
/* ------------------------------------------------------------------ */

export interface MlDraft {
  texts: Record<string, string>;
  savedAtISO: string;
}

export function saveMlDraft(draft: MlDraft): void {
  try {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
  } catch {
    /* ignore */
  }
}

export function loadMlDraft(): MlDraft | null {
  return safeParse<MlDraft | null>(localStorage.getItem(DRAFT_KEY), null);
}

export function clearMlDraft(): void {
  localStorage.removeItem(DRAFT_KEY);
}
