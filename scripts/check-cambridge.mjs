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
/* Test 2 keys — "choose TWO letters" answers are only ever printed as */
/* a pair and order does not matter, so those numbers are verified as a */
/* set rather than one at a time.                                       */
/* ------------------------------------------------------------------ */

/** Q17+18 are C and E in either order; Q19+20 are B and D in either order. */
const PAIRS_LISTENING = [[17, 18], [19, 20]];

const KEY2_LISTENING = {
  1: 'races', 2: 'insurance', 3: 'Jerriz', 4: '25', 5: 'stadium',
  6: 'park', 7: 'coffee', 8: 'leader', 9: 'route', 10: 'lights',
  11: 'C', 12: 'B', 13: 'C', 14: 'B', 15: 'B', 16: 'A',
  17: 'C', 18: 'E', 19: 'B', 20: 'D',
  21: 'B', 22: 'A', 23: 'C', 24: 'C', 25: 'A',
  26: 'A', 27: 'C', 28: 'D', 29: 'G', 30: 'B',
  31: 'location', 32: 'world', 33: 'personal', 34: 'attention', 35: 'name',
  36: 'network', 37: 'frequency', 38: 'colour', 39: 'brain', 40: 'self',
};

const KEY2_READING = {
  1: 'oils', 2: 'friendship', 3: 'funerals', 4: 'wealth', 5: 'indigestion',
  6: 'India', 7: 'camels', 8: 'Alexandria', 9: 'Venice',
  10: 'TRUE', 11: 'FALSE', 12: 'NOT GIVEN', 13: 'FALSE',
  14: 'B', 15: 'F', 16: 'B', 17: 'E',
  18: 'A', 19: 'B', 20: 'C',
  21: 'animals', 22: 'childbirth', 23: 'placebo', 24: 'game', 25: 'strangers', 26: 'names',
  27: 'B', 28: 'C', 29: 'A', 30: 'D', 31: 'D',
  32: 'D', 33: 'C', 34: 'B', 35: 'A', 36: 'C', 37: 'A',
  38: 'B', 39: 'C', 40: 'D',
};

/* ------------------------------------------------------------------ */
/* Test 3 keys, copied from the book's own Answer Key (pages 120-123).  */
/* As in Test 2, Q17+18 and Q19+20 are printed as unordered pairs.      */
/* ------------------------------------------------------------------ */

const PAIRS_LISTENING_T3 = [[17, 18], [19, 20]];

const KEY3_LISTENING = {
  1: '850', 2: 'bike', 3: 'parking', 4: '30', 5: 'weekend',
  6: 'cinema', 7: 'hospital', 8: 'dentist', 9: 'Thursday', 10: 'cafe',
  11: 'F', 12: 'D', 13: 'A', 14: 'B', 15: 'C', 16: 'G',
  17: 'B', 18: 'C', 19: 'B', 20: 'D',
  21: 'C', 22: 'A', 23: 'A', 24: 'B', 25: 'C',
  26: 'F', 27: 'H', 28: 'D', 29: 'A', 30: 'E',
  31: 'tongue', 32: 'plants', 33: 'snakes', 34: 'sky', 35: 'partner',
  36: 'contact', 37: 'protection', 38: 'tail', 39: 'steps', 40: 'injury',
};

