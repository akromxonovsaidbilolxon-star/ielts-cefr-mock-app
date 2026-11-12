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
- Web Crypto (PBKDF2-SHA256) for password hashing; PWA manifest + icons for
  home-screen installation

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
    storage.ts      localStorage history + draft checkpoints
    lastResult.ts   sessionStorage reviewers for the results page
  components/       Layout, QuestionBlock, AudioPlayer, BarChart, ExamShell, Icons
  pages/            Home, ListeningExam, ReadingExam, WritingExam, SpeakingExam,
                    Results, Progress, NotFound
  hooks/            useCountdown
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

The app is private: every exam route requires a signed-in account, and only the
**owner** can create accounts, block people, set expiry dates and read the
activity log.

### How it works

```
Sign-in  →  PBKDF2-SHA256 (210k iterations)  →  session (12h, 60m idle timeout)
```

- Passwords are **never stored in plain text** — only a per-user random salt and
  a PBKDF2 hash.
- Failed attempts are throttled: 5 wrong passwords locks that username for
  5 minutes.
- Accounts can be suspended or given an expiry date.
- Every sign-in, failure and block is written to an on-device activity log.

### Step 1 — create the owner account

Open `/#/setup` on the deployed app (or locally), choose a username and password.
This creates the owner and unlocks the **Owner panel** at `/#/admin`.

### Step 2 — publish the rules so they apply on every device

The account from Step 1 lives in that browser only. To enforce access on every
phone and computer, the roster must be **baked into the build**:

1. Open **Owner panel → Publish access rules** and copy the generated line.
2. Create `.env.production` in the project root and paste it in:
   ```
   VITE_ACCESS_ROSTER=<long base64 string>
   ```
3. Rebuild and redeploy (`npm run build`, or push to trigger the Pages workflow).

Once a roster is baked in, the app shows *"This app is private"* and the owner
panel reports the rules as published. From that point the roster can only be
changed by editing the deployment — which is exactly what makes you the only
person who decides who gets in.

### Managing people from the terminal

```bash
npm run access:list -- --file .env.production
npm run access:add  -- --file .env.production --user mariam --name "Mariam T" --password "Temp1234"
npm run access:hash -- --password "NewPass123"      # for a manual edit
```

Editing an existing username rewrites that person's password. Then rebuild and
redeploy for the change to take effect.

### Security limits — read this

This is a **static site**, so the access check runs in the visitor's browser.
A determined person can inspect the JavaScript and bypass the login screen. The
roster is a strong door lock, not a vault:

| Threat | Protected? |
| --- | --- |
| Someone opening the link without credentials | ✅ Yes |
| Casual sharing of the URL | ✅ Yes |
| Password reuse leaking your users' passwords | ✅ Yes — only hashes leave the server |
| Someone reading the JS bundle to find the content | ❌ No |
| A targeted attacker who knows web development | ❌ No |

Use it to control a class, a study group or a client — **not** for confidential
material. The README section below explains how to make it genuinely private.

### Locking it down properly

If you need real enforcement, put the app behind something that checks requests
on a server. All work without changing any app code:

- **Cloudflare Access** (free for up to 50 users) — email one-time-PIN login in
  front of the Pages deployment. This is the best option for a real classroom.
- **Netlify Identity / password protection** on paid plans.
- **Vercel password protection** on Pro.
- A tiny Express/Fastify proxy that checks a session cookie before serving
  `dist/`.

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

### ⚠️ Order matters

The deployed build **must** contain your access roster, otherwise the app
launches unlocked and asks the first visitor to become the owner. So set the
secret **before** you merge to `main`.

### Steps

**1. Create your owner account locally**

```bash
npm run access:add -- --file .env.production --user owner --name "Your Name" \
  --password "YourStrongPass1" --role owner
```

Add everyone else the same way (omit `--role owner`):

```bash
npm run access:add -- --file .env.production --user mariam --name "Mariam T" \
  --password "Temp1234" --expires 2026-12-31
```

Check the result:

```bash
npm run access:list -- --file .env.production
```

**2. Store the roster as a repository secret**

Copy the single line inside `.env.production` (it starts with
`VITE_ACCESS_ROSTER=`) and paste **only the value** — everything after the `=`
— into:

> GitHub → **Settings → Secrets and variables → Actions → New repository secret**
> Name: `VITE_ACCESS_ROSTER`

The workflow reads it and builds a protected bundle. If the secret is missing
the deploy still runs but prints a loud **“Deploying UNLOCKED build”** warning;
if the secret is malformed the job **fails** instead of publishing.

**3. Enable Pages**

> **Settings → Pages → Build and deployment → Source → GitHub Actions**

**4. Merge to `main`**

The workflow deploys. Your site is then live at:

```
https://<your-username>.github.io/ielts-cefr-mock-app/
```

You can also trigger it manually from **Actions → Deploy to GitHub Pages → Run
workflow** and pick a branch.

**5. Verify**

Open the URL. You should see the sign-in screen with *“This app is private.”*
If you see *“Set up owner access”* instead, the secret did not load — check the
action log for the unlock warning.

> `base: './'` in `vite.config.ts` means the same build works at `/`, at
> `/ielts-cefr-mock-app/`, or on any other static host with no changes.

### Updating access later

1. `npm run access:add -- --file .env.production --user newperson --password "Temp1234"`
2. Update the `VITE_ACCESS_ROSTER` secret with the new value.
3. Re-run the workflow (or push any commit to `main`).

Removing a person works the same way: delete their entry, or set
`"status": "suspended"`.

### Other hosting options

Everything is static, so any host works — build with `npm run build` and serve
`dist/`. All of these let you set `VITE_ACCESS_ROSTER` as an environment
variable:

| Host | Build command | Publish directory | Env var location |
| --- | --- | --- | --- |
| **Netlify** | `npm run build` | `dist` | Site settings → Environment variables |
| **Vercel** | `npm run build` | `dist` | Settings → Environment Variables |
| **Cloudflare Pages** | `npm run build` | `dist` | Settings → Variables and Secrets |

Quickest possible demo (no account):

```bash
npm run build
# drag the dist/ folder onto https://app.netlify.com/drop
```

Without the env var that build is unlocked — fine for a private demo, not for
sharing.

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

1. Add each person with `npm run access:add`.
2. Publish the updated roster (step 2 above).
3. Send each person the URL plus **their own** username and temporary password.

Everyone gets separate credentials, so you can revoke one person without
affecting the others, and the activity log shows who signed in.

### Sharing safely — read this

The login screen stops people who do not have an account, but because the app is
static the check runs in their browser and a determined visitor can bypass it.
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
