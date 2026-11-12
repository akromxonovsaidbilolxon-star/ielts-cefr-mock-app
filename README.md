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
