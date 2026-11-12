import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ML_WRITING } from '../content/multilevel/writing';
import { assessWriting } from '../lib/scoring';
import {
  bandToSectionScore,
  combineWritingScores,
  sectionScoreToLevel,
  WRITING_WEIGHTS,
} from '../lib/multilevel';
import {
  clearMlDraft,
  loadMlDraft,
  newMlAttempt,
  saveMlAttempt,
  saveMlDraft,
} from '../lib/mlStorage';
import { ProgressCard, TimerCard } from '../components/ExamShell';
import { CheckIcon } from '../components/Icons';

const TOTAL_SECONDS = 60 * 60;

function countWords(text: string): number {
  const trimmed = text.trim();
  if (!trimmed) return 0;
  return trimmed.split(/\s+/).filter((w) => /[a-zA-Z0-9]/.test(w)).length;
}

export default function MlWriting() {
  const navigate = useNavigate();
  const [texts, setTexts] = useState<Record<string, string>>({
    'ml-w1': '',
    'ml-w2': '',
    'ml-w3': '',
  });
  const [secondsLeft, setSecondsLeft] = useState(TOTAL_SECONDS);
  const [running, setRunning] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const restoredRef = useRef(false);
  const textsRef = useRef(texts);
  textsRef.current = texts;

  const tasks = ML_WRITING.tasks;

  /* ---------------- restore draft ---------------- */
  useEffect(() => {
    if (restoredRef.current) return;
    restoredRef.current = true;
    const draft = loadMlDraft();
    if (draft?.texts) {
      setTexts((prev) => ({ ...prev, ...draft.texts }));
      const elapsed = Math.round(
        (Date.now() - new Date(draft.savedAtISO).getTime()) / 1000,
      );
      setSecondsLeft(Math.max(60, TOTAL_SECONDS - Math.max(0, elapsed)));
    }
  }, []);

  /* ---------------- one shared timer ---------------- */
  useEffect(() => {
    if (!running || submitted) return;
    const id = window.setInterval(() => {
      setSecondsLeft((prev) => (prev <= 1 ? 0 : prev - 1));
    }, 1000);
    return () => window.clearInterval(id);
  }, [running, submitted]);

  /* ---------------- autosave ---------------- */
  useEffect(() => {
    if (submitted) return;
    const id = window.setTimeout(() => {
      saveMlDraft({ texts, savedAtISO: new Date().toISOString() });
    }, 700);
    return () => window.clearTimeout(id);
  }, [texts, submitted]);

  const submit = useCallback(() => {
    if (submitted) return;
    setSubmitted(true);
    setRunning(false);

    const current = textsRef.current;
    const taskBands: Record<string, number> = {};
    const feedback: Record<string, unknown> = {};

    for (const task of tasks) {
      const analysis = assessWriting(current[task.id] ?? '', task.part === 1 ? 1 : 2, task.minWords);
      taskBands[task.id] = bandToSectionScore(analysis.band);
      feedback[task.id] = analysis;
    }

    const sectionScore = combineWritingScores(
      taskBands as Partial<Record<keyof typeof WRITING_WEIGHTS, number>>,
    );

    saveMlAttempt(
      newMlAttempt({
        writing: {
          score: sectionScore,
          level: sectionScoreToLevel(sectionScore),
        },
      }),
    );

    sessionStorage.setItem(
      'ielts-mock:multilevel:writing-report',
      JSON.stringify({ taskBands, feedback, texts: current }),
    );
    clearMlDraft();
    navigate('/multilevel/results?section=writing');
  }, [navigate, submitted, tasks]);

  useEffect(() => {
    if (secondsLeft === 0 && !submitted) submit();
  }, [secondsLeft, submitted, submit]);

  const wordCounts = useMemo(() => {
    const out: Record<string, number> = {};
    for (const task of tasks) out[task.id] = countWords(texts[task.id] ?? '');
    return out;
  }, [texts, tasks]);

  const totalWords = Object.values(wordCounts).reduce((a, b) => a + b, 0);

  return (
    <>
      <div className="part-hero">
        <div>
          <h2>Multilevel Writing</h2>
          <p>
            2 parts · 3 tasks · one shared 60-minute timer. Part 1 has two tasks
            on the same situation; Part 2 is a longer response.
          </p>
        </div>
        <span className="badge badge-brand">Score / 75</span>
      </div>

      <div className="exam">
        <div>
          {/* Shared source message shown above Tasks 1.1 and 1.2 */}
          <div className="card card-pad" style={{ marginBottom: '1rem', borderLeft: '4px solid var(--brand)' }}>
            <div className="row-between" style={{ marginBottom: '0.6rem' }}>
              <div className="tiny strong" style={{ textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--faint)' }}>
                Source message — read this for Tasks 1.1 and 1.2
              </div>
              <span className="badge">Part 1</span>
            </div>
            <div className="small" style={{ marginBottom: '0.4rem' }}>
              <b>From:</b> {ML_WRITING.sourceMessage.from}
            </div>
            <div className="small" style={{ marginBottom: '0.7rem' }}>
              <b>Subject:</b> {ML_WRITING.sourceMessage.subject}
            </div>
            <div
              className="small"
              style={{
                whiteSpace: 'pre-line',
                background: 'var(--surface-2)',
                padding: '0.85rem 1rem',
                borderRadius: 'var(--radius-sm)',
                lineHeight: 1.65,
              }}
            >
              {ML_WRITING.sourceMessage.body}
            </div>
          </div>

          {/* Three separate tasks with their own boxes and counters */}
          {tasks.map((task) => {
            const words = wordCounts[task.id];
            const meets = words >= task.minWords;
            const over = task.maxWords ? words > task.maxWords : false;
            return (
              <div
                key={task.id}
                className="card card-pad"
                style={{ marginBottom: '1rem', scrollMarginTop: '84px' }}
                id={task.id}
              >
                <div className="row-between" style={{ marginBottom: '0.55rem' }}>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '1.02rem' }}>{task.label}</h3>
                    <div className="tiny faint">{task.taskType}</div>
                  </div>
                  <span className="badge badge-accent">
                    {task.minWords}
                    {task.maxWords ? `–${task.maxWords}` : '+'} words
                  </span>
                </div>

                <p className="small" style={{ whiteSpace: 'pre-line', marginBottom: '0.7rem' }}>
                  {task.prompt}
                </p>

                <details style={{ marginBottom: '0.7rem' }}>
                  <summary className="small strong" style={{ cursor: 'pointer', color: 'var(--brand)' }}>
                    Guidance
                  </summary>
                  <ul className="list-check" style={{ marginTop: '0.5rem' }}>
                    {task.guidance.map((g) => (
                      <li key={g}>{g}</li>
                    ))}
                  </ul>
                </details>

                <div className="row-between" style={{ marginBottom: '0.4rem' }}>
                  <label htmlFor={`ta-${task.id}`} className="tiny strong muted">
                    Your answer
                  </label>
                  <span className={`badge ${meets && !over ? 'badge-ok' : words > 0 ? 'badge-warn' : ''}`}>
                    {words} words
                  </span>
                </div>
                <textarea
                  id={`ta-${task.id}`}
                  className="textarea"
                  style={{ minHeight: task.part === 1 ? 170 : 260 }}
                  value={texts[task.id] ?? ''}
                  onChange={(e) =>
                    setTexts((prev) => ({ ...prev, [task.id]: e.target.value }))
                  }
                  placeholder={
                    task.part === 1 && task.id === 'ml-w1'
                      ? 'Hi Dilnoza, I have some news about the course...'
                      : task.part === 1
                        ? 'Dear Mr Rahimov, I am writing to...'
                        : 'Write your discussion post here...'
                  }
                  spellCheck
                />
                <div className="row-between tiny faint" style={{ marginTop: '0.35rem' }}>
                  <span>
                    {meets
                      ? over
                        ? `Over the ${task.maxWords}-word limit`
                        : 'Within the word range'
                      : `${task.minWords - words} words to go`}
                  </span>
                  <span>Saves automatically</span>
                </div>
              </div>
            );
          })}
        </div>

        <aside className="exam-side">
          <TimerCard
            remaining={secondsLeft}
            total={TOTAL_SECONDS}
            running={running && !submitted}
            onToggle={() => setRunning((r) => !r)}
            label="Total (all 3 tasks)"
          />
          <ProgressCard answered={totalWords} total={450} label="Words written" />
          <div className="card card-pad">
            <div className="tiny strong" style={{ textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--faint)', marginBottom: '0.5rem' }}>
              Task progress
            </div>
            {tasks.map((task) => {
              const words = wordCounts[task.id];
              return (
                <div key={task.id} className="small row-between" style={{ marginTop: '0.3rem' }}>
                  <span>
                    {task.label.replace('Part ', 'P').replace('Task ', 'T')}
                  </span>
                  <b className={words >= task.minWords ? '' : 'muted'}>
                    {words}/{task.minWords}
                  </b>
                </div>
              );
            })}
          </div>
          <div className="callout callout-info small">
            <b>Weighting:</b> Task 1.1 = 1/9, Task 1.2 = 2/9, Task 2 = 6/9.
            Part 1 is worth one third of the Writing score and Part 2 two thirds,
            as in the real exam.
          </div>
          <button type="button" className="btn btn-block btn-lg" onClick={submit} disabled={submitted}>
            <CheckIcon className="" />
            Submit all three tasks
          </button>
          <div className="tiny faint center">
            Feedback is structural; a real examiner also judges accuracy.
          </div>
        </aside>
      </div>
    </>
  );
}
