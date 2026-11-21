import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAcademy } from './AcademyProvider';
import {
  LEVELS,
  averagePercent,
  homeworkState,
  humanDue,
  letterGrade,
  submissionFor,
  type Level,
  type SchoolClass,
} from './types';
import { Avatar, Empty, LevelChip, Modal, PageHead, Stat } from './ui';
import {
  ChartIcon,
  CheckIcon,
  PlusIcon,
  TrashIcon,
  UsersIcon,
  XIcon,
} from '../components/Icons';

const COLORS: SchoolClass['color'][] = ['brand', 'accent', 'ok', 'warn'];

export default function AcademyClasses() {
  const { data, isTeacher, createClass, updateClass, deleteClass, addStudent, viewAs } = useAcademy();
  const [params, setParams] = useSearchParams();
  const selectedId = params.get('class');
  const [editing, setEditing] = useState<SchoolClass | null>(null);

  const selected = data.classes.find((c) => c.id === selectedId) ?? data.classes[0];

  if (!isTeacher) {
    return (
      <div className="acad-page">
        <PageHead title="My classes" subtitle="The groups you belong to." />
        <div className="acad-class-grid">
          {data.classes.map((cls) => (
            <div key={cls.id} className={`acad-class-card tone-${cls.color}`}>
              <div className="row-between">
                <h4 style={{ margin: 0 }}>{cls.name}</h4>
                <LevelChip level={cls.level} />
              </div>
              <div className="tiny muted">{cls.schedule}</div>
              <div className="acad-class-meta">
                <span>
                  <UsersIcon className="" /> {cls.studentIds.length} students
                </span>
              </div>
            </div>
          ))}
          {data.classes.length === 0 && <Empty title="You are not in a class yet" />}
        </div>
      </div>
    );
  }

  return (
    <div className="acad-page">
      <PageHead
        title="Classes"
        subtitle="Every class groups students, homework and marks together."
        actions={
          <button type="button" className="btn" onClick={() => setEditing(blankClass())}>
            <PlusIcon className="" />
            New class
          </button>
        }
      />

      {data.classes.length === 0 ? (
        <Empty
          title="Create your first class"
          action={
            <button type="button" className="btn btn-sm" onClick={() => setEditing(blankClass())}>
              <PlusIcon className="" />
              New class
            </button>
          }
        >
          Give it a name, choose a level and add your students.
        </Empty>
      ) : (
        <div className="acad-class-grid">
          {data.classes.map((cls) => {
            const avg = averagePercent(
              data.submissions.filter((s) => cls.studentIds.includes(s.studentId)),
              data.assignments.filter((a) => a.classId === cls.id),
            );
            return (
              <button
                key={cls.id}
                type="button"
                className={`acad-class-card tone-${cls.color}${cls.id === selected?.id ? ' active' : ''}`}
                onClick={() => setParams({ class: cls.id })}
              >
                <div className="row-between">
                  <h4 style={{ margin: 0 }}>{cls.name}</h4>
                  <LevelChip level={cls.level} />
                </div>
                <div className="tiny muted">{cls.schedule || 'No fixed time'}</div>
                <div className="acad-class-meta">
                  <span>
                    <UsersIcon className="" /> {cls.studentIds.length}
                  </span>
                  <span>
                    <ChartIcon className="" /> {avg === null ? '—' : `${avg}%`}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {selected && (
        <ClassDetail
          key={selected.id}
          cls={selected}
          onEdit={() => setEditing(selected)}
          onDelete={async () => {
            if (window.confirm(`Delete ${selected.name}? Its homework and marks are removed too.`)) {
              await deleteClass(selected.id);
              setParams({});
            }
          }}
          onAddStudent={addStudent}
          viewingStudent={viewAs}
        />
      )}

      {editing && (
        <ClassModal
          cls={editing}
          students={data.students}
          onClose={() => setEditing(null)}
          onSave={async (next) => {
            if (data.classes.some((c) => c.id === next.id)) await updateClass(next);
            else await createClass(next);
            setEditing(null);
          }}
          onAddStudent={addStudent}
        />
      )}
    </div>
  );
}

function blankClass(): SchoolClass {
  return {
    id: '',
    name: '',
    level: 'B2',
    schedule: '',
    color: 'brand',
    studentIds: [],
    createdAt: new Date().toISOString(),
  };
}

function ClassDetail({
  cls,
  onEdit,
  onDelete,
  onAddStudent,
  viewingStudent,
}: {
  cls: SchoolClass;
  onEdit: () => void;
  onDelete: () => void;
  onAddStudent: (name: string, email: string) => Promise<{ id: string; displayName: string }>;
  viewingStudent: string | null;
}) {
  const { data } = useAcademy();
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const assignments = data.assignments.filter((a) => a.classId === cls.id);
  const students = cls.studentIds
    .map((id) => data.students.find((s) => s.id === id))
    .filter((s): s is NonNullable<typeof s> => Boolean(s));

  const classSubs = data.submissions.filter((s) => students.some((st) => st.id === s.studentId));
  const avg = averagePercent(classSubs, assignments);
  const outstanding = assignments.filter((a) =>
    students.some((st) => homeworkState(a, submissionFor(data.submissions, a.id, st.id)) === 'missing'),
  ).length;

  const stats = useMemo(
    () => ({
      marked: classSubs.filter((s) => s.points !== null).length,
      pending: classSubs.filter((s) => s.points === null).length,
    }),
    [classSubs],
  );

  return (
    <div style={{ marginTop: '1.2rem' }}>
      <div className="acad-stats">
        <Stat label="Students" value={students.length} hint={cls.schedule} tone="brand" />
        <Stat label="Assignments" value={assignments.length} hint={`${outstanding} with missing work`} tone="accent" />
        <Stat label="Class average" value={avg === null ? '—' : `${avg}%`} hint={letterGrade(avg)} tone="ok" />
        <Stat label="Marked" value={stats.marked} hint={`${stats.pending} waiting`} tone={stats.pending ? 'warn' : 'ok'} />
      </div>

      <div className="acad-grid-2">
        <section className="card card-pad">
          <div className="row-between" style={{ marginBottom: '0.7rem' }}>
            <h3 style={{ margin: 0 }}>
              <UsersIcon className="" /> Students
            </h3>
            <button type="button" className="btn btn-sm btn-ghost" onClick={onEdit}>
              Edit list
            </button>
          </div>

          {students.length === 0 && <p className="muted small">No students in this class yet.</p>}

          <div className="stack stack-sm">
            {students.map((student) => {
              const graded = data.submissions.filter((s) => s.studentId === student.id && s.points !== null);
              const studentAvg = averagePercent(graded, assignments);
              const open = assignments.filter((a) => {
                const st = homeworkState(a, submissionFor(data.submissions, a.id, student.id));
                return st === 'missing' || st === 'open' || st === 'due-soon';
              }).length;
              const isViewing = viewingStudent === student.id;
              return (
                <div key={student.id} className={`acad-student-row${isViewing ? ' active' : ''}`}>
                  <Avatar name={student.displayName} size={32} />
                  <span className="grow" style={{ minWidth: 0 }}>
                    <span className="strong small" style={{ display: 'block' }}>
                      {student.displayName}
                    </span>
                    <span className="tiny muted">{student.email}</span>
                  </span>
                  <span className="row" style={{ gap: '0.3rem' }}>
                    {open > 0 && <span className="badge badge-warn">{open} open</span>}
                    <span className={`badge ${studentAvg !== null && studentAvg >= 70 ? 'badge-ok' : ''}`}>
                      {studentAvg === null ? '—' : `${studentAvg}%`}
                    </span>
                  </span>
                </div>
              );
            })}
          </div>

          <div className="acad-add-student">
            <div className="tiny strong" style={{ marginBottom: '0.35rem' }}>
              Add a student
            </div>
            <div className="row wrap" style={{ gap: '0.4rem' }}>
              <input
                className="input"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Full name"
                aria-label="Student name"
              />
              <input
                className="input"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="Email (optional)"
                aria-label="Student email"
              />
              <button
                type="button"
                className="btn btn-sm"
                disabled={busy || !newName.trim()}
                onClick={async () => {
                  setBusy(true);
                  setMessage(null);
                  try {
                    const student = await onAddStudent(newName, newEmail);
                    setNewName('');
                    setNewEmail('');
                    setMessage(
                      `Added ${student.displayName}. Now add them to this class from Edit list.`,
                    );
                  } catch (err) {
                    setMessage(err instanceof Error ? err.message : 'Could not add that student.');
                  } finally {
                    setBusy(false);
                  }
                }}
              >
                <PlusIcon className="" />
                Add
              </button>
            </div>
            {message && <div className="tiny muted" style={{ marginTop: '0.35rem' }}>{message}</div>}
          </div>
        </section>

        <section className="card card-pad">
          <h3 style={{ marginTop: 0 }}>Homework for this class</h3>
          {assignments.length === 0 && <p className="muted small">Nothing set yet.</p>}
          <div className="stack stack-sm">
            {assignments.map((assignment) => {
              const submitted = data.submissions.filter((s) => s.assignmentId === assignment.id).length;
              return (
                <div key={assignment.id} className="acad-mini-row">
                  <span className="grow" style={{ minWidth: 0 }}>
                    <span className="small strong">{assignment.title}</span>
                    <span className="tiny muted" style={{ display: 'block' }}>
                      {humanDue(assignment.dueAt)} · {submitted}/{students.length} handed in
                    </span>
                  </span>
                </div>
              );
            })}
          </div>

          <div className="divider" style={{ margin: '1rem 0' }} />
          <div className="row wrap">
            <button type="button" className="btn btn-sm btn-ghost" onClick={onEdit}>
              Edit class
            </button>
            <button type="button" className="btn btn-sm btn-ghost" onClick={onDelete} style={{ color: 'var(--bad)' }}>
              <TrashIcon className="" />
              Delete class
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}

function ClassModal({
  cls,
  students,
  onClose,
  onSave,
  onAddStudent,
}: {
  cls: SchoolClass;
  students: { id: string; displayName: string; email: string }[];
  onClose: () => void;
  onSave: (cls: SchoolClass) => Promise<void>;
  onAddStudent: (name: string, email: string) => Promise<{ id: string; displayName: string }>;
}) {
  const [draft, setDraft] = useState<SchoolClass>(cls);
  const [query, setQuery] = useState('');
  const [name, setName] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const filtered = students.filter((s) =>
    `${s.displayName} ${s.email}`.toLowerCase().includes(query.trim().toLowerCase()),
  );

  const toggle = (id: string) => {
    setDraft((prev) => ({
      ...prev,
      studentIds: prev.studentIds.includes(id)
        ? prev.studentIds.filter((x) => x !== id)
        : [...prev.studentIds, id],
    }));
  };

  const save = async () => {
    if (!draft.name.trim()) {
      setError('Give the class a name.');
      return;
    }
    setBusy(true);
    setError(null);
    try {
      await onSave({ ...draft, name: draft.name.trim() });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save the class.');
      setBusy(false);
    }
  };

  return (
    <Modal
      title={cls.id ? 'Edit class' : 'New class'}
      onClose={onClose}
      wide
      footer={
        <>
          <button type="button" className="btn btn-ghost" onClick={onClose} disabled={busy}>
            Cancel
          </button>
          <button type="button" className="btn" onClick={() => void save()} disabled={busy}>
            <CheckIcon className="" />
            {busy ? 'Saving…' : cls.id ? 'Save class' : 'Create class'}
          </button>
        </>
      }
    >
      <div className="stack stack-md">
        <div className="acad-form-row">
          <label className="field" style={{ flex: 2 }}>
            <span className="field-label">Class name</span>
            <input
              className="input"
              value={draft.name}
              onChange={(e) => setDraft({ ...draft, name: e.target.value })}
              placeholder="IELTS B2 · Evening"
            />
          </label>
          <label className="field">
            <span className="field-label">Level</span>
            <select
              className="input"
              value={draft.level}
              onChange={(e) => setDraft({ ...draft, level: e.target.value as Level })}
            >
              {LEVELS.map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </select>
          </label>
        </div>

        <label className="field">
          <span className="field-label">Schedule (optional)</span>
          <input
            className="input"
            value={draft.schedule}
            onChange={(e) => setDraft({ ...draft, schedule: e.target.value })}
            placeholder="Mon & Wed · 18:00"
          />
        </label>

        <div className="field">
          <span className="field-label">Colour</span>
          <div className="acad-swatches">
            {COLORS.map((color) => (
              <button
                key={color}
                type="button"
                className={`acad-swatch tone-${color}${draft.color === color ? ' active' : ''}`}
                aria-label={`Colour ${color}`}
                onClick={() => setDraft({ ...draft, color })}
              />
            ))}
          </div>
        </div>

        <div>
          <div className="row-between" style={{ marginBottom: '0.4rem' }}>
            <span className="field-label">Students ({draft.studentIds.length} selected)</span>
            <span className="tiny faint">{students.length} in the centre</span>
          </div>
          <label className="acad-search" style={{ width: '100%' }}>
            <input
              className="input"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search students"
            />
          </label>
          <div className="acad-picker">
            {filtered.map((student) => {
              const checked = draft.studentIds.includes(student.id);
              return (
                <button
                  key={student.id}
                  type="button"
                  className={`acad-picker-row${checked ? ' active' : ''}`}
                  onClick={() => toggle(student.id)}
                >
                  <Avatar name={student.displayName} size={28} />
                  <span className="grow" style={{ minWidth: 0 }}>
                    <span className="small strong" style={{ display: 'block' }}>
                      {student.displayName}
                    </span>
                    <span className="tiny muted">{student.email}</span>
                  </span>
                  <span className={`acad-check${checked ? ' on' : ''}`}>
                    {checked ? <CheckIcon className="" /> : null}
                  </span>
                </button>
              );
            })}
            {filtered.length === 0 && <p className="muted small" style={{ padding: '0.5rem' }}>No students match.</p>}
          </div>
        </div>

        <div className="acad-inline-add">
          <input
            className="input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="New student name"
          />
          <button
            type="button"
            className="btn btn-sm btn-ghost"
            disabled={!name.trim()}
            onClick={async () => {
              try {
                const student = await onAddStudent(name, '');
                setDraft((prev) => ({ ...prev, studentIds: [...prev.studentIds, student.id] }));
                setName('');
              } catch (err) {
                setError(err instanceof Error ? err.message : 'Could not add that student.');
              }
            }}
          >
            <PlusIcon className="" />
            Add new
          </button>
        </div>

        {error && (
          <div className="callout callout-bad small" role="alert">
            <XIcon className="" /> {error}
          </div>
        )}
      </div>
    </Modal>
  );
}
