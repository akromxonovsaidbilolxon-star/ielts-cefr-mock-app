-- ============================================================================
--  Education Centre — Supabase setup
--
--  Run this ONCE in Supabase Dashboard → SQL Editor → New query → Run.
--  It is safe to re-run.
--
--  Requires: supabase/setup.sql (the `profiles` table and `is_owner()`).
--
--  WHAT THIS ADDS
--   1. academy_classes / class_students   — groups of students
--   2. academy_assignments                — homework set for a class
--   3. academy_submissions                — a student's hand-in + mark
--   4. academy_books                      — the book library
--   5. Storage buckets: academy-books, academy-submissions (both private)
--
--  HOW ACCESS WORKS
--   • Owners (teachers) have full control over everything.
--   • Students read their own classes, the books, the homework set for their
--     classes, and their own submissions.
--   • Students write ONLY their own submission, and only the answer, files and
--     timestamp columns — marks are teacher-only. The guard trigger below is
--     what enforces that: it rejects changes to points/feedback from anyone
--     who is not an owner, even if the row-level policy let the update through.
-- ============================================================================

-- ---------------------------------------------------------------- classes --
create table if not exists public.academy_classes (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  level      text not null default 'B2' check (level in ('A1','A2','B1','B2','C1','C2','Mixed')),
  schedule   text not null default '',
  color      text not null default 'brand' check (color in ('brand','accent','ok','warn')),
  created_at timestamptz not null default now()
);

create table if not exists public.class_students (
  class_id   uuid not null references public.academy_classes(id) on delete cascade,
  student_id uuid not null references public.profiles(id) on delete cascade,
  primary key (class_id, student_id)
);

create index if not exists class_students_student_idx on public.class_students(student_id);

-- ------------------------------------------------------------- assignments --
create table if not exists public.academy_books (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  author      text not null default '',
  subject     text not null default '',
  level       text not null default 'B2' check (level in ('A1','A2','B1','B2','C1','C2','Mixed')),
  description text not null default '',
  cover_color text not null default 'brand' check (cover_color in ('brand','accent','ok','warn','bad')),
  file_name   text,
  file_size   bigint,
  file_type   text,
  file_path   text,
  uploaded_by uuid references public.profiles(id) on delete set null,
  created_at  timestamptz not null default now()
);

create table if not exists public.academy_assignments (
  id          uuid primary key default gen_random_uuid(),
  class_id    uuid not null references public.academy_classes(id) on delete cascade,
  title       text not null,
  description text not null default '',
  due_at      date not null,
  max_points  integer not null default 10 check (max_points between 1 and 1000),
  book_id     uuid references public.academy_books(id) on delete set null,
  created_at  timestamptz not null default now()
);

create index if not exists academy_assignments_class_idx on public.academy_assignments(class_id);

-- ------------------------------------------------------------- submissions --
create table if not exists public.academy_submissions (
  id            uuid primary key default gen_random_uuid(),
  assignment_id uuid not null references public.academy_assignments(id) on delete cascade,
  student_id    uuid not null references public.profiles(id) on delete cascade,
  body          text not null default '',
  files         jsonb not null default '[]'::jsonb,
  submitted_at  timestamptz not null default now(),
  points        numeric(6,2),
  feedback      text not null default '',
  graded_at     timestamptz,
  unique (assignment_id, student_id)
);

create index if not exists academy_submissions_student_idx on public.academy_submissions(student_id);

-- ------------------------------------------------------------------ helper --
-- Is the signed-in user a student in this class?
create or replace function public.is_class_member(target_class uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.class_students cs
    where cs.class_id = target_class and cs.student_id = auth.uid()
  );
$$;

revoke all on function public.is_class_member(uuid) from public;
grant execute on function public.is_class_member(uuid) to authenticated;

-- Is the signed-in user a student on this assignment?
create or replace function public.owns_assignment(target_assignment uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.academy_assignments a
    join public.class_students cs on cs.class_id = a.class_id
    where a.id = target_assignment and cs.student_id = auth.uid()
  );
$$;

revoke all on function public.owns_assignment(uuid) from public;
grant execute on function public.owns_assignment(uuid) to authenticated;

-- ------------------------------------------------------------------- RLS ----
alter table public.academy_classes      enable row level security;
alter table public.class_students       enable row level security;
alter table public.academy_books        enable row level security;
alter table public.academy_assignments  enable row level security;
alter table public.academy_submissions  enable row level security;

-- classes ------------------------------------------------------------------
drop policy if exists "academy classes read"  on public.academy_classes;
drop policy if exists "academy classes write" on public.academy_classes;

create policy "academy classes read"
  on public.academy_classes for select to authenticated
  using (public.is_owner() or public.is_class_member(id));

create policy "academy classes write"
  on public.academy_classes for all to authenticated
  using (public.is_owner()) with check (public.is_owner());

-- class_students -----------------------------------------------------------
drop policy if exists "class students read"  on public.class_students;
drop policy if exists "class students write" on public.class_students;

create policy "class students read"
  on public.class_students for select to authenticated
  using (public.is_owner() or student_id = auth.uid());

