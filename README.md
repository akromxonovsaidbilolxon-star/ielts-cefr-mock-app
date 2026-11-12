# IELTS / CEFR Mock Exam

A complete, self-contained IELTS practice app with all four skills and a CEFR
level estimate. Everything runs in the browser — no backend, no accounts, no
API keys.

## Features

| Skill | What you get | Scoring |
| --- | --- | --- |
| **Listening** | 4 parts, 40 questions, realistic transcripts read aloud by the browser's speech engine, Pause/Rewind and speed control | Official raw-score → band table |
| **Academic Reading** | 3 passages, 40 questions (True/False/Not Given, Yes/No/Not Given, MCQ, matching, summary completion) with a side-by-side passage/question layout | Official raw-score → band table |
| **Writing** | Task 1 report from an SVG data chart + Task 2 essay, live word count and countdown | Heuristic feedback on length, paragraphing, lexical range, cohesion and sentence variety; Task 2 weighted ×2 |
| **Speaking** | All 3 parts, cue card, 1-minute prep timer, 2-minute long turn, optional microphone recording | Self-assessment against the four IELTS criteria |

Other features:

- **Band → CEFR mapping** (A1–C2) with the descriptive scale on the home page
- **Progress tracking**: every attempt is saved to `localStorage`, with history
  table, per-skill bests, a band-over-time trend chart and a skill comparison bar
- **Detailed answer review** immediately after a Listening or Reading test, with
  correct answers and an explanation for every question
- **Crash protection**: answers and the timer are checkpointed to `localStorage`,
  so an accidental refresh mid-test does not lose work
- Fully responsive, keyboard accessible, print stylesheet included

## Getting started

```bash
npm install
npm run dev      # http://localhost:5173
```

```bash
npm run build    # type-check + production build into dist/
npm run preview  # serve the production build
npm run typecheck
```

## Tech stack

- **React 19** + **TypeScript** (strict) + **Vite 7**
- **react-router-dom** with `HashRouter`, so deep links work on any static host
- Hand-written CSS design system — no UI framework, no chart library
  (the bar chart and trend chart are plain SVG)
- Web Speech API for listening audio, MediaRecorder for speaking practice
- Supabase Auth (email + password) with Postgres Row Level Security for access
  control; PWA manifest + icons for home-screen installation

## Project layout

```
src/
  content/          exam material
    listening.ts    4 parts, scripts + question groups
    reading.ts      3 academic passages + 40 questions
    writing.ts      2 tasks (chart spec for Task 1)
    speaking.ts     3 parts + cue card
  lib/
    scoring.ts      band tables, CEFR mapping, answer matching, writing feedback
    storage.ts      localStorage history + draft checkpoints (per-user)
    lastResult.ts   sessionStorage reviewers for the results page
    supabase.ts     Supabase client + profile queries
    currentUser.ts  tracks who is signed in so storage keys are namespaced
    voices.ts       ranks installed voices so audio is not robotic
    audioManifest.ts  registers real recordings, falls back to speech
  auth/             AuthProvider (Supabase session) + route guards
  components/       Layout, QuestionBlock, AudioPlayer, BarChart, ExamShell, Icons,
                    StorageMigration
  pages/            Home, Login, Admin, ListeningExam, ReadingExam, WritingExam,
                    SpeakingExam, Results, Progress, NotFound
  hooks/            useCountdown
supabase/
  setup.sql         tables, RLS policies, owner role, auto-profile trigger
scripts/
  preflight.mjs     checks credentials, build output and mobile assets
  audio-manifest.mjs  scans public/audio/ and regenerates the manifest
```

## How marking works

1. **Raw score** — Listening and Reading are marked against the answer key.
   Answer matching tolerates case, punctuation, articles (`a`/`an`/`the`),
   spelled-out numbers (`twenty-two` = `22`), currency symbols and `"answer|alternative"`
   alternatives, but still requires correct spelling for key nouns.
2. **Band** — raw scores convert through the standard IELTS band tables.
3. **CEFR** — bands map to levels: `≥8.5 → C2`, `≥7.0 → C1`, `≥5.5 → B2`,
   `≥4.0 → B1`, `≥3.0 → A2`, otherwise `A1`.
4. **Overall** — the mean of the skills attempted, rounded to the nearest half band,
   exactly as IELTS rounds an overall score.

## Two separate exams

The app contains **two independent exams**, each with its own question bank,
timings, scoring and saved results. They never share content or history.

