import { Link, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { CAMBRIDGE_TESTS, getCambridgeTest, groupByBook } from '../content/cambridge';
import { bandToCefr } from '../lib/scoring';
import { loadCambridgeHistory, latestForTest, bestForTest, type CambridgeScore } from '../lib/cambridgeStorage';
import type { Skill } from '../types';
import CambridgeSourceNote from '../components/CambridgeSourceNote';
import { ArrowRightIcon, BookIcon, HeadphonesIcon, MicIcon, PenIcon } from '../components/Icons';

const SKILL_META: {
  skill: Skill;
  segment: string;
  title: string;
  blurb: string;
  meta: string;
  icon: React.ReactNode;
}[] = [
  {
    skill: 'listening',
    segment: 'listening',
    title: 'Listening',
    blurb: 'Four sections, 40 questions, played once at exam speed.',
    meta: '30 minutes · 40 questions',
    icon: <HeadphonesIcon />,
  },
  {
    skill: 'reading',
    segment: 'reading',
    title: 'Academic Reading',
    blurb: 'Three passages, 40 questions, no extra transfer time.',
    meta: '60 minutes · 40 questions',
    icon: <BookIcon />,
  },
  {
    skill: 'writing',
    segment: 'writing',
    title: 'Writing',
    blurb: 'Task 1 report plus the Task 2 essay, assessed with the usual heuristics.',
    meta: '60 minutes · 2 tasks',
    icon: <PenIcon />,
  },
  {
    skill: 'speaking',
    segment: 'speaking',
    title: 'Speaking',
    blurb: 'The three-part interview for this test, with cue card and timers.',
    meta: '11–14 minutes · 3 parts',
    icon: <MicIcon />,
  },
];

export default function CambridgeHome() {
  const { testId } = useParams();
  const test = getCambridgeTest(testId);
  const [history, setHistory] = useState<CambridgeScore[]>([]);

  useEffect(() => {
    setHistory(loadCambridgeHistory());
  }, []);

  if (!test) {
    return (
      <div className="empty">
        <BookIcon className="" />
        <div style={{ marginTop: '0.5rem' }}>That Cambridge test does not exist yet.</div>
        <Link to="/" className="btn btn-ghost" style={{ marginTop: '0.9rem' }}>
          ← Back to home
        </Link>
      </div>
    );
  }

  const latest = latestForTest(history, test.id);
  const best = bestForTest(history, test.id);
  const bands = (['listening', 'reading', 'writing', 'speaking'] as Skill[])
    .map((s) => latest[s]?.band)
    .filter((b): b is number => typeof b === 'number');
  const overall =
    bands.length > 0 ? Math.round((bands.reduce((a, b) => a + b, 0) / bands.length) * 2) / 2 : null;

  return (
    <>
      <div className="part-hero">
        <div>
          <h2>{test.label}</h2>
          <p>
            The real test paper, section by section. Listening uses the actual recordings; Reading
            and Writing are transcribed from the book.
          </p>
        </div>
        <span className="badge badge-brand">
          {overall !== null ? `Band ${overall.toFixed(1)} · ${bandToCefr(overall)}` : 'Not attempted'}
        </span>
      </div>

      <CambridgeSourceNote source={test.source} />

      {overall !== null && (
        <div className="callout callout-ok" style={{ marginTop: '1rem' }}>
          <div className="callout-title">
            Your best result on this test so far: Band {overall.toFixed(1)} · CEFR{' '}
            {bandToCefr(overall)}
          </div>
          Calculated from the latest attempt at each skill. A full IELTS band needs all four
          skills, so take the ones you have not done yet.
        </div>
      )}

      <section style={{ marginTop: '1.5rem' }}>
        <div className="section-head">
          <h2>Choose a skill</h2>
          <span className="small muted">Results are saved in this browser only</span>
        </div>
        <div className="skill-grid">
          {SKILL_META.map((item) => {
            const last = latest[item.skill];
            const top = best[item.skill];
            return (
              <Link
                key={item.skill}
                to={`/cambridge/${test.id}/${item.segment}`}
                className="skill-card"
              >
                <div className="row-between">
                  <span className="skill-icon">{item.icon}</span>
                  {last ? (
                    <span className="badge badge-ok">
                      Band {last.band.toFixed(1)} · {bandToCefr(last.band)}
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
                    {top !== undefined ? `Best ${top.toFixed(1)} →` : 'Start →'}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {history.length > 0 && (
        <section style={{ marginTop: '1.8rem' }}>
          <div className="section-head">
            <h2>Recent attempts on this test</h2>
            <Link to="/cambridge" className="small">
              All Cambridge tests →
            </Link>
          </div>
          <div className="card card-pad">
            <table className="table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Skill</th>
                  <th>Score</th>
                  <th>Band</th>
                </tr>
              </thead>
              <tbody>
                {history
                  .filter((h) => h.testId === test.id)
                  .slice(0, 8)
                  .map((h, i) => (
                    <tr key={`${h.dateISO}-${h.skill}-${i}`}>
                      <td className="nowrap muted">
                        {new Date(h.dateISO).toLocaleDateString(undefined, {
                          day: 'numeric',
                          month: 'short',
                        })}
                      </td>
                      <td className="strong" style={{ textTransform: 'capitalize' }}>
                        {h.skill}
                      </td>
                      <td>
                        {h.correct !== undefined && h.total !== undefined
                          ? `${h.correct}/${h.total}`
                          : '—'}
                      </td>
                      <td>
                        <span className="badge badge-brand">{h.band.toFixed(1)}</span>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      <div className="row wrap" style={{ marginTop: '1.5rem' }}>
        <Link to="/cambridge" className="btn btn-ghost">
          ← All Cambridge tests
        </Link>
        <Link to="/" className="btn btn-soft">
          App home
          <ArrowRightIcon className="" />
        </Link>
      </div>
    </>
  );
}

/**
 * Catalogue page: every Cambridge test in the app, grouped by book.
 *
 * Grouping matters once more than one book is loaded. Books are listed newest
 * first, and any book whose other tests have not been transcribed yet says so
 * plainly, rather than pretending the book is complete.
 */
export function CambridgeIndex() {
  const books = groupByBook(CAMBRIDGE_TESTS);
  const totalTests = CAMBRIDGE_TESTS.length;
  const testsPerBook = 4;

  return (
    <>
      <div className="part-hero">
        <div>
          <h2>Cambridge IELTS tests</h2>
          <p>
            Real exam papers from the Cambridge books, one test at a time. These are kept separate
            from the built-in free mock paper.
          </p>
        </div>
        <span className="badge badge-brand">
          {totalTests} test{totalTests === 1 ? '' : 's'} · {books.length} book
          {books.length === 1 ? '' : 's'}
        </span>
      </div>

      {books.map((book) => {
        const missing = testsPerBook - book.tests.length;
        return (
          <section key={`${book.book}-${book.module}`} style={{ marginTop: '1.5rem' }}>
            <div className="row-between" style={{ alignItems: 'baseline', marginBottom: '0.7rem' }}>
              <h3 style={{ margin: 0 }}>
                Cambridge IELTS {book.book}
                {book.module === 'general' ? ' · General Training' : ' · Academic'}
              </h3>
              <span className="tiny muted">
                {book.tests.length} of {testsPerBook} tests
              </span>
            </div>

            <div className="skill-grid">
              {book.tests.map((t) => (
                <Link key={t.id} to={`/cambridge/${t.id}`} className="skill-card">
                  <div className="row-between">
                    <span className="skill-icon">
                      <BookIcon />
                    </span>
                    <span className="badge badge-brand">Test {t.test}</span>
                  </div>
                  <h3>Test {t.test}</h3>
                  <p>
                    Listening (4 sections), Reading (3 passages), Writing (2 tasks) and Speaking
                    (3 parts) — all from the book.
                  </p>
                  <div className="skill-card-foot">
                    <span>4 skills · 100 questions</span>
                    <span className="skill-go">Open →</span>
                  </div>
                </Link>
              ))}

              {missing > 0 && (
                <div className="skill-card skill-card-pending">
                  <div className="row-between">
                    <span className="skill-icon skill-icon-pending">
                      <BookIcon />
                    </span>
                    <span className="badge">Not yet</span>
                  </div>
                  <h3>
                    {missing === 1 ? 'One more test' : `${missing} more tests`}
                  </h3>
                  <p>
                    Not transcribed yet. Each test is copied from the book by hand, so they are
                    added one at a time.
                  </p>
                  <div className="skill-card-foot">
                    <span>Coming later</span>
                  </div>
                </div>
              )}
            </div>
          </section>
        );
      })}

      <div className="callout callout-info" style={{ marginTop: '1.3rem' }}>
        <div className="callout-title">Why not all 60 tests at once?</div>
        The Cambridge series runs from Book 1 to Book 17, with four tests in each — roughly 60
        tests, or about 600 pages to copy by hand. Each answer is also checked against the printed
        answer key by <code>npm run check:cambridge</code>, which is what keeps a typo from
        silently costing a student marks.
        <br />
        <br />
        To add a test: create a content file in <code>src/content/cambridge/</code>, register it in{' '}
        <code>src/content/cambridge/index.ts</code>, and add its official key to{' '}
        <code>scripts/check-cambridge.mjs</code>.
      </div>

      <div className="row wrap" style={{ marginTop: '1.5rem' }}>
        <Link to="/cambridge" className="btn btn-ghost">
          ← All Cambridge tests
        </Link>
        <Link to="/" className="btn btn-soft">
          App home
          <ArrowRightIcon className="" />
        </Link>
      </div>
    </>
  );
}
