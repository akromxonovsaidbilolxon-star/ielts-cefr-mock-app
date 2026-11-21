/**
 * Live backend — the education centre on Supabase.
 *
 * Tables and storage buckets are created by `supabase/academy.sql`, which also
 * carries every row-level-security policy. This module assumes those policies
 * exist; it never trusts the client for authorisation.
 *
 * Mapping: camelCase in the app ↔ snake_case in Postgres.
 */

import { getSupabase, listProfiles, type Profile } from '../lib/supabase';
import type {
  AcademySnapshot,
  Assignment,
  Book,
  FileRef,
  Level,
  SchoolClass,
  Student,
  Submission,
} from './types';

/* ------------------------------------------------------------------ */
/* Row shapes                                                          */
/* ------------------------------------------------------------------ */

interface ClassRow {
  id: string;
  name: string;
  level: Level;
  schedule: string;
  color: SchoolClass['color'];
  created_at: string;
  class_students: { student_id: string }[] | null;
}

interface BookRow {
  id: string;
  title: string;
  author: string;
  subject: string;
  level: Level;
  description: string;
  cover_color: Book['coverColor'];
  file_name: string | null;
  file_size: number | null;
  file_type: string | null;
  file_path: string | null;
  uploaded_by: string | null;
  created_at: string;
}

interface AssignmentRow {
  id: string;
  class_id: string;
  title: string;
  description: string;
  due_at: string;
  max_points: number;
  book_id: string | null;
  created_at: string;
}

interface SubmissionRow {
  id: string;
  assignment_id: string;
  student_id: string;
  body: string | null;
  files: FileRef[] | null;
  submitted_at: string;
  points: number | null;
  feedback: string | null;
  graded_at: string | null;
}

/* ------------------------------------------------------------------ */
/* Mapping                                                             */
/* ------------------------------------------------------------------ */

function toClass(row: ClassRow): SchoolClass {
  return {
    id: row.id,
    name: row.name,
    level: row.level,
    schedule: row.schedule ?? '',
    color: row.color ?? 'brand',
    studentIds: (row.class_students ?? []).map((r) => r.student_id),
    createdAt: row.created_at,
  };
}

function toBook(row: BookRow): Book {
  const file: FileRef | null =
    row.file_path && row.file_name
      ? {
          name: row.file_name,
          size: row.file_size ?? 0,
          type: row.file_type ?? 'application/pdf',
          path: row.file_path,
          bucket: 'academy-books',
        }
      : null;
  return {
    id: row.id,
    title: row.title,
    author: row.author ?? '',
    subject: row.subject ?? '',
    level: row.level,
    description: row.description ?? '',
    coverColor: row.cover_color ?? 'brand',
    file,
    uploadedBy: row.uploaded_by ?? '',
    createdAt: row.created_at,
  };
}

function toAssignment(row: AssignmentRow): Assignment {
  return {
    id: row.id,
    classId: row.class_id,
    title: row.title,
    description: row.description ?? '',
    dueAt: row.due_at,
    maxPoints: row.max_points,
    bookId: row.book_id,
    createdAt: row.created_at,
  };
}

function toSubmission(row: SubmissionRow): Submission {
  return {
    id: row.id,
    assignmentId: row.assignment_id,
    studentId: row.student_id,
    text: row.body ?? '',
    files: Array.isArray(row.files) ? row.files : [],
    submittedAt: row.submitted_at,
    points: row.points,
    feedback: row.feedback ?? '',
    gradedAt: row.graded_at,
  };
}

function toStudent(profile: Profile): Student {
  return { id: profile.id, displayName: profile.displayName, email: profile.email };
}

/* ------------------------------------------------------------------ */
/* Reads                                                               */
/* ------------------------------------------------------------------ */

export async function loadLiveAcademy(viewerId: string, isTeacher: boolean): Promise<AcademySnapshot> {
  const supabase = getSupabase();

  const [classesRes, booksRes, assignmentsRes, submissionsRes, profilesRes] = await Promise.all([
    supabase
      .from('academy_classes')
      .select('id, name, level, schedule, color, created_at, class_students(student_id)')
      .order('created_at', { ascending: true }),
    supabase.from('academy_books').select('*').order('created_at', { ascending: false }),
    supabase.from('academy_assignments').select('*').order('due_at', { ascending: true }),
    supabase
      .from('academy_submissions')
      .select('*')
      .order('submitted_at', { ascending: false }),
    isTeacher
      ? listProfiles().catch(() => [] as Profile[])
      : Promise.resolve([] as Profile[]),
  ]);

  const firstError = [classesRes.error, booksRes.error, assignmentsRes.error, submissionsRes.error].find(
    Boolean,
  );
  if (firstError) {
    throw new Error(
      /does not exist|schema cache/i.test(firstError.message)
        ? 'The education centre tables are not set up yet. Run supabase/academy.sql in the Supabase SQL editor.'
        : firstError.message,
    );
  }

  const classes = ((classesRes.data ?? []) as unknown as ClassRow[]).map(toClass);
  const students = (profilesRes ?? []).map(toStudent);
  // Always include the viewer so a teacher previewing as a student still has a name.
  if (!students.some((s) => s.id === viewerId)) {
    const me = (profilesRes ?? []).find((p) => p.id === viewerId);
    if (me) students.push(toStudent(me));
  }

  return {
    isTeacher,
    classes,
    students,
    books: ((booksRes.data ?? []) as BookRow[]).map(toBook),
    assignments: ((assignmentsRes.data ?? []) as AssignmentRow[]).map(toAssignment),
    submissions: ((submissionsRes.data ?? []) as SubmissionRow[]).map(toSubmission),
  };
}