| | **IELTS Mock** | **Uzbekistan Multilevel (CEFR)** |
| --- | --- | --- |
| Listening | 4 parts · 40 questions · 30 min | **6 parts · 35 questions · 45 min** |
| Reading | 3 passages · 40 questions · 60 min | **5 parts · 35 questions · 60 min** |
| Writing | 2 tasks · 60 min | **2 parts · 3 tasks · 60 min** |
| Speaking | 3 parts · ~14 min | **4 stages · 8 windows · ~15 min** |
| Result | IELTS band 0–9 | **Score /75 → B1, B2 or C1** |

### Multilevel format

Built to the national certificate specification:

- **Listening** — six parts, 35 questions. Each recording is played **twice**,
  with 15–30 seconds to read ahead. 45 minutes including answer transfer.
- **Reading** — five parts, 35 questions, graded from short notices (A1–A2) to
  an academic text (C1). 60 minutes including transfer.
- **Writing** — two parts, three tasks, all inside one shared 60-minute timer:
  - Part 1 · Task 1.1 — informal email, **~50 words**
  - Part 1 · Task 1.2 — formal email, **120–150 words** (same situation)
  - Part 2 · Task 2 — discussion post, **180–200 words**
  - The shared source message sits above Tasks 1.1 and 1.2, and each task has its
    own answer box and live word counter.
- **Speaking** — four stages, **eight recording windows**:

  | Stage | Level | Task | Prep | Window |
  | --- | --- | --- | --- | --- |
  | 1.1 | A1–A2 | 3 personal questions, one at a time | none | 30 s each |
  | 1.2 | B1 | 3 questions on two pictures, one at a time | none | 45 s, then 30 s ×2 |
  | 2 | B2 | one response covering 3 related questions | 60 s | 2 min |
  | 3 | C1 | analyse both sides of a statement | 60 s | 2 min |

### How the Multilevel score works

Every section is scored out of **75**, and the overall result is the **average of
the four sections**:

| Level | Overall score |
| --- | --- |
| C1 | 65 – 75 |
| B2 | 51 – 64 |
| B1 | 38 – 50 |
| Below B1 | 0 – 37 |

There is **no C2** on this certificate — the exam contains no C2 tasks. A1 and A2
appear only as general CEFR reference points, never as awards.

Raw Listening/Reading marks are converted with a curve calibrated on the
published thresholds (18/35 → 38, 24/35 → 51, 28/35 → 65, 35/35 → 75). The real
exam uses a Rasch model, so treat the section score as a close approximation.

### Exam Mode and Practice Mode

- **Exam Mode** — everyone starts at Part 1 and follows the fixed section order,
  task types and timings. Answers never change what comes next.
- **Practice Mode** — choose a starting level per skill (B1, B2 or C1). After
  each set the next one adapts: 80% or more moves you up, 40% or less moves you
  down.

`partNumber` and `difficulty` are deliberately **separate fields**:

```ts
interface MlQuestion {
  number: number;
  difficulty: 'A1' | 'A2' | 'B1' | 'B2' | 'C1';  // level of the material
  // ...
}
interface MlListeningPart {
  partNumber: number;   // exam task FORMAT: 1-6
  difficulty: MlLevel;  // level of THIS set
}
```

So "Listening Part 1 at B2" is a valid practice set — same task format, harder
material — which is exactly how the app keeps format and difficulty independent.

### Project layout (Multilevel)

```
src/content/multilevel/
  types.ts      MlQuestion, MlListeningPart, MlReadingPart, MlSpeakingStage
  listening.ts  6 parts, 35 questions
  reading.ts    5 parts, 35 questions
  writing.ts    shared source message + 3 tasks
  speaking.ts   4 stages, 8 windows
  index.ts      re-exports + official section specs
src/lib/
  multilevel.ts 0-75 scoring, band tables, descriptors, task weights
  mlStorage.ts  Multilevel history and practice state (separate keys)
  mlPractice.ts part/difficulty options and adaptive level logic
  mlReview.ts   post-test answer review
src/pages/
  MlHome.tsx     hub with Exam/Practice mode switch
  MlListening.tsx  MlReading.tsx  MlWriting.tsx  MlSpeaking.tsx
  MlResults.tsx    MlProgress.tsx
```

## Access control (login)

The app is private. Every exam route requires a signed-in account, and only the
**owner** can add, suspend or promote people. Accounts live in **Supabase Auth**,
so changes apply to every phone and computer immediately — no rebuild, no
redeploy.

### How it works

```
Browser  →  Supabase Auth (email + password)  →  JWT
             ↓
      profiles table  (role: owner | student, status: active | suspended)
             ↓
      Row Level Security — checked by Postgres on every query
```

Three things enforce this, in order of importance:

1. **Row Level Security (RLS)** in Postgres. This is the real boundary. Even
   someone who reverse-engineers the JavaScript bundle cannot read other
   accounts or change their own role.
