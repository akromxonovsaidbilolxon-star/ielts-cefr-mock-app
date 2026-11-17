import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getCambridgeTest } from '../content/cambridge';
import { assessWriting } from '../lib/scoring';
import {
  loadCambridgeDraft,
  saveCambridgeDraft,
  saveCambridgeScore,
  storeCambridgeWritingReport,
} from '../lib/cambridgeStorage';
import { ProgressCard, TimerCard } from '../components/ExamShell';
import CambridgeSourceNote from '../components/CambridgeSourceNote';
import { HospitalMaps } from '../components/CambridgeFigures';
import BarChart from '../components/BarChart';
import { HOSPITAL_MAPS } from '../content/cambridge/figures';
import { CheckIcon } from '../components/Icons';

const TOTAL_SECONDS = 60 * 60;

export default function CambridgeWriting() {
  const { testId } = useParams();
  const navigate = useNavigate();
  const test = getCambridgeTest(testId);

  const tasks = test ? [test.writing.task1, test.writing.task2] : [];

  const [taskIndex, setTaskIndex] = useState(0);
  const [texts, setTexts] = useState<Record<string, string>>({});
  const [secondsLeft, setSecondsLeft] = useState(TOTAL_SECONDS);
  const [running, setRunning] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const restoredRef = useRef(false);
  const textsRef = useRef(texts);

  textsRef.current = texts;
  const task = tasks[taskIndex];

  useEffect(() => {
    if (!test || restoredRef.current) return;
    restoredRef.current = true;
    const draft = loadCambridgeDraft(test.id, 'writing');
    if (draft) {
      const restored: Record<string, string> = {};
      for (const [k, v] of Object.entries(draft.answers)) restored[`w${k}`] = String(v);
      setTexts(restored);
      const elapsed = Math.round((Date.now() - new Date(draft.savedAtISO).getTime()) / 1000);
      setSecondsLeft(Math.max(60, TOTAL_SECONDS - Math.max(0, elapsed)));
    }
  }, [test]);

  useEffect(() => {
    if (!running || submitted) return;
    const id = window.setInterval(() => {
      setSecondsLeft((prev) => (prev <= 1 ? 0 : prev - 1));
    }, 1000);
    return () => window.clearInterval(id);
  }, [running, submitted]);

  const submit = useCallback(() => {
    if (!test || submitted) return;
    setSubmitted(true);
    setRunning(false);
    const current = textsRef.current;
    const t1 = assessWriting(current.w1 ?? '', 1, test.writing.task1.minWords);
    const t2 = assessWriting(current.w2 ?? '', 2, test.writing.task2.minWords);
    // Task 2 counts twice, as in the real test.
    const combined = Math.round(((t1.band + t2.band * 2) / 3) * 2) / 2;

    saveCambridgeScore({
      testId: test.id,
      testLabel: test.label,
      skill: 'writing',
      dateISO: new Date().toISOString(),
      band: combined,
      correct: t1.analysis.words + t2.analysis.words,
      total: 400,
      detail: {
        task1Band: t1.band,
        task2Band: t2.band,
        task1Words: t1.analysis.words,
        task2Words: t2.analysis.words,
      },
    });
    storeCambridgeWritingReport(test.id, { t1, t2, texts: current });
    navigate(`/cambridge/${test.id}/results?skill=writing`);
  }, [navigate, submitted, test]);

  useEffect(() => {
    if (secondsLeft === 0 && !submitted) submit();
  }, [secondsLeft, submitted, submit]);

  useEffect(() => {
    if (!test || submitted) return;
    const id = window.setTimeout(() => {
      saveCambridgeDraft(test.id, 'writing', {
        answers: { 1: texts.w1 ?? '', 2: texts.w2 ?? '' },
        savedAtISO: new Date().toISOString(),
      });
    }, 700);
    return () => window.clearTimeout(id);
  }, [texts, submitted, test]);

  if (!test || !task) {
    return (
      <div className="empty">
        <div>That test could not be found.</div>
        <Link to="/cambridge" className="btn btn-ghost" style={{ marginTop: '0.9rem' }}>
          ← All Cambridge tests
        </Link>
      </div>
    );
  }

  const text = texts[task.id] ?? '';
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;

  return (
    <>
      <div className="part-hero">
        <div>
          <h2>Writing · {test.label}</h2>
          <p>2 tasks · 60 minutes. Task 2 carries twice the weight of Task 1.</p>
        </div>
        <span className="badge badge-brand">Band estimate</span>
      </div>

      <CambridgeSourceNote source={test.source} compact />

      <div className="exam">
        <div>
          <div className="row wrap" style={{ marginBottom: '0.9rem' }}>
            {tasks.map((t, i) => (
              <button
                key={t.id}
                type="button"
                className={`btn btn-sm ${i === taskIndex ? '' : 'btn-ghost'}`}
                onClick={() => setTaskIndex(i)}
              >
                Task {t.task}
                <span className="tiny" style={{ opacity: 0.75 }}>
                  {t.minWords}+ words
                </span>
              </button>
            ))}
          </div>

          <div className="card card-pad">
            <div className="row-between">
              <h3 style={{ margin: 0 }}>{task.title}</h3>
              <span className="badge">
                {task.minutes} min · at least {task.minWords} words
              </span>
            </div>
            <p style={{ marginTop: '0.7rem', whiteSpace: 'pre-line' }}>{task.prompt}</p>

            {task.figure === 'hospital-maps' && <HospitalMaps panels={HOSPITAL_MAPS.panels} />}
            {task.chart && (
              <div style={{ marginTop: '0.9rem' }}>
                <BarChart spec={task.chart} />
                <p className="tiny muted" style={{ marginTop: '0.45rem' }}>
                  Redrawn from the printed chart for this app — bar heights are approximate.
                  Read each bar to the nearest whole percent.
                </p>
              </div>
            )}

            <ul className="list-check" style={{ marginTop: '0.9rem' }}>
              {task.guidance.map((g) => (
                <li key={g}>{g}</li>
              ))}
            </ul>
          </div>

          <div className="card card-pad" style={{ marginTop: '1rem' }}>
            <div className="row-between" style={{ marginBottom: '0.5rem' }}>
              <span className="tiny strong" style={{ textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--faint)' }}>
                Your answer
              </span>
              <span className={`badge ${words >= task.minWords ? 'badge-ok' : 'badge-warn'}`}>
                {words} words
              </span>
            </div>
            <textarea
              className="input wtextarea"
              value={text}
              onChange={(e) => setTexts((prev) => ({ ...prev, [task.id]: e.target.value }))}
              placeholder={
                task.task === 1
                  ? 'Write your report here. Aim for 3–4 paragraphs.'
                  : 'Write your essay here. Aim for 4–5 paragraphs.'
              }
              spellCheck
              aria-label={`Your answer for Task ${task.task}`}
            />
            {words > 0 && words < task.minWords && (
              <div className="tiny faint" style={{ marginTop: '0.4rem' }}>
                {task.minWords - words} more words to reach the minimum. Under-length answers lose
                marks for Task Response.
              </div>
            )}
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
            answered={Object.values(texts).filter((t) => t.trim().length > 0).length}
            total={2}
            label="Tasks written"
          />
          <button
            type="button"
            className="btn btn-block btn-lg"
            onClick={submit}
            disabled={submitted}
          >
            <CheckIcon className="" />
            Submit both tasks
          </button>
          <div className="tiny faint center">
            Your writing is never uploaded — it stays in this browser.
          </div>
        </aside>
      </div>
    </>
  );
}
