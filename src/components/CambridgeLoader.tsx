import { useEffect, useState, type ReactNode } from 'react';
import { Link, useParams } from 'react-router-dom';
import { loadCambridgeTest } from '../lib/cambridgeContent';
import type { CambridgeTest } from '../content/cambridge/types';

/**
 * Loads one Cambridge test from Supabase and hands it to the page.
 *
 * Every Cambridge page needs the same three states — loading, "no such test",
 * "could not reach the server" — so they live here instead of being repeated
 * five times. Loading is not instant, so the exam timer must not start until
 * the content has actually arrived; callers render their timer inside the
 * child, which only mounts once `test` is non-null.
 */

interface Props {
  children: (test: CambridgeTest) => ReactNode;
}

export default function CambridgeLoader({ children }: Props) {
  const { testId } = useParams();
  const [test, setTest] = useState<CambridgeTest | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    setLoading(true);
    setError(null);
    setTest(null);

    loadCambridgeTest(testId)
      .then((found) => {
        if (cancelled) return;
        if (found) setTest(found);
        else setError('missing');
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : 'Could not load this test.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [testId]);

  if (loading) {
    return (
      <div className="boot-screen">
        <div className="boot-mark">IE</div>
        <div className="muted small">Loading test…</div>
      </div>
    );
  }

  if (test) return <>{children(test)}</>;

  const isMissing = error === 'missing';

  return (
    <div className="page">
      <div className="callout callout-warn">
        <div className="callout-title">
          {isMissing ? 'That test could not be found' : 'Could not load this test'}
        </div>
        {isMissing ? (
          <p>
            It may not have been published yet, or the link may be out of date.
            Tests are added to the database one at a time.
          </p>
        ) : (
          <p>
            {error}. Check your connection and try again — the book text is
            loaded from the server, so it needs one.
          </p>
        )}
        <p style={{ marginBottom: 0 }}>
          <Link to="/cambridge">← All Cambridge tests</Link>
        </p>
      </div>
    </div>
  );
}