create policy "class students write"
  on public.class_students for all to authenticated
  using (public.is_owner()) with check (public.is_owner());

-- books --------------------------------------------------------------------
drop policy if exists "books read"    on public.academy_books;
drop policy if exists "books teacher" on public.academy_books;

-- Every signed-in member of the centre can read the library.
create policy "books read"
  on public.academy_books for select to authenticated
  using (true);

create policy "books teacher"
  on public.academy_books for all to authenticated
  using (public.is_owner()) with check (public.is_owner());

-- assignments --------------------------------------------------------------
drop policy if exists "assignments read"    on public.academy_assignments;
drop policy if exists "assignments teacher" on public.academy_assignments;

create policy "assignments read"
  on public.academy_assignments for select to authenticated
  using (public.is_owner() or public.is_class_member(class_id));

create policy "assignments teacher"
  on public.academy_assignments for all to authenticated
  using (public.is_owner()) with check (public.is_owner());

-- submissions --------------------------------------------------------------
drop policy if exists "submissions read"   on public.academy_submissions;
drop policy if exists "submissions insert" on public.academy_submissions;
drop policy if exists "submissions update" on public.academy_submissions;
drop policy if exists "submissions delete" on public.academy_submissions;

create policy "submissions read"
  on public.academy_submissions for select to authenticated
  using (public.is_owner() or student_id = auth.uid());

create policy "submissions insert"
  on public.academy_submissions for insert to authenticated
  with check (
    (student_id = auth.uid() and public.owns_assignment(assignment_id))
    or public.is_owner()
  );

create policy "submissions update"
  on public.academy_submissions for update to authenticated
  using (public.is_owner() or student_id = auth.uid())
  with check (public.is_owner() or student_id = auth.uid());

create policy "submissions delete"
  on public.academy_submissions for delete to authenticated
  using (public.is_owner() or student_id = auth.uid());

-- ------------------------------------------------ marks are teacher-only ----
-- RLS cannot say "students may update their answer but not the mark" with a
-- policy alone. This trigger closes that hole: a non-owner may change body,
-- files and submitted_at, but any change to points/feedback/graded_at or to
-- the student/assignment it belongs to is rejected outright.
create or replace function public.guard_submission_marks()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if public.is_owner() then
    return new;
  end if;

  if new.points is distinct from old.points
     or new.feedback is distinct from old.feedback
     or new.graded_at is distinct from old.graded_at then
    raise exception 'Only a teacher can grade this submission.';
  end if;

  if new.student_id is distinct from old.student_id
     or new.assignment_id is distinct from old.assignment_id then
    raise exception 'A submission cannot be moved to another student or assignment.';
  end if;

  return new;
end;
$$;

drop trigger if exists guard_submission_marks on public.academy_submissions;
create trigger guard_submission_marks
  before update on public.academy_submissions
  for each row execute function public.guard_submission_marks();

-- ----------------------------------------------------------------- grants ---
grant select, insert, update, delete on public.academy_classes     to authenticated;
grant select, insert, update, delete on public.class_students      to authenticated;
grant select, insert, update, delete on public.academy_books       to authenticated;
grant select, insert, update, delete on public.academy_assignments to authenticated;
grant select, insert, update, delete on public.academy_submissions to authenticated;

-- ============================================================================
--  STORAGE
--  Two private buckets. Books are licensed material, so nothing is public:
--  the app requests short-lived signed URLs, and students only ever receive
--  URLs for the files they open.
-- ============================================================================

insert into storage.buckets (id, name, public)
values ('academy-books', 'academy-books', false)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('academy-submissions', 'academy-submissions', false)
on conflict (id) do nothing;

-- Bucket policies -------------------------------------------------------------
drop policy if exists "academy books read"   on storage.objects;
drop policy if exists "academy books write"  on storage.objects;
drop policy if exists "academy subs read"    on storage.objects;
drop policy if exists "academy subs write"   on storage.objects;

-- Any signed-in member may read books (they still need a signed URL).
create policy "academy books read"
  on storage.objects for select to authenticated
  using (bucket_id = 'academy-books');

create policy "academy books write"
  on storage.objects for all to authenticated
  using (bucket_id = 'academy-books' and public.is_owner())
  with check (bucket_id = 'academy-books' and public.is_owner());

-- Homework uploads are namespaced by user id: <uid>/<timestamp>-<name>.
create policy "academy subs read"
  on storage.objects for select to authenticated
  using (
    bucket_id = 'academy-submissions'
    and (public.is_owner() or (storage.foldername(name))[1] = auth.uid()::text)
  );

create policy "academy subs write"
  on storage.objects for insert to authenticated
  with check (
    bucket_id = 'academy-submissions'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "academy subs delete" on storage.objects;
create policy "academy subs delete"
  on storage.objects for delete to authenticated
  using (
    bucket_id = 'academy-submissions'
    and (public.is_owner() or (storage.foldername(name))[1] = auth.uid()::text)
  );

-- ============================================================================
--  VERIFY
-- ============================================================================
-- select * from public.academy_classes order by created_at;
-- select * from public.academy_assignments order by due_at;
-- select * from public.academy_submissions order by submitted_at desc;
