import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ML_LISTENING_QUESTIONS } from '../content/multilevel/listening';
import { ML_READING_QUESTIONS } from '../content/multilevel/reading';
import { ML_LISTENING_PARTS } from '../content/multilevel/listening';
import { ML_READING_PARTS } from '../content/multilevel/reading';
import { isCorrect } from '../lib/scoring';
import {
  awardColorClass,
  awardLabel,
  awardRange,
  averageScore,
  formatScore,
  MULTILEVEL_DESCRIPTORS,
  scoreToAward,
  sectionScoreToLevel,
} from '../lib/multilevel';
import { latestMlSection, loadMlHistory } from '../lib/mlStorage';
import { readMlReview } from '../lib/mlReview';
import type { MlAttempt, MlSectionScore } from '../content/multilevel/types';
import { QuestionGroupBlock } from '../components/QuestionBlock';
import { ChartIcon, TrophyIcon } from '../components/Icons';

const SECTIONS = ['listening', 'reading', 'writing', 'speaking'] as const;
type SectionKey = (typeof SECTIONS)[number];

const SECTION_LABEL: Record<SectionKey, string> = {
  listening: 'Listening',
  reading: 'Reading',
  writing: 'Writing',
  speaking: 'Speaking',
};

const BANDS: { award: string; range: string; desc: string }[] = [
  { award: 'C1', range: '65 – 75', desc: 'Understands demanding texts; effective in academic and professional settings.' },
  { award: 'B2', range: '51 – 64', desc: 'Discusses a range of topics, defends opinions, writes detailed essays.' },
  { award: 'B1', range: '38 – 50', desc: 'Handles most travel situations, describes experiences, writes connected text.' },
  { award: 'Below B1', range: '0 – 37', desc: 'Currently A1–A2: simple exchanges on familiar, everyday matters.' },
];

