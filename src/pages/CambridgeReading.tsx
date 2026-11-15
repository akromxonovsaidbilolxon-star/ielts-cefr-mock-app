import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getCambridgeTest, readingQuestions } from '../content/cambridge';
import { countCorrect, readingBand } from '../lib/scoring';
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
import CambridgeSourceNote from '../components/CambridgeSourceNote';
import { CheckIcon } from '../components/Icons';

const TOTAL_SECONDS = 60 * 60;
const TOTAL_QUESTIONS = 40;

export default function CambridgeReading() {
  const { testId } = useParams();
  const navigate = useNavigate();
  const test = getCambridgeTest(testId);

  const [answers, setAnswers] = useState<Answers>({});
  const [passageIndex, setPassageIndex] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(TOTAL_SECONDS);
  const [running, setRunning] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const restoredRef = useRef(false);
  const answersRef = useRef<Answers>({});

  answersRef.current = answers;

  const passages = test?.reading ?? [];
  const passage = passages[passageIndex];
  const allQuestions = useMemo(() => (test ? readingQuestions(test) : []), [test]);

  useEffect(() => {
    if (!test || restoredRef.current) return;
    restoredRef.current = true;
    const draft = loadCambridgeDraft(test.id, 'reading');
    if (draft) {
      setAnswers(draft.answers);
      const elapsed = Math.round((Date.now() - new Date(draft.savedAtISO).getTime()) / 1000);
      setSecondsLeft(Math.max(30, TOTAL_SECONDS - Math.max(0, elapsed)));
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
    const correct = countCorrect(answersRef.current, allQuestions);
    saveCambridgeScore({
      testId: test.id,
      testLabel: test.label,
      skill: 'reading',
      dateISO: new Date().toISOString(),
      band: readingBand(correct),
      correct,
      total: TOTAL_QUESTIONS,
    });
    storeCambridgeReview(test.id, 'reading', answersRef.current);
    clearCambridgeDraft(test.id, 'reading');
    navigate(`/cambridge/${test.id}/results?skill=reading`);
  }, [allQuestions, navigate, submitted, test]);

  useEffect(() => {
    if (secondsLeft === 0 && !submitted) submit();
  }, [secondsLeft, submitted, submit]);

  useEffect(() => {
    if (!test || submitted) return;
    const id = window.setTimeout(() => {
      saveCambridgeDraft(test.id, 'reading', {
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

  const jumpTo = useCallback(
    (n: number) => {
      const idx = passages.findIndex((p) =>
        p.groups.some((g) => g.questions.some((q) => q.number === n)),
      );
      if (idx >= 0 && idx !== passageIndex) {
        setPassageIndex(idx);
        window.setTimeout(() => {
          document.getElementById(`q-${n}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 160);
        return;
      }
      document.getElementById(`q-${n}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    },
    [passageIndex, passages],
  );

  if (!test || !passage) {
    return (
      <div className="empty">
        <div>That test could not be found.</div>
        <Link to="/cambridge" className="btn btn-ghost" style={{ marginTop: '0.9rem' }}>
          ← All Cambridge tests
        </Link>
      </div>
    );
  }

  const range = (() => {
    const nums = passage.groups.flatMap((g) => g.questions.map((q) => q.number));
    return { from: nums[0], to: nums[nums.length - 1] };
  })();

  return (
    <>
      <div className="part-hero">
        <div>
          <h2>Academic Reading · {test.label}</h2>
          <p>3 passages · 40 questions · 60 minutes. No extra transfer time.</p>
        </div>
        <span className="badge badge-brand">Band estimate</span>
      </div>

      <CambridgeSourceNote source={test.source} compact />

      <div className="exam">
        <div>
          <div className="row wrap" style={{ marginBottom: '0.9rem' }}>
            {passages.map((p, i) => (
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
            <div className="passage-col" key={passage.id}>
              <div className="passage-title">{passage.title}</div>
              <div className="passage-sub">{passage.subtitle}</div>
              {passage.paragraphs.map((para, i) => (
                <p key={`${para.label}-${i}`} className="passage-para">
                  {para.label && <span className="passage-para-label">{para.label}</span>}
                  {para.text}
                </p>
              ))}
            </div>

            <div>
              {passage.groups.map((group) => (
                <CambridgeGroupBlock
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
            <AnswerGrid total={TOTAL_QUESTIONS} answered={answeredNumbers} onJump={jumpTo} />
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
            Spelling matters. Copy words exactly from the passage.
          </div>
        </aside>
      </div>
    </>
  );
}
