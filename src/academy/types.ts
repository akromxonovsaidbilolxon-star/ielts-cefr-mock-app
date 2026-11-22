/**
 * Education-centre domain model.
 *
 * One vocabulary shared by the demo backend (this browser) and the Supabase
 * backend (shared between every device). Field names are camelCase; the
 * Supabase layer maps them to snake_case columns in `supabase/academy.sql`.
 */

export type Level = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2' | 'Mixed';

export const LEVELS: Level[] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2', 'Mixed'];

/** Where a file physically lives. */
export type FileBucket = 'demo' | 'academy-books' | 'academy-submissions';

export interface FileRef {
  name: string;
  size: number;
  type: string;
  /** Object key in Storage (or IndexedDB key in demo mode). */
  path: string;
  bucket: FileBucket;
}

export interface Student {
  id: string;
  displayName: string;
  email: string;
}

export interface SchoolClass {
  id: string;
  name: string;
  level: Level;
  /** Free text such as "Mon & Wed · 16:00". */
  schedule: string;
  /** Accent key used by the UI. */
  color: 'brand' | 'accent' | 'ok' | 'warn';
  studentIds: string[];
  createdAt: string;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  subject: string;
  level: Level;
  description: string;
  coverColor: 'brand' | 'accent' | 'ok' | 'warn' | 'bad';
  file: FileRef | null;
  uploadedBy: string;
  createdAt: string;
}

export interface Assignment {
  id: string;
  classId: string;
  title: string;
  description: string;
  /** ISO date (YYYY-MM-DD) the work is due. */
  dueAt: string;
  maxPoints: number;
  /** Optional book the homework is based on. */
  bookId: string | null;
  createdAt: string;
}

export interface Submission {
  id: string;
  assignmentId: string;
  studentId: string;
  text: string;
  files: FileRef[];
  submittedAt: string;
  points: number | null;
  feedback: string;
  gradedAt: string | null;
}

export interface AcademySnapshot {
  /** Signed-in user is the teacher/owner. */
  isTeacher: boolean;
  classes: SchoolClass[];
  students: Student[];
  books: Book[];
  assignments: Assignment[];
  submissions: Submission[];
}

/* ------------------------------------------------------------------ */
/* Derived helpers                                                     */
/* ------------------------------------------------------------------ */

export type HomeworkState = 'missing' | 'open' | 'due-soon' | 'submitted' | 'graded' | 'closed';

export function submissionFor(
  submissions: Submission[],
  assignmentId: string,
  studentId: string,
): Submission | undefined {
  return submissions.find((s) => s.assignmentId === assignmentId && s.studentId === studentId);
}

/** Days from today to the due date; negative means overdue. */
export function daysUntil(dueAt: string, now = new Date()): number {
  const due = new Date(`${dueAt}T23:59:59`);
  return Math.ceil((due.getTime() - now.getTime()) / 86_400_000);
}

export function humanDue(dueAt: string, now = new Date()): string {
  const days = daysUntil(dueAt, now);
  if (days === 0) return 'Due today';
  if (days === 1) return 'Due tomorrow';
  if (days === -1) return 'Was due yesterday';
  if (days < 0) return `${Math.abs(days)} days late`;
  if (days <= 7) return `Due in ${days} days`;
  return `Due ${new Date(`${dueAt}T12:00:00`).toLocaleDateString(undefined, {
    day: 'numeric',
    month: 'short',
  })}`;
}

export function homeworkState(
  assignment: Assignment,
  submission: Submission | undefined,
  now = new Date(),
): HomeworkState {
  if (submission && submission.points !== null) return 'graded';
  if (submission) return 'submitted';
  const days = daysUntil(assignment.dueAt, now);
  if (days < 0) return 'missing';
  if (days <= 2) return 'due-soon';
  return 'open';
}

export function percent(points: number | null, maxPoints: number): number | null {
  if (points === null || maxPoints <= 0) return null;
  return Math.round((points / maxPoints) * 100);
}

export function letterGrade(pct: number | null): string {
  if (pct === null) return '—';
  if (pct >= 93) return 'A';
  if (pct >= 90) return 'A−';
  if (pct >= 87) return 'B+';
  if (pct >= 83) return 'B';
  if (pct >= 80) return 'B−';
  if (pct >= 77) return 'C+';
  if (pct >= 73) return 'C';
  if (pct >= 70) return 'C−';
  if (pct >= 60) return 'D';
  return 'F';
}

/** Average percentage across graded submissions (null when none are graded). */
export function averagePercent(submissions: Submission[], assignments: Assignment[]): number | null {
  const maxima = new Map(assignments.map((a) => [a.id, a.maxPoints]));
  const values = submissions
    .filter((s) => s.points !== null && maxima.has(s.assignmentId))
    .map((s) => (s.points as number) / (maxima.get(s.assignmentId) as number));
  if (values.length === 0) return null;
  return Math.round((values.reduce((sum, v) => sum + v, 0) / values.length) * 100);
}

export function classById(classes: SchoolClass[], id: string): SchoolClass | undefined {
  return classes.find((c) => c.id === id);
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/** Safe, predictable object key segment. */
export function safeFileName(name: string): string {
  return name
    .normalize('NFKD')
    .replace(/[^\w.\- ]+/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .slice(-80) || 'file';
}
