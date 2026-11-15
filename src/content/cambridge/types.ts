import type { Question, SpeakingPart, WritingTask } from '../../types';

/**
 * Types for real Cambridge IELTS book content.
 *
 * These live in a separate tree from the built-in synthetic IELTS paper so the
 * two never mix: `src/content/*.ts` is the original free paper, and everything
 * under `src/content/cambridge/` is transcribed from a purchased Cambridge book.
 */

/** A group's visual format, which decides how it is rendered. */
export type CambridgeLayout =
  /** Standard stacked questions — radio options or a text input each. */
  | 'list'
  /** A box of lettered choices shown once, then compact dropdowns. */
  | 'compact'
  /** Grid with blanks embedded inside cells via {{n}} placeholders. */
  | 'table'
  /** Vertical flow chart made of boxes and arrows. */
  | 'flow'
  /** Prose notes with inline blanks (Section 4 style). */
  | 'notes';

export interface CambridgeBox {
  title: string;
  items: { letter: string; text: string }[];
}

export interface CambridgeTable {
  columns: string[];
  rows: { cells: { text: string }[] }[];
}

export interface CambridgeGroup {
  id: string;
  heading: string;
  instruction?: string;
  note?: string;
  /** Bold caption printed above the group (e.g. the section title). */
  title?: string;
  /** Small bold sub-heading inside a notes group (e.g. "Recent research"). */
  subhead?: string;
  layout: CambridgeLayout;
  questions: Question[];
  table?: CambridgeTable;
  flow?: { title?: string; steps: string[] };
  box?: CambridgeBox;
  /** Named inline figure to draw above the questions. */
  figure?: 'granford';
}

/** Where a real recording lives. Files stay in the owner's Google Drive. */
export interface CambridgeAudio {
  /** Google Drive file id — the file is shared "anyone with the link". */
  driveId: string;
  /** Original filename in Drive, shown so the owner can re-check it. */
  filename: string;
  bytes?: number;
}

export interface CambridgeSection {
  id: number;
  heading: string;
  title: string;
  intro?: string;
  audio?: CambridgeAudio;
  groups: CambridgeGroup[];
}

export interface CambridgePassage {
  id: number;
  title: string;
  subtitle: string;
  paragraphs: { label: string; text: string }[];
  groups: CambridgeGroup[];
}

/** Writing task plus the inline figure this book's Task 1 uses. */
export interface CambridgeWritingTask extends WritingTask {
  figure?: 'hospital-maps';
}

export interface CambridgeSource {
  bookTitle: string;
  publisher: string;
  /** Shown on every test page — never remove. */
  rights: string;
  /** How this particular copy was assembled, for the teacher's records. */
  provenance: string;
}

export interface CambridgeTest {
  id: string;
  book: number;
  test: number;
  label: string;
  source: CambridgeSource;
  listening: CambridgeSection[];
  reading: CambridgePassage[];
  writing: { task1: CambridgeWritingTask; task2: CambridgeWritingTask };
  speaking: SpeakingPart[];
}

/* ------------------------------------------------------------------ */
/* Derived helpers                                                     */
/* ------------------------------------------------------------------ */

export interface FlatQuestion {
  number: number;
  answer: string;
  prompt: string;
}

function flatten(groups: CambridgeGroup[]): FlatQuestion[] {
  return groups.flatMap((g) =>
    g.questions.map((q) => ({ number: q.number, answer: q.answer, prompt: q.prompt })),
  );
}

export function listeningQuestions(test: CambridgeTest): FlatQuestion[] {
  return test.listening.flatMap((s) => flatten(s.groups)).sort((a, b) => a.number - b.number);
}

export function readingQuestions(test: CambridgeTest): FlatQuestion[] {
  return test.reading.flatMap((p) => flatten(p.groups)).sort((a, b) => a.number - b.number);
}

/** Every group in a skill, in printed order — used by the answer review. */
export function listeningGroups(test: CambridgeTest): CambridgeGroup[] {
  return test.listening.flatMap((s) => s.groups);
}

export function readingGroups(test: CambridgeTest): CambridgeGroup[] {
  return test.reading.flatMap((p) => p.groups);
}
