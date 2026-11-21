import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAcademy } from './AcademyProvider';
import {
  averagePercent,
  classById,
  daysUntil,
  homeworkState,
  humanDue,
  letterGrade,
  percent,
  submissionFor,
  type Assignment,
} from './types';
import { Avatar, Empty, HomeworkBadge, LevelChip, PageHead, Stat } from './ui';
import {
  ArrowRightIcon,
  BookOpenIcon,
  ChartIcon,
  CheckIcon,
  ClipboardIcon,
  ClockIcon,
  GraduationIcon,
  StarIcon,
} from '../components/Icons';

/**
 * Overview dashboard.
 *
 * Deliberately answers two different questions with the same page:
 *   • Teacher: what needs marking, who is missing work, what is due next.
 *   • Student: what do I have to do, what is coming back, how am I doing.
 */
export default function AcademyHome() {
  const { data, isTeacher, studentId, viewAs, loading } = useAcademy();

  const myClassIds = useMemo(
    () => new Set(data.classes.filter((c) => c.studentIds.includes(studentId)).map((c) => c.id)),
    [data.classes, studentId],
  );

  const myAssignments = useMemo(
    () =>
      isTeacher && !viewAs
        ? data.assignments
        : data.assignments.filter((a) => myClassIds.has(a.classId)),
    [data.assignments, isTeacher, myClassIds, viewAs],
  );

  if (isTeacher && !viewAs) {
    return <TeacherOverview />;
  }

  const graded = data.submissions.filter((s) => s.points !== null);
  const avg = averagePercent(graded, myAssignments);
  const upcoming = myAssignments
    .filter((a) => homeworkState(a, submissionFor(data.submissions, a.id, studentId)) !== 'graded')
    .sort((a, b) => daysUntil(a.dueAt) - daysUntil(b.dueAt))
    .slice(0, 4);

  const todo = myAssignments.filter((a) => {
    const state = homeworkState(a, submissionFor(data.submissions, a.id, studentId));
    return state === 'open' || state === 'due-soon' || state === 'missing';
  }).length;

  return (
    <div className="acad-page">
      <PageHead
        title={`Hi, ${data.students.find((s) => s.id === studentId)?.displayName.split(' ')[0] ?? 'there'}`}
        subtitle="Your work, your marks and your books — all in one place."
      />

      <div className="acad-stats">
        <Stat label="To do" value={todo} hint="Homework not handed in" tone={todo > 0 ? 'warn' : 'ok'} />
        <Stat label="Average" value={avg === null ? '—' : `${avg}%`} hint={letterGrade(avg)} tone="brand" />
        <Stat label="Graded" value={graded.length} hint="Pieces marked" tone="ok" />
        <Stat label="Books" value={data.books.length} hint="On the shelf" tone="accent" />
      </div>

      <div className="acad-grid-2">
        <section className="card card-pad">
          <div className="section-head" style={{ marginBottom: '0.7rem' }}>
            <h3 style={{ margin: 0 }}>Coming up</h3>
            <Link to="/academy/homework" className="small">
              All homework →
            </Link>
          </div>
          {loading && <p className="muted small">Loading…</p>}
          {!loading && upcoming.length === 0 && (
            <Empty title="Nothing outstanding">You are up to date. Nice work.</Empty>
          )}
          <div className="stack stack-sm">
            {upcoming.map((assignment) => {
              const submission = submissionFor(data.submissions, assignment.id, studentId);
              const state = homeworkState(assignment, submission);
              return (
                <Link key={assignment.id} to="/academy/homework" className="acad-list-row">
                  <span className="acad-list-icon">
                    <ClipboardIcon className="" />
                  </span>
                  <span className="acad-list-main">
                    <span className="strong">{assignment.title}</span>
                    <span className="tiny muted">
                      {classById(data.classes, assignment.classId)?.name ?? 'Class'} ·{' '}
                      {humanDue(assignment.dueAt)}
                    </span>
                  </span>
                  <HomeworkBadge state={state} />
                </Link>
              );
            })}
          </div>
        </section>

        <section className="card card-pad">
          <div className="section-head" style={{ marginBottom: '0.7rem' }}>
            <h3 style={{ margin: 0 }}>Recent feedback</h3>
            <Link to="/academy/grades" className="small">
              My grades →
            </Link>
          </div>
          {graded.length === 0 && <Empty title="No marks yet">Your marked work will appear here.</Empty>}
          <div className="stack stack-sm">
            {graded
              .slice()
              .sort((a, b) => (b.gradedAt ?? b.submittedAt).localeCompare(a.gradedAt ?? a.submittedAt))
              .slice(0, 4)
              .map((submission) => {
                const assignment = data.assignments.find((a) => a.id === submission.assignmentId);
                if (!assignment) return null;
                const pct = percent(submission.points, assignment.maxPoints);
                return (
                  <div key={submission.id} className="acad-feedback-row">
                    <span className="acad-mark">{pct}%</span>
                    <span className="grow" style={{ minWidth: 0 }}>
                      <span className="strong" style={{ display: 'block' }}>
                        {assignment.title}
                      </span>
                      <span className="tiny muted">
                        {submission.points}/{assignment.maxPoints} points · {letterGrade(pct)}
                      </span>
                      {submission.feedback && (
                        <span className="tiny" style={{ display: 'block', marginTop: '0.2rem' }}>
                          “{submission.feedback}”
                        </span>
                      )}
                    </span>
                  </div>
                );
              })}
          </div>
        </section>
      </div>

      <section className="card card-pad" style={{ marginTop: '1rem' }}>
        <div className="section-head" style={{ marginBottom: '0.7rem' }}>
          <h3 style={{ margin: 0 }}>
            <BookOpenIcon className="" /> Books for your class
          </h3>
          <Link to="/academy/library" className="small">
            Open library →
          </Link>
        </div>
        <div className="acad-book-strip">
          {data.books.slice(0, 4).map((book) => (
            <Link to="/academy/library" key={book.id} className={`acad-book-mini cover-${book.coverColor}`}>
              <span className="acad-book-mini-title">{book.title}</span>
              <span className="tiny">{book.subject}</span>
            </Link>
          ))}
          {data.books.length === 0 && <p className="muted small">No books uploaded yet.</p>}
        </div>
      </section>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Teacher dashboard                                                   */
/* ------------------------------------------------------------------ */

function TeacherOverview() {
  const { data, setViewAsStudent, backend, resetDemoData } = useAcademy();

  const toMark = data.submissions.filter((s) => s.points === null);
  const gradedAll = data.submissions.filter((s) => s.points !== null);
  const classAvg = averagePercent(gradedAll, data.assignments);

  const pendingByAssignment = useMemo(() => {
    const map = new Map<string, { assignment: Assignment; missing: number; total: number; submitted: number }>();
    for (const assignment of data.assignments) {
      const cls = classById(data.classes, assignment.classId);
      if (!cls) continue;
      const submissions = data.submissions.filter((s) => s.assignmentId === assignment.id);
      const submittedIds = new Set(submissions.map((s) => s.studentId));
      const missing = cls.studentIds.filter((id) => !submittedIds.has(id)).length;
      map.set(assignment.id, {
        assignment,
        missing,
        total: cls.studentIds.length,
        submitted: submissions.length,
      });
    }
    return map;
  }, [data]);

  const nextDue = data.assignments
    .filter((a) => daysUntil(a.dueAt) >= 0)
    .sort((a, b) => daysUntil(a.dueAt) - daysUntil(b.dueAt))
    .slice(0, 4);

  const overdue = data.assignments.filter((a) => {
    const info = pendingByAssignment.get(a.id);
    return info && daysUntil(a.dueAt) < 0 && info.missing > 0;
  });

  return (
    <div className="acad-page">
      <PageHead
        title="Centre overview"
        subtitle="Marking queue, attendance of submissions and what is due next."
        actions={
          <>
            <Link to="/academy/homework" className="btn btn-sm">
              <ClipboardIcon className="" />
              Set homework
            </Link>
            <Link to="/academy/library" className="btn btn-sm btn-ghost">
              <BookOpenIcon className="" />
              Upload a book
            </Link>
          </>
        }
      />

      <div className="acad-stats">
        <Stat label="Students" value={data.students.length} hint={`${data.classes.length} classes`} tone="brand" />
        <Stat
          label="To mark"
          value={toMark.length}
          hint={toMark.length === 0 ? 'All caught up' : 'Waiting for a mark'}
          tone={toMark.length > 0 ? 'warn' : 'ok'}
        />
        <Stat label="Class average" value={classAvg === null ? '—' : `${classAvg}%`} hint={letterGrade(classAvg)} tone="ok" />
        <Stat label="Overdue" value={overdue.length} hint="Assignments with missing work" tone={overdue.length ? 'bad' : 'neutral'} />
      </div>

      <div className="acad-grid-2">
        <section className="card card-pad">
          <div className="section-head" style={{ marginBottom: '0.7rem' }}>
            <h3 style={{ margin: 0 }}>
              <StarIcon className="" /> Waiting to be marked
            </h3>
            <Link to="/academy/grades" className="small">
              Gradebook →
            </Link>
          </div>
          {toMark.length === 0 && (
            <Empty title="Nothing to mark">Handed-in work will pile up here.</Empty>
          )}
          <div className="stack stack-sm">
            {toMark.slice(0, 6).map((submission) => {
              const assignment = data.assignments.find((a) => a.id === submission.assignmentId);
              const student = data.students.find((s) => s.id === submission.studentId);
              if (!assignment) return null;
              return (
                <div key={submission.id} className="acad-list-row as-div">
                  <Avatar name={student?.displayName ?? 'Student'} size={32} />
                  <span className="acad-list-main">
                    <span className="strong">{student?.displayName ?? 'Student'}</span>
                    <span className="tiny muted">{assignment.title}</span>
                  </span>
                  <Link to="/academy/grades" className="btn btn-sm btn-soft">
                    <CheckIcon className="" />
                    Mark
                  </Link>
                </div>
              );
            })}
          </div>
        </section>

        <section className="card card-pad">
          <div className="section-head" style={{ marginBottom: '0.7rem' }}>
            <h3 style={{ margin: 0 }}>
              <ClockIcon className="" /> Due next
            </h3>
          </div>
          {nextDue.length === 0 && <Empty title="No upcoming deadlines" />}
          <div className="stack stack-sm">
            {nextDue.map((assignment) => {
              const info = pendingByAssignment.get(assignment.id);
              const cls = classById(data.classes, assignment.classId);
              const progress = info && info.total > 0 ? Math.round((info.submitted / info.total) * 100) : 0;
              return (
                <div key={assignment.id} className="acad-due-row">
                  <div className="row-between" style={{ gap: '0.5rem' }}>
                    <span className="strong small">{assignment.title}</span>
                    <span className="badge badge-accent">{humanDue(assignment.dueAt)}</span>
                  </div>
                  <div className="tiny muted">
                    {cls?.name} · {info?.submitted ?? 0}/{info?.total ?? 0} handed in
                  </div>
                  <div className="acad-progress">
                    <span style={{ width: `${progress}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>

      <section className="card card-pad" style={{ marginTop: '1rem' }}>
        <div className="section-head" style={{ marginBottom: '0.7rem' }}>
          <h3 style={{ margin: 0 }}>
            <GraduationIcon className="" /> My classes
          </h3>
          <Link to="/academy/classes" className="small">
            Manage classes →
          </Link>
        </div>
        {data.classes.length === 0 && (
          <Empty
            title="No classes yet"
            action={
              <Link to="/academy/classes" className="btn btn-sm">
                Create the first class
              </Link>
            }
          >
            Classes group students so homework and marks stay organised.
          </Empty>
        )}
        <div className="acad-class-grid">
          {data.classes.map((cls) => {
            const avg = averagePercent(
              data.submissions.filter((s) => cls.studentIds.includes(s.studentId)),
              data.assignments.filter((a) => a.classId === cls.id),
            );
            return (
              <Link key={cls.id} to={`/academy/classes?class=${cls.id}`} className={`acad-class-card tone-${cls.color}`}>
                <div className="row-between">
                  <h4 style={{ margin: 0 }}>{cls.name}</h4>
                  <LevelChip level={cls.level} />
                </div>
                <div className="tiny muted">{cls.schedule || 'No fixed time'}</div>
                <div className="acad-class-meta">
                  <span>{cls.studentIds.length} students</span>
                  <span>{avg === null ? 'No marks' : `${avg}% avg`}</span>
                  <span>
                    <ChartIcon className="" /> Gradebook
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {backend === 'demo' && (
        <section className="card card-pad" style={{ marginTop: '1rem' }}>
          <div className="row-between" style={{ gap: '0.75rem' }}>
            <div>
              <h3 style={{ margin: 0 }}>Demo data</h3>
              <p className="small muted" style={{ margin: 0 }}>
                Everything you add is kept in this browser. Reset to put the sample
                classroom back exactly as it was.
              </p>
            </div>
            <button
              type="button"
              className="btn btn-sm btn-ghost"
              onClick={async () => {
                if (window.confirm('Reset all demo classes, homework, marks and books?')) {
                  await resetDemoData();
                }
              }}
            >
              Reset demo data
            </button>
          </div>
        </section>
      )}

      {data.students.length > 0 && (
        <section className="card card-pad" style={{ marginTop: '1rem' }}>
          <div className="row-between" style={{ marginBottom: '0.6rem' }}>
            <div>
              <h3 style={{ margin: 0 }}>See it as a student</h3>
              <p className="small muted" style={{ margin: 0 }}>
                Preview exactly what one learner sees. Your data is never changed.
              </p>
            </div>
          </div>
          <div className="row wrap">
            {data.students.slice(0, 8).map((student) => (
              <button
                key={student.id}
                type="button"
                className="btn btn-sm btn-ghost"
                onClick={() => setViewAsStudent(student.id)}
              >
                <Avatar name={student.displayName} size={20} />
                {student.displayName}
                <ArrowRightIcon className="" />
              </button>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
