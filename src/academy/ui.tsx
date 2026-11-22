import { useEffect, useRef, useState, type ReactNode } from 'react';
import { openAcademyFile, uploadAcademyFile } from './files';
import {
  formatBytes,
  homeworkState,
  type Assignment,
  type FileRef,
  type HomeworkState,
  type Level,
  type Submission,
} from './types';
import {
  CheckIcon,
  DownloadIcon,
  FileIcon,
  PaperclipIcon,
  UploadIcon,
  XIcon,
} from '../components/Icons';

/* ------------------------------------------------------------------ */
/* Layout primitives                                                   */
/* ------------------------------------------------------------------ */

export function PageHead({
  title,
  subtitle,
  actions,
}: {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="page-head acad-page-head">
      <div>
        <h1>{title}</h1>
        {subtitle && <p className="muted small">{subtitle}</p>}
      </div>
      {actions && <div className="row wrap">{actions}</div>}
    </div>
  );
}

export function Stat({
  label,
  value,
  hint,
  tone = 'brand',
}: {
  label: string;
  value: ReactNode;
  hint?: ReactNode;
  tone?: 'brand' | 'accent' | 'ok' | 'warn' | 'bad' | 'neutral';
}) {
  return (
    <div className={`acad-stat tone-${tone}`}>
      <div className="acad-stat-label">{label}</div>
      <div className="acad-stat-value">{value}</div>
      {hint && <div className="acad-stat-hint">{hint}</div>}
    </div>
  );
}

export function Empty({
  title,
  children,
  action,
}: {
  title: string;
  children?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="empty">
      <div className="empty-title">{title}</div>
      {children && <p className="small muted" style={{ margin: '0.3rem auto 0', maxWidth: '46ch' }}>{children}</p>}
      {action && <div style={{ marginTop: '0.9rem' }}>{action}</div>}
    </div>
  );
}

export function LevelChip({ level }: { level: Level }) {
  const tone =
    level === 'C1' || level === 'C2' ? 'ok' : level === 'B2' ? 'brand' : level === 'Mixed' ? 'warn' : 'accent';
  return <span className={`badge badge-${tone}`}>{level}</span>;
}

const STATE_LABEL: Record<HomeworkState, string> = {
  missing: 'Overdue',
  open: 'Open',
  'due-soon': 'Due soon',
  submitted: 'Submitted',
  graded: 'Graded',
  closed: 'Closed',
};

export function HomeworkBadge({ state }: { state: HomeworkState }) {
  const cls =
    state === 'graded'
      ? 'badge-ok'
      : state === 'submitted'
        ? 'badge-brand'
        : state === 'missing'
          ? 'badge-bad'
          : state === 'due-soon'
            ? 'badge-warn'
            : state === 'closed'
              ? 'badge'
              : 'badge-accent';
  return <span className={`badge ${cls}`}>{STATE_LABEL[state]}</span>;
}

/**
 * Shown while the centre's data loads. It is a plain skeleton, not a spinner:
 * the layout stays put, so nothing jumps when records arrive.
 */
export function AcademyLoading() {
  return (
    <div className="acad-page" aria-busy="true" aria-label="Loading the education centre">
      <div className="acad-skeleton acad-skeleton-title" />
      <div className="acad-stats">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="acad-skeleton acad-skeleton-stat" />
        ))}
      </div>
      <div className="acad-grid-2">
        <div className="acad-skeleton acad-skeleton-card" />
        <div className="acad-skeleton acad-skeleton-card" />
      </div>
      <p className="muted small" style={{ marginTop: '0.9rem' }}>
        Loading your centre…
      </p>
    </div>
  );
}

export function stateOf(assignment: Assignment, submission: Submission | undefined): HomeworkState {
  return homeworkState(assignment, submission);
}

export function Avatar({ name, size = 34 }: { name: string; size?: number }) {
  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join('');
  const hue = Array.from(name).reduce((acc, ch) => acc + ch.charCodeAt(0), 0) % 360;
  return (
    <span
      className="acad-avatar"
      style={{
        width: size,
        height: size,
        fontSize: size * 0.36,
        background: `linear-gradient(140deg, hsl(${hue} 62% 42%), hsl(${(hue + 40) % 360} 58% 36%))`,
      }}
      aria-hidden
    >
      {initials || '?'}
    </span>
  );
}

