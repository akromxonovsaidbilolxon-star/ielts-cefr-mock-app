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

A deployment workflow is included at `.github/workflows/deploy.yml`. It builds the
app, type-checks it and publishes `dist/` to GitHub Pages on every push to `main`.

### One-time setup (needs repo admin — do this in the browser)

1. Open **Settings → Pages** in the repository.
2. Under **Build and deployment → Source**, choose **GitHub Actions**.
3. Push to `main` (or run the workflow manually from the **Actions** tab).

The site appears at:

```
https://<your-username>.github.io/ielts-cefr-mock-app/
```

No extra configuration is needed for the subpath: `vite.config.ts` sets
`base: './'`, so the same build works at `/`, at `/ielts-cefr-mock-app/`, or from
any other static host.

> **Note:** the workflow runs on pushes to `main`. If your work is on a feature
> branch, merge it into `main` first, otherwise no deployment is triggered.

### Other hosting options

Because the whole app is static, any static host works — the only requirement is
that you run `npm run build` and serve the `dist/` folder.

| Host | Publish step | Notes |
| --- | --- | --- |
| **Netlify** | Build command `npm run build`, publish directory `dist` | Free, custom domain, auto-deploys from Git |
| **Vercel** | Framework preset **Vite**, output `dist` | Same idea as Netlify |
| **Cloudflare Pages** | Build command `npm run build`, output `dist` | Generous free tier |
| **GitHub Pages** | See above | Free, URL tied to the repo |

Simplest manual option — build locally and drag-drop the folder:

```bash
npm run build
# then drag the generated dist/ folder onto https://app.netlify.com/drop
```

Because routing uses `HashRouter` (`/#/reading`), no server-side rewrite rules are
required on any host — deep links work out of the box.

## Accuracy note

This is a study tool, not an official test. Listening and Reading bands are
calculated from the standard conversion tables and are close to what a real test
would give for the same raw score. Writing and Speaking cannot be marked
reliably by software: Writing is estimated from measurable text features and
Speaking is self-assessed. Treat both as revision guidance, not as a score.

Exam content is original and written for this project. The app is not affiliated
with or endorsed by the IELTS test owners.
