/**
 * Demo backend — the education centre running entirely in this browser.
 *
 * Used when the build has no Supabase credentials, and offered as "Preview as
 * student" alongside the normal backend. One localStorage document holds all
 * records; binary files live in IndexedDB (see idb.ts). Keys are namespaced per
 * signed-in user through scopedKey so a shared laptop does not mix two
 * teachers' demo data.
 */

import { scopedKey } from '../lib/currentUser';
import { deleteAcademyFile } from './files';
import { demoSnapshot, DEMO_BOOK_TEXT, DEMO_STUDENT_ID } from './demoData';
import { makeTextPdf } from './pdf';
import { uploadAcademyFile } from './files';
import type {
  AcademySnapshot,
  Assignment,
  Book,
  FileRef,
  SchoolClass,
  Student,
  Submission,
} from './types';

const KEY_BASE = 'academy:demo:v1';

interface DemoDoc {
  seeded: boolean;
  classes: SchoolClass[];
  students: Student[];
  books: Book[];
  assignments: Assignment[];
  submissions: Submission[];
}

const key = () => scopedKey(KEY_BASE);

function read(): DemoDoc {
  try {
    const raw = localStorage.getItem(key());
    if (raw) {
      const parsed = JSON.parse(raw) as DemoDoc;
      if (parsed && Array.isArray(parsed.classes)) return parsed;
    }
  } catch {
    /* corrupted document — reseed below */
  }
  const snap = demoSnapshot();
  const doc: DemoDoc = {
    seeded: true,
    classes: snap.classes,
    students: snap.students,
    books: snap.books.map((b) => ({ ...b, file: seedBookFile(b.id) })),
    assignments: snap.assignments,
    submissions: snap.submissions,
  };
  write(doc);
  return doc;
}

/** Generates a real, openable PDF for each starter book. */
function seedBookFile(bookId: string): FileRef | null {
  const text = DEMO_BOOK_TEXT[bookId];
  if (!text) return null;
  const blob = makeTextPdf(text.title, text.paragraphs);
  const path = `seed/${bookId}.pdf`;
  // Fire-and-forget. If IndexedDB is blocked (private browsing), the book
  // still lists — opening it shows a clear message instead of breaking the app.
  void (async () => {
    try {
      const { putBlob } = await import('./idb');
      await putBlob(path, blob);
    } catch {
      /* storage unavailable — see academyFileUrl's message */
    }
  })();
  return {
    name: `${text.title}.pdf`,
    size: blob.size,
    type: 'application/pdf',
    path,
    bucket: 'demo',
  };
}

function write(doc: DemoDoc): void {
  localStorage.setItem(key(), JSON.stringify(doc));
}

function newId(prefix: string): string {
  const uuid =
    typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  return `${prefix}-${uuid}`;
}

export function resetDemo(): void {
  localStorage.removeItem(key());
}

export async function loadDemo(isTeacher: boolean, viewAs: string | null): Promise<AcademySnapshot> {
  const doc = read();
  if (!isTeacher) {
    // A real signed-in student: show only their own classes and work. Demo data
    // belongs to the demo teacher, so they are not put into those classes.
    const own = doc.classes.filter((c) => c.studentIds.includes(viewAs ?? '')); 
    return {
      isTeacher: false,
      classes: own,
      students: doc.students.filter((s) => s.id === viewAs || own.some((c) => c.studentIds.includes(s.id))),
      books: doc.books,
      assignments: doc.assignments.filter((a) => own.some((c) => c.id === a.classId)),
      submissions: doc.submissions.filter((s) => s.studentId === viewAs),
    };
  }
  if (viewAs) {
    const own = doc.classes.filter((c) => c.studentIds.includes(viewAs));
    return {
      isTeacher: true,
      classes: own,
      students: doc.students,
      books: doc.books,
      assignments: doc.assignments.filter((a) => own.some((c) => c.id === a.classId)),
      submissions: doc.submissions.filter((s) => s.studentId === viewAs),
    };
  }
  return {
    isTeacher: true,
    classes: doc.classes,
    students: doc.students,
    books: doc.books,
    assignments: doc.assignments,
    submissions: doc.submissions,
  };
}

