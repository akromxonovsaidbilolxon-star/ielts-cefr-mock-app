import { useMemo, useState } from 'react';
import { useAcademy } from './AcademyProvider';
import {
  classById,
  homeworkState,
  humanDue,
  letterGrade,
  percent,
  submissionFor,
  type Assignment,
  type HomeworkState,
} from './types';
import {
  Avatar,
  Empty,
  FileList,
  FilePicker,
  GradeControl,
  HomeworkBadge,
  LevelChip,
  Modal,
  PageHead,
  useUploader,
} from './ui';
import {
  BookOpenIcon,
  CalendarIcon,
  CheckIcon,
  ClipboardIcon,
  ClockIcon,
  PlusIcon,
  TrashIcon,
} from '../components/Icons';

const FILTERS: { id: 'all' | HomeworkState; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'open', label: 'Open' },
  { id: 'due-soon', label: 'Due soon' },
  { id: 'submitted', label: 'Handed in' },
  { id: 'graded', label: 'Graded' },
  { id: 'missing', label: 'Overdue' },
];

function emptyAssignment(classId: string): Assignment {
  const due = new Date();
  due.setDate(due.getDate() + 7);
  return {
    id: '',
    classId,
    title: '',
    description: '',
    dueAt: due.toISOString().slice(0, 10),
    maxPoints: 10,
    bookId: null,
    createdAt: new Date().toISOString(),
  };
}

