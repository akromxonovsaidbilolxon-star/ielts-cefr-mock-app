import type { Question, QuestionGroup } from '../types';
import { isCorrect } from '../lib/scoring';
import { CheckIcon, XIcon } from './Icons';

interface QuestionProps {
  question: Question;
  value: string | undefined;
  onChange: (value: string) => void;
  onFocus?: (n: number) => void;
  review?: boolean;
  inputId: string;
}

const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F'];

export function QuestionRow({
  question,
  value,
  onChange,
  onFocus,
  review = false,
  inputId,
}: QuestionProps) {
  const correct = review ? isCorrect(value, question.answer) : null;

  return (
    <div className="q" id={inputId} data-question={question.number}>
      <div className="q-num">{question.number}</div>
      <div className="q-body">
        <div className="q-prompt">
          {renderPrompt(question.prompt)}
          {review && correct !== null && (
            <span
              className={`badge ${correct ? 'badge-ok' : 'badge-bad'}`}
              style={{ marginLeft: '0.5rem', verticalAlign: 'middle' }}
            >
              {correct ? <CheckIcon className="" /> : <XIcon className="" />}
              {correct ? 'Correct' : 'Incorrect'}
            </span>
          )}
        </div>

        {question.type === 'mcq' && question.options && (
          <div className="opt-list" role="radiogroup" aria-label={`Question ${question.number}`}>
            {question.options.map((option, i) => {
              const letter = LETTERS[i];
              const selected = value === letter;
              const isAnswerKey = question.answer.split('|').map((a) => a.trim()).includes(letter);
              const cls = [
                'opt',
                selected ? 'selected' : '',
                review && isAnswerKey ? 'correct-opt' : '',
                review && selected && !isAnswerKey ? 'incorrect-opt' : '',
              ]
                .filter(Boolean)
                .join(' ');
              return (
                <label key={letter} className={cls}>
                  <input
                    type="radio"
                    name={`q-${question.number}`}
                    value={letter}
                    checked={selected}
                    onChange={() => onChange(letter)}
                    onFocus={() => onFocus?.(question.number)}
                    disabled={review}
                  />
                  <span className="opt-key">{letter}</span>
                  <span>{option}</span>
                </label>
              );
            })}
          </div>
        )}

        {question.type === 'select' && question.options && (
          <div className="opt-list" role="radiogroup" aria-label={`Question ${question.number}`}>
            {question.options.map((option) => {
              const selected = value === option;
              const isAnswerKey = question.answer
                .split('|')
                .map((a) => a.trim().toLowerCase())
                .includes(option.toLowerCase());
              const cls = [
                'opt',
                selected ? 'selected' : '',
                review && isAnswerKey ? 'correct-opt' : '',
                review && selected && !isAnswerKey ? 'incorrect-opt' : '',
              ]
                .filter(Boolean)
                .join(' ');
              return (
                <label key={option} className={cls}>
                  <input
                    type="radio"
                    name={`q-${question.number}`}
                    value={option}
                    checked={selected}
                    onChange={() => onChange(option)}
                    onFocus={() => onFocus?.(question.number)}
                    disabled={review}
                  />
                  <span>{option}</span>
                </label>
              );
            })}
          </div>
        )}

        {question.type === 'text' && (
          <div className="answer-row">
            <input
              className={`input ${review ? (correct ? 'correct' : 'incorrect') : ''}`}
              type="text"
              value={value ?? ''}
              onChange={(e) => onChange(e.target.value)}
              onFocus={() => onFocus?.(question.number)}
              disabled={review}
              placeholder="Your answer"
              aria-label={`Answer for question ${question.number}`}
              autoComplete="off"
              spellCheck={false}
            />
            {review && !correct && (
              <span className="small">
                <span className="muted">Answer: </span>
                <b>{question.answer.split('|')[0]}</b>
              </span>
            )}
          </div>
        )}

        {review && question.explanation && (
          <div className="tiny muted" style={{ marginTop: '0.4rem', lineHeight: 1.5 }}>
            {question.explanation}
          </div>
        )}
      </div>
    </div>
  );
}

/** Renders a prompt, turning runs of underscores into visible blanks. */
function renderPrompt(prompt: string) {
  const parts = prompt.split(/(_{2,})/g);
  if (parts.length === 1) return prompt;
  return parts.map((part, i) =>
    /^_{2,}$/.test(part) ? <span key={i} className="blank" /> : <span key={i}>{part}</span>,
  );
}

interface GroupProps {
  group: QuestionGroup;
  answers: Record<number, string>;
  onChange: (n: number, value: string) => void;
  onFocus?: (n: number) => void;
  review?: boolean;
}

export function QuestionGroupBlock({ group, answers, onChange, onFocus, review = false }: GroupProps) {
  const useTable = group.layout === 'notes' && group.questions.every((q) => q.type === 'text');

  return (
    <section className="question-group" id={group.id}>
      <div className="qg-head">
        <h3>{group.heading}</h3>
        <p className="qg-instruction">{group.instruction}</p>
      </div>
      <div className="qg-body">
        {useTable ? (
          <table className="notes-table">
            <tbody>
              {group.questions.map((q) => {
                const correct = review ? isCorrect(answers[q.number], q.answer) : null;
                return (
                  <tr key={q.number}>
                    <td className="q-num" style={{ paddingTop: '0.4rem' }}>
                      {q.number}
                    </td>
                    <td>
                      <div style={{ marginBottom: '0.2rem' }}>{renderPrompt(q.prompt)}</div>
                      <div className="answer-row">
                        <input
                          className={`input ${review ? (correct ? 'correct' : 'incorrect') : ''}`}
                          type="text"
                          value={answers[q.number] ?? ''}
                          onChange={(e) => onChange(q.number, e.target.value)}
                          onFocus={() => onFocus?.(q.number)}
                          disabled={review}
                          placeholder="Your answer"
                          aria-label={`Answer for question ${q.number}`}
                          autoComplete="off"
                          spellCheck={false}
                        />
                        {review && (
                          <span className="small nowrap">
                            {correct ? (
                              <span className="badge badge-ok">Correct</span>
                            ) : (
                              <span className="badge badge-bad">
                                Answer: {q.answer.split('|')[0]}
                              </span>
                            )}
                          </span>
                        )}
                      </div>
                      {review && q.explanation && (
                        <div className="tiny muted" style={{ marginTop: '0.25rem' }}>
                          {q.explanation}
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          group.questions.map((q) => (
            <QuestionRow
              key={q.number}
              question={q}
              value={answers[q.number]}
              onChange={(value) => onChange(q.number, value)}
              onFocus={onFocus}
              review={review}
              inputId={`q-${q.number}`}
            />
          ))
        )}
      </div>
    </section>
  );
}
