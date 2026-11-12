import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { bandToCefr, CEFR_DESCRIPTIONS, overallBand } from '../lib/scoring';
import { bestBand, clearHistory, latestBySkill, loadHistory } from '../lib/storage';
import type { Attempt, Skill } from '../types';
import { ChartIcon, TrophyIcon } from '../components/Icons';

const ALL_SKILLS: Skill[] = ['listening', 'reading', 'writing', 'speaking'];
const SKILL_LABEL: Record<Skill, string> = {
  listening: 'Listening',
  reading: 'Reading',
  writing: 'Writing',
  speaking: 'Speaking',
};
const SKILL_COLOR: Record<Skill, string> = {
  listening: '#0d4ea6',
  reading: '#0e7490',
  writing: '#c2410c',
  speaking: '#6d28d9',
};

export default function Progress() {
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [confirmClear, setConfirmClear] = useState(false);

  useEffect(() => {
    setAttempts(loadHistory());
  }, []);

  const latest = useMemo(() => latestBySkill(attempts), [attempts]);

  const overall = useMemo(() => {
    const bands = ALL_SKILLS.map((s) => latest[s]?.band).filter(
      (b): b is number => typeof b === 'number',
    );
    return overallBand(bands);
  }, [latest]);

  const chronological = useMemo(
    () => [...attempts].sort((a, b) => (a.dateISO < b.dateISO ? -1 : 1)),
    [attempts],
  );

  const overallSeries = useMemo(() => {
    return chronological
      .map((attempt, index) => {
        const bands = ALL_SKILLS.map((s) => attemptsUntil(chronological, index)[s])
          .filter((b): b is number => typeof b === 'number');
        return { dateISO: attempt.dateISO, band: overallBand(bands) };
      })
      .filter((p): p is { dateISO: string; band: number } => p.band !== null);
  }, [chronological]);

  if (attempts.length === 0) {
    return (
      <>
        <div className="hero" style={{ padding: '2.2rem' }}>
          <div className="hero-inner">
            <h1>Your progress</h1>
            <p>Finish a section and your bands, CEFR level and history appear here.</p>
            <div className="hero-actions">
              <Link to="/listening" className="btn btn-lg">
                Take the first test
              </Link>
            </div>
          </div>
        </div>
        <div className="empty" style={{ marginTop: '1.2rem' }}>
          <TrophyIcon className="" />
          <div style={{ marginTop: '0.5rem' }}>No attempts saved yet.</div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="section-head">
        <div>
          <h1 style={{ marginBottom: '0.15rem' }}>Your progress</h1>
          <p className="muted" style={{ margin: 0 }}>
            {attempts.length} saved attempt{attempts.length === 1 ? '' : 's'} · stored in this
            browser only
          </p>
        </div>
        {confirmClear ? (
          <div className="row">
            <span className="small muted">Delete all history?</span>
            <button
              type="button"
              className="btn btn-danger btn-sm"
              onClick={() => {
                clearHistory();
                setAttempts([]);
                setConfirmClear(false);
              }}
            >
              Yes, delete
            </button>
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={() => setConfirmClear(false)}
            >
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
            <div className="band-dial-value">{overall !== null ? overall.toFixed(1) : '—'}</div>
            <div className="band-dial-label">overall</div>
          </div>
        </div>
        <div>
          <h1 style={{ fontSize: '1.6rem' }}>
            {overall !== null ? `Band ${overall.toFixed(1)} · CEFR ${bandToCefr(overall)}` : 'In progress'}
          </h1>
          <p>
            {overall !== null
              ? CEFR_DESCRIPTIONS[bandToCefr(overall)]
              : 'Complete all four skills to unlock your full CEFR estimate.'}
          </p>
        </div>
      </div>

      <div className="score-cards" style={{ marginBottom: '1.5rem' }}>
        {ALL_SKILLS.map((skill) => {
          const result = latest[skill];
          const best = bestBand(attempts, skill);
          return (
            <div key={skill} className="score-card">
              <div className="score-card-top">
                <span className="score-card-name">{SKILL_LABEL[skill]}</span>
                <span
                  className="chart-swatch"
                  style={{ background: SKILL_COLOR[skill], width: 12, height: 12 }}
                />
              </div>
              <div className="score-card-value">
                {result ? result.band.toFixed(1) : '—'}
                {result && (
                  <span className="badge badge-brand" style={{ marginLeft: '0.5rem', verticalAlign: 'middle' }}>
                    {bandToCefr(result.band)}
                  </span>
                )}
              </div>
              <div className="score-card-meta">
                {best !== null && best !== result?.band
                  ? `Best: ${best.toFixed(1)} · `
                  : ''}
                {result
                  ? new Date(result.dateISO).toLocaleDateString()
                  : 'Not attempted'}
              </div>
            </div>
          );
        })}
      </div>

      {overallSeries.length > 1 && (
        <div className="card card-pad" style={{ marginBottom: '1.5rem' }}>
          <div className="section-head" style={{ marginBottom: '0.5rem' }}>
            <h3 style={{ margin: 0 }}>
              <ChartIcon className="" /> Overall band over time
            </h3>
            <span className="tiny faint">Each point averages the skills attempted so far</span>
          </div>
          <TrendChart points={overallSeries} />
        </div>
      )}

      {ALL_SKILLS.some((s) => attempts.some((a) => a.scores[s])) && (
        <div className="card card-pad" style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ marginTop: 0 }}>Skill comparison</h3>
          <div className="stack stack-sm">
            {ALL_SKILLS.map((skill) => {
              const result = latest[skill];
              const band = result?.band ?? 0;
              return (
                <div key={skill}>
                  <div className="row-between small">
                    <span className="strong">{SKILL_LABEL[skill]}</span>
                    <span className="muted">{result ? `Band ${result.band.toFixed(1)}` : 'Not attempted'}</span>
                  </div>
                  <div className="progress-bar" style={{ marginTop: '0.25rem' }}>
                    <div
                      className="progress-fill"
                      style={{
                        width: `${(band / 9) * 100}%`,
                        background: SKILL_COLOR[skill],
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="card">
        <div className="card-pad" style={{ paddingBottom: '0.4rem' }}>
          <h3 style={{ margin: 0 }}>Attempt history</h3>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className="table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Skill</th>
                <th>Band</th>
                <th>CEFR</th>
                <th>Detail</th>
              </tr>
            </thead>
            <tbody>
              {attempts.flatMap((attempt) =>
                (Object.keys(attempt.scores) as Skill[]).map((skill) => {
                  const result = attempt.scores[skill]!;
                  return (
                    <tr key={`${attempt.id}-${skill}`}>
                      <td className="nowrap">
                        {new Date(attempt.dateISO).toLocaleString(undefined, {
                          day: '2-digit',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </td>
                      <td className="strong">{SKILL_LABEL[skill]}</td>
                      <td>
                        <span className="badge badge-brand">{result.band.toFixed(1)}</span>
                      </td>
                      <td>{bandToCefr(result.band)}</td>
                      <td className="muted small">
                        {skill === 'listening' || skill === 'reading'
                          ? `${result.correct ?? 0} / ${result.total ?? 40} correct`
                          : skill === 'writing'
                            ? `T1 ${result.detail?.task1Band ?? '—'} · T2 ${result.detail?.task2Band ?? '—'}`
                            : `Fluency ${result.detail?.fluency ?? '—'} · Vocab ${result.detail?.lexical ?? '—'}`}
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
        {ALL_SKILLS.map((skill) => (
          <Link key={skill} to={`/${skill}`} className="btn btn-ghost btn-sm">
            Practise {SKILL_LABEL[skill]}
          </Link>
        ))}
      </div>
    </>
  );
}

/* ------------------------------------------------------------------ */

function attemptsUntil(chronological: Attempt[], index: number): Partial<Record<Skill, number>> {
  const out: Partial<Record<Skill, number>> = {};
  for (let i = 0; i <= index; i += 1) {
    const attempt = chronological[i];
    for (const skill of Object.keys(attempt.scores) as Skill[]) {
      const band = attempt.scores[skill]?.band;
      if (typeof band === 'number') out[skill] = band;
    }
  }
  return out;
}

function TrendChart({ points }: { points: { dateISO: string; band: number }[] }) {
  const width = 640;
  const height = 220;
  const pad = { top: 18, right: 22, bottom: 34, left: 38 };
  const plotW = width - pad.left - pad.right;
  const plotH = height - pad.top - pad.bottom;

  const x = (i: number) => pad.left + (points.length === 1 ? plotW / 2 : (i / (points.length - 1)) * plotW);
  const y = (band: number) => pad.top + plotH - ((band - 3) / 6) * plotH;

  const path = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${x(i)} ${y(p.band)}`).join(' ');

  return (
    <svg viewBox={`0 0 ${width} ${height}`} width="100%" role="img" aria-label="Overall band trend">
      {[3, 4, 5, 6, 7, 8, 9].map((band) => (
        <g key={band}>
          <line
            x1={pad.left}
            x2={width - pad.right}
            y1={y(band)}
            y2={y(band)}
            stroke="#e3e9f2"
          />
          <text x={pad.left - 8} y={y(band) + 4} textAnchor="end" fontSize={10} fill="#8794a8">
            {band}
          </text>
        </g>
      ))}
      <path d={path} fill="none" stroke="#0d4ea6" strokeWidth={2.5} strokeLinejoin="round" />
      {points.map((p, i) => (
        <g key={p.dateISO + i}>
          <circle cx={x(i)} cy={y(p.band)} r={4} fill="#fff" stroke="#0d4ea6" strokeWidth={2.5} />
          <text x={x(i)} y={height - 12} textAnchor="middle" fontSize={9.5} fill="#8794a8">
            {new Date(p.dateISO).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}
          </text>
        </g>
      ))}
    </svg>
  );
}
