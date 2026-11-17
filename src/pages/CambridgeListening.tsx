import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { listeningQuestions } from '../content/cambridge';
import type { CambridgeTest } from '../content/cambridge/types';
import CambridgeLoader from '../components/CambridgeLoader';
import { listeningBand, countCorrect } from '../lib/scoring';
import {
  clearCambridgeDraft,
  loadCambridgeDraft,
  saveCambridgeDraft,
  saveCambridgeScore,
  storeCambridgeReview,
} from '../lib/cambridgeStorage';
import type { Answers } from '../types';
import { AnswerGrid, ProgressCard, TimerCard } from '../components/ExamShell';
import { CambridgeGroupBlock } from '../components/CambridgeGroup';
import CambridgeAudioPlayer from '../components/CambridgeAudioPlayer';
import CambridgeSourceNote from '../components/CambridgeSourceNote';
import { GranfordMap } from '../components/CambridgeFigures';
import { CheckIcon } from '../components/Icons';

const TOTAL_SECONDS = 30 * 60;
const TOTAL_QUESTIONS = 40;

function CambridgeListeningInner({ test }: { test: CambridgeTest }) {
  const navigate = useNavigate();

  const [answers, setAnswers] = useState<Answers>({});
  const [section, setSection] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(TOTAL_SECONDS);
  const [running, setRunning] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const restoredRef = useRef(false);
  const answersRef = useRef<Answers>({});

  answersRef.current = answers;

  const sections = test?.listening ?? [];
  const active = sections[section];
  const allQuestions = useMemo(() => (test ? listeningQuestions(test) : []), [test]);

  /* ---------------- restore draft ---------------- */
  useEffect(() => {
    if (!test || restoredRef.current) return;
    restoredRef.current = true;
    const draft = loadCambridgeDraft(test.id, 'listening');
    if (draft) {
      setAnswers(draft.answers);
      const elapsed = Math.round((Date.now() - new Date(draft.savedAtISO).getTime()) / 1000);
      setSecondsLeft(Math.max(30, TOTAL_SECONDS - Math.max(0, elapsed)));
    }
  }, [test]);

  /* ---------------- timer ---------------- */
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
    const userAnswers = answersRef.current;
    const correct = countCorrect(userAnswers, allQuestions);
    const band = listeningBand(correct);
    saveCambridgeScore({
      testId: test.id,
      testLabel: test.label,
      skill: 'listening',
      dateISO: new Date().toISOString(),
      band,
      correct,
      total: TOTAL_QUESTIONS,
    });
    storeCambridgeReview(test.id, 'listening', userAnswers);
    clearCambridgeDraft(test.id, 'listening');
    navigate(`/cambridge/${test.id}/results?skill=listening`);
  }, [allQuestions, navigate, submitted, test]);

  useEffect(() => {
    if (secondsLeft === 0 && !submitted) submit();
  }, [secondsLeft, submitted, submit]);

  /* ---------------- persist draft ---------------- */
  useEffect(() => {
    if (!test || submitted) return;
    const id = window.setTimeout(() => {
      saveCambridgeDraft(test.id, 'listening', {
        answers,
        savedAtISO: new Date().toISOString(),
      });
    }, 600);
    return () => window.clearTimeout(id);
  }, [answers, submitted, test]);

  const setAnswer = useCallback((n: number, value: string) => {
    setAnswers((prev) => ({ ...prev, [n]: value }));
  }, []);

  const answeredNumbers = useMemo(
    () => new Set(Object.entries(answers).filter(([, v]) => v && v.trim()).map(([k]) => Number(k))),
    [answers],
  );

  const scrollToQuestion = useCallback(
    (n: number) => {
      const target = sections.findIndex((s) =>
        s.groups.some((g) => g.questions.some((q) => q.number === n)),
      );
      if (target >= 0 && target !== section) {
        setSection(target);
        window.setTimeout(() => {
          document.getElementById(`q-${n}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 140);
        return;
      }
      document.getElementById(`q-${n}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    },
    [section, sections],
  );

  if (!test) {
    return (
      <div className="empty">
        <div>That test could not be found.</div>
        <Link to="/cambridge" className="btn btn-ghost" style={{ marginTop: '0.9rem' }}>
          ← All Cambridge tests
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="part-hero">
        <div>
          <h2>Listening · {test.label}</h2>
          <p>
            4 sections · 40 questions · 30 minutes. Each recording plays once — exactly as in the
            real test.
          </p>
        </div>
        <span className="badge badge-brand">Band estimate</span>
      </div>

      <CambridgeSourceNote source={test.source} compact />

      <div className="exam">
        <div>
          <div className="row wrap" style={{ marginBottom: '1rem' }}>
            {sections.map((s, i) => {
              const nums = s.groups.flatMap((g) => g.questions.map((q) => q.number));
              return (
                <button
                  key={s.id}
                  type="button"
                  className={`btn btn-sm ${i === section ? '' : 'btn-ghost'}`}
                  onClick={() => setSection(i)}
                >
                  Section {s.id}
                  <span className="tiny" style={{ opacity: 0.75 }}>
                    {nums[0]}–{nums[nums.length - 1]}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="callout callout-info" style={{ marginBottom: '0.9rem' }}>
            <b>
              Section {active.id} — {active.title}
            </b>
            {active.intro && <div style={{ marginTop: '0.2rem' }}>{active.intro}</div>}
          </div>

          {active.audio ? (
            <CambridgeAudioPlayer audio={active.audio} />
          ) : (
            <div className="callout callout-warn">
              No recording is registered for this section yet.
            </div>
          )}

          <div style={{ marginTop: '1rem' }}>
            {active.groups.map((group) => (
              <div key={group.id}>
                {group.figure === 'granford' && group.figureSpec && <GranfordMap spec={group.figureSpec} />}
                <CambridgeGroupBlock group={group} answers={answers} onChange={setAnswer} />
              </div>
            ))}
          </div>
        </div>

        <aside className="exam-side">
          <TimerCard
            remaining={secondsLeft}
            total={TOTAL_SECONDS}
            running={running && !submitted}
            onToggle={() => setRunning((r) => !r)}
          />
          <ProgressCard answered={answeredNumbers.size} total={TOTAL_QUESTIONS} />
          <div className="card card-pad">
            <div
              className="tiny strong"
              style={{
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                color: 'var(--faint)',
                marginBottom: '0.55rem',
              }}
            >
              Answer sheet
            </div>
            <AnswerGrid total={TOTAL_QUESTIONS} answered={answeredNumbers} onJump={scrollToQuestion} />
            <div className="tiny faint" style={{ marginTop: '0.6rem' }}>
              Click a number to jump to that question.
            </div>
          </div>
          <button
            type="button"
            className="btn btn-block btn-lg"
            onClick={submit}
            disabled={submitted}
          >
            <CheckIcon className="" />
            Submit test
          </button>
          <div className="tiny faint center">
            Unanswered questions score zero. Your result is saved in this browser.
          </div>
        </aside>
      </div>
    </>
  );
}

export default function CambridgeListening() {
  return (
    <CambridgeLoader>
      {(test) => <CambridgeListeningInner test={test} />}
    </CambridgeLoader>
  );
}
