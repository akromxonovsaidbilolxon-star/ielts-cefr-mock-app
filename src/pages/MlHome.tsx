import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ML_SECTIONS } from '../content/multilevel';
import { LEVEL_ORDER } from '../lib/multilevel';
import type { MlLevel } from '../content/multilevel/types';
import {
  availableLevels,
  practiceOptionsFor,
} from '../lib/mlPractice';
import {
  loadMlHistory,
  latestMlSection,
  loadPractice,
  setPracticeLevel,
  type PracticeSkill,
} from '../lib/mlStorage';
import {
  awardColorClass,
  awardLabel,
  awardRange,
  averageScore,
  formatScore,
  MULTILEVEL_DESCRIPTORS,
  scoreToAward,
} from '../lib/multilevel';
import {
  ArrowRightIcon,
  BookIcon,
  HeadphonesIcon,
  MicIcon,
  PenIcon,
} from '../components/Icons';

const SECTIONS = ['listening', 'reading', 'writing', 'speaking'] as const;

const SECTION_META = {
  listening: { label: 'Listening', icon: <HeadphonesIcon />, path: 'listening' },
  reading: { label: 'Reading', icon: <BookIcon />, path: 'reading' },
  writing: { label: 'Writing', icon: <PenIcon />, path: 'writing' },
  speaking: { label: 'Speaking', icon: <MicIcon />, path: 'speaking' },
} as const;

