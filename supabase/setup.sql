-- ============================================================================
--  IELTS / CEFR Mock Exam — Supabase setup
--
--  Run this ONCE in Supabase Dashboard → SQL Editor → New query → Run.
--  It is safe to re-run.
--
--  WHAT THIS DOES
--   1. Creates a `profiles` table (one row per auth user).
--   2. Turns on Row Level Security so only owners can manage accounts.
--   3. Auto-creates a profile whenever you add a user in the dashboard.
--   4. Blocks the FIRST user from silently becoming owner.
-- ============================================================================

-- ---------------------------------------------------------------- profiles --
create table if not exists public.profiles (
  id           uuid primary key references auth.users(id) on delete cascade,
  email        text        not null,
  display_name text,
  role         text        not null default 'student' check (role in ('owner', 'student')),
  status       text        not null default 'active'  check (status in ('active', 'suspended')),
  created_at   timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- ------------------------------------------------------------- is_owner() --
-- SECURITY DEFINER is required: a policy on `profiles` that itself queries
-- `profiles` would recurse infinitely without it.
create or replace function public.is_owner()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid()
      and role = 'owner'
      and status = 'active'
  );
$$;

revoke all on function public.is_owner() from public;
grant execute on function public.is_owner() to authenticated;

-- ------------------------------------------------------------------ policies --
drop policy if exists "read own profile"  on public.profiles;
drop policy if exists "owner reads all"   on public.profiles;
drop policy if exists "owner updates all" on public.profiles;

-- Everyone can read their own row (used to load role/status after sign-in).
create policy "read own profile"
  on public.profiles for select
  to authenticated
  using (id = auth.uid());

-- Owners can read every row (the People tab).
create policy "owner reads all"
  on public.profiles for select
  to authenticated
  using (public.is_owner());

-- Owners can change role/status for anyone.
-- Note: `with check` is what actually prevents privilege escalation.
create policy "owner updates all"
  on public.profiles for update
  to authenticated
  using (public.is_owner())
  with check (public.is_owner());

-- Deliberately NO insert or delete policy:
--   rows are created by the trigger below, and deleted by cascade from
--   auth.users. A browser therefore cannot add or remove accounts.
revoke insert, delete on public.profiles from anon, authenticated;
grant select, update on public.profiles to authenticated;

-- ------------------------------------------------------- auto-create rows --
-- Runs whenever a user is created (dashboard, invite, or admin API).
-- New users are always 'student' — never owners. Promotion is explicit.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, display_name, role, status)
  values (
    new.id,
    coalesce(new.email, ''),
    coalesce(new.raw_user_meta_data->>'display_name', split_part(coalesce(new.email, ''), '@', 1)),
    'student',
    'active'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------- backfill existing rows --
insert into public.profiles (id, email, display_name, role, status)
select
  u.id,
  coalesce(u.email, ''),
  split_part(coalesce(u.email, ''), '@', 1),
  'student',
  'active'
from auth.users u
on conflict (id) do nothing;

-- ============================================================================
--  MAKE YOURSELF THE OWNER
--
--  Replace the email below with your own, then run just this statement:
-- ============================================================================
-- update public.profiles set role = 'owner' where email = 'you@example.com';

-- ============================================================================
--  VERIFY (should return exactly one owner row)
-- ============================================================================
-- select email, role, status from public.profiles order by created_at;
