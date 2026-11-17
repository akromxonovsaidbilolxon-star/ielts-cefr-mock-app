import type { Skill } from '../types';
import { scopedKey } from './currentUser';

/**
 * Storage for Cambridge book tests.
 *
 * Kept in its own namespace, separate from `lib/storage.ts`, because the
 * built-in free paper and a real Cambridge test must never overwrite each
 * other's "latest band". Everything is also scoped to the signed-in user.
 */

const BASE = 'ielts-mock:cambridge:v1';

export interface CambridgeScore {
  testId: string;
  testLabel: string;
  skill: Skill;
  dateISO: string;
  band: number;
  correct?: number;
  total?: number;
  /** Writing/Speaking breakdown, when there is one. */
  detail?: Record<string, number>;
}

const historyKey = () => scopedKey(`${BASE}:history`);
const draftKey = (testId: string, skill: Skill) => scopedKey(`${BASE}:draft:${testId}:${skill}`);
const reviewKey = (testId: string, skill: Skill) =>
  scopedKey(`${BASE}:review:${testId}:${skill}`);
const writingKey = (testId: string) => scopedKey(`${BASE}:writing:${testId}`);

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

/* ------------------------------------------------------------------ */
/* History                                                             */
/* ------------------------------------------------------------------ */

export function loadCambridgeHistory(): CambridgeScore[] {
  const list = read<CambridgeScore[]>(historyKey(), []);
  if (!Array.isArray(list)) return [];
  return list.sort((a, b) => (a.dateISO < b.dateISO ? 1 : -1));
}

export function saveCambridgeScore(score: CambridgeScore): CambridgeScore[] {
  const next = [score, ...loadCambridgeHistory()].slice(0, 200);
  try {
    localStorage.setItem(historyKey(), JSON.stringify(next));
  } catch {
    /* quota — ignore, the attempt still shows this session */
  }
  return next;
}

/** Best band per skill for one test. */
export function bestForTest(history: CambridgeScore[], testId: string): Partial<Record<Skill, number>> {
  const out: Partial<Record<Skill, number>> = {};
  for (const row of history) {
    if (row.testId !== testId) continue;
    const prev = out[row.skill];
    if (prev === undefined || row.band > prev) out[row.skill] = row.band;
  }
  return out;
}

export function latestForTest(
  history: CambridgeScore[],
  testId: string,
): Partial<Record<Skill, CambridgeScore>> {
  const out: Partial<Record<Skill, CambridgeScore>> = {};
  for (const row of [...history].sort((a, b) => (a.dateISO < b.dateISO ? 1 : -1))) {
    if (row.testId !== testId) continue;
    if (!out[row.skill]) out[row.skill] = row;
  }
  return out;
}

/* ------------------------------------------------------------------ */
/* Drafts                                                              */
/* ------------------------------------------------------------------ */

export interface CambridgeDraft {
  answers: Record<number, string>;
  savedAtISO: string;
}

export function saveCambridgeDraft(testId: string, skill: Skill, draft: CambridgeDraft): void {
  try {
    localStorage.setItem(draftKey(testId, skill), JSON.stringify(draft));
  } catch {
    /* ignore */
  }
}

export function loadCambridgeDraft(testId: string, skill: Skill): CambridgeDraft | null {
  return read<CambridgeDraft | null>(draftKey(testId, skill), null);
}

export function clearCambridgeDraft(testId: string, skill: Skill): void {
  try {
    localStorage.removeItem(draftKey(testId, skill));
  } catch {
    /* ignore */
  }
}

/* ------------------------------------------------------------------ */
/* Answer review + writing report                                      */
/* ------------------------------------------------------------------ */

export interface CambridgeReview {
  skill: Skill;
  answers: Record<number, string>;
}

export function storeCambridgeReview(testId: string, skill: Skill, answers: Record<number, string>): void {
  try {
    sessionStorage.setItem(reviewKey(testId, skill), JSON.stringify({ skill, answers }));
  } catch {
    /* ignore */
  }
}

export function readCambridgeReview(testId: string, skill: Skill): CambridgeReview | null {
  try {
    const raw = sessionStorage.getItem(reviewKey(testId, skill));
    if (!raw) return null;
    return JSON.parse(raw) as CambridgeReview;
  } catch {
    return null;
  }
}

export function storeCambridgeWritingReport(testId: string, report: unknown): void {
  try {
    sessionStorage.setItem(writingKey(testId), JSON.stringify(report));
  } catch {
    /* ignore */
  }
}

export function readCambridgeWritingReport<T>(testId: string): T | null {
  try {
    const raw = sessionStorage.getItem(writingKey(testId));
    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}