export function Modal({
  title,
  onClose,
  children,
  footer,
  wide,
}: {
  title: string;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
  wide?: boolean;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  return (
    <div className="modal-backdrop" onClick={onClose} role="presentation">
      <div
        className={`modal${wide ? ' modal-wide' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-head">
          <h3 style={{ margin: 0 }}>{title}</h3>
          <button type="button" className="icon-btn" onClick={onClose} aria-label="Close">
            <XIcon className="" />
          </button>
        </div>
        <div className="modal-body">{children}</div>
        {footer && <div className="modal-foot">{footer}</div>}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* File handling                                                       */
/* ------------------------------------------------------------------ */

export function FileList({
  files,
  removing,
  onRemove,
}: {
  files: FileRef[];
  removing?: string | null;
  onRemove?: (file: FileRef) => void;
}) {
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (files.length === 0) return null;

  return (
    <div className="file-list">
      {files.map((file) => (
        <div key={file.path} className="file-row">
          <span className="file-icon">
            <FileIcon className="" />
          </span>
          <span className="file-main">
            <button
              type="button"
              className="file-name"
              title="Open file"
              onClick={async () => {
                setBusy(file.path);
                setError(null);
                try {
                  await openAcademyFile(file);
                } catch (err) {
                  setError(err instanceof Error ? err.message : 'Could not open that file.');
                } finally {
                  setBusy(null);
                }
              }}
            >
              {file.name}
            </button>
            <span className="tiny faint">
              {formatBytes(file.size)}
              {busy === file.path ? ' · opening…' : ''}
            </span>
          </span>
          <span className="row" style={{ gap: '0.25rem' }}>
            <button
              type="button"
              className="icon-btn"
              aria-label={`Download ${file.name}`}
              title="Download"
              onClick={async () => {
                try {
                  const { academyFileUrl } = await import('./files');
                  const url = await academyFileUrl(file);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = file.name;
                  a.rel = 'noopener';
                  document.body.appendChild(a);
                  a.click();
                  a.remove();
                } catch (err) {
                  setError(err instanceof Error ? err.message : 'Could not download that file.');
                }
              }}
            >
              <DownloadIcon className="" />
            </button>
            {onRemove && (
              <button
                type="button"
                className="icon-btn danger"
                aria-label={`Remove ${file.name}`}
                title="Remove"
                disabled={removing === file.path}
                onClick={() => onRemove(file)}
              >
                <XIcon className="" />
              </button>
            )}
          </span>
        </div>
      ))}
      {error && <div className="tiny" style={{ color: 'var(--bad)' }}>{error}</div>}
    </div>
  );
}

/**
 * Attach files to homework: uploads immediately so the student's work is
 * already safe on the server before they press "Hand in".
 */
export function useUploader(bucket: 'academy-books' | 'academy-submissions') {
  const [files, setFiles] = useState<FileRef[]>([]);
  const [uploading, setUploading] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const add = async (list: FileList | null) => {
    if (!list || list.length === 0) return;
    setError(null);
    const chosen = Array.from(list);
    setUploading((n) => n + chosen.length);
    for (const file of chosen) {
      try {
        if (file.size > 25 * 1024 * 1024) {
          throw new Error(`${file.name} is larger than 25 MB.`);
        }
        const ref = await uploadAcademyFile(file, bucket);
        setFiles((prev) => [...prev, ref]);
      } catch (err) {
        setError(err instanceof Error ? err.message : `Could not upload ${file.name}.`);
      } finally {
        setUploading((n) => n - 1);
      }
    }
    if (inputRef.current) inputRef.current.value = '';
  };

  return {
    files,
    setFiles,
    uploading,
    error,
    inputRef,
    add,
    remove: (file: FileRef) => setFiles((prev) => prev.filter((f) => f.path !== file.path)),
    reset: () => {
      setFiles([]);
      setError(null);
    },
  };
}

export function FilePicker({
  uploader,
  label = 'Attach files',
  accept,
}: {
  uploader: ReturnType<typeof useUploader>;
  label?: string;
  accept?: string;
}) {
  return (
    <div className="stack stack-sm">
      <div className="row wrap">
        <button
          type="button"
          className="btn btn-ghost btn-sm"
          onClick={() => uploader.inputRef.current?.click()}
          disabled={uploader.uploading > 0}
        >
          <PaperclipIcon className="" />
          {uploader.uploading > 0 ? 'Uploading…' : label}
        </button>
        <span className="tiny faint">PDF, Word, image · up to 25 MB each</span>
      </div>
      <input
        ref={uploader.inputRef}
        type="file"
        hidden
        multiple
        accept={accept}
        onChange={(e) => void uploader.add(e.target.files)}
      />
      <FileList files={uploader.files} onRemove={uploader.remove} />
      {uploader.error && <div className="tiny" style={{ color: 'var(--bad)' }}>{uploader.error}</div>}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Grading controls                                                    */
/* ------------------------------------------------------------------ */

export function GradeControl({
  maxPoints,
  points,
  feedback,
  busy,
  onSave,
}: {
  maxPoints: number;
  points: number | null;
  feedback: string;
  busy?: boolean;
  onSave: (points: number, feedback: string) => Promise<void> | void;
}) {
  const [value, setValue] = useState(points !== null ? String(points) : '');
  const [note, setNote] = useState(feedback);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setValue(points !== null ? String(points) : '');
    setNote(feedback);
  }, [points, feedback]);

  const save = async () => {
    const parsed = Number(value);
    if (value.trim() === '' || Number.isNaN(parsed)) {
      setError('Enter a score first.');
      return;
    }
    if (parsed < 0 || parsed > maxPoints) {
      setError(`Score must be between 0 and ${maxPoints}.`);
      return;
    }
    setError(null);
    await onSave(parsed, note.trim());
  };

  return (
    <div className="grade-control">
      <div className="row wrap" style={{ gap: '0.5rem' }}>
        <label className="grade-score">
          <input
            className="input"
            type="number"
            min={0}
            max={maxPoints}
            step={0.5}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            aria-label={`Score out of ${maxPoints}`}
          />
          <span className="muted small">/ {maxPoints}</span>
        </label>
        <button type="button" className="btn btn-sm" onClick={() => void save()} disabled={busy}>
          <CheckIcon className="" />
          {points === null ? 'Save mark' : 'Update mark'}
        </button>
      </div>
      <textarea
        className="input acad-feedback"
        rows={2}
        placeholder="Feedback for the student (optional)"
        value={note}
        onChange={(e) => setNote(e.target.value)}
      />
      {error && <div className="tiny" style={{ color: 'var(--bad)' }}>{error}</div>}
    </div>
  );
}

export function UploadIconSmall() {
  return <UploadIcon className="" />;
}
