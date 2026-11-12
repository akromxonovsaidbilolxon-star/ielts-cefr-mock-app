/**
 * MULTILEVEL EXAM CONTENT — entirely separate from the IELTS bank in
 * `src/content/listening.ts` and `src/content/reading.ts`.
 *
 * Nothing here is shared with IELTS: different task formats, different
 * timings and different difficulty targets. Keeping the two banks apart
 * prevents either exam from drifting into the other's style.
 */

export { ML_LISTENING_PARTS, ML_LISTENING_QUESTIONS } from './listening';
export { ML_READING_PARTS, ML_READING_QUESTIONS } from './reading';
export { ML_WRITING } from './writing';
export {
  ML_SPEAKING_STAGES,
  ML_SPEAKING_QUESTIONS,
  ML_SPEAKING_FIRST,
} from './speaking';

export * from './types';

/** Official section shapes, used by the exam engine and the UI copy. */
export const ML_SECTIONS = {
  listening: {
    parts: 6,
    questions: 35,
    minutes: 45,
    description:
      'Six parts, 35 questions. Each recording is played twice, with 15–30 seconds to read the questions first. The 45 minutes includes answer-sheet transfer time.',
  },
  reading: {
    parts: 5,
    questions: 35,
    minutes: 60,
    description:
      'Five parts, 35 questions, from short notices to an academic text. The 60 minutes includes answer-sheet transfer time.',
  },
  writing: {
    parts: 2,
    tasks: 3,
    minutes: 60,
    description:
      'Two parts and three tasks in one 60-minute block: an informal message (~50 words), a formal email (120–150 words) and a longer discussion post (180–200 words).',
  },
  speaking: {
    parts: 4,
    windows: 8,
    minutes: 15,
    description:
      'Four stages and eight recording windows: three personal questions, three picture-based questions, an abstract topic and a two-sided argument.',
  },
} as const;