export default function MlHome() {
  const [mode, setMode] = useState<'exam' | 'practice'>('exam');
  const [history, setHistory] = useState<ReturnType<typeof loadMlHistory>>([]);
  const [practice, setPractice] = useState(loadPractice());
  const [practiceSkill, setPracticeSkill] = useState<PracticeSkill>('listening');

  useEffect(() => {
    setHistory(loadMlHistory());
    setPractice(loadPractice());
  }, []);

  const latest = useMemo(() => latestMlSection(history), [history]);
  const scores = SECTIONS.map((s) => latest[s]?.score).filter(
    (v): v is number => typeof v === 'number',
  );
  const overall = averageScore(scores);
  const award = overall !== null ? scoreToAward(overall) : null;

  const levels = availableLevels(practiceSkill);
  const chosenLevel = practice.levels[practiceSkill] ?? levels[0] ?? 'B1';
  const options = useMemo(
    () => practiceOptionsFor(practiceSkill, chosenLevel),
    [practiceSkill, chosenLevel],
  );

  return (
    <>
      <div className="part-hero">
        <div>
          <h2>Uzbekistan Multilevel Exam</h2>
          <p>
            Four sections, each scored out of <b>75</b>. Your level (B1, B2 or C1)
            is the average of all four — there is no C2 on this certificate.
          </p>
        </div>
        <span className="badge badge-accent">Milliy sertifikat</span>
      </div>

      {/* Overall summary */}
      {overall !== null && award && (
        <div className="callout callout-ok" style={{ marginBottom: '1.1rem' }}>
          <div className="callout-title">
            Latest overall: {formatScore(overall)} / 75 · {awardLabel(award)} ({awardRange(award)})
          </div>
          {MULTILEVEL_DESCRIPTORS[award]}
        </div>
      )}

      {/* Mode switch */}
      <div className="row wrap" style={{ marginBottom: '1rem' }}>
        <button
          type="button"
          className={`btn ${mode === 'exam' ? '' : 'btn-ghost'}`}
          onClick={() => setMode('exam')}
        >
          Exam Mode
        </button>
        <button
          type="button"
          className={`btn ${mode === 'practice' ? '' : 'btn-ghost'}`}
          onClick={() => setMode('practice')}
        >
          Practice Mode
        </button>
        <span className="tiny faint">
          {mode === 'exam'
            ? 'Fixed order, real timings, no adaptation.'
            : 'Choose a level per skill; difficulty adapts after each set.'}
        </span>
      </div>

      {mode === 'exam' ? (
        <>
          <div className="callout callout-info" style={{ marginBottom: '1rem' }}>
            <b>Exam Mode.</b> Everyone starts at Part 1 and follows the exam’s fixed
            section order, task types and timings. Answers never change what comes
            next.
          </div>

          <div className="skill-grid">
            {SECTIONS.map((section) => {
              const meta = SECTION_META[section];
              const spec = ML_SECTIONS[section];
              const result = latest[section];
              return (
                <Link key={section} to={`/multilevel/${meta.path}`} className="skill-card">
                  <div className="row-between">
                    <span className="skill-icon">{meta.icon}</span>
                    {result ? (
                      <span className="badge badge-ok">
                        {formatScore(result.score)} / 75
                      </span>
                    ) : (
                      <span className="badge">Not attempted</span>
                    )}
                  </div>
                  <h3>{meta.label}</h3>
                  <p>{spec.description}</p>
                  <div className="skill-card-foot">
                    <span>
                      {'questions' in spec
                        ? `${spec.questions} questions`
                        : 'tasks' in spec
                          ? `${spec.tasks} tasks`
                          : `${spec.windows} windows`}{' '}
                      · {spec.minutes} min
                    </span>
                    <span className="skill-go">{result ? 'Retake' : 'Start'} →</span>
                  </div>
                </Link>
              );
            })}
          </div>

          <div className="card card-pad" style={{ marginTop: '1.3rem' }}>
            <h3 style={{ marginTop: 0 }}>Section-by-section format</h3>
            <div style={{ overflowX: 'auto' }}>
              <table className="table">
                <thead>
                  <tr>
                    <th>Section</th>
                    <th>Format</th>
                    <th>Time</th>
                    <th>Score</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="strong">Listening</td>
                    <td>6 parts, 35 questions — each recording played <b>twice</b>, 15–30 s to read first</td>
                    <td className="nowrap">45 min</td>
                    <td>0–75</td>
                  </tr>
                  <tr>
                    <td className="strong">Reading</td>
                    <td>5 parts, 35 questions — notices to academic text</td>
                    <td className="nowrap">60 min</td>
                    <td>0–75</td>
                  </tr>
                  <tr>
                    <td className="strong">Writing</td>
                    <td>2 parts, 3 tasks — informal (~50 w), formal (120–150 w), discussion (180–200 w)</td>
                    <td className="nowrap">60 min</td>
                    <td>0–75</td>
                  </tr>
                  <tr>
                    <td className="strong">Speaking</td>
                    <td>4 stages, 8 recording windows — 3 personal, 3 picture-based, abstract topic, argument</td>
                    <td className="nowrap">~15 min</td>
                    <td>0–75</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="callout callout-warn" style={{ marginBottom: '1rem' }}>
            <b>Practice Mode.</b> Pick a starting level for a skill. Your next set
            adapts: 80% or more moves you up, 40% or less moves you down.
            Part number (task format) and difficulty (level) are separate, so you
            can practise the same task type at a harder level.
          </div>

          <div className="row wrap" style={{ marginBottom: '0.9rem' }}>
            {(['listening', 'reading'] as PracticeSkill[]).map((s) => (
              <button
                key={s}
                type="button"
                className={`btn btn-sm ${practiceSkill === s ? '' : 'btn-ghost'}`}
                onClick={() => setPracticeSkill(s)}
              >
                {SECTION_META[s].label}
              </button>
            ))}
            <span className="tiny faint">Writing and Speaking are always full-length.</span>
          </div>

          <div className="card card-pad" style={{ marginBottom: '1rem' }}>
            <div className="row-between" style={{ marginBottom: '0.6rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.02rem' }}>
                {SECTION_META[practiceSkill].label} — choose your level
              </h3>
              <span className="badge badge-brand">{chosenLevel}</span>
            </div>
            <div className="row wrap">
              {LEVEL_ORDER.map((level: MlLevel) => {
                const unlocked = levels.includes(level);
                return (
                  <button
                    key={level}
                    type="button"
                    className={`btn btn-sm ${chosenLevel === level ? '' : 'btn-ghost'}`}
                    disabled={!unlocked}
                    title={unlocked ? `Practise at ${level}` : `No ${level} material yet`}
                    onClick={() => {
                      setPractice(setPracticeLevel(practiceSkill, level));
                    }}
                  >
                    {level}
                    {!unlocked && <span className="tiny" style={{ opacity: 0.6 }}>·soon</span>}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="skill-grid">
            {options.map((opt) => (
              <Link
                key={`${opt.partNumber}-${opt.difficulty}`}
                to={`/multilevel/${practiceSkill}?practice=1`}
                className="skill-card"
              >
                <div className="row-between">
                  <span className="skill-icon">{SECTION_META[practiceSkill].icon}</span>
                  <span className="badge badge-brand">{opt.difficulty}</span>
                </div>
                <h3>Part {opt.partNumber}</h3>
                <p>{opt.title}</p>
                <div className="skill-card-foot">
                  <span>{opt.approximate ? `Nearest available level` : 'Exact level match'}</span>
                  <span className="skill-go">Practise →</span>
                </div>
              </Link>
            ))}
          </div>
        </>
      )}

      {/* Level reference */}
      <div className="card card-pad" style={{ marginTop: '1.3rem' }}>
        <h3 style={{ marginTop: 0 }}>CEFR levels and this certificate</h3>
        <div style={{ overflowX: 'auto' }}>
          <table className="table">
            <thead>
              <tr>
                <th>Level</th>
                <th>Overall</th>
                <th>What you can typically do</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['C1', '65 – 75', 'Understand demanding texts; use English effectively in academic, professional and social settings.'],
                ['B2', '51 – 64', 'Discuss a range of topics, explain and defend an opinion, write clear detailed essays.'],
                ['B1', '38 – 50', 'Manage most travel situations, describe experiences, write simple connected text.'],
                ['A2', 'below 38', 'Handle everyday situations like shopping, directions and routines (general CEFR descriptor).'],
                ['A1', 'below 38', 'Introduce yourself, answer simple questions, understand basic phrases (general CEFR descriptor).'],
              ].map(([level, range, desc]) => (
                <tr
                  key={level}
                  style={{ background: award === level ? 'var(--brand-light)' : undefined }}
                >
                  <td>
                    <span className={`badge ${awardColorClass(level as never)}`}>{level}</span>
                  </td>
                  <td className="nowrap">{range}</td>
                  <td className="muted small">{desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="tiny faint" style={{ marginTop: '0.6rem' }}>
          The certificate awards <b>B1, B2 or C1</b> only. A1 and A2 are shown as
          general CEFR reference points, not as certificate awards.
        </div>
      </div>

      <div className="row wrap" style={{ marginTop: '1.3rem' }}>
        <Link to="/multilevel/progress" className="btn btn-ghost">
          View Multilevel progress
        </Link>
        <Link to="/" className="btn btn-ghost">
          <ArrowRightIcon className="" />
          Back to home
        </Link>
      </div>
    </>
  );
}
