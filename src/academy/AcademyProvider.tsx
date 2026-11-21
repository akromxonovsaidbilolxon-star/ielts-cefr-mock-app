/**
 * AcademyProvider — one hook that the education-centre pages talk to.
 *
 * It chooses a backend at runtime:
 *   • Supabase configured → the shared database (teacher = owner account).
 *   • No Supabase      → demo mode in this browser, so the centre can be tried
 *                        before any account is set up.
 *
 * A teacher can also "Preview as student" to see exactly what a learner sees;
 * that is a view filter only and never changes permissions.
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { useAuth } from '../auth/AuthProvider';
import { getSupabase, isConfigured } from '../lib/supabase';
import {
  createLiveAssignment,
  createLiveClass,
  deleteLiveAssignment,
  deleteLiveBook,
  deleteLiveClass,
  gradeLiveSubmission,
  loadLiveAcademy,
  saveLiveBook,
  saveLiveSubmission,
  updateLiveAssignment,
  updateLiveClass,
} from './academyApi';
import {
  addDemoStudent,
  gradeDemoSubmission,
  loadDemo,
  removeDemoAssignment,
  removeDemoBook,
  removeDemoClass,
  resetDemo,
  saveDemoAssignment,
  saveDemoBook,
  saveDemoClass,
  submitDemoHomework,
} from './demoStore';
import { DEMO_STUDENT_ID } from './demoData';
import type { AcademySnapshot, Assignment, Book, FileRef, SchoolClass, Student } from './types';

/** In demo mode the student persona maps onto Madina in the demo classroom. */
const DEMO_STUDENT_USER = 'demo-student';

export type Backend = 'demo' | 'live';

interface AcademyContextValue {
  backend: Backend;
  loading: boolean;
  error: string | null;
  data: AcademySnapshot;
  /** The id used as "me" when a student views the centre. */
  studentId: string;
  /** Non-null when a teacher is previewing the student experience. */
  viewAs: string | null;
  setViewAsStudent: (studentId: string | null) => void;
  /** True when the signed-in person can create and grade work. */
  isTeacher: boolean;
  refresh: () => Promise<void>;
  createClass: (cls: SchoolClass) => Promise<void>;
  updateClass: (cls: SchoolClass) => Promise<void>;
  deleteClass: (id: string) => Promise<void>;
  addStudent: (name: string, email: string) => Promise<Student>;
  saveAssignment: (assignment: Assignment) => Promise<void>;
  deleteAssignment: (id: string) => Promise<void>;
  submitHomework: (args: {
    assignmentId: string;
    text: string;
    files: FileRef[];
    /** Only used in teacher preview. */
    studentId?: string;
  }) => Promise<void>;
  gradeSubmission: (args: { submissionId: string; points: number; feedback: string }) => Promise<void>;
  saveBook: (book: Book) => Promise<void>;
  deleteBook: (id: string) => Promise<void>;
  resetDemoData: () => Promise<void>;
}

const AcademyContext = createContext<AcademyContextValue | null>(null);

const VIEW_AS_KEY = 'academy:view-as:v1';

function emptyData(isTeacher: boolean): AcademySnapshot {
  return { isTeacher, classes: [], students: [], books: [], assignments: [], submissions: [] };
}

function newId(prefix: string): string {
  const uuid =
    typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  return `${prefix}-${uuid}`;
}

