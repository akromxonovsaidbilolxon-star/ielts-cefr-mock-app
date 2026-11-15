#!/usr/bin/env node
/**
 * Verifies the Cambridge content before it ships.
 *
 *   npm run check:cambridge
 *
 * Catches the mistakes that are easy to make when transcribing a book by hand:
 * a missing question number, a table blank that points at a question that does
 * not exist, a duplicated number, an answer that is not in its own option list,
 * and a mismatch with the official answer key.
 *
 * The expected keys below are the printed Cambridge answer keys for
 * Cambridge IELTS 13 Academic, Test 1. If a transcriber mistypes an answer this
 * fails, which is the whole point: wrong keys make the app worse than useless.
 */

import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const C = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  dim: '\x1b[2m',
  bold: '\x1b[1m',
};

let problems = 0;
const ok = (m) => console.log(`  ${C.green}✔${C.reset} ${m}`);
const bad = (m) => {
  problems += 1;
  console.log(`  ${C.red}✘${C.reset} ${m}`);
};
const info = (m) => console.log(`  ${C.dim}·${C.reset} ${m}`);
const section = (t) => console.log(`\n${C.bold}${t}${C.reset}`);

/* ------------------------------------------------------------------ */
/* 1. Official answer keys                                             */
/* ------------------------------------------------------------------ */

const KEY_LISTENING = {
  1: 'choose', 2: 'private', 3: '20', 4: 'healthy', 5: 'bones',
  6: 'lecture', 7: 'arretsa', 8: 'vegetarian', 9: 'market', 10: 'knife',
  11: 'B', 12: 'C', 13: 'B', 14: 'E', 15: 'D', 16: 'B', 17: 'G',
  18: 'C', 19: 'H', 20: 'I',
  21: 'A', 22: 'C', 23: 'B', 24: 'C', 25: 'B',
  26: 'G', 27: 'C', 28: 'H', 29: 'A', 30: 'E',
  31: 'crow', 32: 'cliffs', 33: 'speed', 34: 'brain(s)', 35: 'food',
  36: 'behaviour(s)', 37: 'new', 38: 'stress', 39: 'tail(s)', 40: 'permanent',
};

const KEY_READING = {
  1: 'update', 2: 'environment', 3: 'captain', 4: 'films', 5: 'season',
  6: 'accommodation', 7: 'blog',
  8: 'FALSE', 9: 'NOT GIVEN', 10: 'FALSE', 11: 'TRUE', 12: 'NOT GIVEN', 13: 'TRUE',
  14: 'iv', 15: 'vi', 16: 'i', 17: 'v', 18: 'viii', 19: 'iii',
  20: 'E', 21: 'B', 22: 'D', 23: 'A',
  24: 'focus', 25: 'pleasure', 26: 'curiosity',
  27: 'B', 28: 'C', 29: 'C', 30: 'D', 31: 'A',
  32: 'D', 33: 'A', 34: 'E', 35: 'C', 36: 'G', 37: 'B',
  38: 'YES', 39: 'NOT GIVEN', 40: 'NO',
};

/* ------------------------------------------------------------------ */
/* 2. Load the compiled content                                        */
/* ------------------------------------------------------------------ */

const dir = 'src/content/cambridge';

function sourceOf(file) {
  return readFileSync(join(dir, file), 'utf8');
}

section('1. Content files present');

const files = readdirSync(dir);
for (const need of ['types.ts', 'index.ts', 'c13-test1.ts', 'tables.ts', 'figures.ts']) {
  if (files.includes(need)) ok(need);
  else bad(`${need} is missing`);
}

/* The content is TypeScript; strip the types so plain node can read it. */
async function loadTest() {
  const { execSync } = await import('node:child_process');
  // Bundle just the content module to a temporary ES module.
  execSync(
    './node_modules/.bin/esbuild src/content/cambridge/index.ts --bundle --format=esm --outfile=/tmp/cam-content.mjs --log-level=error',
    { stdio: 'inherit' },
  );
  return import(`file:///tmp/cam-content.mjs?t=${Date.now()}`);
}

let mod;
try {
  mod = await loadTest();
} catch (err) {
  bad(`Could not load the content module: ${err.message}`);
  console.log(`\n${C.red}${problems} problem(s)${C.reset}\n`);
  process.exit(1);
}

const TEST = mod.C13_TEST1;

if (!TEST) {
  bad('C13_TEST1 is not exported from index.ts');
  process.exit(1);
}

/* ------------------------------------------------------------------ */
/* 3. Structure                                                        */
/* ------------------------------------------------------------------ */

section('2. Listening structure');

if (TEST.listening.length === 4) ok('4 sections');
else bad(`expected 4 listening sections, found ${TEST.listening.length}`);