export default function AcademyHomework() {
  const { data, isTeacher, studentId, viewAs, saveAssignment, deleteAssignment } = useAcademy();
  const [filter, setFilter] = useState<'all' | HomeworkState>('all');
  const [classFilter, setClassFilter] = useState<string>('all');
  const [editing, setEditing] = useState<Assignment | null>(null);

  const asStudent = !isTeacher || Boolean(viewAs);
  const meId = studentId;

  const myClassIds = useMemo(
    () => new Set(data.classes.filter((c) => c.studentIds.includes(meId)).map((c) => c.id)),
    [data.classes, meId],
  );

  const visible = useMemo(() => {
    let list = data.assignments;
    if (asStudent) list = list.filter((a) => myClassIds.has(a.classId));
    if (classFilter !== 'all') list = list.filter((a) => a.classId === classFilter);
    if (filter !== 'all') {
      list = list.filter((a) => homeworkState(a, submissionFor(data.submissions, a.id, meId)) === filter);
    }
    return list
      .slice()
      .sort((a, b) => {
        // Unfinished work first, then by due date.
        const sa = homeworkState(a, submissionFor(data.submissions, a.id, meId));
        const sb = homeworkState(b, submissionFor(data.submissions, b.id, meId));
        const rank = (s: HomeworkState) =>
          s === 'missing' ? 0 : s === 'due-soon' ? 1 : s === 'open' ? 2 : s === 'submitted' ? 3 : 4;
        return rank(sa) - rank(sb) || a.dueAt.localeCompare(b.dueAt);
      });
  }, [asStudent, classFilter, data, filter, meId, myClassIds]);

  return (
    <div className="acad-page">
      <PageHead
        title={asStudent ? 'My homework' : 'Homework'}
        subtitle={
          asStudent
            ? 'Read the task, attach your work and hand it in before the deadline.'
            : 'Set work for a class, then mark what comes back.'
        }
        actions={
          !asStudent ? (
            <button
              type="button"
              className="btn"
              onClick={() =>
                setEditing(emptyAssignment(data.classes[0]?.id ?? ''))
              }
              disabled={data.classes.length === 0}
              title={data.classes.length === 0 ? 'Create a class first' : undefined}
            >
              <PlusIcon className="" />
              New homework
            </button>
          ) : undefined
        }
      />

      <div className="acad-toolbar">
        <div className="row wrap" style={{ gap: '0.3rem' }}>
          {FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              className={`chip${filter === f.id ? ' active' : ''}`}
              onClick={() => setFilter(f.id)}
            >
              {f.label}
            </button>
          ))}
        </div>
        {!asStudent && data.classes.length > 0 && (
          <select
            className="input acad-select"
            value={classFilter}
            onChange={(e) => setClassFilter(e.target.value)}
            aria-label="Filter by class"
          >
            <option value="all">All classes</option>
            {data.classes.map((cls) => (
              <option key={cls.id} value={cls.id}>
                {cls.name}
              </option>
            ))}
          </select>
        )}
      </div>

      {visible.length === 0 && (
        <Empty
          title={asStudent ? 'Nothing here right now' : 'No homework yet'}
          action={
            !asStudent && data.classes.length > 0 ? (
              <button
                type="button"
                className="btn btn-sm"
                onClick={() => setEditing(emptyAssignment(data.classes[0].id))}
              >
                <PlusIcon className="" />
                Set the first homework
              </button>
            ) : undefined
          }
        >
          {asStudent
            ? 'When your teacher sets homework, it appears here with the deadline.'
            : data.classes.length === 0
              ? 'Create a class first — homework is always assigned to a class.'
              : 'Assign work and track who has handed it in.'}
        </Empty>
      )}

      <div className="stack stack-md">
        {visible.map((assignment) => (
          <AssignmentCard
            key={assignment.id}
            assignment={assignment}
            asStudent={asStudent}
            meId={meId}
            onEdit={() => setEditing(assignment)}
            onDelete={async () => {
              if (window.confirm('Delete this homework and every submission attached to it?')) {
                await deleteAssignment(assignment.id);
              }
            }}
          />
        ))}
      </div>

      {editing && (
        <EditAssignmentModal
          assignment={editing}
          onClose={() => setEditing(null)}
          onSave={async (next) => {
            await saveAssignment(next);
            setEditing(null);
          }}
        />
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Assignment card                                                     */
/* ------------------------------------------------------------------ */

function AssignmentCard({
  assignment,
  asStudent,
  meId,
  onEdit,
  onDelete,
}: {
  assignment: Assignment;
  asStudent: boolean;
  meId: string;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const { data, submitHomework, gradeSubmission } = useAcademy();
  const cls = classById(data.classes, assignment.classId);
  const book = assignment.bookId ? data.books.find((b) => b.id === assignment.bookId) : undefined;
  const mySubmission = submissionFor(data.submissions, assignment.id, meId);
  const state = homeworkState(assignment, mySubmission);
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const classSubmissions = data.submissions.filter((s) => s.assignmentId === assignment.id);

  if (asStudent) {
    return (
      <>
        <div className={`acad-card state-${state}`}>
          <div className="acad-card-top">
            <div style={{ minWidth: 0 }}>
              <div className="row wrap" style={{ gap: '0.4rem', marginBottom: '0.3rem' }}>
                <HomeworkBadge state={state} />
                {cls && <span className="badge">{cls.name}</span>}
                <span className="tiny faint">
                  <ClockIcon className="" /> {humanDue(assignment.dueAt)}
                </span>
              </div>
              <h3 className="acad-card-title">{assignment.title}</h3>
              <div className="tiny muted">
                {assignment.maxPoints} points
                {book ? ` · based on ${book.title}` : ''}
              </div>
            </div>
            {mySubmission?.points !== null && mySubmission && (
              <div className="acad-score-badge">
                <b>{percent(mySubmission.points, assignment.maxPoints)}%</b>
                <span>{mySubmission.points}/{assignment.maxPoints}</span>
              </div>
            )}
          </div>

          <p className={`acad-desc${expanded ? ' open' : ''}`}>{assignment.description}</p>
          {assignment.description.length > 220 && (
            <button type="button" className="link-btn" onClick={() => setExpanded((v) => !v)}>
              {expanded ? 'Show less' : 'Read full task'}
            </button>
          )}

          {book?.file && (
            <div className="acad-inline-book">
              <BookOpenIcon className="" />
              <span className="grow">
                Reference: <b>{book.title}</b>
              </span>
              <FileList files={[book.file]} />
            </div>
          )}

          {mySubmission && (
            <div className="acad-submitted">
              <div className="row-between" style={{ gap: '0.5rem' }}>
                <span className="small strong">
                  <CheckIcon className="" /> Handed in{' '}
                  {new Date(mySubmission.submittedAt).toLocaleString(undefined, {
                    day: 'numeric',
                    month: 'short',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
                {mySubmission.points !== null && (
                  <span className="badge badge-ok">
                    Marked {mySubmission.points}/{assignment.maxPoints} · {letterGrade(percent(mySubmission.points, assignment.maxPoints))}
                  </span>
                )}
              </div>
              {mySubmission.text && <p className="acad-submitted-text">{mySubmission.text}</p>}
              <FileList files={mySubmission.files} />
              {mySubmission.feedback && (
                <div className="callout callout-info small" style={{ marginTop: '0.6rem' }}>
                  <b>Teacher's feedback:</b> {mySubmission.feedback}
                </div>
              )}
            </div>
          )}

          <div className="acad-card-foot">
            <span className="tiny faint">
              {state === 'graded'
                ? 'This work is marked. You can still resubmit if your teacher asks.'
                : state === 'submitted'
                  ? 'Waiting for your teacher to mark it.'
                  : 'You can hand this in as many times as you like before marking.'}
            </span>
            <button type="button" className="btn btn-sm" onClick={() => setOpen(true)}>
              <ClipboardIcon className="" />
              {mySubmission ? 'Update submission' : 'Hand in'}
            </button>
          </div>
        </div>

        {open && (
          <SubmitModal
            assignment={assignment}
            existing={mySubmission}
            onClose={() => setOpen(false)}
            onSubmit={async (text, files) => {
              await submitHomework({ assignmentId: assignment.id, text, files });
              setOpen(false);
            }}
          />
        )}
      </>
    );
  }

  /* Teacher view */
  const studentCount = cls?.studentIds.length ?? 0;
  const submittedCount = classSubmissions.length;
  const markedCount = classSubmissions.filter((s) => s.points !== null).length;

  return (
    <>
      <div className="acad-card">
        <div className="acad-card-top">
          <div style={{ minWidth: 0 }}>
            <div className="row wrap" style={{ gap: '0.4rem', marginBottom: '0.3rem' }}>
              {cls && (
                <>
                  <LevelChip level={cls.level} />
                  <span className="badge">{cls.name}</span>
                </>
              )}
              <span className="tiny faint">
                <ClockIcon className="" /> {humanDue(assignment.dueAt)}
              </span>
            </div>
            <h3 className="acad-card-title">{assignment.title}</h3>
            <div className="tiny muted">
              {assignment.maxPoints} points · {submittedCount}/{studentCount} handed in · {markedCount} marked
            </div>
          </div>
          <div className="row" style={{ gap: '0.3rem' }}>
            <button type="button" className="btn btn-sm btn-ghost" onClick={onEdit}>
              Edit
            </button>
            <button type="button" className="icon-btn danger" onClick={onDelete} aria-label="Delete homework">
              <TrashIcon className="" />
            </button>
          </div>
        </div>

        <p className="acad-desc small">{assignment.description}</p>

        <div className="acad-progress" style={{ marginBottom: '0.75rem' }}>
          <span style={{ width: `${studentCount ? (submittedCount / studentCount) * 100 : 0}%` }} />
        </div>

        <button type="button" className="link-btn" onClick={() => setOpen(true)}>
          {open ? 'Hide submissions' : `Review ${submittedCount} submission${submittedCount === 1 ? '' : 's'} →`}
        </button>

        {open && (
          <div className="acad-submission-list">
            {(cls?.studentIds ?? []).map((id) => {
              const student = data.students.find((s) => s.id === id);
              const submission = classSubmissions.find((s) => s.studentId === id);
              return (
                <div key={id} className="acad-submission">
                  <div className="row" style={{ gap: '0.5rem' }}>
                    <Avatar name={student?.displayName ?? 'Student'} size={30} />
                    <span className="strong small grow">{student?.displayName ?? 'Student'}</span>
                    {!submission ? (
                      <span className="badge badge-bad">Not handed in</span>
                    ) : submission.points === null ? (
                      <span className="badge badge-warn">Needs marking</span>
                    ) : (
                      <span className="badge badge-ok">
                        {submission.points}/{assignment.maxPoints} ·{' '}
                        {letterGrade(percent(submission.points, assignment.maxPoints))}
                      </span>
                    )}
                  </div>

                  {submission && (
                    <div className="acad-submission-body">
                      {submission.text && <p className="acad-submitted-text small">{submission.text}</p>}
                      <FileList files={submission.files} />
                      <GradeControl
                        maxPoints={assignment.maxPoints}
                        points={submission.points}
                        feedback={submission.feedback}
                        onSave={async (points, feedback) => {
                          await gradeSubmission({ submissionId: submission.id, points, feedback });
                        }}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Student submit modal                                                */
/* ------------------------------------------------------------------ */

function SubmitModal({
  assignment,
  existing,
  onClose,
  onSubmit,
}: {
  assignment: Assignment;
  existing?: { text: string; files: import('./types').FileRef[] };
  onClose: () => void;
  onSubmit: (text: string, files: import('./types').FileRef[]) => Promise<void>;
}) {
  const uploader = useUploader('academy-submissions');
  const [text, setText] = useState(existing?.text ?? '');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Start from any files already handed in.
  const [initialised] = useState(() => {
    if (existing?.files.length) uploader.setFiles(existing.files);
    return true;
  });
  void initialised;

  const submit = async () => {
    if (!text.trim() && uploader.files.length === 0) {
      setError('Write something or attach a file before handing in.');
      return;
    }
    if (uploader.uploading > 0) {
      setError('Please wait for the upload to finish.');
      return;
    }
    setBusy(true);
    setError(null);
    try {
      await onSubmit(text.trim(), uploader.files);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not hand in your work. Try again.');
      setBusy(false);
    }
  };

  return (
    <Modal
      title={existing ? 'Update your submission' : 'Hand in your work'}
      onClose={onClose}
      footer={
        <>
          <button type="button" className="btn btn-ghost" onClick={onClose} disabled={busy}>
            Cancel
          </button>
          <button type="button" className="btn" onClick={() => void submit()} disabled={busy}>
            <CheckIcon className="" />
            {busy ? 'Handing in…' : existing ? 'Resubmit' : 'Hand in'}
          </button>
        </>
      }
    >
      <div className="stack stack-md">
        <div className="callout callout-info small">
          <b>{assignment.title}</b>
          <div className="tiny" style={{ marginTop: '0.2rem' }}>
            <CalendarIcon className="" /> {humanDue(assignment.dueAt)} · out of {assignment.maxPoints} points
          </div>
        </div>

        <label className="field">
          <span className="field-label">Your answer (optional if you attach work)</span>
          <textarea
            className="input acad-textarea"
            rows={6}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type your answer here, or write a short note about the files you attached…"
          />
          <span className="tiny faint">{text.trim().split(/\s+/).filter(Boolean).length} words</span>
        </label>

        <div>
          <span className="field-label" style={{ display: 'block', marginBottom: '0.3rem' }}>
            Attach your work
          </span>
          <FilePicker uploader={uploader} label="Upload photos, PDF or Word" />
        </div>

        {error && (
          <div className="callout callout-bad small" role="alert">
            {error}
          </div>
        )}
        {uploader.error && <div className="tiny" style={{ color: 'var(--bad)' }}>{uploader.error}</div>}
      </div>
    </Modal>
  );
}

/* ------------------------------------------------------------------ */
/* Teacher create/edit modal                                           */
/* ------------------------------------------------------------------ */

function EditAssignmentModal({
  assignment,
  onClose,
  onSave,
}: {
  assignment: Assignment;
  onClose: () => void;
  onSave: (assignment: Assignment) => Promise<void>;
}) {
  const { data } = useAcademy();
  const [draft, setDraft] = useState<Assignment>(assignment);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const save = async () => {
    if (!draft.title.trim()) {
      setError('Give the homework a title.');
      return;
    }
    if (!draft.classId) {
      setError('Choose a class.');
      return;
    }
    setBusy(true);
    setError(null);
    try {
      await onSave(draft);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save the homework.');
      setBusy(false);
    }
  };

  return (
    <Modal
      title={assignment.id ? 'Edit homework' : 'New homework'}
      onClose={onClose}
      wide
      footer={
        <>
          <button type="button" className="btn btn-ghost" onClick={onClose} disabled={busy}>
            Cancel
          </button>
          <button type="button" className="btn" onClick={() => void save()} disabled={busy}>
            {busy ? 'Saving…' : assignment.id ? 'Save changes' : 'Assign homework'}
          </button>
        </>
      }
    >
      <div className="stack stack-md">
        <label className="field">
          <span className="field-label">Class</span>
          <select
            className="input"
            value={draft.classId}
            onChange={(e) => setDraft({ ...draft, classId: e.target.value })}
          >
            {data.classes.map((cls) => (
              <option key={cls.id} value={cls.id}>
                {cls.name} ({cls.studentIds.length} students)
              </option>
            ))}
          </select>
        </label>

        <label className="field">
          <span className="field-label">Title</span>
          <input
            className="input"
            value={draft.title}
            onChange={(e) => setDraft({ ...draft, title: e.target.value })}
            placeholder="e.g. Writing Task 2 — technology in education"
          />
        </label>

        <label className="field">
          <span className="field-label">Instructions</span>
          <textarea
            className="input acad-textarea"
            rows={5}
            value={draft.description}
            onChange={(e) => setDraft({ ...draft, description: e.target.value })}
            placeholder="What should the student do? Include page numbers, word counts and any book to use."
          />
        </label>

        <div className="acad-form-row">
          <label className="field">
            <span className="field-label">Due date</span>
            <input
              className="input"
              type="date"
              value={draft.dueAt}
              onChange={(e) => setDraft({ ...draft, dueAt: e.target.value })}
            />
          </label>
          <label className="field">
            <span className="field-label">Points</span>
            <input
              className="input"
              type="number"
              min={1}
              max={100}
              value={draft.maxPoints}
              onChange={(e) => setDraft({ ...draft, maxPoints: Math.max(1, Number(e.target.value) || 10) })}
            />
          </label>
          <label className="field">
            <span className="field-label">Book (optional)</span>
            <select
              className="input"
              value={draft.bookId ?? ''}
              onChange={(e) => setDraft({ ...draft, bookId: e.target.value || null })}
            >
              <option value="">No book</option>
              {data.books.map((book) => (
                <option key={book.id} value={book.id}>
                  {book.title}
                </option>
              ))}
            </select>
          </label>
        </div>

        {error && (
          <div className="callout callout-bad small" role="alert">
            {error}
          </div>
        )}
      </div>
    </Modal>
  );
}