/* ------------------------------------------------------------------ */
/* Writes                                                              */
/* ------------------------------------------------------------------ */

export async function createLiveClass(cls: SchoolClass): Promise<string> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('academy_classes')
    .insert({ name: cls.name, level: cls.level, schedule: cls.schedule, color: cls.color })
    .select('id')
    .single();
  if (error) throw new Error(error.message);
  const id = data.id as string;
  await syncClassStudents(id, cls.studentIds);
  return id;
}

async function syncClassStudents(classId: string, studentIds: string[]): Promise<void> {
  const supabase = getSupabase();
  const { error: delError } = await supabase
    .from('class_students')
    .delete()
    .eq('class_id', classId);
  if (delError) throw new Error(delError.message);
  if (studentIds.length === 0) return;
  const { error } = await supabase
    .from('class_students')
    .insert(studentIds.map((student_id) => ({ class_id: classId, student_id })));
  if (error) throw new Error(error.message);
}

export async function updateLiveClass(cls: SchoolClass): Promise<void> {
  const { error } = await getSupabase()
    .from('academy_classes')
    .update({ name: cls.name, level: cls.level, schedule: cls.schedule, color: cls.color })
    .eq('id', cls.id);
  if (error) throw new Error(error.message);
  await syncClassStudents(cls.id, cls.studentIds);
}

export async function deleteLiveClass(id: string): Promise<void> {
  const { error } = await getSupabase().from('academy_classes').delete().eq('id', id);
  if (error) throw new Error(error.message);
}

export async function createLiveAssignment(assignment: Assignment): Promise<string> {
  const { data, error } = await getSupabase()
    .from('academy_assignments')
    .insert({
      class_id: assignment.classId,
      title: assignment.title,
      description: assignment.description,
      due_at: assignment.dueAt,
      max_points: assignment.maxPoints,
      book_id: assignment.bookId,
    })
    .select('id')
    .single();
  if (error) throw new Error(error.message);
  return data.id as string;
}

export async function updateLiveAssignment(assignment: Assignment): Promise<void> {
  const { error } = await getSupabase()
    .from('academy_assignments')
    .update({
      class_id: assignment.classId,
      title: assignment.title,
      description: assignment.description,
      due_at: assignment.dueAt,
      max_points: assignment.maxPoints,
      book_id: assignment.bookId,
    })
    .eq('id', assignment.id);
  if (error) throw new Error(error.message);
}

export async function deleteLiveAssignment(id: string): Promise<void> {
  const { error } = await getSupabase().from('academy_assignments').delete().eq('id', id);
  if (error) throw new Error(error.message);
}

export async function saveLiveSubmission(args: {
  assignmentId: string;
  studentId: string;
  text: string;
  files: FileRef[];
}): Promise<void> {
  const { error } = await getSupabase()
    .from('academy_submissions')
    .upsert(
      {
        assignment_id: args.assignmentId,
        student_id: args.studentId,
        body: args.text,
        files: args.files,
        submitted_at: new Date().toISOString(),
        points: null,
        feedback: '',
        graded_at: null,
      },
      { onConflict: 'assignment_id,student_id' },
    );
  if (error) throw new Error(error.message);
}

export async function gradeLiveSubmission(args: {
  submissionId: string;
  points: number;
  feedback: string;
}): Promise<void> {
  const { data, error } = await getSupabase()
    .from('academy_submissions')
    .update({
      points: args.points,
      feedback: args.feedback,
      graded_at: new Date().toISOString(),
    })
    .eq('id', args.submissionId)
    .select('id');
  if (error) throw new Error(error.message);
  if (!Array.isArray(data) || data.length === 0) {
    throw new Error('That mark was not saved. Only the teacher can grade homework.');
  }
}

export async function saveLiveBook(book: Book): Promise<string> {
  const supabase = getSupabase();
  const { data: auth } = await supabase.auth.getUser();
  const row = {
    title: book.title,
    author: book.author,
    subject: book.subject,
    level: book.level,
    description: book.description,
    cover_color: book.coverColor,
    file_name: book.file?.name ?? null,
    file_size: book.file?.size ?? null,
    file_type: book.file?.type ?? null,
    file_path: book.file?.path ?? null,
    uploaded_by: auth.user?.id ?? null,
  };
  if (book.id) {
    const { error } = await supabase.from('academy_books').update(row).eq('id', book.id);
    if (error) throw new Error(error.message);
    return book.id;
  }
  const { data, error } = await supabase.from('academy_books').insert(row).select('id').single();
  if (error) throw new Error(error.message);
  return data.id as string;
}

export async function deleteLiveBook(id: string): Promise<void> {
  const { error } = await getSupabase().from('academy_books').delete().eq('id', id);
  if (error) throw new Error(error.message);
}