for (const s of TEST.listening) {
  const nums = s.groups.flatMap((g) => g.questions.map((q) => q.number));
  const expected = 10;
  if (nums.length === expected) ok(`Section ${s.id}: ${nums.length} questions (${nums[0]}–${nums[nums.length - 1]})`);
  else bad(`Section ${s.id}: ${nums.length} questions, expected ${expected}`);

  if (s.audio?.driveId) ok(`Section ${s.id}: audio → ${s.audio.filename}`);
  else bad(`Section ${s.id}: no Drive audio registered`);
}

section('3. Reading structure');

if (TEST.reading.length === 3) ok('3 passages');
else bad(`expected 3 passages, found ${TEST.reading.length}`);

for (const p of TEST.reading) {
  const nums = p.groups.flatMap((g) => g.questions.map((q) => q.number));
  if (nums.length > 0) ok(`Passage ${p.id}: ${nums.length} questions (${nums[0]}–${nums[nums.length - 1]})`);
  else bad(`Passage ${p.id}: no questions`);
  if (p.paragraphs.length >= 1 && p.paragraphs.every((x) => x.text.length > 100))
    ok(`Passage ${p.id}: ${p.paragraphs.length} paragraphs, all with body text`);
  else bad(`Passage ${p.id}: a paragraph is empty or too short`);
}

/* ------------------------------------------------------------------ */
/* 4. Numbering: every 1–40 present exactly once                       */
/* ------------------------------------------------------------------ */

section('4. Question numbering');

function collectNumbers(groups) {
  return groups.flatMap((g) => g.questions.map((q) => q.number));
}

const listeningNums = TEST.listening.flatMap((s) => collectNumbers(s.groups));
const readingNums = TEST.reading.flatMap((p) => collectNumbers(p.groups));

function checkNumbers(nums, label) {
  const seen = new Map();
  for (const n of nums) seen.set(n, (seen.get(n) ?? 0) + 1);
  const missing = [];
  for (let i = 1; i <= 40; i += 1) if (!seen.has(i)) missing.push(i);
  const dupes = [...seen.entries()].filter(([, c]) => c > 1).map(([n]) => n);
  if (missing.length) bad(`${label}: missing question numbers ${missing.join(', ')}`);
  if (dupes.length) bad(`${label}: duplicated question numbers ${dupes.join(', ')}`);
  if (!missing.length && !dupes.length) ok(`${label}: 1–40 present exactly once`);
}

checkNumbers(listeningNums, 'Listening');
checkNumbers(readingNums, 'Reading');

/* ------------------------------------------------------------------ */
/* 5. Answers exist, and match the official key                        */
/* ------------------------------------------------------------------ */

section('5. Answer keys vs the printed Cambridge key');

function normalise(v) {
  return String(v)
    .toLowerCase()
    .replace(/\(s\)/g, '')
    .replace(/[^a-z0-9 ]/g, '')
    .trim();
}

function checkKey(groups, expected, label) {
  let checked = 0;
  for (const g of groups) {
    for (const q of g.questions) {
      const want = expected[q.number];
      if (!want) {
        bad(`${label} Q${q.number}: no official answer recorded`);
        continue;
      }
      if (!q.answer) {
        bad(`${label} Q${q.number}: no answer in the content`);
        continue;
      }
      const options = q.answer.split('|').map(normalise);
      const target = normalise(want);
      if (!options.includes(target)) {
        bad(`${label} Q${q.number}: content says "${q.answer}", official key says "${want}"`);
      } else {
        checked += 1;
      }
    }
  }
  if (checked === Object.keys(expected).length) ok(`${label}: all ${checked} answers match the official key`);
}

checkKey(TEST.listening.flatMap((s) => s.groups), KEY_LISTENING, 'Listening');
checkKey(TEST.reading.flatMap((p) => p.groups), KEY_READING, 'Reading');

/* ------------------------------------------------------------------ */
/* 6. Layout-specific integrity                                        */
/* ------------------------------------------------------------------ */

section('6. Layout integrity');

function allQuestions(groups) {
  return groups.flatMap((g) => g.questions);
}