2. **`profiles` rows are never created from the browser.** New rows appear via a
   trigger when the owner adds a user. There is no INSERT policy, so a visitor
   cannot create an account for themselves.
3. **The UI** hides owner-only screens. Convenience, not security.

### What the owner can do

| Action | Where | Effect |
|---|---|---|
| Add someone | Supabase → Authentication → Users | Account is created, they can sign in |
| Reset a password | Supabase → Authentication → Users | They sign in with the new one |
| Suspend / reactivate | App → Owner panel → People | Instantly blocked or restored |
| Promote to owner | App → Owner panel → People | Full admin rights — trust carefully |
| Delete permanently | Supabase → Authentication → Users | Profile is removed automatically |

Suspending does **not** delete their results — those live on their own device.

### One-time setup

**1. Create the Supabase project**

Go to [supabase.com](https://supabase.com) → **New project**. Free tier covers
50,000 monthly users, which is far more than a classroom needs.

**2. Run the database setup**

Open **SQL Editor** → **New query** → paste the contents of
[`supabase/setup.sql`](supabase/setup.sql) → **Run**.

This creates the `profiles` table, the RLS policies, `is_owner()`, and the
trigger that creates a profile whenever you add a user. It is safe to re-run.

**3. Make yourself the owner**

Replace the email with your own and run it in the SQL Editor:

```sql
update public.profiles set role = 'owner' where email = 'you@example.com';
```

Do this **before** adding a second person, or you will have no admin access.

**4. Create the first account**

**Authentication → Users → Add user → Create new user**. Enter the email and a
password, and tick **Auto Confirm User** so they can sign in immediately.

**5. Turn off public sign-up**

**Authentication → Sign In / Providers** → disable **Allow new users to sign
up**. Without this, anyone who finds your project URL could register their own
account. Hiding the button in the app is not enough — the API stays open.

**6. Give the app its credentials**

**Project Settings → API**, copy the **Project URL** and the **anon / public
key**. Put them in `.env.production`:

```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOi...
```

Then `npm run build`. `npm run preflight` verifies both are present and that you
have not accidentally pasted the service role key.

### Which key goes where

| Key | Safe in the browser? | Use |
|---|---|---|
| **anon / public** | ✅ Yes — this is its purpose | `VITE_SUPABASE_ANON_KEY` |
| **service_role** | ❌ **Never** — bypasses every RLS policy | Supabase dashboard only |

`preflight` and the GitHub Actions workflow both **refuse to publish** if the
service role key is detected in the bundle. That mistake would give anyone who
opens the app full read/write access to your database.

### A note on what this protects

Because this is a static app with no backend, a determined person who extracts
the anon key could still read the *public* parts of your Supabase project. What
they cannot do is see other people's accounts, change roles, or create users —
RLS blocks all of it at the database, not in the browser.

For a classroom this is more than sufficient. If you later need stronger
guarantees, add rate limiting and Turnstile/bot protection in Supabase
(**Authentication → Attack Protection**).


## Mobile app (Android & iOS)

The app is a **Progressive Web App**: it can be installed to the home screen and
runs full-screen, without an app store, an APK or an Xcode build.

### What is included

- `public/manifest.webmanifest` — name, icons, theme colour, portrait
  orientation, `display: standalone` and three home-screen shortcuts
  (Listening, Reading, Progress).
- Icons: 192, 512 and a **maskable** 512 for Android adaptive icons, plus
  152/167/180 Apple touch icons for iOS.
- iOS meta tags (`apple-mobile-web-app-*`, `black-translucent` status bar) so the
  installed app looks native.
- A fixed **bottom tab bar** on phones with icons for every section — the
  desktop top navigation is hidden below 720px.
- Safe-area insets (`env(safe-area-inset-*)`) so nothing hides behind the iPhone
  notch or home indicator.
- 16px form inputs to stop iOS zooming the page when a field is focused.
- Minimum 44px tap targets (Apple HIG) and 48px on key controls (Material).
- Reduced padding, stacked grids and scrollable passages for small screens,
  plus specific tuning for ≤380px phones and landscape mode.

### Installing it

**Android (Chrome):** open the site → menu → **Add to Home screen / Install app**.
You can also scan the deployed URL with **PWABuilder** to wrap it as an APK/AAB
for the Play Store.

**iPhone / iPad (Safari):** open the site → **Share** → **Add to Home Screen**.
(iOS does not allow the install prompt from Chrome — Safari only.)

### Note on offline use

A service worker is **not** registered, so the app needs a connection to load.
Adding one would cache the shell and make exams work offline; the trade-off is
that you must remember to update the cache version on every deploy, otherwise
users keep a stale build. Say the word and it can be added.

## Publishing (GitHub Pages)

The repo ships a workflow at `.github/workflows/deploy.yml` that type-checks,
builds and publishes `dist/` to GitHub Pages on every push to `main`.

### ⚠️ Set the secrets first

The workflow **refuses to deploy** without Supabase credentials, because a build
without them cannot sign anybody in.

### Steps

**1. Add the repository secrets**

On GitHub: **Settings → Secrets and variables → Actions → New repository
secret**. Add both:

| Name | Value |
|---|---|
| `VITE_SUPABASE_URL` | `https://your-project.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | the **anon / public** key |

> The anon key is meant to be public. It is *not* a secret in the security
> sense — RLS is what protects your data. Never put the **service_role** key
> here; the workflow rejects the build if it detects it.

**2. Enable GitHub Pages once**

**Settings → Pages → Source: GitHub Actions**. (This cannot be automated from a
workflow — GitHub requires a human to enable it the first time.)

**3. Push to `main`**

```bash
git push origin main
```

The workflow verifies the credentials, builds, checks the key is baked into the
bundle, and deploys. Results appear under **Actions**.

### If the site says "Sign-in is not configured"

The build did not receive the credentials. Check that both secrets exist and
that you built *after* adding them.

### If you see "Set up owner access"

That screen belonged to the old build-time roster and no longer exists. A page
still showing it is a stale deployment — force a fresh deploy, then hard-refresh
(Ctrl/Cmd+Shift+R).


## Sharing it with mobile devices

### Option A — Install as an app (recommended)

Once deployed, the URL is a **Progressive Web App**. Send people the link; once
they open it they can install it to their home screen:

**Android (Chrome / Edge)**
1. Open the link.
2. Tap the **⋮** menu → **Install app** (or **Add to Home screen**).
3. Confirm. An “IELTS Mock” icon appears in the app drawer, opening full-screen
   with no browser bars.

**iPhone / iPad (Safari — required)**
1. Open the link in **Safari** (Chrome on iOS cannot install PWAs).
2. Tap the **Share** button (square with an arrow).
3. Scroll and tap **Add to Home Screen** → **Add**.
4. Launch it from the home screen. It runs full-screen with a translucent status
   bar, matching the native look.

> **Important for iPhones:** the microphone-based Speaking recorder and password
> hashing both need a **secure context**. GitHub Pages, Netlify, Vercel and
> Cloudflare all serve HTTPS, so they work. A plain `http://192.168.x.x` address
> on your local network does **not** — see the caveat below.

### Option B — Share over the local network (no deploy at all)

Useful for testing on your own phone before publishing:

```bash
npm run dev
```

Vite prints a **Network** address, e.g. `http://192.168.1.42:5173`. Make sure the
phone is on the same Wi-Fi, then open that address.

**Two limitations on plain HTTP:**
- **iOS:** Safari will not install the PWA and Web Crypto is unavailable, so
  password hashing falls back to a weak mode (the app shows a warning banner).
- **Android:** installing from the menu is also restricted without HTTPS.

For anything beyond a quick check, deploy to HTTPS.

### Option C — Share with a QR code

Easiest way to get a link onto a phone in a classroom:

```bash
# prints a scannable QR code in the terminal
npx qrcode-terminal "https://your-name.github.io/ielts-cefr-mock-app/"
```

Or paste the URL into any online QR generator and project it on screen.

### Sharing with several people

1. Add each person in **Supabase → Authentication → Users → Add user**
   (tick **Auto Confirm User**).
2. Send each person the URL plus **their own** email and password.

Everyone gets separate credentials, so you can suspend one person without
affecting the others. The Owner panel lists everyone and their status.

### Sharing safely — read this

The login screen stops people who do not have an account. Because this is a
static app, the *interface* runs in the browser — but the data is protected by
Row Level Security in Postgres, so a visitor who tampers with the page still
cannot read other accounts or grant themselves a role.

What RLS does **not** hide is that a Supabase project exists, nor the public
anon key. Neither grants access to anything you have not allowed by policy —
but do not store anything confidential in a table without a policy that
restricts it.
For a classroom or study group that is fine. If the content is confidential, put
the deployment behind **Cloudflare Access** (free up to 50 users) or Netlify
password protection — see *Locking it down properly* above. Those options add a
real server-side check without changing any app code.

## Accuracy note

This is a study tool, not an official test. Listening and Reading bands are
calculated from the standard conversion tables and are close to what a real test
would give for the same raw score. Writing and Speaking cannot be marked
reliably by software: Writing is estimated from measurable text features and
Speaking is self-assessed. Treat both as revision guidance, not as a score.

Exam content is original and written for this project. The app is not affiliated
with or endorsed by the IELTS test owners.
