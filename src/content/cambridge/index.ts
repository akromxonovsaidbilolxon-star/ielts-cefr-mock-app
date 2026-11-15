import type { CambridgeTest } from './types';
import { C13_T1_LISTENING, C13_T1_READING } from './c13-test1';
import { C13_T1_TASK1, C13_T1_TASK2, C13_T1_SPEAKING } from './c13-test1-writing-speaking';

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

/** Every Cambridge test available in the app, newest first. */
export const CAMBRIDGE_TESTS: CambridgeTest[] = [C13_TEST1];

export function getCambridgeTest(id: string | undefined): CambridgeTest | undefined {
  if (!id) return undefined;
  return CAMBRIDGE_TESTS.find((t) => t.id === id);
}
