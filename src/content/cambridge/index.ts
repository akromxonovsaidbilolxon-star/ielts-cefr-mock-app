import type { CambridgeTest } from './types';
import { C13_T1_LISTENING, C13_T1_READING } from './c13-test1';
import { C13_T1_TASK1, C13_T1_TASK2, C13_T1_SPEAKING } from './c13-test1-writing-speaking';
import { C13_T2_LISTENING, C13_T2_READING } from './c13-test2';
import { C13_T2_TASK1, C13_T2_TASK2, C13_T2_SPEAKING } from './c13-test2-writing-speaking';
import { C13_T3_LISTENING, C13_T3_READING } from './c13-test3';
import { C13_T3_TASK1, C13_T3_TASK2, C13_T3_SPEAKING } from './c13-test3-writing-speaking';

export * from './types';

/**
 * Cambridge IELTS 13, Academic, Test 1.
 *
 * Rights note: this is a transcription of material the owner purchased, kept in
 * a private, sign-in-only classroom app. Cambridge's own copyright page states
 * that an individual teacher may make copies for use within his or her own
 * classroom. The notice below is shown on every page of this test — do not
 * remove it when adding further tests.
 */
export const C13_TEST1: CambridgeTest = {
  id: 'c13-t1',
  book: 13,
  test: 1,
  label: 'Cambridge IELTS 13 · Academic · Test 1',
  source: {
    bookTitle: 'Cambridge IELTS 13 Academic',
    publisher: 'Cambridge University Press',
    rights:
      'Transcribed from Cambridge IELTS 13 Academic (Test 1), © Cambridge University Press. Used for private classroom teaching only — not for redistribution or resale.',
    provenance:
      'Questions and passages transcribed by hand from the owner\'s copy of the book. Listening recordings remain in the owner\'s own Google Drive and are streamed from there; no audio is copied into this repository.',
  },
  listening: C13_T1_LISTENING,
  reading: C13_T1_READING,
  writing: { task1: C13_T1_TASK1, task2: C13_T1_TASK2 },
  speaking: C13_T1_SPEAKING,
};

/**
 * Cambridge IELTS 13, Academic, Test 2.
 *
 * Same rights and provenance rules as Test 1: transcribed by hand from the
 * owner's own copy, streamed audio, private classroom use only.
 */
export const C13_TEST2: CambridgeTest = {
  id: 'c13-t2',
  book: 13,
  test: 2,
  label: 'Cambridge IELTS 13 · Academic · Test 2',
  source: {
    bookTitle: 'Cambridge IELTS 13 Academic',
    publisher: 'Cambridge University Press',
    rights:
      'Transcribed from Cambridge IELTS 13 Academic (Test 2), © Cambridge University Press. Used for private classroom teaching only — not for redistribution or resale.',
    provenance:
      'Questions and passages transcribed by hand from the owner\'s copy of the book (pages 32–51). Listening recordings remain in the owner\'s own Google Drive and are streamed from there; no audio is copied into this repository. The Task 1 bar chart is redrawn from the printed figure and its bar heights are approximate.',
  },
  listening: C13_T2_LISTENING,
  reading: C13_T2_READING,
  writing: { task1: C13_T2_TASK1, task2: C13_T2_TASK2 },
  speaking: C13_T2_SPEAKING,
};

/**
 * Cambridge IELTS 13, Academic, Test 3.
 *
 * Transcribed from the owner's own copy of the book, pages 54-75. Unlike the
 * Test 2 chart, the Task 1 bar chart here carries the figures printed beside
 * each bar in the book, so no values are estimated.
 */
export const C13_TEST3: CambridgeTest = {
  id: 'c13-t3',
  book: 13,
  test: 3,
  label: 'Cambridge IELTS 13 · Academic · Test 3',
  source: {
    bookTitle: 'Cambridge IELTS 13 Academic',
    publisher: 'Cambridge University Press',
    rights:
      'Transcribed from Cambridge IELTS 13 Academic (Test 3), © Cambridge University Press. Used for private classroom teaching only — not for redistribution or resale.',
    provenance:
      'Questions and passages transcribed from the owner\'s copy of the book (pages 54–75); all 40 listening and 40 reading answers checked against the book\'s own Answer Key on pages 120–123. Listening recordings remain in the owner\'s own Google Drive and are streamed from there; no audio is copied into this repository. The Task 1 bar chart is redrawn from the printed figure using the values printed beside each bar.',
  },
  listening: C13_T3_LISTENING,
  reading: C13_T3_READING,
  writing: { task1: C13_T3_TASK1, task2: C13_T3_TASK2 },
  speaking: C13_T3_SPEAKING,
};

/** Every Cambridge test available in the app, in book order. */
export const CAMBRIDGE_TESTS: CambridgeTest[] = [C13_TEST1, C13_TEST2, C13_TEST3];

export function getCambridgeTest(id: string | undefined): CambridgeTest | undefined {
  if (!id) return undefined;
  return CAMBRIDGE_TESTS.find((t) => t.id === id);
}
