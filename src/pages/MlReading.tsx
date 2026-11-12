import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ML_READING_PARTS, ML_READING_QUESTIONS } from '../content/multilevel/reading';
import { countCorrect } from '../lib/scoring';
import { rawToSectionScore, sectionScoreToLevel } from '../lib/multilevel';
import { newMlAttempt, saveMlAttempt } from '../lib/mlStorage';
import { storeMlReview } from '../lib/mlReview';
import { AnswerGrid, ProgressCard, TimerCard } from '../components/ExamShell';
import { QuestionGroupBlock } from '../components/QuestionBlock';
import { CheckIcon } from '../components/Icons';

const TOTAL_SECONDS = 60 * 60;
const TOTAL_QUESTIONS = 35;

export default function MlReading() {
  const navigate = useNavigate();
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [partIndex, setPartIndex] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(TOTAL_SECONDS);
  const [running, setRunning] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const answersRef = useRef<Record<number, string>>({});
  answersRef.current = answers;

  const part = ML_READING_PARTS[partIndex];

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
    const userAnswers = answersRef.current;
    const correct = countCorrect(userAnswers, ML_READING_QUESTIONS);
    const score = rawToSectionScore(correct, TOTAL_QUESTIONS);
    saveMlAttempt(
      newMlAttempt({
        reading: {
          correct,
          total: TOTAL_QUESTIONS,
          score,
          level: sectionScoreToLevel(score),
        },
      }),
    );
    storeMlReview('reading', userAnswers);
    navigate('/multilevel/results?section=reading');
  }, [navigate, submitted]);

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

  const group = useMemo(
    () => ({
      id: `ml-r-${part.id}`,
      heading: `${part.title} · Questions ${part.questions[0].number}–${part.questions[part.questions.length - 1].number}`,
      instruction: part.instruction,
      layout: 'list' as const,
      questions: part.questions,
    }),
    [part],
  );

  const jumpTo = useCallback((n: number) => {
    const idx = ML_READING_PARTS.findIndex((p) => p.questions.some((q) => q.number === n));
    if (idx >= 0) setPartIndex(idx);
  }, []);

  return (
    <>
      <div className="part-hero">
        <div>
          <h2>Multilevel Reading</h2>
          <p>5 parts · 35 questions · 60 minutes, including answer-sheet transfer.</p>
        </div>
        <span className="badge badge-brand">Score / 75</span>
      </div>

      <div className="exam">
        <div>
          <div className="row wrap" style={{ marginBottom: '0.9rem' }}>
            {ML_READING_PARTS.map((p, i) => (
              <button
                key={p.id}
                type="button"
                className={`btn btn-sm ${i === partIndex ? '' : 'btn-ghost'}`}
                onClick={() => setPartIndex(i)}
              >
                Part {p.partNumber}
                <span className="tiny" style={{ opacity: 0.75 }}>{p.difficulty}</span>
              </button>
            ))}
          </div>

          <div className="reading-layout">
            <div className="passage-col" key={part.id}>
              <div className="passage-title">{part.title}</div>
              <div className="passage-sub">Level {part.difficulty}</div>
              {part.intro && (
                <p className="small muted" style={{ marginBottom: '0.9rem' }}>
                  {part.intro}
                </p>
              )}
              {part.blocks.map((block, i) => (
                <div key={i} style={{ marginBottom: '1rem' }}>
                  {block.heading && (
                    <div className="strong small" style={{ color: 'var(--brand)', marginBottom: '0.3rem' }}>
                      {block.heading}
                    </div>
                  )}
                  {block.kind === 'notice' || block.kind === 'advert' ? (
                    <div className="callout callout-info" style={{ whiteSpace: 'pre-line' }}>
                      {block.text}
                    </div>
                  ) : block.kind === 'email' ? (
                    <div className="callout" style={{ whiteSpace: 'pre-line', fontFamily: 'ui-monospace, monospace', fontSize: '0.85rem' }}>
                      {block.text}
                    </div>
                  ) : (
                    <p className="passage-para" style={{ whiteSpace: 'pre-line' }}>
                      {block.text}
                    </p>
                  )}
                </div>
              ))}
            </div>

            <div>
              <QuestionGroupBlock group={group} answers={answers} onChange={setAnswer} />
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
          <ProgressCard answered={answered.size} total={TOTAL_QUESTIONS} />
          <div className="card card-pad">
            <div className="tiny strong" style={{ textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--faint)', marginBottom: '0.55rem' }}>
              Answer sheet
            </div>
            <AnswerGrid total={TOTAL_QUESTIONS} answered={answered} onJump={jumpTo} />
          </div>
          <button type="button" className="btn btn-block btn-lg" onClick={submit} disabled={submitted}>
            <CheckIcon className="" />
            Submit reading
          </button>
          <div className="tiny faint center">Copy words exactly from the text.</div>
        </aside>
      </div>
    </>
  );
}
