import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { LISTENING_PARTS, LISTENING_QUESTIONS } from '../content/listening';
import { READING_PASSAGES, READING_QUESTIONS } from '../content/reading';
import { bandToCefr, CEFR_DESCRIPTIONS, isCorrect, overallBand } from '../lib/scoring';
import { latestBySkill, loadHistory } from '../lib/storage';
import { readReview, WRITING_REPORT_KEY, type WritingReport } from '../lib/lastResult';
import type { Attempt, Skill } from '../types';
import { QuestionGroupBlock } from '../components/QuestionBlock';
import { ChartIcon, TrophyIcon } from '../components/Icons';

const SKILL_LABEL: Record<Skill, string> = {
  listening: 'Listening',
  reading: 'Academic Reading',
  writing: 'Writing',
  speaking: 'Speaking',
};

const ALL_SKILLS: Skill[] = ['listening', 'reading', 'writing', 'speaking'];

export default function Results() {
  const [params] = useSearchParams();
  const focus = (params.get('skill') as Skill | null) ?? null;
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [tab, setTab] = useState<'scores' | 'review'>('scores');

  useEffect(() => {
    setAttempts(loadHistory());
  }, []);

  const latest = useMemo(() => latestBySkill(attempts), [attempts]);
  const focusResult = focus ? latest[focus] : undefined;

  const bands = useMemo(
    () =>
      ALL_SKILLS.map((s) => latest[s]?.band).filter(
        (b): b is number => typeof b === 'number',
      ),
    [latest],
  );
  const overall = overallBand(bands);
  const cefr = overall !== null ? bandToCefr(overall) : null;

  const review = useMemo(() => readReview(), []);
  const writingReport = useMemo<WritingReport | null>(() => {
    try {
      const raw = sessionStorage.getItem(WRITING_REPORT_KEY);
      return raw ? (JSON.parse(raw) as WritingReport) : null;
    } catch {
      return null;
    }
  }, []);

  const showReview = focus === 'listening' || focus === 'reading';
  const canReview = showReview && review && review.skill === focus;

  const reviewGroups =
    focus === 'listening'
      ? LISTENING_PARTS.flatMap((p) => p.questionGroups)
      : focus === 'reading'
        ? READING_PASSAGES.flatMap((p) => p.questionGroups)
        : [];

  const reviewQuestions =
    focus === 'listening' ? LISTENING_QUESTIONS : focus === 'reading' ? READING_QUESTIONS : [];

  const reviewCorrect = review
    ? reviewQuestions.filter((q) => isCorrect(review.answers[q.number], q.answer)).length
    : 0;

  if (!focus) {
    return <ResultsOverview attempts={attempts} latest={latest} overall={overall} cefr={cefr} />;
  }

  return (
    <>
      <div className="score-hero">
        <div className="band-dial">
          <div className="band-dial-inner">
            <div className="band-dial-value">
              {focusResult ? focusResult.band.toFixed(1) : '—'}
            </div>
            <div className="band-dial-label">band</div>
          </div>
        </div>
        <div>
          <h1>{SKILL_LABEL[focus]} result</h1>
          <p>
            {focusResult ? (
              <>
                CEFR level <b style={{ color: '#fff' }}>{bandToCefr(focusResult.band)}</b> ·{' '}
                {CEFR_DESCRIPTIONS[bandToCefr(focusResult.band)]}
              </>
            ) : (
              'No result recorded for this skill yet.'
            )}
          </p>
          {focusResult && (focusResult.correct !== undefined || focusResult.total !== undefined) && (
            <p style={{ marginTop: '0.6rem' }}>
              {focus === 'writing'
                ? `${focusResult.correct ?? 0} words written in total`
                : `${focusResult.correct ?? 0} of ${focusResult.total ?? 0} correct`}
            </p>
          )}
        </div>
      </div>

      {focus === 'writing' && writingReport && (
        <WritingSection report={writingReport} band={focusResult?.band ?? null} />
      )}

      {focus === 'speaking' && focusResult && (
        <SpeakingSection detail={focusResult.detail} band={focusResult.band} />
      )}

      {showReview && !canReview && (
        <div className="callout callout-info" style={{ marginTop: '1.2rem' }}>
          The detailed answer review is only available immediately after you submit
          a test in this tab. Take the test again to see a full breakdown.
        </div>
      )}

      {canReview && (
        <section style={{ marginTop: '1.5rem' }}>
          <div className="section-head">
            <h2 style={{ fontSize: '1.25rem' }}>Answer review</h2>
            <div className="row">
              <span className="badge badge-ok">Correct {reviewCorrect}</span>
              <span className="badge badge-bad">
                Incorrect {reviewQuestions.length - reviewCorrect}
              </span>
              <button
                type="button"
                className={`btn btn-sm ${tab === 'review' ? '' : 'btn-ghost'}`}
                onClick={() => setTab(tab === 'review' ? 'scores' : 'review')}
              >
                {tab === 'review' ? 'Hide review' : 'Show full review'}
              </button>
            </div>
          </div>
          {tab === 'review' && (
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

      <div className="row wrap" style={{ marginTop: '1.5rem' }}>
        <Link to="/" className="btn btn-ghost">
          ← Back to home
        </Link>
        <Link to={`/${focus}`} className="btn">
          Retake {SKILL_LABEL[focus]}
        </Link>
        <Link to="/progress" className="btn btn-soft">
          <ChartIcon className="" />
          View progress
        </Link>
      </div>
    </>
  );
}

/* ------------------------------------------------------------------ */

function ResultsOverview({
  attempts,
  latest,
  overall,
  cefr,
}: {
  attempts: Attempt[];
  latest: Partial<Record<Skill, { band: number; dateISO: string }>>;
  overall: number | null;
  cefr: string | null;
}) {
  return (
    <>
      <div className="score-hero">
        <div className="band-dial">
          <div className="band-dial-inner">
            <div className="band-dial-value">{overall !== null ? overall.toFixed(1) : '—'}</div>
            <div className="band-dial-label">overall</div>
          </div>
        </div>
        <div>
          <h1>Your results</h1>
          <p>
            {overall !== null
              ? `Estimated overall band ${overall.toFixed(1)} · CEFR ${cefr}`
              : 'Take any section to see your estimated band and CEFR level.'}
          </p>
          {cefr && <p style={{ marginTop: '0.5rem' }}>{CEFR_DESCRIPTIONS[cefr as keyof typeof CEFR_DESCRIPTIONS]}</p>}
        </div>
      </div>

      <div className="score-cards" style={{ marginTop: '1.3rem' }}>
        {ALL_SKILLS.map((skill) => {
          const result = latest[skill];
          return (
            <div key={skill} className="score-card">
              <div className="score-card-top">
                <span className="score-card-name">{SKILL_LABEL[skill]}</span>
                {result ? (
                  <span className="badge badge-brand">{bandToCefr(result.band)}</span>
                ) : (
                  <span className="badge">—</span>
                )}
              </div>
              <div className="score-card-value">
                {result ? result.band.toFixed(1) : '—'}
              </div>
              <div className="score-card-meta">
                {result
                  ? new Date(result.dateISO).toLocaleDateString(undefined, {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })
                  : 'Not attempted yet'}
              </div>
              <Link
                to={`/${skill}`}
                className="btn btn-ghost btn-sm btn-block"
                style={{ marginTop: '0.8rem' }}
              >
                {result ? 'Retake' : 'Start'}
              </Link>
            </div>
          );
        })}
      </div>

      {attempts.length === 0 && (
        <div className="empty" style={{ marginTop: '1.3rem' }}>
          <TrophyIcon className="" />
          <div style={{ marginTop: '0.5rem' }}>
            No attempts yet. Start with Listening — it takes 30 minutes.
          </div>
        </div>
      )}
    </>
  );
}

function WritingSection({ report, band }: { report: WritingReport; band: number | null }) {
  const tasks = [
    { key: 't1', label: 'Task 1 — Report', data: report.t1 },
    { key: 't2', label: 'Task 2 — Essay', data: report.t2 },
  ] as const;

  return (
    <section style={{ marginTop: '1.4rem' }}>
      <div className="callout callout-info" style={{ marginBottom: '1rem' }}>
        <div className="callout-title">How this band was estimated</div>
        Writing cannot be marked automatically with full accuracy. This estimate
        weighs length, paragraphing, vocabulary range, cohesive devices and
        sentence variety, with Task 2 counting double — the same weighting the real
        test uses. Use the feedback as a revision checklist.
      </div>

      {tasks.map((task) => {
        const a = task.data.analysis;
        return (
          <div key={task.key} className="card card-pad" style={{ marginBottom: '1rem' }}>
            <div className="row-between">
              <h3 style={{ margin: 0 }}>{task.label}</h3>
              <span className="badge badge-brand">Est. band {task.data.band.toFixed(1)}</span>
            </div>

            <div className="info-grid" style={{ marginTop: '0.9rem' }}>
              <Metric label="Words" value={a.words} hint={task.data.wordCountOk ? 'Meets minimum' : 'Under minimum'} />
              <Metric label="Paragraphs" value={a.paragraphs} />
              <Metric label="Sentences" value={a.sentences} />
              <Metric label="Avg. sentence" value={`${a.avgSentenceLength} words`} />
              <Metric label="Unique words" value={`${Math.round(a.uniqueRatio * 100)}%`} />
              <Metric label="Linking words" value={a.linkerCount} />
              <Metric label="Academic terms" value={a.academicCount} />
              <Metric label="Long words" value={`${Math.round(a.longWordRatio * 100)}%`} />
            </div>

            {task.data.strengths.length > 0 && (
              <div style={{ marginTop: '1rem' }}>
                <div className="tiny strong" style={{ textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--ok)', marginBottom: '0.45rem' }}>
                  What worked
                </div>
                <ul className="list-check">
                  {task.data.strengths.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
              </div>
            )}

            {task.data.improvements.length > 0 && (
              <div style={{ marginTop: '1rem' }}>
                <div className="tiny strong" style={{ textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--warn)', marginBottom: '0.45rem' }}>
                  What to improve
                </div>
                <ul className="list-check improve">
                  {task.data.improvements.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        );
      })}
      {band !== null && (
        <div className="callout callout-ok">
          Combined writing band: <b>{band.toFixed(1)}</b> — Task 1 and Task 2
          weighted 1:2, as in the real IELTS.
        </div>
      )}
    </section>
  );
}

function Metric({ label, value, hint }: { label: string; value: string | number; hint?: string }) {
  return (
    <div className="info-card">
      <div className="tiny faint" style={{ textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700 }}>
        {label}
      </div>
      <div style={{ fontSize: '1.3rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
        {value}
      </div>
      {hint && <div className="tiny muted">{hint}</div>}
    </div>
  );
}

function SpeakingSection({
  detail,
  band,
}: {
  detail?: Record<string, number>;
  band: number;
}) {
  const rows = [
    ['Fluency & coherence', detail?.fluency],
    ['Lexical resource', detail?.lexical],
    ['Grammatical range', detail?.grammar],
    ['Pronunciation', detail?.pronunciation],
  ] as const;

  return (
    <section style={{ marginTop: '1.4rem' }}>
      <div className="card card-pad">
        <div className="row-between">
          <h3 style={{ margin: 0 }}>Self-assessment breakdown</h3>
          <span className="badge badge-brand">Band {band.toFixed(1)}</span>
        </div>
        <p className="small muted" style={{ marginTop: '0.4rem' }}>
          These are the four criteria a real IELTS examiner uses. Because speaking
          requires a trained listener, this score reflects your own judgement —
          recording yourself and comparing against band descriptors is the best
          available practice.
        </p>
        <div style={{ overflowX: 'auto' }}>
          <table className="table">
            <thead>
              <tr>
                <th>Criterion</th>
                <th>Your rating</th>
                <th>Band 7 looks like</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(([label, score]) => (
                <tr key={label}>
                  <td className="strong">{label}</td>
                  <td>{typeof score === 'number' ? score.toFixed(1) : '—'}</td>
                  <td className="muted">
                    {label === 'Fluency & coherence' &&
                      'Speaks at length without noticeable effort; ideas clearly linked.'}
                    {label === 'Lexical resource' &&
                      'Uses some less common and idiomatic vocabulary flexibly.'}
                    {label === 'Grammatical range' &&
                      'Produces a range of complex structures with frequent error-free sentences.'}
                    {label === 'Pronunciation' &&
                      'Sustained clear pronunciation; L1 accent does not impede understanding.'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
