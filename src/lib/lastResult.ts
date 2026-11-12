import type { Answers, Skill } from '../types';

export interface StoredReview {
  skill: Skill;
  answers: Answers;
}

const KEY = 'ielts-mock:review';

export function storeReview(skill: Skill, answers: Answers): void {
  try {
    sessionStorage.setItem(KEY, JSON.stringify({ skill, answers } satisfies StoredReview));
  } catch {
    /* ignore quota errors */
  }
}

export function readReview(): StoredReview | null {
  try {
    const raw = sessionStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoredReview;
    if (!parsed?.skill || !parsed?.answers) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function clearReview(): void {
  try {
    sessionStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
}

export interface WritingReport {
  t1: {
    band: number;
    analysis: {
      words: number;
      sentences: number;
      paragraphs: number;
      avgSentenceLength: number;
      uniqueRatio: number;
      linkerCount: number;
      academicCount: number;
      longWordRatio: number;
      repeated: { word: string; count: number }[];
    };
    strengths: string[];
    improvements: string[];
    wordCountOk: boolean;
  };
  t2: WritingReport['t1'];
  texts: Record<string, string>;
}

export const WRITING_REPORT_KEY = 'ielts-mock:writing-report';
