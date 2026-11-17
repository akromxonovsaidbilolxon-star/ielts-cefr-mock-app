/**
 * Cambridge test registry — BUILD TIME ONLY. Never import this from a page.
 *
 * Why this file exists
 * --------------------
 * The tests themselves are copyrighted book text. If a page (or anything a
 * page imports) pulls them in, they are compiled into the public JavaScript
 * bundle and anyone can read them without signing in. That was the case before
 * this refactor: every passage was in `index-*.js`.
 *
 * So the split is:
 *   - `index.ts`     — helpers and types only. Pages import this. No book text.
 *   - `registry.ts`  — the tests. Imported ONLY by build-time scripts:
 *                        · scripts/check-cambridge.mjs  (answer-key checks)
 *                        · scripts/export-cambridge-sql.mjs (DB loader)
 *
 * Nothing under `src/` may import this file. `npm run check:bundle` fails the
 * build if book text reaches `dist/`.
 */

import type { CambridgeTest } from './types';
import { C13_T1_LISTENING, C13_T1_READING } from './c13-test1';
import { C13_T1_TASK1, C13_T1_TASK2, C13_T1_SPEAKING } from './c13-test1-writing-speaking';
import { C13_T2_LISTENING, C13_T2_READING } from './c13-test2';
import { C13_T2_TASK1, C13_T2_TASK2, C13_T2_SPEAKING } from './c13-test2-writing-speaking';
import { C13_T3_LISTENING, C13_T3_READING } from './c13-test3';
import { C13_T3_TASK1, C13_T3_TASK2, C13_T3_SPEAKING } from './c13-test3-writing-speaking';

/**
 * Rights note: these are transcriptions of material the owner purchased, kept
 * in a private, sign-in-only classroom app. Cambridge's own copyright page
 * states that an individual teacher may make copies for use within his or her
 * own classroom. The notice below is shown on every page of each test.
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
      "Questions and passages transcribed by hand from the owner's copy of the book. Listening recordings remain in the owner's own Google Drive and are streamed from there; no audio is copied into this repository.",
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
      "Questions and passages transcribed by hand from the owner's copy of the book (pages 32–51). Listening recordings remain in the owner's own Google Drive and are streamed from there; no audio is copied into this repository. The Task 1 bar chart is redrawn from the printed figure and its bar heights are approximate.",
  },
  listening: C13_T2_LISTENING,
  reading: C13_T2_READING,
  writing: { task1: C13_T2_TASK1, task2: C13_T2_TASK2 },
  speaking: C13_T2_SPEAKING,
};

/**
 * Cambridge IELTS 13, Academic, Test 3.
 *
 * Unlike the Test 2 chart, the Task 1 bar chart here carries the figures
 * printed beside each bar in the book, so no values are estimated.
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
      "Questions and passages transcribed from the owner's copy of the book (pages 54–75); all 40 listening and 40 reading answers checked against the book's own Answer Key on pages 120–123. Listening recordings remain in the owner's own Google Drive and are streamed from there; no audio is copied into this repository. The Task 1 bar chart is redrawn from the printed figure using the values printed beside each bar.",
  },
  listening: C13_T3_LISTENING,
  reading: C13_T3_READING,
  writing: { task1: C13_T3_TASK1, task2: C13_T3_TASK2 },
  speaking: C13_T3_SPEAKING,
};

/** Every Cambridge test in the book, in order. Used to seed the database. */
export const CAMBRIDGE_TESTS: CambridgeTest[] = [C13_TEST1, C13_TEST2, C13_TEST3];
