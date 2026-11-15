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

/**
 * A notes group can be printed three ways in the book:
 *  1. plain numbered rows (`group.questions`);
 *  2. a label column down the left whose rows continue across several blanks
 *     (Test 2 Reading Passage 1) — supplied as `labels` + `sections`;
 *  3. long notes broken by sub-headings (Test 2 Section 4) — `sections` only.
 * The left label is merged with `rowSpan` when consecutive rows repeat it, so
 * "Middle Ages:" can cover five lines exactly as the book shows.
 */
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
  const byNumber = useMemo(
    () => new Map(group.questions.map((q) => [q.number, q])),
    [group.questions],
  );

  const reviewBadge = (n: number) => {
    const q = byNumber.get(n);
    if (!q) return null;
    const correct = isCorrect(answers[n], q.answer);
    return (
      <span className="cnote-review">
        <span className={`badge ${correct ? 'badge-ok' : 'badge-bad'}`}>
          {correct ? 'Correct' : `Answer: ${q.answer.split('|')[0]}`}
        </span>
        {q.explanation && (
          <span className="tiny muted" style={{ marginLeft: '0.5rem' }}>
            {q.explanation}
          </span>
        )}
      </span>
    );
  };

  /* Labels + sections: one table row per line, label grouped via rowSpan. */
  if (group.labels && group.sections) {
    const rows = group.sections.flatMap((sec, si) =>
      sec.lines.map((line, li) => ({ sec, si, line, li })),
    );
    return (
      <div className="cnotes">
        <table className="cnotes-labels">
          <tbody>
            {rows.map((row, ri) => {
              const label = group.labels?.[ri] ?? '';
              const prev = ri > 0 ? group.labels?.[ri - 1] : undefined;
              const showLabel = label !== '' && label !== prev;
              let span = 1;
              if (showLabel) {
                while (group.labels?.[ri + span] === label) span += 1;
              }
              const newSection = ri === 0 || rows[ri - 1].si !== row.si;
              const nums = [...row.line.matchAll(/\{\{(\d+)\}\}/g)].map((m) => Number(m[1]));
              return (
                <Fragment key={ri}>
                  {newSection && row.sec.heading && (
                    <tr className="cnotes-subhead-row">
                      <td colSpan={label || group.labels ? 2 : 1} className="cnotes-subhead">
                        {row.sec.heading}
                      </td>
                    </tr>
                  )}
                  <tr className="cnotes-line">
                    {showLabel && (
                      <th className="cnotes-label" rowSpan={span} scope="row">
                        {label}
                      </th>
                    )}
                    <td className="cnotes-cell">
                      <div className="cnotes-bullet">
                        <RichText
                          text={row.line}
                          questions={group.questions}
                          answers={answers}
                          onChange={onChange}
                          review={review}
                        />
                      </div>
                      {review && nums.map((n) => <Fragment key={n}>{reviewBadge(n)}</Fragment>)}
                    </td>
                  </tr>
                </Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }

  /* Sub-headed notes with no label column (Section 4). */
  if (group.sections) {
    return (
      <div className="cnotes">
        {group.sections.map((sec, si) => (
          <div key={si} className="cnotes-section">
            {sec.heading && <div className="cnotes-subhead">{sec.heading}</div>}
            {sec.lines.map((line, li) => {
              const nums = [...line.matchAll(/\{\{(\d+)\}\}/g)].map((m) => Number(m[1]));
              return (
                <div key={li} className="cnote-row">
                  <span className="cnote-body">
                    <span className="cnote-prompt">
                      <RichText
                        text={line}
                        questions={group.questions}
                        answers={answers}
                        onChange={onChange}
                        review={review}
                      />
                    </span>
                    {review && nums.map((n) => <Fragment key={n}>{reviewBadge(n)}</Fragment>)}
                  </span>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    );
  }

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
/* Choose TWO letters — one tick-box bank per pair of answers           */
/* ------------------------------------------------------------------ */

/**
 * Used by "Choose TWO letters, A–E" questions such as 17 & 18. Both numbers
 * share one tick-box bank in the book, so the UI collects exactly two letters
 * and maps them onto the two question numbers. Order does not matter: each
 * correct letter earns its own mark, which is how IELTS credits this format.
 */
function ChooseTwoRows({
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
    <div className="cpairs">
      {(group.pairs ?? []).map((pair) => {
        const marks = pair.answers;
        const picked = marks.map((n) => answers[n] ?? '');
        const key = marks
          .map((n) => group.questions.find((q) => q.number === n)?.answer.split('|')[0] ?? '')
          .filter(Boolean);
        const pairCorrect =
          marks.every((n) => isCorrect(answers[n], group.questions.find((q) => q.number === n)?.answer ?? '')) &&
          new Set(key.map((k) => k.toUpperCase())).size === key.length;

        const toggle = (letter: string) => {
          if (review) return;
          const at = picked.indexOf(letter);
          if (at >= 0) {
            // Clicking a chosen letter clears that box.
            onChange(marks[at], '');
            return;
          }
          // Fill the first empty box, or replace the oldest pick when both are full.
          const target = picked.indexOf('');
          onChange(target >= 0 ? marks[target] : marks[0], letter);
        };

        return (
          <div key={pair.heading} className="cpair">
            <div className="cpair-head">{pair.heading}</div>
            <div className="cpair-stem">
              <span className="q-num">{marks.join(' & ')}</span>
              <span>{pair.prompt}</span>
            </div>
            <div className="cpair-bank">
              {(group.box?.items ?? []).map((item) => {
                const on = picked.includes(item.letter);
                const isKey = key.includes(item.letter);
                const cls = [
                  'cpair-opt',
                  on ? 'selected' : '',
                  review && isKey ? 'correct-opt' : '',
                  review && on && !isKey ? 'incorrect-opt' : '',
                ]
                  .filter(Boolean)
                  .join(' ');
                return (
                  <label key={item.letter} className={cls}>
                    <input
                      type="checkbox"
                      checked={on}
                      onChange={() => toggle(item.letter)}
                      disabled={review}
                      aria-label={`${item.letter} for questions ${marks.join(' and ')}`}
                    />
                    <span className="cbox-letter">{item.letter}</span>
                    <span>{item.text}</span>
                  </label>
                );
              })}
            </div>
            <div className="cpair-slots" aria-hidden={false}>
              {marks.map((n) => (
                <span key={n} className={`cpair-slot${picked[marks.indexOf(n)] ? ' filled' : ''}`}>
                  <span className="q-num">{n}</span>
                  <b>{picked[marks.indexOf(n)] || '–'}</b>
                </span>
              ))}
              {review && (
                <span className={`badge ${pairCorrect ? 'badge-ok' : 'badge-bad'}`} style={{ marginLeft: 'auto' }}>
                  {pairCorrect ? 'Both correct' : `Answer: ${key.join(' & ')}`}
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
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

      {group.layout === 'chooseTwo' && (
        <ChooseTwoRows group={group} answers={answers} onChange={onChange} review={review} />
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
