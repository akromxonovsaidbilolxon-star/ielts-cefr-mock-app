import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { WRITING_TASKS } from '../content/writing';
import { assessWriting } from '../lib/scoring';
import { clearDraft, loadDraft, newAttempt, saveAttempt, saveDraft } from '../lib/storage';
import BarChart from '../components/BarChart';
import { ProgressCard, TimerCard } from '../components/ExamShell';
import { CheckIcon } from '../components/Icons';

const TOTAL_SECONDS = 60 * 60;

export default function WritingExam() {
  const navigate = useNavigate();
  const [taskIndex, setTaskIndex] = useState(0);
  const [texts, setTexts] = useState<Record<string, string>>({ w1: '', w2: '' });
  const [secondsLeft, setSecondsLeft] = useState(TOTAL_SECONDS);
  const [running, setRunning] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const restoredRef = useRef(false);
  const textsRef = useRef(texts);

  textsRef.current = texts;
  const task = WRITING_TASKS[taskIndex];
  const text = texts[task.id] ?? '';

  useEffect(() => {
    if (restoredRef.current) return;
    restoredRef.current = true;
    const draft = loadDraft('writing');
    if (draft) {
      const restored: Record<string, string> = { w1: '', w2: '' };
      for (const [k, v] of Object.entries(draft.answers)) restored[`w${k}`] = String(v);
      setTexts((prev) => ({ ...prev, ...restored }));
      const elapsed = Math.round((Date.now() - new Date(draft.savedAtISO).getTime()) / 1000);
      setSecondsLeft(Math.max(60, TOTAL_SECONDS - Math.max(0, elapsed)));
    }
  }, []);

  useEffect(() => {
    if (!running || submitted) return;
    const id = window.setInterval(() => {
      setSecondsLeft((prev) => (prev <= 1 ? 0 : prev - 1));
    }, 1000);
    return () => window.clearInterval(id);
  }, [running, submitted]);

  const submit = useCallback(() => {
    if (submitted) return;
    setSubmitted(true);
    setRunning(false);
    const current = textsRef.current;
    const t1 = assessWriting(current.w1 ?? '', 1, WRITING_TASKS[0].minWords);
    const t2 = assessWriting(current.w2 ?? '', 2, WRITING_TASKS[1].minWords);
    const combined = Math.round(((t1.band + t2.band * 2) / 3) * 2) / 2; // Task 2 weighs double

    saveAttempt(
      newAttempt({
        writing: {
          band: combined,
          correct: t1.analysis.words + t2.analysis.words,
          total: 400,
          detail: {
            task1Band: t1.band,
            task2Band: t2.band,
            task1Words: t1.analysis.words,
            task2Words: t2.analysis.words,
          },
          feedback:
            'Estimated from length, structure, vocabulary range, cohesion and sentence variety. Human examiners also assess accuracy — treat this as a guide.',
        },
      }),
    );

    sessionStorage.setItem(
      'ielts-mock:writing-report',
      JSON.stringify({ t1, t2, texts: current }),
    );
    clearDraft('writing');
    navigate('/results?skill=writing');
  }, [navigate, submitted]);

  useEffect(() => {
    if (secondsLeft === 0 && !submitted) submit();
  }, [secondsLeft, submitted, submit]);

  useEffect(() => {
    if (submitted) return;
    const id = window.setTimeout(() => {
      saveDraft('writing', {
        answers: { 1: texts.w1 ?? '', 2: texts.w2 ?? '' },
        savedAtISO: new Date().toISOString(),
      });
    }, 700);
    return () => window.clearTimeout(id);
  }, [texts, submitted]);

  const words = useMemo(() => {
    const trimmed = text.trim();
    if (!trimmed) return 0;
    return trimmed.split(/\s+/).filter((w) => /[a-zA-Z0-9]/.test(w)).length;
  }, [text]);

  const progress = Math.min(100, Math.round((words / task.minWords) * 100));
  const totalWords = (texts.w1 ?? '').trim().split(/\s+/).filter(Boolean).length +
    (texts.w2 ?? '').trim().split(/\s+/).filter(Boolean).length;

  return (
    <>
      <div className="part-hero">
        <div>
          <h2>Writing Test</h2>
          <p>2 tasks · 60 minutes. Task 1 = 20 min / 150 words, Task 2 = 40 min / 250 words.</p>
        </div>
        <span className="badge badge-brand">Auto-feedback</span>
      </div>

      <div className="exam">
        <div>
          <div className="row wrap" style={{ marginBottom: '0.9rem' }}>
            {WRITING_TASKS.map((t, i) => (
              <button
                key={t.id}
                type="button"
                className={`btn btn-sm ${i === taskIndex ? '' : 'btn-ghost'}`}
                onClick={() => setTaskIndex(i)}
              >
                {t.title}
              </button>
            ))}
          </div>

          <div className="card card-pad" style={{ marginBottom: '1rem' }}>
            <div className="row-between" style={{ marginBottom: '0.6rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.05rem' }}>{task.title}</h3>
              <span className="badge badge-accent">
                {task.minutes} min · {task.minWords}+ words
              </span>
            </div>
            <p style={{ whiteSpace: 'pre-line', marginBottom: '0.8rem' }}>{task.prompt}</p>
            {task.chart && <BarChart spec={task.chart} />}
            <details style={{ marginTop: '0.9rem' }}>
              <summary className="strong small" style={{ cursor: 'pointer', color: 'var(--brand)' }}>
                How to hit Band 7 on this task
              </summary>
              <ul className="list-check" style={{ marginTop: '0.6rem' }}>
                {task.guidance.map((g) => (
                  <li key={g}>{g}</li>
                ))}
              </ul>
            </details>
          </div>

          <div className="card card-pad">
            <div className="row-between" style={{ marginBottom: '0.55rem' }}>
              <label htmlFor="writing-input" className="strong small">
                Your answer — {task.title}
              </label>
              <span
                className={`badge ${
                  words >= task.minWords ? 'badge-ok' : words > 0 ? 'badge-warn' : ''
                }`}
              >
                {words} / {task.minWords} words
              </span>
            </div>
            <textarea
              id="writing-input"
              className="textarea"
              value={text}
              onChange={(e) => setTexts((prev) => ({ ...prev, [task.id]: e.target.value }))}
              placeholder={
                task.task === 1
                  ? 'Write your report here. Start with a sentence that paraphrases the chart topic...'
                  : 'Write your essay here. Introduce the topic, discuss both views, and state your opinion...'
              }
              spellCheck
            />
            <div className="progress-bar" style={{ marginTop: '0.7rem' }}>
              <div className="progress-fill" style={{ width: `${progress}%` }} />
            </div>
            <div className="row-between tiny faint" style={{ marginTop: '0.35rem' }}>
              <span>Draft saves automatically in this browser.</span>
              <span>
                {words >= task.minWords
                  ? 'Minimum length reached.'
                  : `${task.minWords - words} words to go.`}
              </span>
            </div>
          </div>
        </div>

        <aside className="exam-side">
          <TimerCard
            remaining={secondsLeft}
            total={TOTAL_SECONDS}
            running={running && !submitted}
            onToggle={() => setRunning((r) => !r)}
          />
          <ProgressCard
            answered={Math.min(words, task.minWords)}
            total={task.minWords}
            label="Word count"
          />
          <div className="card card-pad">
            <div className="tiny strong" style={{ textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--faint)', marginBottom: '0.5rem' }}>
              Overall progress
            </div>
            <div className="small row-between">
              <span>Task 1</span>
              <b>{(texts.w1 ?? '').trim().split(/\s+/).filter(Boolean).length} words</b>
            </div>
            <div className="small row-between" style={{ marginTop: '0.3rem' }}>
              <span>Task 2</span>
              <b>{(texts.w2 ?? '').trim().split(/\s+/).filter(Boolean).length} words</b>
            </div>
            <div className="divider" style={{ margin: '0.6rem 0' }} />
            <div className="small row-between">
              <span className="muted">Total</span>
              <b>{totalWords} words</b>
            </div>
          </div>
          <div className="callout callout-info small">
            Task 2 counts for <b>twice</b> the score of Task 1. Leave enough time
            for it, and always re-read your work for grammar slips.
          </div>
          <button type="button" className="btn btn-block btn-lg" onClick={submit} disabled={submitted}>
            <CheckIcon className="" />
            Submit both tasks
          </button>
          <div className="tiny faint center">
            Feedback is generated on your text — it is a study aid, not an official score.
          </div>
        </aside>
      </div>
    </>
  );
}