const KEY3_READING = {
  1: 'furniture', 2: 'sugar', 3: 'ropes', 4: 'charcoal', 5: 'bowls',
  6: 'hormones', 7: 'cosmetics', 8: 'dynamite',
  9: 'FALSE', 10: 'FALSE', 11: 'NOT GIVEN', 12: 'TRUE', 13: 'NOT GIVEN',
  14: 'B', 15: 'C', 16: 'A', 17: 'B',
  18: 'recording devices', 19: 'fathers', 20: 'bridge hypothesis',
  21: 'repertoire', 22: 'audio-recording vests', 23: 'vocabulary',
  24: 'F', 25: 'A', 26: 'E',
  27: 'C', 28: 'H', 29: 'A', 30: 'B', 31: 'D',
  32: 'shells', 33: 'lake', 34: 'rainfall', 35: 'grains', 36: 'pottery',
  37: 'B', 38: 'A', 39: 'D', 40: 'A',
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
for (const need of [
  'types.ts',
  'index.ts',
  'registry.ts',
  'c13-test1.ts',
  'c13-test2.ts',
  'c13-test3.ts',
  'figures.ts',
  'figures-db.ts',
]) {
  if (files.includes(need)) ok(need);
  else bad(`${need} is missing`);
}

/*
 * The tests are no longer re-exported from index.ts — that barrel is now
 * helper-only so the browser bundle cannot pull book text in. The tests are
 * loaded from a dedicated entry point instead, which exists purely for this
 * script and for `npm run export:cambridge`.
 */
async function loadTest() {
  const { execSync } = await import('node:child_process');
  execSync(
    './node_modules/.bin/esbuild src/content/cambridge/registry.ts --bundle --format=esm --outfile=/tmp/cam-content.mjs --log-level=error',
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

if (!mod.C13_TEST1) {
  bad('C13_TEST1 is not exported from registry.ts');
  process.exit(1);
}

/** The two tests currently in the book, paired with their official keys. */
const SUITE = [
  {
    test: mod.C13_TEST1,
    listeningKey: KEY_LISTENING,
    readingKey: KEY_READING,
    pairs: [],
    task1Figure: 'hospital-maps',
    minSpeaking: 12,
  },
  {
    test: mod.C13_TEST2,
    listeningKey: KEY2_LISTENING,
    readingKey: KEY2_READING,
    pairs: PAIRS_LISTENING,
    task1Chart: true,
    minSpeaking: 12,
  },
  {
    test: mod.C13_TEST3,
    listeningKey: KEY3_LISTENING,
    readingKey: KEY3_READING,
    pairs: PAIRS_LISTENING_T3,
    task1Chart: true,
    minSpeaking: 12,
  },
].filter((s) => s.test);

const summary = [];

for (const S of SUITE) {
  const T = S.test;
  console.log(`\n${C.bold}━━━ ${T.label} ━━━${C.reset}`);

  /* ------------------------------------------------------------------ */
  /* 3. Structure                                                        */
  /* ------------------------------------------------------------------ */

  section('2. Listening structure');

  if (T.listening.length === 4) ok('4 sections');
  else bad(`expected 4 listening sections, found ${T.listening.length}`);

  for (const s of T.listening) {
    const nums = s.groups.flatMap((g) => g.questions.map((q) => q.number));
    const expected = 10;
    if (nums.length === expected) ok(`Section ${s.id}: ${nums.length} questions (${nums[0]}–${nums[nums.length - 1]})`);
    else bad(`Section ${s.id}: ${nums.length} questions, expected ${expected}`);

    if (s.audio?.storagePath || s.audio?.driveId) ok(`Section ${s.id}: audio → ${s.audio.filename}`);
    else bad(`Section ${s.id}: no audio registered`);
    if (s.audio?.storagePath) ok(`Section ${s.id}: private storage path registered`);
  }

  section('3. Reading structure');

  if (T.reading.length === 3) ok('3 passages');
  else bad(`expected 3 passages, found ${T.reading.length}`);

  for (const p of T.reading) {
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

  const listeningNums = T.listening.flatMap((s) => collectNumbers(s.groups));
  const readingNums = T.reading.flatMap((p) => collectNumbers(p.groups));

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

  /**
   * "Choose TWO letters" answers only exist as a pair in the book. Number by
   * number the printed key is meaningless, so compare the pair as a set and
   * skip those numbers in the per-number pass.
   */
  function checkPairs(groups, expected, pairs, label) {
    const all = groups.flatMap((g) => g.questions);
    for (const [a, b] of pairs) {
      const qa = all.find((q) => q.number === a);
      const qb = all.find((q) => q.number === b);
      if (!qa || !qb) {
        bad(`${label} Q${a}+${b}: pair member missing`);
        continue;
      }
      const got = new Set([qa.answer, qb.answer].map((x) => x.trim().toUpperCase()));
      const want = new Set([expected[a], expected[b]].map((x) => String(x).trim().toUpperCase()));
      const same = got.size === want.size && [...want].every((x) => got.has(x));
      if (same) ok(`${label} Q${a}+${b}: pair is {${[...want].sort().join(', ')}} in either order`);
      else bad(`${label} Q${a}+${b}: content gives {${[...got].join(', ')}}, key gives {${[...want].join(', ')}}`);
    }
  }

  const paired = new Set(S.pairs.flat());
  function checkKeySkipping(groups, expected, label, skip) {
    let checked = 0;
    for (const g of groups) {
      for (const q of g.questions) {
        if (skip.has(q.number)) continue;
        const want = expected[q.number];
        if (!want) { bad(`${label} Q${q.number}: no official answer recorded`); continue; }
        if (!q.answer) { bad(`${label} Q${q.number}: no answer in the content`); continue; }
        const options = q.answer.split('|').map(normalise);
        if (!options.includes(normalise(want))) {
          bad(`${label} Q${q.number}: content says "${q.answer}", official key says "${want}"`);
        } else checked += 1;
      }
    }
    const total = Object.keys(expected).length - skip.size;
    if (checked === total) ok(`${label}: all ${checked} single answers match the official key`);
  }

  checkKeySkipping(T.listening.flatMap((s) => s.groups), S.listeningKey, 'Listening', paired);
  checkKeySkipping(T.reading.flatMap((p) => p.groups), S.readingKey, 'Reading', paired);
  checkPairs(T.listening.flatMap((s) => s.groups), S.listeningKey, S.pairs, 'Listening');

  /* ------------------------------------------------------------------ */
  /* 6. Layout-specific integrity                                        */
  /* ------------------------------------------------------------------ */

  section('6. Layout integrity');

  function allQuestions(groups) {
    return groups.flatMap((g) => g.questions);
  }

  for (const [label, groups] of [
    ['Listening', T.listening.flatMap((s) => s.groups)],
    ['Reading', T.reading.flatMap((p) => p.groups)],
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

      // Choose-TWO groups: every number must appear in exactly one pair, the
      // pair must own an option bank, and the letters must be distinct.
      if (g.layout === 'chooseTwo') {
        const p = g.pairs ?? [];
        if (!p.length) bad(`${label} ${g.id}: chooseTwo group has no pairs`);
        if (!g.box?.items?.length) bad(`${label} ${g.id}: chooseTwo group has no letter bank`);
        const inPairs = new Set(p.flatMap((x) => x.answers));
        const missing = [...numbers].filter((n) => !inPairs.has(n));
        if (missing.length) bad(`${label} ${g.id}: Q${missing.join(', ')} not in any answer pair`);
        for (const pair of p) {
          const letters = pair.answers.map(
            (n) => g.questions.find((q) => q.number === n)?.answer ?? '',
          );
          if (new Set(letters).size !== letters.length) {
            bad(`${label} ${g.id}: pair ${pair.answers.join('+')} reuses the letter ${letters.join('/')}`);
          }
          if (pair.answers.length !== 2) bad(`${label} ${g.id}: pair must have exactly two numbers`);
          const bank = new Set((g.box?.items ?? []).map((i) => i.letter));
          for (const l of letters) if (!bank.has(l)) bad(`${label} ${g.id}: "${l}" is not in the letter bank`);
        }
        if (!missing.length && p.length) ok(`${label} ${g.id}: ${p.length} answer pairs → ${p.flatMap((x) => x.answers).join(', ')}`);
      }

      // Labelled notes / sub-headed notes: every question needs a {{n}} blank
      // somewhere, and every blank must belong to this group.
      if (g.layout === 'notes' && (g.labels || g.sections)) {
        const lines = (g.sections ?? []).flatMap((x) => x.lines);
        const blanks = new Set();
        for (const line of lines) for (const m of line.matchAll(/\{\{(\d+)\}\}/g)) blanks.add(Number(m[1]));
        const unplaced = [...numbers].filter((n) => !blanks.has(n));
        const extra = [...blanks].filter((n) => !numbers.has(n));
        if (unplaced.length) bad(`${label} ${g.id}: no blank printed for Q${unplaced.join(', ')}`);
        if (extra.length) bad(`${label} ${g.id}: blank for Q${extra.join(', ')} is not in this group`);
        if (g.labels && g.labels.length !== lines.length) {
          bad(`${label} ${g.id}: ${g.labels.length} labels for ${lines.length} lines`);
        }
        if (!unplaced.length && !extra.length) ok(`${label} ${g.id}: ${blanks.size} sectioned blanks match ${numbers.size} questions`);
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

  const { task1, task2 } = T.writing;
  if (task1.task === 1 && task1.minWords === 150 && task1.minutes === 20) ok('Task 1: 20 min / 150 words');
  else bad(`Task 1 metadata wrong: ${JSON.stringify({ task: task1.task, minWords: task1.minWords, minutes: task1.minutes })}`);
  if (task2.task === 2 && task2.minWords === 250 && task2.minutes === 40) ok('Task 2: 40 min / 250 words');
  else bad(`Task 2 metadata wrong: ${JSON.stringify({ task: task2.task, minWords: task2.minWords, minutes: task2.minutes })}`);
  if (S.task1Figure) {
    if (task1.figure === S.task1Figure) ok(`Task 1 figure wired up (${S.task1Figure})`);
    else bad(`Task 1 figure should be "${S.task1Figure}", found "${task1.figure ?? 'none'}"`);
  }
  if (S.task1Chart) {
    const chart = task1.chart;
    if (!chart) {
      bad('Task 1 is missing its bar chart');
    } else {
      const bars = chart.categories.length;
      const okSeries = chart.series.length === 2 && chart.series.every((x) => x.values.length === bars);
      if (bars >= 9 && okSeries) ok(`Task 1 bar chart: ${bars} year groups, 2 series`);
      else bad(`Task 1 bar chart shape is wrong: ${bars} groups, ${chart.series.map((x) => x.values.length).join('/')} values`);
    }
  }

  if (T.speaking.length === 3) ok('Speaking: 3 parts');
  else bad(`Speaking: ${T.speaking.length} parts, expected 3`);

  // Part 1 (4) + Part 2 cue card & follow-up (2) + Part 3 (6) = 12 per test.
  const speakingQuestions = T.speaking.reduce((n, p) => n + p.questions.length, 0);
  summary.push(`${T.test ? `Test ${T.test}` : T.id}: Listening 40 · Reading 40 · Writing 2 · Speaking ${speakingQuestions}`);
  if (speakingQuestions >= (S.minSpeaking ?? 12)) ok(`Speaking: ${speakingQuestions} questions across 3 parts`);
  else bad(`Speaking: only ${speakingQuestions} questions`);

  for (const part of T.speaking) {
    const nums = part.questions.length;
    if (nums === 0) bad(`Speaking Part ${part.id}: no questions`);
  }
  const counts = T.speaking.map((p) => `P${p.id}=${p.questions.length}`).join(' · ');
  info(counts);

  const cue = T.speaking.find((p) => p.cueCard);
  if (cue && cue.prepSeconds === 60 && cue.speakSeconds === 120) ok('Part 2: 60 s prep / 120 s talk');
  else bad('Part 2 timing is wrong');

  /* ------------------------------------------------------------------ */
  /* 8. Attribution notice must exist                                    */
  /* ------------------------------------------------------------------ */

  section('8. Attribution notice');

  const src = T.source;
  if (src?.rights?.includes('Cambridge')) ok('rights notice names Cambridge');
  else bad('the rights notice does not name Cambridge');
  if (src?.rights?.includes('classroom')) ok('rights notice states the classroom-use basis');
  else bad('the rights notice does not state the permitted use');
  if (src?.provenance) ok('provenance note present');
  else bad('no provenance note');


}

/* ------------------------------------------------------------------ */

console.log('');
if (problems === 0) {
  console.log(`${C.green}${C.bold}✔ Cambridge content checks all passed${C.reset}`);
  for (const line of summary) console.log(`${C.dim}  ${line}${C.reset}`);
  console.log('');
  process.exit(0);
}
console.log(`${C.red}${C.bold}✘ ${problems} problem(s) found${C.reset}\n`);
process.exit(1);
