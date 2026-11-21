import { useMemo, useRef, useState } from 'react';
import { useAcademy } from './AcademyProvider';
import { openAcademyFile } from './files';
import {
  LEVELS,
  formatBytes,
  safeFileName,
  type Book,
  type Level,
} from './types';
import { Empty, FileList, LevelChip, Modal, PageHead } from './ui';
import {
  BookOpenIcon,
  DownloadIcon,
  EyeIcon,
  PlusIcon,
  SearchIcon,
  TrashIcon,
  UploadIcon,
} from '../components/Icons';

const COVER_COLORS: Book['coverColor'][] = ['brand', 'accent', 'ok', 'warn', 'bad'];

export default function AcademyLibrary() {
  const { data, isTeacher, saveBook, deleteBook } = useAcademy();
  const [query, setQuery] = useState('');
  const [level, setLevel] = useState<'all' | Level>('all');
  const [editing, setEditing] = useState<Book | null>(null);
  const [opening, setOpening] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const books = useMemo(() => {
    const q = query.trim().toLowerCase();
    return data.books.filter((book) => {
      if (level !== 'all' && book.level !== level) return false;
      if (!q) return true;
      return `${book.title} ${book.author} ${book.subject} ${book.description}`
        .toLowerCase()
        .includes(q);
    });
  }, [data.books, level, query]);

  const flash = (message: string) => {
    setError(message);
    window.setTimeout(() => setError(null), 5000);
  };

  const open = async (book: Book) => {
    if (!book.file) {
      flash('This book has no file attached yet. Edit it to upload the PDF.');
      return;
    }
    setOpening(book.id);
    try {
      await openAcademyFile(book.file);
    } catch (err) {
      flash(err instanceof Error ? err.message : 'Could not open that book.');
    } finally {
      setOpening(null);
    }
  };

  const download = async (book: Book) => {
    if (!book.file) return;
    try {
      const { academyFileUrl } = await import('./files');
      const url = await academyFileUrl(book.file);
      const a = document.createElement('a');
      a.href = url;
      a.download = book.file.name;
      a.rel = 'noopener';
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (err) {
      flash(err instanceof Error ? err.message : 'Could not download that book.');
    }
  };

  return (
    <div className="acad-page">
      <PageHead
        title="Book library"
        subtitle={
          isTeacher
            ? 'Upload course books, past papers and worksheets. Students can read them in the app.'
            : 'Course books and materials uploaded by your teacher.'
        }
        actions={
          isTeacher ? (
            <button type="button" className="btn" onClick={() => setEditing(blankBook())}>
              <PlusIcon className="" />
              Upload a book
            </button>
          ) : undefined
        }
      />

      {error && (
        <div className="callout callout-bad small" style={{ marginBottom: '0.8rem' }} role="alert">
          {error}
        </div>
      )}

      <div className="acad-toolbar">
        <label className="acad-search">
          <SearchIcon className="" />
          <input
            className="input"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by title, subject or author"
            aria-label="Search books"
          />
        </label>
        <select
          className="input acad-select"
          value={level}
          onChange={(e) => setLevel(e.target.value as 'all' | Level)}
          aria-label="Filter by level"
        >
          <option value="all">All levels</option>
          {LEVELS.map((l) => (
            <option key={l} value={l}>
              {l}
            </option>
          ))}
        </select>
      </div>

      {books.length === 0 && (
        <Empty
          title={data.books.length === 0 ? 'The shelf is empty' : 'No books match that search'}
          action={
            isTeacher && data.books.length === 0 ? (
              <button type="button" className="btn btn-sm" onClick={() => setEditing(blankBook())}>
                <UploadIcon className="" />
                Upload the first book
              </button>
            ) : undefined
          }
        >
          {data.books.length === 0
            ? 'Upload a PDF and it becomes available to every student in the centre.'
            : 'Try a different word or level.'}
        </Empty>
      )}

      <div className="acad-shelf">
        {books.map((book) => (
          <article key={book.id} className="acad-book">
            <div className={`acad-book-cover cover-${book.coverColor}`}>
              <span className="acad-book-cover-icon">
                <BookOpenIcon className="" />
              </span>
              <span className="acad-book-cover-title">{book.title}</span>
              <span className="acad-book-cover-author">{book.author || 'School materials'}</span>
            </div>
            <div className="acad-book-body">
              <div className="row wrap" style={{ gap: '0.35rem' }}>
                <LevelChip level={book.level} />
                {book.subject && <span className="badge">{book.subject}</span>}
              </div>
              <h4 className="acad-book-title">{book.title}</h4>
              {book.description && <p className="tiny muted acad-book-desc">{book.description}</p>}
              <div className="tiny faint">
                {book.file ? `${formatBytes(book.file.size)} · PDF or document` : 'No file attached'}
              </div>
              <div className="acad-book-actions">
                <button
                  type="button"
                  className="btn btn-sm"
                  onClick={() => void open(book)}
                  disabled={opening === book.id}
                >
                  <EyeIcon className="" />
                  {opening === book.id ? 'Opening…' : 'Read'}
                </button>
                <button
                  type="button"
                  className="btn btn-sm btn-ghost"
                  onClick={() => void download(book)}
                  disabled={!book.file}
                  aria-label={`Download ${book.title}`}
                >
                  <DownloadIcon className="" />
                </button>
                {isTeacher && (
                  <>
                    <button
                      type="button"
                      className="btn btn-sm btn-ghost"
                      onClick={() => setEditing(book)}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="icon-btn danger"
                      aria-label={`Delete ${book.title}`}
                      onClick={async () => {
                        if (window.confirm(`Remove "${book.title}" from the library?`)) {
                          await deleteBook(book.id);
                        }
                      }}
                    >
                      <TrashIcon className="" />
                    </button>
                  </>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>

      {isTeacher && editing && (
        <BookModal
          book={editing}
          onClose={() => setEditing(null)}
          onSave={async (book) => {
            await saveBook(book);
            setEditing(null);
          }}
        />
      )}
    </div>
  );
}

function blankBook(): Book {
  return {
    id: '',
    title: '',
    author: '',
    subject: '',
    level: 'B2',
    description: '',
    coverColor: 'brand',
    file: null,
    uploadedBy: '',
    createdAt: new Date().toISOString(),
  };
}

function BookModal({
  book,
  onClose,
  onSave,
}: {
  book: Book;
  onClose: () => void;
  onSave: (book: Book) => Promise<void>;
}) {
  const [draft, setDraft] = useState<Book>(book);
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const pickFile = async (file: File | undefined) => {
    if (!file) return;
    if (file.size > 25 * 1024 * 1024) {
      setError('That file is larger than 25 MB. Compress the PDF first.');
      return;
    }
    setUploading(true);
    setError(null);
    try {
      const { uploadAcademyFile } = await import('./files');
      const ref = await uploadAcademyFile(file, 'academy-books');
      setDraft((prev) => ({
        ...prev,
        file: ref,
        // Fill the title from the filename the first time, as a convenience.
        title: prev.title || file.name.replace(/\.[^.]+$/, '').replace(/[_-]+/g, ' '),
      }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not upload that file.');
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  const save = async () => {
    if (!draft.title.trim()) {
      setError('Give the book a title.');
      return;
    }
    setBusy(true);
    setError(null);
    try {
      await onSave({ ...draft, title: draft.title.trim() });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save the book.');
      setBusy(false);
    }
  };

  return (
    <Modal
      title={book.id ? 'Edit book' : 'Upload a book'}
      onClose={onClose}
      wide
      footer={
        <>
          <button type="button" className="btn btn-ghost" onClick={onClose} disabled={busy}>
            Cancel
          </button>
          <button type="button" className="btn" onClick={() => void save()} disabled={busy || uploading}>
            {busy ? 'Saving…' : book.id ? 'Save changes' : 'Add to library'}
          </button>
        </>
      }
    >
      <div className="stack stack-md">
        <div className="acad-upload">
          <button
            type="button"
            className="acad-upload-drop"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
          >
            <UploadIcon className="" />
            <span className="strong">{uploading ? 'Uploading…' : 'Choose a PDF or document'}</span>
            <span className="tiny muted">Up to 25 MB · stored privately for your centre</span>
          </button>
          <input
            ref={inputRef}
            type="file"
            hidden
            accept="application/pdf,.pdf,.doc,.docx,.ppt,.pptx,.epub,image/*"
            onChange={(e) => void pickFile(e.target.files?.[0])}
          />
          {draft.file && (
            <div className="acad-upload-file">
              <span className="grow tiny">
                <b>{draft.file.name}</b> · {formatBytes(draft.file.size)}
              </span>
              <button
                type="button"
                className="icon-btn danger"
                aria-label="Remove file"
                onClick={() => setDraft({ ...draft, file: null })}
              >
                <TrashIcon className="" />
              </button>
            </div>
          )}
        </div>

        <div className="acad-form-row">
          <label className="field">
            <span className="field-label">Title</span>
            <input
              className="input"
              value={draft.title}
              onChange={(e) => setDraft({ ...draft, title: e.target.value })}
              placeholder="Pathway to IELTS B2"
            />
          </label>
          <label className="field">
            <span className="field-label">Author / source</span>
            <input
              className="input"
              value={draft.author}
              onChange={(e) => setDraft({ ...draft, author: e.target.value })}
              placeholder="Cambridge University Press"
            />
          </label>
        </div>

        <div className="acad-form-row">
          <label className="field">
            <span className="field-label">Subject</span>
            <input
              className="input"
              value={draft.subject}
              onChange={(e) => setDraft({ ...draft, subject: e.target.value })}
              placeholder="Grammar, Writing, Past papers…"
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
          <label className="field">
            <span className="field-label">Cover</span>
            <div className="acad-swatches">
              {COVER_COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  className={`acad-swatch cover-${color}${draft.coverColor === color ? ' active' : ''}`}
                  aria-label={`Cover colour ${color}`}
                  onClick={() => setDraft({ ...draft, coverColor: color })}
                />
              ))}
            </div>
          </label>
        </div>

        <label className="field">
          <span className="field-label">Description</span>
          <textarea
            className="input"
            rows={3}
            value={draft.description}
            onChange={(e) => setDraft({ ...draft, description: e.target.value })}
            placeholder="What is this book used for?"
          />
        </label>

        {draft.file && (
          <div className="tiny muted">
            Saved as <code>{safeFileName(draft.file.name)}</code>
            <FileList files={[draft.file]} />
          </div>
        )}

        {error && (
          <div className="callout callout-bad small" role="alert">
            {error}
          </div>
        )}
      </div>
    </Modal>
  );
}
