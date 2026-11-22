import { useMemo, useState } from 'react';
import { useAcademy } from './AcademyProvider';
import {
  averagePercent,
  classById,
  homeworkState,
  letterGrade,
  percent,
  submissionFor,
} from './types';
import { Avatar, Empty, HomeworkBadge, PageHead, Stat } from './ui';
import { DownloadIcon, StarIcon } from '../components/Icons';

/**
 * Gradebook.
 *
 * Teacher: a per-class matrix (students × assignments) with the class average,
 * and a "needs marking" filter. Student: their own marks per assignment with
 * feedback and a running average.
 */
export default function AcademyGrades() {
  const { isTeacher, studentId, viewAs } = useAcademy();
  const asStudent = !isTeacher || Boolean(viewAs);

  if (asStudent) return <StudentGrades meId={studentId} />;

  return <TeacherGradebook />;
}

function StudentGrades({ meId }: { meId: string }) {
  const { data } = useAcademy();

  const myClassIds = useMemo(
    () => data.classes.filter((c) => c.studentIds.includes(meId)).map((c) => c.id),
    [data.classes, meId],
  );
  const myAssignments = data.assignments.filter((a) => myClassIds.includes(a.classId));
  const mySubmissions = data.submissions.filter((s) => s.studentId === meId);
  const graded = mySubmissions.filter((s) => s.points !== null);
  const avg = averagePercent(graded, myAssignments);

  return (
    <div className="acad-page">
      <PageHead title="My grades" subtitle="Every mark, every piece of feedback, in date order." />

      <div className="acad-stats">
        <Stat label="Average" value={avg === null ? '—' : `${avg}%`} hint={letterGrade(avg)} tone="brand" />
        <Stat label="Marked work" value={graded.length} hint={`of ${myAssignments.length} assignments`} tone="ok" />
        <Stat
          label="Best mark"
          value={
            graded.length === 0
              ? '—'
              : `${Math.max(
                  ...graded.map((s) => {
                    const a = myAssignments.find((x) => x.id === s.assignmentId);
                    return a ? percent(s.points, a.maxPoints) ?? 0 : 0;
                  }),
                )}%`
          }
          hint="Highest percentage"
          tone="accent"
        />
          <Stat
          label="Waiting"
          value={mySubmissions.filter((s) => s.points === null).length}
          hint="Handed in, not marked"
          tone="warn"
        />
      </div>

      {myAssignments.length === 0 && (
        <Empty title="No grades yet">
          Your marks appear here as soon as you are added to a class and homework is set.
        </Empty>
      )}

      <div className="stack stack-sm">
        {myAssignments
          .slice()
          .sort((a, b) => b.dueAt.localeCompare(a.dueAt))
          .map((assignment) => {
            const submission = submissionFor(mySubmissions, assignment.id, meId);
            const state = homeworkState(assignment, submission);
            const pct = submission ? percent(submission.points, assignment.maxPoints) : null;
            return (
              <div key={assignment.id} className="acad-grade-row">
                <div className="acad-grade-main">
                  <div className="row wrap" style={{ gap: '0.4rem' }}>
                    <HomeworkBadge state={state} />
                    <span className="tiny faint">{classById(data.classes, assignment.classId)?.name}</span>
                  </div>
                  <div className="strong small" style={{ marginTop: '0.15rem' }}>
                    {assignment.title}
                  </div>
                  {submission?.feedback && (
                    <div className="tiny muted" style={{ marginTop: '0.2rem' }}>
                      “{submission.feedback}”
                    </div>
                  )}
                </div>
                <div className="acad-grade-score">
                  {submission?.points === null || !submission ? (
                    <span className="faint small">—</span>
                  ) : (
                    <>
                      <b>{pct}%</b>
                      <span className="tiny faint">
                        {submission.points}/{assignment.maxPoints} · {letterGrade(pct)}
                      </span>
                    </>
                  )}
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}

function TeacherGradebook() {
  const { data, gradeSubmission } = useAcademy();
  const [classId, setClassId] = useState<string>(data.classes[0]?.id ?? '');
  const [onlyUnmarked, setOnlyUnmarked] = useState(false);
  const [active, setActive] = useState<{ assignmentId: string; studentId: string } | null>(null);

  const cls = classById(data.classes, classId) ?? data.classes[0];
  const assignments = data.assignments.filter((a) => a.classId === cls?.id);
  const students = (cls?.studentIds ?? [])
    .map((id) => data.students.find((s) => s.id === id))
    .filter((s): s is NonNullable<typeof s> => Boolean(s));

  const classSubmissions = data.submissions.filter((s) =>
    assignments.some((a) => a.id === s.assignmentId),
  );
  const avg = averagePercent(classSubmissions, assignments);

  const unmarked = classSubmissions.filter((s) => s.points === null);
  const activeAssignment = active ? assignments.find((a) => a.id === active.assignmentId) : undefined;
  const activeSubmission = active
    ? submissionFor(data.submissions, active.assignmentId, active.studentId)
    : undefined;
  const activeStudent = active ? data.students.find((s) => s.id === active.studentId) : undefined;

  const exportCsv = () => {
    if (!cls) return;
    const header = ['Student', ...assignments.map((a) => `${a.title} (/${a.maxPoints})`), 'Average %'];
    const lines = [header.map(csvCell).join(',')];
    for (const student of students) {
      const row = [student.displayName];
      for (const assignment of assignments) {
        const sub = submissionFor(data.submissions, assignment.id, student.id);
        row.push(sub?.points !== null && sub ? String(sub.points) : '');
      }
      const studentAvg = averagePercent(
        data.submissions.filter((s) => s.studentId === student.id),
        assignments,
      );
      row.push(studentAvg === null ? '' : String(studentAvg));
      lines.push(row.map(csvCell).join(','));
    }
    const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${cls.name.replace(/[^\w]+/g, '-')}-gradebook.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (data.classes.length === 0) {
    return (
      <div className="acad-page">
        <PageHead title="Gradebook" />
        <Empty title="No classes yet">Create a class and add students to start recording marks.</Empty>
      </div>
    );
  }

  return (
    <div className="acad-page">
      <PageHead
        title="Gradebook"
        subtitle="Marks by student and assignment. Click any cell to mark it."
        actions={
          <button type="button" className="btn btn-sm btn-ghost" onClick={exportCsv}>
            <DownloadIcon className="" />
            Export CSV
          </button>
        }
      />

      <div className="acad-toolbar">
        <div className="row wrap" style={{ gap: '0.3rem' }}>
          {data.classes.map((c) => (
            <button
              key={c.id}
              type="button"
              className={`chip${c.id === cls?.id ? ' active' : ''}`}
              onClick={() => {
                setClassId(c.id);
                setActive(null);
              }}
            >
              {c.name}
            </button>
          ))}
        </div>
        <label className="check-row small">
          <input
            type="checkbox"
            checked={onlyUnmarked}
            onChange={(e) => setOnlyUnmarked(e.target.checked)}
          />
          Needs marking ({unmarked.length})
        </label>
      </div>

      <div className="acad-stats">
        <Stat label="Students" value={students.length} hint={cls?.schedule} tone="brand" />
        <Stat label="Assignments" value={assignments.length} hint="Set for this class" tone="accent" />
        <Stat
          label="Class average"
          value={avg === null ? '—' : `${avg}%`}
          hint={letterGrade(avg)}
          tone="ok"
        />
        <Stat label="Needs marking" value={unmarked.length} hint="Across all classes" tone={unmarked.length ? 'warn' : 'ok'} />
      </div>

      {assignments.length === 0 ? (
        <Empty title="No homework set for this class yet">
          Open Homework to set the first assignment — it will appear as a column here.
        </Empty>
      ) : (
        <div className="card acad-matrix-wrap">
          <table className="acad-matrix">
            <thead>
              <tr>
                <th className="sticky-col">Student</th>
                {assignments.map((a) => (
                  <th key={a.id} title={a.title}>
                    <span className="acad-matrix-th">{a.title}</span>
                    <span className="acad-matrix-max">/{a.maxPoints}</span>
                  </th>
                ))}
                <th>Average</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => {
                const studentAvg = averagePercent(
                  data.submissions.filter((s) => s.studentId === student.id),
                  assignments,
                );
                return (
                  <tr key={student.id}>
                    <td className="sticky-col">
                      <span className="row" style={{ gap: '0.45rem' }}>
                        <Avatar name={student.displayName} size={26} />
                        <span className="small strong acad-matrix-name">{student.displayName}</span>
                      </span>
                    </td>
                    {assignments.map((assignment) => {
                      const submission = submissionFor(data.submissions, assignment.id, student.id);
                      const pending = submission && submission.points === null;
                      if (onlyUnmarked && !pending) {
                        return <td key={assignment.id} className="acad-cell muted">·</td>;
                      }
                      const pct = submission ? percent(submission.points, assignment.maxPoints) : null;
                      return (
                        <td key={assignment.id}>
                          <button
                            type="button"
                            className={`acad-cell${
                              submission?.points === null || !submission
                                ? submission
                                  ? ' pending'
                                  : ' missing'
                                : pct !== null && pct >= 70
                                  ? ' good'
                                  : ' low'
                            }`}
                            onClick={() => setActive({ assignmentId: assignment.id, studentId: student.id })}
                            title={
                              submission
                                ? `${student.displayName} · ${assignment.title}`
                                : 'No submission yet'
                            }
                          >
                            {submission?.points !== null && submission ? submission.points : submission ? '!' : '–'}
                          </button>
                        </td>
                      );
                    })}
                    <td>
                      <span className={`badge ${studentAvg !== null && studentAvg >= 70 ? 'badge-ok' : 'badge'}`}>
                        {studentAvg === null ? '—' : `${studentAvg}%`}
                      </span>
                    </td>
                  </tr>
                );
              })}
              {students.length === 0 && (
                <tr>
                  <td colSpan={assignments.length + 2} className="muted small" style={{ padding: '1.2rem' }}>
                    No students in this class yet. Add them under Classes.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <div className="acad-legend tiny muted">
        <span><i className="lg lg-good" /> 70%+</span>
        <span><i className="lg lg-low" /> below 70%</span>
        <span><i className="lg lg-pending" /> handed in, needs marking</span>
        <span><i className="lg lg-missing" /> not handed in</span>
      </div>

      {active && activeAssignment && activeStudent && (
        <div className="card card-pad" style={{ marginTop: '1rem' }}>
          <div className="row-between" style={{ marginBottom: '0.6rem' }}>
            <div>
              <h3 style={{ margin: 0 }}>
                <StarIcon className="" /> {activeStudent.displayName}
              </h3>
              <p className="small muted" style={{ margin: 0 }}>
                {activeAssignment.title} · out of {activeAssignment.maxPoints}
              </p>
            </div>
            <button type="button" className="btn btn-sm btn-ghost" onClick={() => setActive(null)}>
              Close
            </button>
          </div>
          {!activeSubmission ? (
            <Empty title="Nothing handed in">
              The student has not submitted this assignment yet.
            </Empty>
          ) : (
            <>
              {activeSubmission.text && (
                <p className="acad-submitted-text small">{activeSubmission.text}</p>
              )}
              <GradeInline
                maxPoints={activeAssignment.maxPoints}
                points={activeSubmission.points}
                feedback={activeSubmission.feedback}
                onSave={(points, feedback) =>
                  gradeSubmission({ submissionId: activeSubmission.id, points, feedback })
                }
              />
            </>
          )}
        </div>
      )}
    </div>
  );
}

function GradeInline({
  maxPoints,
  points,
  feedback,
  onSave,
}: {
  maxPoints: number;
  points: number | null;
  feedback: string;
  onSave: (points: number, feedback: string) => Promise<void>;
}) {
  const [value, setValue] = useState(points !== null ? String(points) : '');
  const [note, setNote] = useState(feedback);
  const [busy, setBusy] = useState(false);

  return (
    <div className="acad-grade-edit">
      <div className="row wrap" style={{ gap: '0.5rem' }}>
        <input
          className="input acad-score-input"
          type="number"
          min={0}
          max={maxPoints}
          step={0.5}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="0"
        />
        <span className="muted small">/ {maxPoints}</span>
        <button
          type="button"
          className="btn btn-sm"
          disabled={busy}
          onClick={async () => {
            const parsed = Number(value);
            if (Number.isNaN(parsed)) return;
            setBusy(true);
            try {
              await onSave(Math.min(maxPoints, Math.max(0, parsed)), note.trim());
            } finally {
              setBusy(false);
            }
          }}
        >
          Save mark
        </button>
      </div>
      <textarea
        className="input acad-feedback"
        rows={2}
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Feedback for the student"
      />
    </div>
  );
}

function csvCell(value: string): string {
  return /[",\n]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value;
}
