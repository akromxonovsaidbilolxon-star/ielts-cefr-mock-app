#!/usr/bin/env node
/**
 * Guard: no Cambridge book text may reach the public bundle.
 *
 * The transcribed passages live in `src/content/cambridge/*.ts` as the source
 * the database is loaded from. They must never be imported by anything the
 * browser downloads, because the bundle is a public file — that is exactly the
 * bug this project fixed: passages used to be readable without signing in.
 *
 * This check runs against `dist/` after a build, so it catches both a page that
 * imports the content directly and a renderer that hardcodes book wording.
 *
 * Usage:  npm run check:bundle      (build first)
 */

import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const C = {
  reset: '\x1b[0m', red: '\x1b[31m', green: '\x1b[32m',
  yellow: '\x1b[33m', bold: '\x1b[1m', dim: '\x1b[2m',
};

const assetsDir = 'dist/assets';
if (!existsSync(assetsDir)) {
  console.error(`${C.red}dist/assets is missing — run npm run build first.${C.reset}`);
  process.exit(1);
}

const files = readdirSync(assetsDir)
  .filter((f) => f.endsWith('.js'))
  .map((f) => ({ name: f, text: readFileSync(join(assetsDir, f), 'utf8') }));

/**
 * Distinctive strings that only occur in Cambridge book text or in figures
 * redrawn from it. Kept short so a paraphrase still trips the check.
 */
const FORBIDDEN = [
  // Reading passages
  'Harappan',
  'Melanoides',
  'coconut palm',
  'baby talk',
  'bridge hypothesis',
  'Ramirez-Esparza',
  // Listening
  'sleepy lizard',
  'Banford',
  'Tyrian',
  'cochineal',
  'Granford',
  'Station Road',
  'Bridge Street',
  // Writing / Speaking
  'England and Wales',
  'electricity in 2014',
  'interesting discussion',
];

let problems = 0;

console.log(`\n${C.bold}Cambridge bundle guard${C.reset}`);
console.log(`${C.dim}${files.length} asset file(s) scanned${C.reset}\n`);

for (const term of FORBIDDEN) {
  const hits = files.filter((f) => f.text.includes(term));
  if (hits.length === 0) {
    console.log(`  ${C.green}✔${C.reset} not in bundle: ${term}`);
  } else {
    problems++;
    console.log(`  ${C.red}✘${C.reset} FOUND in bundle: ${term}`);
    for (const h of hits) console.log(`      ${C.dim}${h.name}${C.reset}`);
  }
}

console.log('');
if (problems > 0) {
  console.log(
    `${C.red}${C.bold}✘ ${problems} term(s) leaked into the public bundle${C.reset}\n` +
      `${C.dim}Book text must come from Supabase at run time. Check that nothing imports\n` +
      `from src/content/cambridge/c13-*.ts, figures-db.ts, or hardcodes book wording.${C.reset}\n`,
  );
  process.exit(1);
}

console.log(`${C.green}${C.bold}✔ No Cambridge book text in the bundle${C.reset}\n`);
