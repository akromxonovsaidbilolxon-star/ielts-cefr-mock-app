import { Fragment, useMemo } from 'react';
import type { CambridgeGroup, CambridgeTable } from '../content/cambridge/types';
import type { Question } from '../types';
import { isCorrect } from '../lib/scoring';

/* ------------------------------------------------------------------ */
/* Tiny inline markup: {{n}} · *italic* · ~underline~ · newlines       */
/* ------------------------------------------------------------------ */

/** Matches {{n}} blanks, *italic* runs and ~underline~ runs. */
const TOKEN = /\{\{(\d+)\}\}|\*([^*\n]+)\*|~([^~\n]+)~/g;

interface BlankProps {
  number: number;
  value: string | undefined;
  onChange: (n: number, v: string) => void;
  answer: string;
  review: boolean;
  compact?: boolean;
}

function Blank({ number, value, onChange, answer, review, compact = false }: BlankProps) {
  const correct = review ? isCorrect(value, answer) : null;
  return (
    <span className={`cblank${compact ? ' cblank-sm' : ''}`}>
      <input
        className={`input cblank-input${review ? (correct ? ' correct' : ' incorrect') : ''}`}
        type="text"
        value={value ?? ''}
        onChange={(e) => onChange(number, e.target.value)}
        disabled={review}
        aria-label={`Answer for question ${number}`}
        autoComplete="off"
        spellCheck={false}
        inputMode={/^\d/.test(answer) ? 'numeric' : 'text'}
      />
      {review && !correct && <span className="cblank-key">{answer.split('|')[0]}</span>}
    </span>
  );
}

/** Render cell text containing {{n}} blanks and simple formatting. */
export function RichText({
  text,
  questions,
  answers,
  onChange,
  review,
}: {
  text: string;
  questions: Question[];
  answers: Record<number, string>;
  onChange: (n: number, v: string) => void;
  review: boolean;
}) {
  const byNumber = useMemo(() => {
    const map = new Map<number, Question>();
    for (const q of questions) map.set(q.number, q);
    return map;
  }, [questions]);

  const nodes: React.ReactNode[] = [];
  let last = 0;
  let key = 0;
  TOKEN.lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = TOKEN.exec(text)) !== null) {
    if (match.index > last) nodes.push(text.slice(last, match.index));
    if (match[1] !== undefined) {
      const n = Number(match[1]);
      const q = byNumber.get(n);
      nodes.push(
        <Blank
          key={`b${key++}`}
          number={n}
          value={answers[n]}
          onChange={onChange}
          answer={q?.answer ?? ''}
          review={review}
        />,
      );
    } else if (match[2] !== undefined) {
      nodes.push(<em key={`i${key++}`}>{match[2]}</em>);
    } else if (match[3] !== undefined) {
      nodes.push(
        <span key={`u${key++}`} className="cblank-written">
          {match[3]}
        </span>,
      );
    }
    last = match.index + match[0].length;
  }
  if (last < text.length) nodes.push(text.slice(last));

  return <>{nodes.map((n, i) => (typeof n === 'string' ? <Fragment key={i}>{withBreaks(n)}</Fragment> : n))}</>;
}

/* Strings inside cells can contain \n; split them into real line breaks. */
function withBreaks(text: string) {
  const lines = text.split('\n');
  if (lines.length === 1) return text;
  return lines.map((line, i) => (
    <Fragment key={i}>
      {i > 0 && <br />}
      {line}
    </Fragment>
  ));
}


/* ------------------------------------------------------------------ */
/* A box of lettered choices, shown once per group                      */
/* ------------------------------------------------------------------ */