export async function addDemoStudent(name: string, email: string): Promise<Student> {
  const doc = read();
  const student: Student = {
    id: newId('s'),
    displayName: name.trim() || 'New student',
    email: email.trim() || `${name.trim().toLowerCase().replace(/\s+/g, '.')}@demo.local`,
  };
  doc.students.push(student);
  write(doc);
  return student;
}

export async function saveDemoClass(cls: SchoolClass): Promise<void> {
  const doc = read();
  const index = doc.classes.findIndex((c) => c.id === cls.id);
  if (index >= 0) doc.classes[index] = cls;
  else doc.classes.push({ ...cls, id: cls.id || newId('c') });
  write(doc);
}

export async function removeDemoClass(id: string): Promise<void> {
  const doc = read();
  doc.classes = doc.classes.filter((c) => c.id !== id);
  const removedAssignments = doc.assignments.filter((a) => a.classId === id).map((a) => a.id);
  doc.assignments = doc.assignments.filter((a) => a.classId !== id);
  doc.submissions = doc.submissions.filter((s) => !removedAssignments.includes(s.assignmentId));
  write(doc);
}

export async function saveDemoAssignment(assignment: Assignment): Promise<void> {
  const doc = read();
  const index = doc.assignments.findIndex((a) => a.id === assignment.id);
  if (index >= 0) doc.assignments[index] = assignment;
  else doc.assignments.push({ ...assignment, id: assignment.id || newId('a') });
  write(doc);
}

export async function removeDemoAssignment(id: string): Promise<void> {
  const doc = read();
  doc.assignments = doc.assignments.filter((a) => a.id !== id);
  doc.submissions = doc.submissions.filter((s) => s.assignmentId !== id);
  write(doc);
}

export async function submitDemoHomework(args: {
  assignmentId: string;
  studentId: string;
  text: string;
  files: FileRef[];
}): Promise<void> {
  const doc = read();
  const existing = doc.submissions.find(
    (s) => s.assignmentId === args.assignmentId && s.studentId === args.studentId,
  );
  if (existing) {
    existing.text = args.text;
    existing.files = args.files;
    existing.submittedAt = new Date().toISOString();
    existing.points = null;
    existing.feedback = '';
    existing.gradedAt = null;
  } else {
    doc.submissions.push({
      id: newId('sub'),
      assignmentId: args.assignmentId,
      studentId: args.studentId,
      text: args.text,
      files: args.files,
      submittedAt: new Date().toISOString(),
      points: null,
      feedback: '',
      gradedAt: null,
    });
  }
  write(doc);
}

export async function gradeDemoSubmission(args: {
  submissionId: string;
  points: number;
  feedback: string;
}): Promise<void> {
  const doc = read();
  const submission = doc.submissions.find((s) => s.id === args.submissionId);
  if (!submission) throw new Error('That submission no longer exists.');
  submission.points = args.points;
  submission.feedback = args.feedback;
  submission.gradedAt = new Date().toISOString();
  write(doc);
}

export async function saveDemoBook(book: Book): Promise<void> {
  const doc = read();
  const index = doc.books.findIndex((b) => b.id === book.id);
  if (index >= 0) doc.books[index] = book;
  else doc.books.push({ ...book, id: book.id || newId('b') });
  write(doc);
}

export async function removeDemoBook(id: string): Promise<void> {
  const doc = read();
  const book = doc.books.find((b) => b.id === id);
  doc.books = doc.books.filter((b) => b.id !== id);
  doc.assignments = doc.assignments.map((a) => (a.bookId === id ? { ...a, bookId: null } : a));
  write(doc);
  if (book?.file && book.file.bucket === 'demo' && !book.file.path.startsWith('seed/')) {
    await deleteAcademyFile(book.file);
  }
}

/** Upload a book PDF into demo storage (also used to make the demo feel real). */
export async function uploadDemoBookFile(file: File): Promise<FileRef> {
  return uploadAcademyFile(file, 'academy-books');
}

export const DEMO_LOGIN_STUDENT = DEMO_STUDENT_ID;
