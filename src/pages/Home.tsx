import { Link } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import { bandToCefr, CEFR_DESCRIPTIONS, overallBand } from '../lib/scoring';
import { latestBySkill, loadHistory } from '../lib/storage';
import type { Attempt, Skill } from '../types';
import {
  ArrowRightIcon,
  BookIcon,
  ChartIcon,
  HeadphonesIcon,
  MicIcon,
  PenIcon,
  TrophyIcon,
} from '../components/Icons';

const SKILLS: {
  skill: Skill;
  to: string;
  title: string;
  blurb: string;
  meta: string;
  icon: React.ReactNode;
}[] = [
  {
    skill: 'listening',
    to: '/listening',
    title: 'Listening',
    blurb:
      'Four recordings — a conversation, a monologue, a tutorial and a lecture — with 40 questions.',
    meta: '30 minutes · 40 questions',
    icon: <HeadphonesIcon />,
  },
  {
    skill: 'reading',
    to: '/reading',
    title: 'Academic Reading',
    blurb:
      'Three academic passages with True/False/Not Given, matching, multiple choice and gap fill.',
    meta: '60 minutes · 40 questions',
    icon: <BookIcon />,
  },
  {
    skill: 'writing',
    to: '/writing',
    title: 'Writing',
    blurb:
      'Report on a data chart, then a discursive essay. Immediate feedback on length, range and structure.',
    meta: '60 minutes · 2 tasks',
    icon: <PenIcon />,
  },
  {
    skill: 'speaking',
    to: '/speaking',
    title: 'Speaking',
    blurb:
      'Full three-part interview with cue card, preparation timer and optional voice recording.',
    meta: '11–14 minutes · 3 parts',
    icon: <MicIcon />,
  },
];

export default function Home() {
  const [attempts, setAttempts] = useState<Attempt[]>([]);

  useEffect(() => {
    setAttempts(loadHistory());
  }, []);

  const latest = useMemo(() => latestBySkill(attempts), [attempts]);

  const bands = useMemo(() => {
    const values = (['listening', 'reading', 'writing', 'speaking'] as Skill[])
      .map((s) => latest[s]?.band)
      .filter((b): b is number => typeof b === 'number');
    return values;
  }, [latest]);

  const overall = overallBand(bands);
  const cefr = overall !== null ? bandToCefr(overall) : null;

  return (
    <>
      <section className="hero">
        <div className="hero-inner">
          <div className="hero-eyebrow">
            <TrophyIcon className="" />
            Free full mock exam
          </div>
          <h1>Practise IELTS and find your CEFR level</h1>
          <p>
            All four skills in real exam format, marked instantly. Listening and
            Reading convert to an IELTS band, which maps to a CEFR level from A1
            to C2 — so you know exactly where you stand.
          </p>
          <div className="hero-actions">
            <Link to="/listening" className="btn btn-lg">
              Start full mock
              <ArrowRightIcon className="" />
            </Link>
            <Link to="/progress" className="btn btn-ghost btn-lg">
              <ChartIcon className="" />
              My progress
            </Link>
          </div>

          <div className="hero-stats">
            <div>
              <div className="hero-stat-value">100</div>
              <div className="hero-stat-label">Questions</div>
            </div>
            <div>
              <div className="hero-stat-value">4</div>
              <div className="hero-stat-label">Skills</div>
            </div>
            <div>
              <div className="hero-stat-value">
                {overall !== null ? overall.toFixed(1) : '—'}
              </div>
              <div className="hero-stat-label">Your band</div>
            </div>
            <div>
              <div className="hero-stat-value">{cefr ?? '—'}</div>
              <div className="hero-stat-label">CEFR level</div>
            </div>
          </div>
        </div>
      </section>

      {overall !== null && cefr && (
        <div className="callout callout-ok" style={{ marginTop: '1.1rem' }}>
          <div className="callout-title">
            Latest overall estimate: Band {overall.toFixed(1)} · CEFR {cefr}
          </div>
          {CEFR_DESCRIPTIONS[cefr]} Based on your most recent {bands.length}{' '}
          skill{bands.length === 1 ? '' : 's'}. A full IELTS overall band uses all
          four skills, so take the skills you have not attempted yet.
        </div>
      )}

      <section style={{ marginTop: '2rem' }}>
        <div className="section-head">
          <h2>Choose a skill</h2>
          <span className="small muted">Start anywhere — results are saved in this browser</span>
        </div>
        <div className="skill-grid">
          {SKILLS.map((item) => {
            const result = latest[item.skill];
            return (
              <Link key={item.skill} to={item.to} className="skill-card">
                <div className="row-between">
                  <span className="skill-icon">{item.icon}</span>
                  {result ? (
                    <span className="badge badge-ok">
                      Band {result.band.toFixed(1)} · {bandToCefr(result.band)}
                    </span>
                  ) : (
                    <span className="badge">Not attempted</span>
                  )}
                </div>
                <h3>{item.title}</h3>
                <p>{item.blurb}</p>
                <div className="skill-card-foot">
                  <span>{item.meta}</span>
                  <span className="skill-go">
                    {result ? 'Retake' : 'Start'} →
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <section style={{ marginTop: '2rem' }}>
        <div className="section-head">
          <h2>How your score is calculated</h2>
        </div>
        <div className="info-grid">
          <div className="info-card">
            <h4>1. Raw score</h4>
            <p>
              Listening and Reading are marked against an answer key, giving a
              score out of 40. Spelling and number format are checked exactly.
            </p>
          </div>
          <div className="info-card">
            <h4>2. IELTS band</h4>
            <p>
              Your raw score is converted using the official band conversion
              tables, then written up to the nearest half band.
            </p>
          </div>
          <div className="info-card">
            <h4>3. CEFR level</h4>
            <p>
              Each band corresponds to a CEFR level: 4.0 → B1, 5.5 → B2, 7.0 → C1,
              8.5 → C2. Your overall band averages all four skills.
            </p>
          </div>
          <div className="info-card">
            <h4>What this is not</h4>
            <p>
              An official IELTS result. Writing and Speaking are estimated from
              measurable features and self-assessment, not marked by an examiner.
            </p>
          </div>
        </div>
      </section>

      <section style={{ marginTop: '2rem' }}>
        <div className="card card-pad">
          <div className="section-head" style={{ marginBottom: '0.75rem' }}>
            <h3 style={{ margin: 0 }}>Band ↔ CEFR reference</h3>
            <Link to="/progress" className="small">
              See my history →
            </Link>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table className="table">
              <thead>
                <tr>
                  <th>IELTS band</th>
                  <th>CEFR</th>
                  <th>Typical description</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['8.5 – 9.0', 'C2', 'Mastery: near-native comprehension and production.'],
                  ['7.0 – 8.0', 'C1', 'Advanced: fluent, flexible, effective for academic work.'],
                  ['5.5 – 6.5', 'B2', 'Upper-intermediate: most university courses accept this with support.'],
                  ['4.0 – 5.0', 'B1', 'Intermediate: everyday topics handled with some difficulty.'],
                  ['3.0 – 3.5', 'A2', 'Elementary: basic exchanges on familiar matters.'],
                  ['below 3.0', 'A1', 'Beginner: simple phrases and very familiar words.'],
                ].map(([band, level, desc]) => (
                  <tr key={level}>
                    <td className="strong nowrap">{band}</td>
                    <td>
                      <span className="badge badge-brand">{level}</span>
                    </td>
                    <td className="muted">{desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </>
  );
}