export default function MlResults() {
  const [params] = useSearchParams();
  const focus = (params.get('section') as SectionKey | null) ?? null;
  const [attempts, setAttempts] = useState<MlAttempt[]>([]);
  const [showReview, setShowReview] = useState(false);

  useEffect(() => {
    setAttempts(loadMlHistory());
  }, []);

  const latest = useMemo(() => latestMlSection(attempts), [attempts]);

  const scores = SECTIONS.map((s) => latest[s]?.score).filter(
    (v): v is number => typeof v === 'number',
  );
  const overall = averageScore(scores);
  const award = overall !== null ? scoreToAward(overall) : null;
  const focusScore = focus ? latest[focus]?.score : undefined;

  const review = useMemo(() => readMlReview(), []);
  const canReview =
    review !== null &&
    (focus === 'listening' || focus === 'reading') &&
    review.section === focus;

  const reviewGroups =
    focus === 'listening'
      ? ML_LISTENING_PARTS.map((p) => ({
          id: `ml-lr-${p.id}`,
          heading: `${p.title}`,
          instruction: p.instruction,
          layout: 'list' as const,
          questions: p.questions,
        }))
      : focus === 'reading'
        ? ML_READING_PARTS.map((p) => ({
            id: `ml-rr-${p.id}`,
            heading: p.title,
            instruction: p.instruction,
            layout: 'list' as const,
            questions: p.questions,
          }))
        : [];

  const allQuestions =
    focus === 'listening'
      ? ML_LISTENING_QUESTIONS
      : focus === 'reading'
        ? ML_READING_QUESTIONS
        : [];

  const reviewCorrect = review
    ? allQuestions.filter((q) => isCorrect(review.answers[q.number], q.answer)).length
    : 0;

  const writingReport = useMemo(() => {
    try {
      const raw = sessionStorage.getItem('ielts-mock:multilevel:writing-report');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }, []);

  return (
    <>
      {/* Hero */}
      <div className="score-hero">
        <div className="band-dial">
          <div className="band-dial-inner">
            <div className="band-dial-value">
              {focusScore !== undefined ? formatScore(focusScore) : overall !== null ? formatScore(overall) : '—'}
            </div>
            <div className="band-dial-label">
              {focus ? `${SECTION_LABEL[focus]} / 75` : 'overall / 75'}
            </div>
          </div>
        </div>
        <div>
          <h1>
            {focus
              ? `${SECTION_LABEL[focus]} result`
              : award
                ? `Multilevel: ${awardLabel(award)}`
                : 'Multilevel results'}
          </h1>
          <p>
            {overall !== null ? (
              <>
                Overall <b style={{ color: '#fff' }}>{formatScore(overall)} / 75</b>
                {award && <> · <b style={{ color: '#fff' }}>{awardLabel(award)}</b> ({awardRange(award)})</>}
              </>
            ) : (
              'Complete a section to see your section score out of 75.'
            )}
          </p>
          {award && (
            <p style={{ marginTop: '0.5rem' }}>{MULTILEVEL_DESCRIPTORS[award]}</p>
          )}
        </div>
      </div>

      {focusScore !== undefined && (
        <div className="callout callout-info" style={{ marginTop: '1rem' }}>
          <b>{SECTION_LABEL[focus!]}: {formatScore(focusScore)} / 75</b>
          {sectionScoreToLevel(focusScore) && (
            <> — indicative level <b>{sectionScoreToLevel(focusScore)}</b></>
          )}
          {'. '}
          The certificate level is decided by the <b>average</b> of all four
          sections, not by any single one.
        </div>
      )}

      {/* Section cards */}
      <div className="score-cards" style={{ marginTop: '1.3rem' }}>
        {SECTIONS.map((section) => {
          const entry = latest[section];
          const level = entry ? sectionScoreToLevel(entry.score) : null;
          return (
            <div key={section} className="score-card">
              <div className="score-card-top">
                <span className="score-card-name">{SECTION_LABEL[section]}</span>
                {level ? (
                  <span className="badge badge-brand">{level}</span>
                ) : (
                  <span className="badge">—</span>
                )}
              </div>
              <div className="score-card-value">
                {entry ? formatScore(entry.score) : '—'}
                <span className="faint" style={{ fontSize: '0.9rem', fontWeight: 600 }}> / 75</span>
              </div>
              <div className="score-card-meta">
                {entry
                  ? new Date(entry.dateISO).toLocaleDateString()
                  : 'Not attempted yet'}
              </div>
              <Link
                to={`/multilevel/${section}`}
                className="btn btn-ghost btn-sm btn-block"
                style={{ marginTop: '0.8rem' }}
              >
                {entry ? 'Retake' : 'Start'}
              </Link>
            </div>
          );
        })}
      </div>

      {/* Writing detail */}
      {focus === 'writing' && writingReport?.feedback && (
        <section style={{ marginTop: '1.4rem' }}>
          <div className="callout callout-warn" style={{ marginBottom: '1rem' }}>
            <div className="callout-title">How the Writing score was estimated</div>
            Writing is graded structurally here — length, paragraphing, vocabulary
            range, linking words and sentence variety — then converted to the
            0–75 scale. A real examiner also judges accuracy and task fulfilment.
          </div>
          {(['ml-w1', 'ml-w2', 'ml-w3'] as const).map((taskId) => {
            const fb = writingReport.feedback[taskId];
            if (!fb) return null;
            const label =
              taskId === 'ml-w1' ? 'Task 1.1 — Informal message'
                : taskId === 'ml-w2' ? 'Task 1.2 — Formal email'
                : 'Task 2 — Discussion post';
            return (
              <div key={taskId} className="card card-pad" style={{ marginBottom: '1rem' }}>
                <div className="row-between">
                  <h3 style={{ margin: 0, fontSize: '1rem' }}>{label}</h3>
                  <span className="badge badge-brand">
                    {formatScore(writingReport.taskBands?.[taskId])} / 75
                  </span>
                </div>
                <div className="row wrap small muted" style={{ marginTop: '0.5rem', gap: '1rem' }}>
                  <span>{fb.analysis.words} words</span>
                  <span>{fb.analysis.paragraphs} paragraphs</span>
                  <span>{fb.analysis.sentences} sentences</span>
                  <span>{fb.analysis.linkerCount} linking words</span>
                </div>
                {fb.strengths?.length > 0 && (
                  <ul className="list-check" style={{ marginTop: '0.7rem' }}>
                    {fb.strengths.map((str: string) => (
                      <li key={str}>{str}</li>
                    ))}
                  </ul>
                )}
                {fb.improvements?.length > 0 && (
                  <ul className="list-check improve" style={{ marginTop: '0.6rem' }}>
                    {fb.improvements.map((str: string) => (
                      <li key={str}>{str}</li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
        </section>
      )}

      {/* Review */}
      {canReview && (
        <section style={{ marginTop: '1.5rem' }}>
          <div className="section-head">
            <h2 style={{ fontSize: '1.2rem' }}>Answer review</h2>
            <div className="row">
              <span className="badge badge-ok">Correct {reviewCorrect}</span>
              <span className="badge badge-bad">Incorrect {allQuestions.length - reviewCorrect}</span>
              <button
                type="button"
                className={`btn btn-sm ${showReview ? '' : 'btn-ghost'}`}
                onClick={() => setShowReview((v) => !v)}
              >
                {showReview ? 'Hide review' : 'Show full review'}
              </button>
            </div>
          </div>
          {showReview && (
            <div>
              {reviewGroups.map((group) => (
                <QuestionGroupBlock
                  key={group.id}
                  group={group}
                  answers={review.answers}
                  onChange={() => {}}
                  review
                />
              ))}
            </div>
          )}
        </section>
      )}

      {/* Bands reference */}
      <section style={{ marginTop: '1.5rem' }}>
        <div className="card card-pad">
          <h3 style={{ marginTop: 0 }}>How the Multilevel level is decided</h3>
          <p className="small muted">
            Each section is scored out of 75. The overall result is the{' '}
            <b>average of the four sections</b>, placed on these bands. There is
            no C2 on this certificate — the exam contains no C2 tasks.
          </p>
          <div style={{ overflowX: 'auto' }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Level</th>
                  <th>Overall score</th>
                  <th>What it means</th>
                </tr>
              </thead>
              <tbody>
                {BANDS.map((b) => (
                  <tr
                    key={b.award}
                    style={{
                      background:
                        award === b.award ? 'var(--brand-light)' : undefined,
                      fontWeight: award === b.award ? 600 : undefined,
                    }}
                  >
                    <td>
                      <span className={`badge ${awardColorClass(b.award as never)}`}>
                        {b.award}
                      </span>
                    </td>
                    <td className="nowrap">{b.range}</td>
                    <td className="muted small">{b.desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="tiny faint" style={{ marginTop: '0.7rem' }}>
            Listening and Reading scores are converted from raw marks using a
            curve calibrated on the published level thresholds; the real exam uses
            a Rasch model, so treat them as close approximations.
          </div>
        </div>
      </section>

      <div className="row wrap" style={{ marginTop: '1.5rem' }}>
        <Link to="/multilevel" className="btn btn-ghost">← Multilevel home</Link>
        {focus && (
          <Link to={`/multilevel/${focus}`} className="btn">
            Retake {SECTION_LABEL[focus]}
          </Link>
        )}
        <Link to="/multilevel/progress" className="btn btn-soft">
          <ChartIcon className="" />
          Multilevel progress
        </Link>
      </div>

      {attempts.length === 0 && (
        <div className="empty" style={{ marginTop: '1.2rem' }}>
          <TrophyIcon className="" />
          <div style={{ marginTop: '0.5rem' }}>No Multilevel attempts saved yet.</div>
        </div>
      )}
    </>
  );
}

export type { MlSectionScore };
