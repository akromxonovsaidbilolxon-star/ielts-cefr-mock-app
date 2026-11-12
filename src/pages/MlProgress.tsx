import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  awardColorClass,
  awardLabel,
  averageScore,
  formatScore,
  MULTILEVEL_DESCRIPTORS,
  scoreToAward,
  sectionScoreToLevel,
} from '../lib/multilevel';
import { clearMlHistory, latestMlSection, loadMlHistory } from '../lib/mlStorage';
import type { MlAttempt } from '../content/multilevel/types';
import { ChartIcon, TrophyIcon } from '../components/Icons';

const SECTIONS = ['listening', 'reading', 'writing', 'speaking'] as const;
const LABEL: Record<(typeof SECTIONS)[number], string> = {
  listening: 'Listening',
  reading: 'Reading',
  writing: 'Writing',
  speaking: 'Speaking',
};
const COLOR: Record<(typeof SECTIONS)[number], string> = {
  listening: '#0d4ea6',
  reading: '#0e7490',
  writing: '#c2410c',
  speaking: '#6d28d9',
};

export default function MlProgress() {
  const [attempts, setAttempts] = useState<MlAttempt[]>([]);
  const [confirmClear, setConfirmClear] = useState(false);

  useEffect(() => {
    setAttempts(loadMlHistory());
  }, []);

  const latest = useMemo(() => latestMlSection(attempts), [attempts]);
  const scores = SECTIONS.map((s) => latest[s]?.score).filter(
    (v): v is number => typeof v === 'number',
  );
  const overall = averageScore(scores);
  const award = overall !== null ? scoreToAward(overall) : null;

  if (attempts.length === 0) {
    return (
      <>
        <div className="part-hero">
          <div>
            <h2>Multilevel progress</h2>
            <p>Your section scores out of 75 and your certificate level appear here.</p>
          </div>
        </div>
        <div className="empty">
          <TrophyIcon className="" />
          <div style={{ marginTop: '0.5rem' }}>No Multilevel attempts yet.</div>
          <Link to="/multilevel" className="btn" style={{ marginTop: '0.8rem' }}>
            Start the Multilevel exam
          </Link>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="section-head">
        <div>
          <h1 style={{ marginBottom: '0.15rem' }}>Multilevel progress</h1>
          <p className="muted" style={{ margin: 0 }}>
            {attempts.length} saved attempt{attempts.length === 1 ? '' : 's'} · separate
            from your IELTS results
          </p>
        </div>
        {confirmClear ? (
          <div className="row">
            <span className="small muted">Delete Multilevel history?</span>
            <button
              type="button"
              className="btn btn-danger btn-sm"
              onClick={() => {
                clearMlHistory();
                setAttempts([]);
                setConfirmClear(false);
              }}
            >
              Yes, delete
            </button>
            <button type="button" className="btn btn-ghost btn-sm" onClick={() => setConfirmClear(false)}>
              Cancel
            </button>
          </div>
        ) : (
          <button type="button" className="btn btn-ghost btn-sm" onClick={() => setConfirmClear(true)}>
            Clear history
          </button>
        )}
      </div>

      <div className="score-hero" style={{ marginBottom: '1.3rem' }}>
        <div className="band-dial">
          <div className="band-dial-inner">
            <div className="band-dial-value">{overall !== null ? formatScore(overall) : '—'}</div>
            <div className="band-dial-label">overall / 75</div>
          </div>
        </div>
        <div>
          <h1 style={{ fontSize: '1.55rem' }}>
            {award ? awardLabel(award) : 'In progress'}
          </h1>
          <p>{award ? MULTILEVEL_DESCRIPTORS[award] : 'Complete sections to build your average.'}</p>
        </div>
      </div>

      <div className="score-cards" style={{ marginBottom: '1.4rem' }}>
        {SECTIONS.map((section) => {
          const entry = latest[section];
          return (
            <div key={section} className="score-card">
              <div className="score-card-top">
                <span className="score-card-name">{LABEL[section]}</span>
                <span className="chart-swatch" style={{ background: COLOR[section], width: 12, height: 12 }} />
              </div>
              <div className="score-card-value">
                {entry ? formatScore(entry.score) : '—'}
                <span className="faint" style={{ fontSize: '0.85rem', fontWeight: 600 }}> / 75</span>
              </div>
              <div className="score-card-meta">
                {entry && sectionScoreToLevel(entry.score)
                  ? `${sectionScoreToLevel(entry.score)} · ${new Date(entry.dateISO).toLocaleDateString()}`
                  : 'Not attempted'}
              </div>
            </div>
          );
        })}
      </div>

      <div className="card card-pad" style={{ marginBottom: '1.3rem' }}>
        <h3 style={{ marginTop: 0 }}>
          <ChartIcon className="" /> Section comparison
        </h3>
        <div className="stack stack-sm">
          {SECTIONS.map((section) => {
            const score = latest[section]?.score ?? 0;
            return (
              <div key={section}>
                <div className="row-between small">
                  <span className="strong">{LABEL[section]}</span>
                  <span className="muted">
                    {latest[section] ? `${formatScore(score)} / 75` : 'Not attempted'}
                  </span>
                </div>
                <div className="progress-bar" style={{ marginTop: '0.25rem' }}>
                  <div
                    className="progress-fill"
                    style={{ width: `${(score / 75) * 100}%`, background: COLOR[section] }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="card">
        <div className="card-pad" style={{ paddingBottom: '0.4rem' }}>
          <h3 style={{ margin: 0 }}>Attempt history</h3>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className="table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Section</th>
                <th>Score</th>
                <th>Level</th>
                <th>Detail</th>
              </tr>
            </thead>
            <tbody>
              {attempts.flatMap((attempt) =>
                SECTIONS.filter((s) => attempt[s]).map((section) => {
                  const entry = attempt[section]!;
                  const level = sectionScoreToLevel(entry.score);
                  return (
                    <tr key={`${attempt.id}-${section}`}>
                      <td className="nowrap small">
                        {new Date(attempt.dateISO).toLocaleString(undefined, {
                          day: '2-digit',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </td>
                      <td className="strong">{LABEL[section]}</td>
                      <td>
                        <span className="badge badge-brand">{formatScore(entry.score)}</span>
                      </td>
                      <td>
                        {level ? (
                          <span className={`badge ${awardColorClass(level as never)}`}>{level}</span>
                        ) : (
                          <span className="muted small">below B1</span>
                        )}
                      </td>
                      <td className="muted small">
                        {typeof entry.correct === 'number'
                          ? `${entry.correct} / ${entry.total ?? 35} correct`
                          : '—'}
                      </td>
                    </tr>
                  );
                }),
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="row wrap" style={{ marginTop: '1.3rem' }}>
        <Link to="/multilevel" className="btn btn-ghost">← Multilevel home</Link>
        {SECTIONS.map((s) => (
          <Link key={s} to={`/multilevel/${s}`} className="btn btn-ghost btn-sm">
            Practise {LABEL[s]}
          </Link>
        ))}
      </div>
    </>
  );
}