export function ChoiceBox({ title, items }: { title: string; items: { letter: string; text: string }[] }) {
  return (
    <div className="cbox">
      <div className="cbox-title">{title}</div>
      <div className="cbox-grid">
        {items.map((it) => (
          <div key={it.letter} className="cbox-item">
            <span className="cbox-letter">{it.letter}</span>
            <span>{it.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Table layout (grid with blanks inside the cells)                     */
/* ------------------------------------------------------------------ */

function GridTable({
  table,
  group,
  answers,
  onChange,
  review,
}: {
  table: CambridgeTable;
  group: CambridgeGroup;
  answers: Record<number, string>;
  onChange: (n: number, v: string) => void;
  review: boolean;
}) {
  return (
    <div className="ctable-wrap">
      <table className="ctable">
        <thead>
          <tr>
            {table.columns.map((c) => (
              <th key={c}>{c}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {table.rows.map((row, ri) => (
            <tr key={ri}>
              {row.cells.map((cell, ci) => (
                <td key={ci}>
                  <RichText
                    text={cell.text}
                    questions={group.questions}
                    answers={answers}
                    onChange={onChange}
                    review={review}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Flow-chart layout                                                    */
/* ------------------------------------------------------------------ */

function FlowChart({
  group,
  answers,
  onChange,
  review,
}: {
  group: CambridgeGroup;
  answers: Record<number, string>;
  onChange: (n: number, v: string) => void;
  review: boolean;
}) {
  const steps = group.flow?.steps ?? [];
  // A step belongs to whichever question number its {{n}} token contains.
  const stepQuestion = (step: string): Question | undefined => {
    const m = /\{\{(\d+)\}\}/.exec(step);
    if (!m) return undefined;
    return group.questions.find((q) => q.number === Number(m[1]));
  };

  return (
    <div className="cflow">
      {steps.map((step, i) => {
        const q = stepQuestion(step);
        const isBlankStep = Boolean(q);
        return (
          <Fragment key={i}>
            {i > 0 && <div className="cflow-arrow" aria-hidden>▼</div>}
            <div className={`cflow-step${isBlankStep ? ' cflow-step-q' : ''}`}>
              {isBlankStep && q ? (
                <div className="cflow-line">
                  <span className="cflow-num">{q.number}</span>
                  <span className="cflow-select">
                    <select
                      className={`input${review ? (isCorrect(answers[q.number], q.answer) ? ' correct' : ' incorrect') : ''}`}
                      value={answers[q.number] ?? ''}
                      onChange={(e) => onChange(q.number, e.target.value)}
                      disabled={review}
                      aria-label={`Answer for question ${q.number}`}
                    >
                      <option value="">—</option>
                      {(q.options ?? []).map((o) => (
                        <option key={o} value={o}>
                          {o}
                        </option>
                      ))}
                    </select>
                  </span>
                  <span className="cflow-text">{stripToken(step)}</span>
                  {review && !isCorrect(answers[q.number], q.answer) && (
                    <span className="cblank-key">{q.answer.split('|')[0]}</span>
                  )}
                </div>
              ) : (
                <div className="cflow-line">
                  <span className="cflow-text cflow-text-plain">{step}</span>
                </div>
              )}
            </div>
          </Fragment>
        );
      })}
    </div>
  );
}

function stripToken(step: string): string {
  return step.replace(/\{\{\d+\}\}/g, '…………');
}

/* ------------------------------------------------------------------ */
/* Compact layout — one prompt per row, a dropdown for the letter       */
/* ------------------------------------------------------------------ */

function CompactRows({
  group,
  answers,
  onChange,
  review,
}: {
  group: CambridgeGroup;
  answers: Record<number, string>;
  onChange: (n: number, v: string) => void;
  review: boolean;
}) {
  return (
    <div className="ccompact">
      {group.questions.map((q) => {
        const correct = review ? isCorrect(answers[q.number], q.answer) : null;
        return (
          <div key={q.number} className="ccompact-row">
            <span className="q-num">{q.number}</span>
            <span className="ccompact-prompt">{q.prompt}</span>
            <select
              className={`input ccompact-select${review ? (correct ? ' correct' : ' incorrect') : ''}`}
              value={answers[q.number] ?? ''}
              onChange={(e) => onChange(q.number, e.target.value)}
              disabled={review}
              aria-label={`Answer for question ${q.number}`}
            >
              <option value="">—</option>
              {(q.options ?? []).map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
            {review && !correct && <span className="cblank-key">{q.answer.split('|')[0]}</span>}
          </div>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Plain list layout — full radio options                               */
/* ------------------------------------------------------------------ */

function ListRows({
  group,
  answers,
  onChange,
  review,
}: {
  group: CambridgeGroup;
  answers: Record<number, string>;
  onChange: (n: number, v: string) => void;
  review: boolean;
}) {
  return (
    <>
      {group.questions.map((q) => {
        const correct = review && q.type !== 'text' ? isCorrect(answers[q.number], q.answer) : null;
        return (
          <div key={q.number} className="q" id={`q-${q.number}`}>
            <div className="q-num">{q.number}</div>
            <div className="q-body">
              <div className="q-prompt">{q.prompt}</div>

              {q.type === 'mcq' && q.options && (
                <div className="opt-list" role="radiogroup" aria-label={`Question ${q.number}`}>
                  {q.options.map((option, i) => {
                    const letter = String.fromCharCode(65 + i);
                    const selected = answers[q.number] === letter;
                    const key = q.answer.split('|').map((a) => a.trim());
                    const isKey = key.includes(letter);
                    const cls = [
                      'opt',
                      selected ? 'selected' : '',
                      review && isKey ? 'correct-opt' : '',
                      review && selected && !isKey ? 'incorrect-opt' : '',
                    ]
                      .filter(Boolean)
                      .join(' ');
                    return (
                      <label key={letter} className={cls}>
                        <input
                          type="radio"
                          name={`cq-${q.number}`}
                          value={letter}
                          checked={selected}
                          onChange={() => onChange(q.number, letter)}
                          disabled={review}
                        />
                        <span className="opt-key">{letter}</span>
                        <span>{option}</span>
                      </label>
                    );
                  })}
                </div>
              )}

              {q.type === 'select' && q.options && (
                <div className="cselect-row" role="radiogroup" aria-label={`Question ${q.number}`}>
                  {q.options.map((option) => {
                    const selected = answers[q.number] === option;
                    const isKey = q.answer
                      .split('|')
                      .map((a) => a.trim().toLowerCase())
                      .includes(option.toLowerCase());
                    const cls = [
                      'cpill',
                      selected ? 'selected' : '',
                      review && isKey ? 'correct-opt' : '',
                      review && selected && !isKey ? 'incorrect-opt' : '',
                    ]
                      .filter(Boolean)
                      .join(' ');
                    return (
                      <button
                        key={option}
                        type="button"
                        className={cls}
                        onClick={() => !review && onChange(q.number, option)}
                        disabled={review}
                        aria-pressed={selected}
                      >
                        {option}
                      </button>
                    );
                  })}
                </div>
              )}

              {q.type === 'text' && (
                <div className="answer-row">
                  <input
                    className={`input ${review ? (isCorrect(answers[q.number], q.answer) ? 'correct' : 'incorrect') : ''}`}
                    type="text"
                    value={answers[q.number] ?? ''}
                    onChange={(e) => onChange(q.number, e.target.value)}
                    disabled={review}
                    placeholder="Your answer"
                    aria-label={`Answer for question ${q.number}`}
                    autoComplete="off"
                    spellCheck={false}
                  />
                  {review && !isCorrect(answers[q.number], q.answer) && (
                    <span className="small">
                      <span className="muted">Answer: </span>
                      <b>{q.answer.split('|')[0]}</b>
                    </span>
                  )}
                </div>
              )}

              {review && q.explanation && (
                <div className="tiny muted" style={{ marginTop: '0.4rem', lineHeight: 1.5 }}>
                  {q.explanation}
                </div>
              )}
              {review && correct !== null && (
                <div style={{ marginTop: '0.35rem' }}>
                  <span className={`badge ${correct ? 'badge-ok' : 'badge-bad'}`}>
                    {correct ? 'Correct' : `Answer: ${q.answer.split('|')[0]}`}
                  </span>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Notes layout — numbered rows, full-width prompts                    */
/* ------------------------------------------------------------------ */

function NotesRows({
  group,
  answers,
  onChange,
  review,
}: {
  group: CambridgeGroup;
  answers: Record<number, string>;
  onChange: (n: number, v: string) => void;
  review: boolean;
}) {
  return (
    <div className="cnotes">
      {group.questions.map((q) => {
        const correct = review ? isCorrect(answers[q.number], q.answer) : null;
        return (
          <div key={q.number} className="cnote-row">
            <span className="q-num">{q.number}</span>
            <div className="cnote-body">
              <div className="cnote-prompt">{richPrompt(q.prompt, q.number, answers, onChange, q, review)}</div>
              {review && (
                <div className="cnote-review">
                  <span className={`badge ${correct ? 'badge-ok' : 'badge-bad'}`}>
                    {correct ? 'Correct' : `Answer: ${q.answer.split('|')[0]}`}
                  </span>
                  {q.explanation && (
                    <span className="tiny muted" style={{ marginLeft: '0.5rem' }}>
                      {q.explanation}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/** Replaces the ____ in a notes prompt with a live input. */
function richPrompt(
  prompt: string,
  number: number,
  answers: Record<number, string>,
  onChange: (n: number, v: string) => void,
  q: Question,
  review: boolean,
) {
  const parts = prompt.split(/(_{2,})/g);
  if (parts.length === 1) return prompt;
  return parts.map((part, i) =>
    /^_{2,}$/.test(part) ? (
      <Blank
        key={i}
        number={number}
        value={answers[number]}
        onChange={onChange}
        answer={q.answer}
        review={review}
      />
    ) : (
      <Fragment key={i}>{part}</Fragment>
    ),
  );
}

/* ------------------------------------------------------------------ */
/* Public: one group                                                    */
/* ------------------------------------------------------------------ */

export function CambridgeGroupBlock({
  group,
  answers,
  onChange,
  review = false,
}: {
  group: CambridgeGroup;
  answers: Record<number, string>;
  onChange: (n: number, v: string) => void;
  review?: boolean;
}) {
  const useCompact = group.layout === 'compact';

  return (
    <section className="question-group" id={group.id}>
      <div className="qg-head">
        <h3>{group.heading}</h3>
        {group.instruction && <p className="qg-instruction">{group.instruction}</p>}
        {group.note && (
          <p className="qg-instruction" style={{ whiteSpace: 'pre-line', marginTop: '0.2rem' }}>
            {group.note}
          </p>
        )}
      </div>

      <div className="qg-body">
        {group.title && <div className="cgroup-title">{group.title}</div>}

        {group.layout === 'table' && group.table && (
          <GridTable
            table={group.table}
            group={group}
            answers={answers}
            onChange={onChange}
            review={review}
          />
        )}

        {group.layout === 'flow' && group.box && (
          <ChoiceBox title={group.box.title} items={group.box.items} />
        )}
        {group.layout === 'flow' && (
          <FlowChart group={group} answers={answers} onChange={onChange} review={review} />
        )}

        {useCompact && group.box && <ChoiceBox title={group.box.title} items={group.box.items} />}
        {useCompact && (
          <CompactRows group={group} answers={answers} onChange={onChange} review={review} />
        )}

        {group.layout === 'list' && (
          <ListRows group={group} answers={answers} onChange={onChange} review={review} />
        )}

        {group.layout === 'notes' && (
          <NotesRows group={group} answers={answers} onChange={onChange} review={review} />
        )}
      </div>
    </section>
  );
}