export function AcademyProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const backend: Backend = isConfigured ? 'live' : 'demo';
  const isOwner = user?.role === 'owner';

  const [data, setData] = useState<AcademySnapshot>(() => emptyData(true));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewAs, setViewAs] = useState<string | null>(() => {
    try {
      return localStorage.getItem(VIEW_AS_KEY);
    } catch {
      return null;
    }
  });

  // Who "I" am on the pages below. A demo student is mapped onto the demo
  // classroom so there is real work to look at; live accounts use their own id.
  const ownStudentId =
    backend === 'demo' && user?.id === DEMO_STUDENT_USER ? DEMO_STUDENT_ID : user?.id ?? '';
  const studentId = viewAs ?? ownStudentId;

  const setViewAsStudent = useCallback((next: string | null) => {
    setViewAs(next);
    try {
      if (next) localStorage.setItem(VIEW_AS_KEY, next);
      else localStorage.removeItem(VIEW_AS_KEY);
    } catch {
      /* private mode */
    }
  }, []);

  const refresh = useCallback(async () => {
    if (!user) return;
    setError(null);
    try {
      if (backend === 'live') {
        const snap = await loadLiveAcademy(user.id, isOwner);
        setData(snap);
      } else {
        const snap = await loadDemo(isOwner, isOwner ? viewAs : ownStudentId);
        setData(snap);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load the education centre.');
      setData(emptyData(isOwner));
    } finally {
      setLoading(false);
    }
  }, [backend, isOwner, ownStudentId, user, viewAs]);

  useEffect(() => {
    setLoading(true);
    void refresh();
  }, [refresh]);

  const createClass = useCallback(
    async (cls: SchoolClass) => {
      if (backend === 'demo') {
        await saveDemoClass({ ...cls, id: cls.id || newId('c') });
      } else {
        await createLiveClass({ ...cls, id: cls.id || newId('c') });
      }
      await refresh();
    },
    [backend, refresh],
  );

  const updateClass = useCallback(
    async (cls: SchoolClass) => {
      if (backend === 'demo') await saveDemoClass(cls);
      else await updateLiveClass(cls);
      await refresh();
    },
    [backend, refresh],
  );

  const deleteClass = useCallback(
    async (id: string) => {
      if (backend === 'demo') await removeDemoClass(id);
      else await deleteLiveClass(id);
      await refresh();
    },
    [backend, refresh],
  );

  const addStudent = useCallback(
    async (name: string, email: string) => {
      if (backend === 'demo') {
        const student = await addDemoStudent(name, email);
        await refresh();
        return student;
      }
      throw new Error(
        'Accounts are created in the owner panel (Supabase → Authentication → Users). ' +
          'Once a student signs in, add them to a class here.',
      );
    },
    [backend, refresh],
  );

  const saveAssignment = useCallback(
    async (assignment: Assignment) => {
      if (backend === 'demo') await saveDemoAssignment(assignment);
      else if (assignment.id) await updateLiveAssignment(assignment);
      else {
        const id = await createLiveAssignment(assignment);
        void id;
      }
      await refresh();
    },
    [backend, refresh],
  );

  const deleteAssignment = useCallback(
    async (id: string) => {
      if (backend === 'demo') await removeDemoAssignment(id);
      else await deleteLiveAssignment(id);
      await refresh();
    },
    [backend, refresh],
  );

  const submitHomework = useCallback(
    async (args: { assignmentId: string; text: string; files: FileRef[]; studentId?: string }) => {
      const targetId = args.studentId ?? studentId;
      if (!targetId) throw new Error('Sign in again to hand in homework.');
      if (backend === 'demo') {
        await submitDemoHomework({
          assignmentId: args.assignmentId,
          studentId: targetId,
          text: args.text,
          files: args.files,
        });
      } else {
        await saveLiveSubmission({
          assignmentId: args.assignmentId,
          studentId: targetId,
          text: args.text,
          files: args.files,
        });
        await getSupabase().auth.getUser();
      }
      await refresh();
    },
    [backend, refresh, studentId],
  );

  const gradeSubmission = useCallback(
    async (args: { submissionId: string; points: number; feedback: string }) => {
      if (backend === 'demo') await gradeDemoSubmission(args);
      else await gradeLiveSubmission(args);
      await refresh();
    },
    [backend, refresh],
  );

  const saveBook = useCallback(
    async (book: Book) => {
      if (backend === 'demo') await saveDemoBook({ ...book, id: book.id || newId('b') });
      else await saveLiveBook(book);
      await refresh();
    },
    [backend, refresh],
  );

  const deleteBook = useCallback(
    async (id: string) => {
      if (backend === 'demo') await removeDemoBook(id);
      else await deleteLiveBook(id);
      await refresh();
    },
    [backend, refresh],
  );

  const resetDemoData = useCallback(async () => {
    if (backend !== 'demo') return;
    resetDemo();
    await refresh();
  }, [backend, refresh]);

  const value = useMemo<AcademyContextValue>(
    () => ({
      backend,
      loading,
      error,
      data,
      studentId,
      viewAs,
      setViewAsStudent,
      isTeacher: isOwner,
      refresh,
      createClass,
      updateClass,
      deleteClass,
      addStudent,
      saveAssignment,
      deleteAssignment,
      submitHomework,
      gradeSubmission,
      saveBook,
      deleteBook,
      resetDemoData,
    }),
    [
      backend,
      loading,
      error,
      data,
      studentId,
      viewAs,
      setViewAsStudent,
      isOwner,
      refresh,
      createClass,
      updateClass,
      deleteClass,
      addStudent,
      saveAssignment,
      deleteAssignment,
      submitHomework,
      gradeSubmission,
      saveBook,
      deleteBook,
      resetDemoData,
    ],
  );

  return <AcademyContext.Provider value={value}>{children}</AcademyContext.Provider>;
}

export function useAcademy(): AcademyContextValue {
  const ctx = useContext(AcademyContext);
  if (!ctx) throw new Error('useAcademy must be used inside <AcademyProvider>');
  return ctx;
}

/** Convenience: the Student record for a given id. */
export function useStudentName(students: Student[], id: string): string {
  return useMemo(() => students.find((s) => s.id === id)?.displayName ?? 'Student', [students, id]);
}
