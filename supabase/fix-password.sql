-- ============================================================================
--  Reset a password — run this in Supabase → SQL Editor
--
--  Use this when someone cannot sign in and the dashboard is not convenient,
--  or when you need to hand a student a known password.
--
--  HOW TO USE
--   1. Fill in the two values in the "SET THESE" block below.
--   2. Run STEP 1 — it only reads, and tells you whether the account is
--      confirmed, suspended, missing a profile, or not an owner.
--   3. If STEP 1 looks right, run STEP 2 to set the password.
--   4. Sign in with the new password.
--
--  This file changes nothing until you uncomment and run STEP 2.
-- ============================================================================

-- ============================== SET THESE ===================================
-- The email the person signs in with (it must match auth.users exactly).
\set target_email 'akromxonovsaidbilolxon@gmail.com'

-- The new password. Use at least 12 characters, mixed case + a number.
-- Never put a real password in a file you commit to Git.
\set new_password 'ChangeMe-2026!'

-- ============================================================================
--  STEP 1 — INSPECT (safe to run, changes nothing)
-- ============================================================================

select
  u.id,
  u.email,
  (u.email_confirmed_at is not null) as email_confirmed,
  u.last_sign_in_at,
  p.role,
  p.status,
  (p.id is not null) as has_profile
from auth.users u
left join public.profiles p on p.id = u.id
where lower(u.email) = lower('akromxonovsaidbilolxon@gmail.com');

-- Reading the result:
--   no rows                 → that email has no account. Create it instead:
--                             Authentication → Users → Add user.
--   email_confirmed = false → sign-in fails with "confirm your email".
--                             STEP 2 below no longer has this problem: it also
--                             marks the address confirmed.
--   has_profile = false      → the app refuses entry even with a correct
--                             password. Run supabase/setup.sql, then the
--                             backfill at the bottom of it.
--   status = 'suspended'     → the app signs them out. Run STEP 3.
--   role = 'student'         → they can sign in but see no owner panel.
--                             Run STEP 3 if this person should be an owner.

-- ============================================================================
--  STEP 2 — SET THE PASSWORD
--  Uncomment (remove the leading "-- ") and run.
-- ============================================================================

-- update auth.users
-- set
--   encrypted_password = crypt('ChangeMe-2026!', gen_salt('bf')),
--   email_confirmed_at = coalesce(email_confirmed_at, now()),
--   updated_at = now()
-- where lower(email) = lower('akromxonovsaidbilolxon@gmail.com');

-- If you get:  function gen_salt(unknown) does not exist
-- then pgcrypto lives in the extensions schema on your project. Use this
-- version instead (note the "extensions." prefix on both functions):

-- update auth.users
-- set
--   encrypted_password = extensions.crypt('ChangeMe-2026!', extensions.gen_salt('bf')),
--   email_confirmed_at = coalesce(email_confirmed_at, now()),
--   updated_at = now()
-- where lower(email) = lower('akromxonovsaidbilolxon@gmail.com');

-- ============================================================================
--  STEP 3 — MAKE SURE THE APP WILL ACTUALLY LET THEM IN
--  A correct password is not enough: the app requires an active profile row,
--  and the owner panel requires role = 'owner'.
-- ============================================================================

-- update public.profiles
-- set role = 'owner', status = 'active'
-- where lower(email) = lower('akromxonovsaidbilolxon@gmail.com');

-- ============================================================================
--  STEP 4 — VERIFY
--  The password check must return true.
-- ============================================================================

-- select
--   email,
--   encrypted_password = crypt('ChangeMe-2026!', encrypted_password) as password_is_correct
-- from auth.users
-- where lower(email) = lower('akromxonovsaidbilolxon@gmail.com');

-- ============================================================================
--  NOTES
--
--  • This is the same bcrypt hash mechanism Supabase Auth uses, so the new
--    password works immediately in the app with no restart or redeploy.
--  • Existing sessions stay signed in. To force everyone out:
--        delete from auth.sessions where user_id = (select id from auth.users
--        where email = 'akromxonovsaidbilolxon@gmail.com');
--    (Only do that if a password was leaked.)
--  • Supabase Dashboard password ≠ app password. The dashboard login at
--    supabase.com is a separate account; if that one is locked, use
--    "Forgot password" on the supabase.com sign-in page with this same email.
--  • Names with the "extensions." prefix depend on your project's setup; try
--    the plain version first, then the prefixed one.
-- ============================================================================
