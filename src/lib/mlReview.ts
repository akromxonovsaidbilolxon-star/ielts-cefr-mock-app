import type { Answers } from '../types';

const KEY = 'ielts-mock:multilevel:review';

export interface MlReview {
  section: 'listening' | 'reading';
  answers: Answers;
}

export function storeMlReview(section: MlReview['section'], answers: Answers): void {
  try {
    sessionStorage.setItem(KEY, JSON.stringify({ section, answers } satisfies MlReview));
  } catch {
    /* ignore */
  }
}

export function readMlReview(): MlReview | null {
  try {
    const raw = sessionStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as MlReview;
    return parsed?.section && parsed?.answers ? parsed : null;
  } catch {
    return null;
  }
}
