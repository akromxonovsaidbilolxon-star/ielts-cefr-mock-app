import type { ScriptLine } from '../../types';

/** Levels that can appear in Multilevel practice material (no C2: the exam has none). */
export type MlLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1';

/** The only levels the certificate can award. */
export type MlAward = 'C1' | 'B2' | 'B1' | 'Below B1';

export type MlQuestionType = 'text' | 'mcq' | 'select';

/**
 * A Multilevel question.
 *
 * `partNumber` describes the exam TASK FORMAT (Listening part 1-6,
 * Reading part 1-5). `difficulty` describes the LEVEL of the material.
 * They are deliberately separate fields so the same task format can be
 * practised at B1, B2 or C1 in Practice Mode.
 */
export interface MlQuestion {
  /** Number within the section, 1-35. */
  number: number;
  prompt: string;
  type: MlQuestionType;
  options?: string[];
  answer: string;
  explanation?: string;
  difficulty: MlLevel;
}

export interface MlListeningPart {
  id: number;
  /** Exam task format: 1-6. */
  partNumber: number;
  /** Level of this part's material. */
  difficulty: MlLevel;
  title: string;
  instruction: string;
  context: string;
  /** Played twice, as in the real exam. */
  script: ScriptLine[];
  /** Seconds of reading time before the recording starts (15-30). */
  preReadSeconds: number;
  questions: MlQuestion[];
}

export interface MlReadingPart {
  id: number;
  partNumber: number;
  difficulty: MlLevel;
  title: string;
  instruction: string;
  /** Optional lead-in, e.g. "Look at the four notices." */
  intro?: string;
  blocks: MlTextBlock[];
  questions: MlQuestion[];
}

export interface MlTextBlock {
  id?: string;
  heading?: string;
  text: string;
  kind?: 'prose' | 'notice' | 'advert' | 'email' | 'table';
}

/* ---------------- Writing ---------------- */

export interface MlWritingTask {
  id: 'ml-w1' | 'ml-w2' | 'ml-w3';
  part: 1 | 2;
  label: string;
  taskType: string;
  prompt: string;
  minWords: number;
  maxWords?: number;
  guidance: string[];
}

export interface MlWritingSection {
  /** Shared situation shown above Tasks 1.1 and 1.2. */
  sourceMessage: {
    from: string;
    subject: string;
    body: string;
  };
  tasks: MlWritingTask[];
  totalMinutes: number;
}

/* ---------------- Speaking ---------------- */

export interface MlSpeakingQuestion {
  id: string;
  label: string;
  text: string;
  /** Recording window in seconds. */
  seconds: number;
}

export interface MlSpeakingStage {
  id: string;
  stage: string;
  title: string;
  level: MlLevel;
  /** What the candidate must do. */
  description: string;
  /** Seconds of preparation before recording (0 for 1.1 and 1.2). */
  prepSeconds: number;
  /** Weight of this stage in the section score (sums to 1). */
  weight: number;
  /** Show the questions one at a time (Part 1) or all together (Parts 2-3). */
  reveal: 'sequential' | 'together';
  /** Optional illustration key. */
  visual?: 'pictures' | 'context';
  questions: MlSpeakingQuestion[];
  /**
   * Additional prompt lines shown alongside a single continuous response
   * (Part 2 shows three related questions but records once).
   */
  subQuestions?: string[];
  statement?: string;
}

/* ---------------- Results ---------------- */

export interface MlSectionScore {
  /** Raw marks, for Listening and Reading. */
  correct?: number;
  total?: number;
  /** Converted section score on the 0-75 scale. */
  score: number;
  level: MlLevel | null;
}

export interface MlAttempt {
  id: string;
  dateISO: string;
  listening?: MlSectionScore;
  reading?: MlSectionScore;
  writing?: MlSectionScore;
  speaking?: MlSectionScore;
  /** Average of attempted sections, 0-75. */
  overall?: number;
  award?: MlAward;
}

