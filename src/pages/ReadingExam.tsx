import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { READING_PASSAGES, READING_QUESTIONS } from '../content/reading';
import { countCorrect, readingBand } from '../lib/scoring';
import { clearDraft, loadDraft, newAttempt, saveAttempt, saveDraft } from '../lib/storage';
import { storeReview } from '../lib/lastResult';
import type { Answers } from '../types';
import { AnswerGrid, ProgressCard, TimerCard } from '../components/ExamShell';
import { QuestionGroupBlock } from '../components/QuestionBlock';
import { CheckIcon } from '../components/Icons';

const TOTAL_SECONDS = 60 * 60;
const TOTAL_QUESTIONS = 40;

export default function ReadingExam() {
  const navigate = useNavigate();
  const [answers, setAnswers] = useState<Answers>({});
  const [passageIndex, setPassageIndex] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(TOTAL_SECONDS);
  const [running, setRunning] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const restoredRef = useRef(false);
  const answersRef = useRef<Answers>({});
  const passageRef = useRef<HTMLDivElement | null>(null);

  answersRef.current = answers;
  const passage = READING_PASSAGES[passageIndex];

  useEffect(() => {
    if (restoredRef.current) return;
    restoredRef.current = true;
    const draft = loadDraft('reading');
    if (draft) {
      setAnswers(draft.answers);
      const elapsed = Math.round((Date.now() - new Date(draft.savedAtISO).getTime()) / 1000);
      setSecondsLeft(Math.max(30, TOTAL_SECONDS - Math.max(0, elapsed)));
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
    const correct = countCorrect(answersRef.current, READING_QUESTIONS);
    saveAttempt(
      newAttempt({
        reading: {
          band: readingBand(correct),
          correct,
          total: TOTAL_QUESTIONS,
          feedback: `You answered ${correct} of ${TOTAL_QUESTIONS} questions correctly.`,
        },
      }),
    );
    storeReview('reading', answersRef.current);
    clearDraft('reading');
    navigate('/results?skill=reading');
  }, [navigate, submitted]);

  useEffect(() => {
    if (secondsLeft === 0 && !submitted) submit();
  }, [secondsLeft, submitted, submit]);

  useEffect(() => {
    if (submitted) return;
    const id = window.setTimeout(() => {
      saveDraft('reading', { answers, savedAtISO: new Date().toISOString() });
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

  const jumpTo = useCallback((n: number) => {
    const idx = READING_PASSAGES.findIndex((p) =>
      p.questionGroups.some((g) => g.questions.some((q) => q.number === n)),
    );
    if (idx >= 0 && idx !== passageIndex) {
      setPassageIndex(idx);
      window.setTimeout(() => {
        document.getElementById(`q-${n}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 140);
      return;
    }
    document.getElementById(`q-${n}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, [passageIndex]);

  const range = useMemo(() => {
    const nums = passage.questionGroups.flatMap((g) => g.questions.map((q) => q.number));
    return { from: nums[0], to: nums[nums.length - 1] };
  }, [passage]);

  return (
    <>
      <div className="part-hero">
        <div>
          <h2>Academic Reading Test</h2>
          <p>3 passages · 40 questions · 60 minutes. No extra transfer time.</p>
        </div>
        <span className="badge badge-brand">Band estimate</span>
      </div>

      <div className="exam">
        <div>
          <div className="row wrap" style={{ marginBottom: '0.9rem' }}>
            {READING_PASSAGES.map((p, i) => (
              <button
                key={p.id}
                type="button"
                className={`btn btn-sm ${i === passageIndex ? '' : 'btn-ghost'}`}
                onClick={() => setPassageIndex(i)}
              >
                Passage {p.id}
              </button>
            ))}
            <span className="tiny faint">
              Questions {range.from}–{range.to}
            </span>
          </div>

          <div className="reading-layout">
            <div className="passage-col" ref={passageRef} key={passage.id}>
              <div className="passage-title">{passage.title}</div>
              <div className="passage-sub">{passage.subtitle}</div>
              {passage.paragraphs.map((para) => (
                <p key={para.label} className="passage-para">
                  <span className="passage-para-label">{para.label}</span>
                  {para.text}
                </p>
              ))}
            </div>

            <div>
              {passage.questionGroups.map((group) => (
                <QuestionGroupBlock
                  key={group.id}
                  group={group}
                  answers={answers}
                  onChange={setAnswer}
                />
              ))}
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
          <ProgressCard answered={answeredNumbers.size} total={TOTAL_QUESTIONS} />
          <div className="card card-pad">
            <div className="tiny strong" style={{ textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--faint)', marginBottom: '0.55rem' }}>
              Answer sheet
            </div>
            <AnswerGrid
              total={TOTAL_QUESTIONS}
              answered={answeredNumbers}
              onJump={jumpTo}
            />
          </div>
          <button type="button" className="btn btn-block btn-lg" onClick={submit} disabled={submitted}>
            <CheckIcon className="" />
            Submit test
          </button>
          <div className="tiny faint center">
            Spelling matters. Copy words exactly from the passage.
          </div>
        </aside>
      </div>
    </>
  );
}
