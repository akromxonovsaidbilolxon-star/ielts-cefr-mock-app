-- ============================================================================
--  IELTS / CEFR Mock Exam — Cambridge book content (private)
--
--  Run this ONCE in Supabase Dashboard → SQL Editor → New query → Run.
--  It is safe to re-run.
--
--  WHY THIS EXISTS
--  The Cambridge passages were previously compiled into the JavaScript
--  bundle, which meant anyone could read 15,000 words of copyrighted book
--  text without signing in. This table moves that text behind the database
--  and behind Row Level Security, so it is never shipped to a browser that
--  has not been authenticated.
--
--  WHAT THIS DOES
--   1. Creates `cambridge_tests` — one row per test, holding the whole
--      test (passages + questions) as JSON.
--   2. Turns on RLS so an ANONYMOUS visitor gets zero rows.
--   3. Grants read access only to signed-in, active accounts.
-- ============================================================================

create table if not exists public.cambridge_tests (
  -- e.g. 'c13-t3'. Same id the app already uses in URLs and in localStorage.
  id          text primary key,
  book        integer     not null,
  test        integer     not null,
  module      text        not null default 'academic'
                          check (module in ('academic', 'general')),
  label       text        not null,

  -- The transcribed test: listening sections, reading passages, writing
  -- tasks, speaking parts. Stored as one document because the app always
  -- loads a whole test, never a single question.
  content     jsonb       not null,

  -- Rights notice shown on every page of the test.
  source      jsonb       not null,

  updated_at  timestamptz not null default now(),

  unique (book, test, module)
);

create index if not exists cambridge_tests_book_idx
  on public.cambridge_tests (book desc, test);

-- ------------------------------------------------------------------ RLS --
alter table public.cambridge_tests enable row level security;

-- An anonymous visitor must get nothing. No policy for `anon` is created at
-- all, which is what enforces that; RLS denies by default.

drop policy if exists "signed-in members read tests" on public.cambridge_tests;
create policy "signed-in members read tests"
  on public.cambridge_tests for select
  to authenticated
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid()
        and p.status = 'active'
    )
  );

-- Writes are owner-only. The app never writes content from the browser —
-- it is loaded by the migration script — so this is a safety net only.
drop policy if exists "owner writes tests" on public.cambridge_tests;
create policy "owner writes tests"
  on public.cambridge_tests for all
  to authenticated
  using (public.is_owner())
  with check (public.is_owner());

-- ------------------------------------------------------------------ grants --
-- Supabase grants table privileges to anon/authenticated by default; revoke
-- the anonymous one explicitly so a future policy mistake cannot leak text.
revoke all on public.cambridge_tests from anon;
grant select on public.cambridge_tests to authenticated;
