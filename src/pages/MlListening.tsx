import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ML_LISTENING_PARTS } from '../content/multilevel/listening';
import { ML_LISTENING_QUESTIONS } from '../content/multilevel/listening';
import { countCorrect } from '../lib/scoring';
import { rawToSectionScore, sectionScoreToLevel } from '../lib/multilevel';
import { newMlAttempt, saveMlAttempt } from '../lib/mlStorage';
import { storeMlReview } from '../lib/mlReview';
import AudioPlayer, { Transcript, useSpeechScript } from '../components/AudioPlayer';
import { AnswerGrid, ProgressCard, TimerCard } from '../components/ExamShell';
import { QuestionGroupBlock } from '../components/QuestionBlock';
import { CheckIcon, PlayIcon } from '../components/Icons';

const TOTAL_SECONDS = 45 * 60;
const TOTAL_QUESTIONS = 35;

export default function MlListening() {
  const navigate = useNavigate();
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [partIndex, setPartIndex] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(TOTAL_SECONDS);
  const [running, setRunning] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [plays, setPlays] = useState(0);
  const answersRef = useRef<Record<number, string>>({});
  answersRef.current = answers;

  const part = ML_LISTENING_PARTS[partIndex];
  const speech = useSpeechScript(part.script);

  // Multilevel plays each recording TWICE.
  useEffect(() => {
    setPlays(0);
  }, [partIndex]);

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
    speech.onStop();

    const userAnswers = answersRef.current;
    const correct = countCorrect(userAnswers, ML_LISTENING_QUESTIONS);
    const score = rawToSectionScore(correct, TOTAL_QUESTIONS);

    saveMlAttempt(
      newMlAttempt({
        listening: {
          correct,
          total: TOTAL_QUESTIONS,
          score,
          level: sectionScoreToLevel(score),
        },
      }),
    );
    storeMlReview('listening', userAnswers);
    navigate('/multilevel/results?section=listening');
  }, [navigate, submitted, speech]);

  useEffect(() => {
    if (secondsLeft === 0 && !submitted) submit();
  }, [secondsLeft, submitted, submit]);

  const setAnswer = useCallback((n: number, value: string) => {
    setAnswers((prev) => ({ ...prev, [n]: value }));
  }, []);

  const answered = useMemo(
    () =>
      new Set(
        Object.entries(answers)
          .filter(([, v]) => v && v.trim())
          .map(([k]) => Number(k)),
      ),
    [answers],
  );

  // Group a part's questions into a single group for the shared renderer.
  const group = useMemo(
    () => ({
      id: `ml-l-${part.id}`,
      heading: `${part.title} · Questions ${part.questions[0].number}–${part.questions[part.questions.length - 1].number}`,
      instruction: part.instruction,
      layout: 'list' as const,
      questions: part.questions,
    }),
    [part],
  );

  const range = useMemo(
    () => ({
      from: part.questions[0].number,
      to: part.questions[part.questions.length - 1].number,
    }),
    [part],
  );

  const jumpTo = useCallback((n: number) => {
    const idx = ML_LISTENING_PARTS.findIndex((p) =>
      p.questions.some((q) => q.number === n),
    );
    if (idx >= 0 && idx !== partIndex) setPartIndex(idx);
  }, [partIndex]);

  return (
    <>
      <div className="part-hero">
        <div>
          <h2>Multilevel Listening</h2>
          <p>
            6 parts · 35 questions · 45 minutes. Each recording plays{' '}
            <b>twice</b>, with {part.preReadSeconds} seconds to read ahead.
          </p>
        </div>
        <span className="badge badge-brand">Score / 75</span>
      </div>

      <div className="exam">
        <div>
          <div className="row wrap" style={{ marginBottom: '1rem' }}>
            {ML_LISTENING_PARTS.map((p, i) => (
              <button
                key={p.id}
                type="button"
                className={`btn btn-sm ${i === partIndex ? '' : 'btn-ghost'}`}
                onClick={() => {
                  if (speech.playing) speech.onStop();
                  setPartIndex(i);
                }}
              >
                Part {p.partNumber}
                <span className="tiny" style={{ opacity: 0.75 }}>{p.difficulty}</span>
              </button>
            ))}
            <span className="tiny faint">Questions {range.from}–{range.to}</span>
          </div>

          <div className="callout callout-info" style={{ marginBottom: '0.9rem' }}>
            <b>{part.title}</b> · Level {part.difficulty}
            <div style={{ marginTop: '0.2rem' }}>{part.context}</div>
          </div>

          {plays === 0 && (
            <div className="callout callout-warn" style={{ marginBottom: '0.9rem' }}>
              <b>Read the questions first.</b> You have {part.preReadSeconds}{' '}
              seconds before the recording starts.
            </div>
          )}

          <AudioPlayer {...speech} />

          <div className="row wrap" style={{ marginTop: '0.7rem' }}>
            <span className="badge badge-accent">Play {Math.min(plays, 2)} of 2</span>
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={() => {
                if (plays >= 2) return;
                setPlays((p) => p + 1);
                speech.onPlayPause();
              }}
              disabled={plays >= 2 && !speech.playing}
            >
              <PlayIcon className="" />
              {plays === 0 ? 'Play recording' : plays === 1 ? 'Play second time' : 'Played twice'}
            </button>
            {plays >= 2 && (
              <span className="tiny faint">
                In the real exam the recording is not repeated beyond this point.
              </span>
            )}
          </div>

          <div style={{ marginTop: '1rem' }}>
            <QuestionGroupBlock
              group={group}
              answers={answers}
              onChange={setAnswer}
            />
          </div>

          <Transcript lines={part.script} currentLine={speech.currentLine} />
        </div>

        <aside className="exam-side">
          <TimerCard
            remaining={secondsLeft}
            total={TOTAL_SECONDS}
            running={running && !submitted}
            onToggle={() => setRunning((r) => !r)}
          />
          <ProgressCard answered={answered.size} total={TOTAL_QUESTIONS} />
          <div className="card card-pad">
            <div className="tiny strong" style={{ textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--faint)', marginBottom: '0.55rem' }}>
              Answer sheet
            </div>
            <AnswerGrid total={TOTAL_QUESTIONS} answered={answered} onJump={jumpTo} />
            <div className="tiny faint" style={{ marginTop: '0.6rem' }}>
              Click a number to jump to that part.
            </div>
          </div>
          <button type="button" className="btn btn-block btn-lg" onClick={submit} disabled={submitted}>
            <CheckIcon className="" />
            Submit listening
          </button>
          <div className="tiny faint center">
            Scored out of 75 using the Multilevel bands.
          </div>
        </aside>
      </div>
    </>
  );
}