for (const [label, groups] of [
  ['Listening', TEST.listening.flatMap((s) => s.groups)],
  ['Reading', TEST.reading.flatMap((p) => p.groups)],
]) {
  for (const g of groups) {
    const numbers = new Set(g.questions.map((q) => q.number));

    // Multiple choice: the book uses 3 options in Listening and 4 in Reading.
    // Whatever the count, the stored answer must be one of the letters shown.
    for (const q of g.questions) {
      if (q.type === 'mcq') {
        const count = q.options?.length ?? 0;
        if (count !== 3 && count !== 4) {
          bad(`${label} Q${q.number}: mcq needs 3 or 4 options, has ${count}`);
        } else {
          const letters = q.options.map((_, i) => String.fromCharCode(65 + i));
          if (!letters.includes(q.answer.split('|')[0])) {
            bad(`${label} Q${q.number}: mcq answer "${q.answer}" is not one of ${letters.join('/')}`);
          }
        }
      }
      if (q.type === 'select') {
        if (!q.options?.length) bad(`${label} Q${q.number}: select with no options`);
        else if (!q.answer.split('|').every((a) => q.options.includes(a.trim()))) {
          bad(`${label} Q${q.number}: answer "${q.answer}" is not one of its own options`);
        }
      }
    }

    // Table blanks must point at real questions in the group, and cover them all.
    if (g.layout === 'table' && g.table) {
      const blanks = new Set();
      for (const row of g.table.rows) {
        for (const cell of row.cells) {
          for (const m of cell.text.matchAll(/\{\{(\d+)\}\}/g)) blanks.add(Number(m[1]));
        }
      }
      const missing = [...numbers].filter((n) => !blanks.has(n));
      const extra = [...blanks].filter((n) => !numbers.has(n));
      if (missing.length) bad(`${label} ${g.id}: table has no blank for Q${missing.join(', ')}`);
      if (extra.length) bad(`${label} ${g.id}: table blank for Q${extra.join(', ')} which is not in this group`);
      if (!missing.length && !extra.length) ok(`${label} ${g.id}: ${blanks.size} table blanks match ${numbers.size} questions`);
    }

    // Flow charts: one blank per question, in order.
    if (g.layout === 'flow' && g.flow) {
      const found = [];
      for (const step of g.flow.steps) {
        for (const m of step.matchAll(/\{\{(\d+)\}\}/g)) found.push(Number(m[1]));
      }
      const expected = [...numbers];
      if (found.length !== expected.length || found.some((n, i) => n !== expected[i])) {
        bad(`${label} ${g.id}: flow blanks [${found.join(',')}] do not match questions [${expected.join(',')}]`);
      } else {
        ok(`${label} ${g.id}: ${found.length} flow-chart blanks in order`);
      }
    }
  }
}

/* ------------------------------------------------------------------ */
/* 7. Writing + Speaking                                               */
/* ------------------------------------------------------------------ */

section('7. Writing and Speaking');

const { task1, task2 } = TEST.writing;
if (task1.task === 1 && task1.minWords === 150 && task1.minutes === 20) ok('Task 1: 20 min / 150 words');
else bad(`Task 1 metadata wrong: ${JSON.stringify({ task: task1.task, minWords: task1.minWords, minutes: task1.minutes })}`);
if (task2.task === 2 && task2.minWords === 250 && task2.minutes === 40) ok('Task 2: 40 min / 250 words');
else bad(`Task 2 metadata wrong: ${JSON.stringify({ task: task2.task, minWords: task2.minWords, minutes: task2.minutes })}`);
if (task1.figure === 'hospital-maps') ok('Task 1 map figure wired up');
else bad('Task 1 is missing its map figure');

if (TEST.speaking.length === 3) ok('Speaking: 3 parts');
else bad(`Speaking: ${TEST.speaking.length} parts, expected 3`);

// Part 1 (4) + Part 2 cue card & follow-up (2) + Part 3 (6) = 12 in this test.
const speakingQuestions = TEST.speaking.reduce((n, p) => n + p.questions.length, 0);
if (speakingQuestions >= 12) ok(`Speaking: ${speakingQuestions} questions across 3 parts`);
else bad(`Speaking: only ${speakingQuestions} questions`);

for (const part of TEST.speaking) {
  const nums = part.questions.length;
  if (nums === 0) bad(`Speaking Part ${part.id}: no questions`);
}
const counts = TEST.speaking.map((p) => `P${p.id}=${p.questions.length}`).join(' · ');
info(counts);

const cue = TEST.speaking.find((p) => p.cueCard);
if (cue && cue.prepSeconds === 60 && cue.speakSeconds === 120) ok('Part 2: 60 s prep / 120 s talk');
else bad('Part 2 timing is wrong');

/* ------------------------------------------------------------------ */
/* 8. Attribution notice must exist                                    */
/* ------------------------------------------------------------------ */

section('8. Attribution notice');

const src = TEST.source;
if (src?.rights?.includes('Cambridge')) ok('rights notice names Cambridge');
else bad('the rights notice does not name Cambridge');
if (src?.rights?.includes('classroom')) ok('rights notice states the classroom-use basis');
else bad('the rights notice does not state the permitted use');
if (src?.provenance) ok('provenance note present');
else bad('no provenance note');

/* ------------------------------------------------------------------ */

console.log('');
if (problems === 0) {
  console.log(`${C.green}${C.bold}✔ Cambridge content checks all passed${C.reset}`);
  console.log(`${C.dim}  Listening 40/40 · Reading 40/40 · Writing 2 tasks · Speaking ${speakingQuestions} questions${C.reset}\n`);
  process.exit(0);
}
console.log(`${C.red}${C.bold}✘ ${problems} problem(s) found${C.reset}\n`);
process.exit(1);
