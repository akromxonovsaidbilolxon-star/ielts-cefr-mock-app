import { useEffect, useMemo, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import {
  getCambridgeTest,
  listeningGroups,
  readingGroups,
  listeningQuestions,
  readingQuestions,
} from '../content/cambridge';
import { bandToCefr, CEFR_DESCRIPTIONS, isCorrect } from '../lib/scoring';
import {
  loadCambridgeHistory,
  readCambridgeReview,
  readCambridgeWritingReport,
} from '../lib/cambridgeStorage';
import { CambridgeGroupBlock } from '../components/CambridgeGroup';
import CambridgeSourceNote from '../components/CambridgeSourceNote';
import type { Skill } from '../types';
import type { WritingFeedback } from '../lib/scoring';

const SKILL_LABEL: Record<Skill, string> = {
  listening: 'Listening',
  reading: 'Academic Reading',
  writing: 'Writing',
  speaking: 'Speaking',
};

interface WritingReport {
  t1: WritingFeedback;
  t2: WritingFeedback;
  texts: Record<string, string>;
}

export default function CambridgeResults() {
  const { testId } = useParams();
  const [params] = useSearchParams();
  const focus = (params.get('skill') as Skill | null) ?? null;
  const test = getCambridgeTest(testId);

  const [tab, setTab] = useState<'scores' | 'review'>('scores');

  const history = useMemo(() => loadCambridgeHistory(), []);
  const rows = useMemo(
    () => (test ? history.filter((h) => h.testId === test.id) : []),
    [history, test],
  );

  const latest = useMemo(() => {
    const out: Partial<Record<Skill, (typeof rows)[number]>> = {};
    for (const row of rows) if (!out[row.skill]) out[row.skill] = row;
    return out;
  }, [rows]);

  const focusResult = focus ? latest[focus] : undefined;
  const bands = (['listening', 'reading', 'writing', 'speaking'] as Skill[])
    .map((s) => latest[s]?.band)
    .filter((b): b is number => typeof b === 'number');
  const overall =
    bands.length > 0 ? Math.round((bands.reduce((a, b) => a + b, 0) / bands.length) * 2) / 2 : null;

  const review = useMemo(
    () => (test && focus ? readCambridgeReview(test.id, focus) : null),
    [test, focus],
  );
  const writingReport = useMemo(
    () => (test && focus === 'writing' ? readCambridgeWritingReport<WritingReport>(test.id) : null),
    [test, focus],
  );

  /* Title + tab state reset when the skill changes. */
  useEffect(() => {
    setTab('scores');
  }, [focus]);

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

  const showReview = focus === 'listening' || focus === 'reading';
  const canReview = Boolean(showReview && review && review.skill === focus);

  const groups =
    focus === 'listening'
      ? listeningGroups(test)
      : focus === 'reading'
        ? readingGroups(test)
        : [];

  const questions =
    focus === 'listening'
      ? listeningQuestions(test)
      : focus === 'reading'
        ? readingQuestions(test)
        : [];

  const reviewCorrect = review
    ? questions.filter((q) => isCorrect(review.answers[q.number], q.answer)).length
    : 0;

  if (!focus) {
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
            <h1>{test.label}</h1>
            <p>
              {overall !== null
                ? `Estimated overall band ${overall.toFixed(1)} · CEFR ${bandToCefr(overall)}`
                : 'Take a section to see your band for this test.'}
            </p>
            {overall !== null && <p style={{ marginTop: '0.5rem' }}>{CEFR_DESCRIPTIONS[bandToCefr(overall)]}</p>}
          </div>
        </div>

        <CambridgeSourceNote source={test.source} />

        <div className="score-cards" style={{ marginTop: '1.2rem' }}>
          {(['listening', 'reading', 'writing', 'speaking'] as Skill[]).map((skill) => {
            const r = latest[skill];
            return (
              <div key={skill} className="score-card">
                <div className="score-card-top">
                  <span className="score-card-name">{SKILL_LABEL[skill]}</span>
                  {r ? <span className="badge badge-brand">{bandToCefr(r.band)}</span> : <span className="badge">—</span>}
                </div>
                <div className="score-card-value">{r ? r.band.toFixed(1) : '—'}</div>
                <div className="score-card-meta">
                  {r
                    ? r.correct !== undefined && r.total !== undefined
                      ? `${r.correct}/${r.total} · ${new Date(r.dateISO).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}`
                      : new Date(r.dateISO).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })
                    : 'Not attempted yet'}
                </div>
                <Link
                  to={`/cambridge/${test.id}/${skill}`}
                  className="btn btn-ghost btn-sm btn-block"
                  style={{ marginTop: '0.8rem' }}
                >
                  {r ? 'Retake' : 'Start'}
                </Link>
              </div>
            );
          })}
        </div>

        <div className="row wrap" style={{ marginTop: '1.4rem' }}>
          <Link to={`/cambridge/${test.id}`} className="btn btn-ghost">
            ← Back to {test.label}
          </Link>
          <Link to="/cambridge" className="btn btn-soft">
            All Cambridge tests
          </Link>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="score-hero">
        <div className="band-dial">
          <div className="band-dial-inner">
            <div className="band-dial-value">{focusResult ? focusResult.band.toFixed(1) : '—'}</div>
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
          {focusResult?.correct !== undefined && focusResult?.total !== undefined && (
            <p style={{ marginTop: '0.6rem' }}>
              {focus === 'writing'
                ? `${focusResult.correct} words written in total`
                : `${focusResult.correct} of ${focusResult.total} correct`}
            </p>
          )}
        </div>
      </div>

      <CambridgeSourceNote source={test.source} compact />

      {focus === 'writing' && writingReport && (
        <section style={{ marginTop: '1.4rem' }}>
          <div className="callout callout-info" style={{ marginBottom: '1rem' }}>
            <div className="callout-title">How this band was estimated</div>
            This is a machine estimate based on length, paragraphing, vocabulary range, linking
            words and sentence variety, with Task 2 counting double. A human examiner also judges
            accuracy — treat the feedback as a revision checklist.
          </div>
          {(
            [
              ['Task 1 — Report', writingReport.t1],
              ['Task 2 — Essay', writingReport.t2],
            ] as const
          ).map(([label, data]) => (
            <div key={label} className="card card-pad" style={{ marginBottom: '1rem' }}>
              <div className="row-between">
                <h3 style={{ margin: 0 }}>{label}</h3>
                <span className="badge badge-brand">Est. band {data.band.toFixed(1)}</span>
              </div>
              <div className="info-grid" style={{ marginTop: '0.9rem' }}>
                {[
                  ['Words', data.analysis.words, data.wordCountOk ? 'Meets minimum' : 'Under minimum'],
                  ['Paragraphs', data.analysis.paragraphs, ''],
                  ['Sentences', data.analysis.sentences, ''],
                  ['Avg. sentence', `${data.analysis.avgSentenceLength} words`, ''],
                  ['Unique words', `${Math.round(data.analysis.uniqueRatio * 100)}%`, ''],
                  ['Linking words', data.analysis.linkerCount, ''],
                ].map(([label2, value, hint]) => (
                  <div key={String(label2)} className="info-card">
                    <h4>{label2}</h4>
                    <div className="strong">{value}</div>
                    {hint && <div className="tiny faint">{hint}</div>}
                  </div>
                ))}
              </div>
              {data.strengths.length > 0 && (
                <div style={{ marginTop: '0.9rem' }}>
                  <div className="tiny strong" style={{ textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--ok)' }}>
                    What worked
                  </div>
                  <ul className="list-check">
                    {data.strengths.map((s) => (
                      <li key={s}>{s}</li>
                    ))}
                  </ul>
                </div>
              )}
              {data.improvements.length > 0 && (
                <div style={{ marginTop: '0.7rem' }}>
                  <div className="tiny strong" style={{ textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--warn)' }}>
                    Next time
                  </div>
                  <ul className="list-check">
                    {data.improvements.map((s) => (
                      <li key={s}>{s}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </section>
      )}

      {focus === 'speaking' && focusResult?.detail && (
        <div className="info-grid" style={{ marginTop: '1.2rem' }}>
          {[
            ['Fluency & coherence', focusResult.detail.fluency],
            ['Lexical resource', focusResult.detail.lexical],
            ['Grammar range', focusResult.detail.grammar],
            ['Pronunciation', focusResult.detail.pronunciation],
          ].map(([label, value]) => (
            <div key={String(label)} className="info-card">
              <h4>{label}</h4>
              <div className="strong">{Number(value).toFixed(1)}</div>
            </div>
          ))}
        </div>
      )}

      {showReview && !canReview && (
        <div className="callout callout-info" style={{ marginTop: '1.2rem' }}>
          The detailed answer review is only available straight after you submit a test in this
          tab. Take the test again to see a full breakdown.
        </div>
      )}

      {canReview && review && (
        <section style={{ marginTop: '1.5rem' }}>
          <div className="section-head">
            <h2 style={{ fontSize: '1.25rem' }}>Answer review</h2>
            <div className="row">
              <span className="badge badge-ok">Correct {reviewCorrect}</span>
              <span className="badge badge-bad">Incorrect {questions.length - reviewCorrect}</span>
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
              {groups.map((group) => (
                <CambridgeGroupBlock
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
        <Link to={`/cambridge/${test.id}`} className="btn btn-ghost">
          ← Back to {test.label}
        </Link>
        <Link to={`/cambridge/${test.id}/${focus}`} className="btn">
          Retake {SKILL_LABEL[focus]}
        </Link>
      </div>
    </>
  );
}
