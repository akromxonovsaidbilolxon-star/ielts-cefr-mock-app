import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LISTENING_PARTS, LISTENING_QUESTIONS } from '../content/listening';
import { listeningBand, countCorrect } from '../lib/scoring';
import { clearDraft, loadDraft, newAttempt, saveAttempt, saveDraft } from '../lib/storage';
import { storeReview } from '../lib/lastResult';
import type { Answers } from '../types';
import AudioPlayer, { Transcript, useSpeechScript } from '../components/AudioPlayer';
import { AnswerGrid, ProgressCard, TimerCard } from '../components/ExamShell';
import { QuestionGroupBlock } from '../components/QuestionBlock';
import { CheckIcon } from '../components/Icons';

const TOTAL_SECONDS = 30 * 60; // 30 minutes + transfer convention
const TOTAL_QUESTIONS = 40;

export default function ListeningExam() {
  const navigate = useNavigate();
  const [answers, setAnswers] = useState<Answers>({});
  const [part, setPart] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(TOTAL_SECONDS);
  const [running, setRunning] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [flagged, setFlagged] = useState<Set<number>>(new Set());
  const restoredRef = useRef(false);
  const answersRef = useRef<Answers>({});

  answersRef.current = answers;

  const activePart = LISTENING_PARTS[part];
  const speech = useSpeechScript(activePart.script);

  /* ---------------- restore draft ---------------- */
  useEffect(() => {
    if (restoredRef.current) return;
    restoredRef.current = true;
    const draft = loadDraft('listening');
    if (draft) {
      setAnswers(draft.answers);
      const elapsed = Math.round(
        (Date.now() - new Date(draft.savedAtISO).getTime()) / 1000,
      );
      setSecondsLeft(Math.max(30, TOTAL_SECONDS - Math.max(0, elapsed)));
    }
  }, []);

  /* ---------------- timer ---------------- */
  useEffect(() => {
    if (!running || submitted) return;
    const id = window.setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          window.clearInterval(id);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => window.clearInterval(id);
  }, [running, submitted]);

  const submit = useCallback(() => {
    if (submitted) return;
    setSubmitted(true);
    setRunning(false);
    speech.onStop?.();
    const userAnswers = answersRef.current;
    const correct = countCorrect(userAnswers, LISTENING_QUESTIONS);
    const band = listeningBand(correct);
    saveAttempt(
      newAttempt({
        listening: {
          band,
          correct,
          total: TOTAL_QUESTIONS,
          feedback: `You answered ${correct} of ${TOTAL_QUESTIONS} questions correctly.`,
        },
      }),
    );
    storeReview('listening', userAnswers);
    clearDraft('listening');
    navigate('/results?skill=listening');
  }, [navigate, submitted, speech]);

  useEffect(() => {
    if (secondsLeft === 0 && !submitted) submit();
  }, [secondsLeft, submitted, submit]);

  /* ---------------- persist draft ---------------- */
  useEffect(() => {
    if (submitted) return;
    const id = window.setTimeout(() => {
      saveDraft('listening', { answers, savedAtISO: new Date().toISOString() });
    }, 600);
    return () => window.clearTimeout(id);
  }, [answers, submitted]);

  const setAnswer = useCallback((n: number, value: string) => {
    setAnswers((prev) => ({ ...prev, [n]: value }));
  }, []);

  const answeredNumbers = useMemo(
    () => new Set(Object.entries(answers).filter(([, v]) => v && v.trim()).map(([k]) => Number(k))),
    [answers],
  );

  const scrollToQuestion = useCallback((n: number) => {
    const target = LISTENING_PARTS.findIndex((p) =>
      p.questionGroups.some((g) => g.questions.some((q) => q.number === n)),
    );
    if (target >= 0 && target !== part) {
      setPart(target);
      window.setTimeout(() => {
        document.getElementById(`q-${n}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 120);
      return;
    }
    document.getElementById(`q-${n}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, [part]);

  return (
    <>
      <div className="part-hero">
        <div>
          <h2>Listening Test</h2>
          <p>
            4 parts · 40 questions · 30 minutes. Audio plays at exam speed — you
            hear each recording once, as in the real test.
          </p>
        </div>
        <span className="badge badge-brand">Band estimate</span>
      </div>

      <div className="exam">
        <div>
          {/* part tabs */}
          <div className="row wrap" style={{ marginBottom: '1rem' }}>
            {LISTENING_PARTS.map((p, i) => (
              <button
                key={p.id}
                type="button"
                className={`btn btn-sm ${i === part ? '' : 'btn-ghost'}`}
                onClick={() => {
                  if (speech.playing) speech.onStop();
                  setPart(i);
                }}
              >
                Part {p.id}
                <span className="tiny" style={{ opacity: 0.75 }}>
                  {p.questionGroups[0].questions[0].number}–
                  {p.questionGroups[p.questionGroups.length - 1].questions.slice(-1)[0].number}
                </span>
              </button>
            ))}
          </div>

          <div className="callout callout-info" style={{ marginBottom: '0.9rem' }}>
            <b>{activePart.title}</b>
            <div style={{ marginTop: '0.2rem' }}>{activePart.context}</div>
          </div>

          <AudioPlayer {...speech} />

          <div style={{ marginTop: '1rem' }}>
            {activePart.questionGroups.map((group) => (
              <QuestionGroupBlock
                key={group.id}
                group={group}
                answers={answers}
                onChange={setAnswer}
                onFocus={flagVisited}
              />
            ))}
          </div>

          <Transcript lines={activePart.script} currentLine={speech.currentLine} />
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
            <div className="tiny strong" style={{ textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--faint)', marginBottom: '0.55rem' }}>
              Answer sheet
            </div>
            <AnswerGrid
              total={TOTAL_QUESTIONS}
              answered={answeredNumbers}
              flagged={flagged}
              onJump={scrollToQuestion}
            />
            <div className="tiny faint" style={{ marginTop: '0.6rem' }}>
              Click a number to jump. Amber dot = flagged on focus.
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
            Unanswered questions score zero. Your result is saved automatically.
          </div>
        </aside>
      </div>
    </>
  );

  function flagVisited(n: number) {
    setFlagged((prev) => (prev.has(n) ? prev : new Set(prev).add(n)));
  }
}
