import { getSupabase, isConfigured } from './supabase';
import type { CambridgeTest } from '../content/cambridge/types';

/**
 * Cambridge test content, loaded from Supabase at run time.
 *
 * WHY IT IS NOT IN THE BUNDLE
 * The passages are copyrighted book text. Importing `content/cambridge` from a
 * page would compile them into the JavaScript the browser downloads, which
 * served them to anyone who opened the site — before sign-in, and with no
 * database in the way. Only signed-in accounts can read `cambridge_tests`
 * (Row Level Security), so the text now never reaches an unauthenticated
 * client at all.
 *
 * VERIFY THE FIX: `npm run build` then
 *   grep -rl "Harappan" dist/assets/*.js      → should print nothing
 */

/** Lightweight catalogue entry — safe to render without the full text. */
export interface CambridgeSummary {
  id: string;
  book: number;
  test: number;
  module: 'academic' | 'general';
  label: string;
}

interface CambridgeRow {
  id: string;
  book: number;
  test: number;
  module: 'academic' | 'general';
  label: string;
  content: {
    listening: CambridgeTest['listening'];
    reading: CambridgeTest['reading'];
    writing: CambridgeTest['writing'];
    speaking: CambridgeTest['speaking'];
  };
  source: CambridgeTest['source'];
}

/* ------------------------------------------------------------------ */
/* Session cache                                                       */
/* ------------------------------------------------------------------ */

const testCache = new Map<string, CambridgeTest>();
let summariesCache: CambridgeSummary[] | null = null;

/** Called on sign-out so the next account cannot read the previous one's cache. */
export function clearCambridgeCache(): void {
  testCache.clear();
  summariesCache = null;
}

/* ------------------------------------------------------------------ */
/* Catalogue                                                           */
/* ------------------------------------------------------------------ */

/**
 * The list of available tests, without any book text. Selecting only the
 * label columns keeps this cheap and keeps passages out of memory until a
 * test is actually opened.
 */
export async function loadCambridgeSummaries(): Promise<CambridgeSummary[]> {
  if (summariesCache) return summariesCache;

  if (!isConfigured) {
    throw new Error(
      'Supabase is not configured, so the Cambridge tests cannot be loaded. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.',
    );
  }

  const { data, error } = await getSupabase()
    .from('cambridge_tests')
    .select('id, book, test, module, label')
    .order('book', { ascending: false })
    .order('test', { ascending: true });

  if (error) throw error;

  summariesCache = (data ?? []) as CambridgeSummary[];
  return summariesCache;
}

/* ------------------------------------------------------------------ */
/* A single test                                                       */
/* ------------------------------------------------------------------ */

function toTest(row: CambridgeRow): CambridgeTest {
  return {
    id: row.id,
    book: row.book,
    test: row.test,
    module: row.module,
    label: row.label,
    source: row.source,
    listening: row.content.listening,
    reading: row.content.reading,
    writing: row.content.writing,
    speaking: row.content.speaking,
  };
}

/**
 * Fetch one test by id. Returns undefined when the row does not exist, which
 * is the same contract the old synchronous `getCambridgeTest` had, so callers
 * keep working unchanged apart from awaiting it.
 *
 * Throws when Supabase itself fails (offline, RLS denial) so the page can tell
 * "this test is not in the book" apart from "we could not reach the server".
 */
export async function loadCambridgeTest(id: string | undefined): Promise<CambridgeTest | undefined> {
  if (!id) return undefined;

  const cached = testCache.get(id);
  if (cached) return cached;

  const { data, error } = await getSupabase()
    .from('cambridge_tests')
    .select('id, book, test, module, label, content, source')
    .eq('id', id)
    .maybeSingle();

  if (error) throw error;
  if (!data) return undefined;

  const test = toTest(data as CambridgeRow);
  testCache.set(id, test);
  return test;
}
