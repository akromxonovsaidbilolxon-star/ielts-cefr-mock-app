#!/usr/bin/env node
/**
 * Pre-deploy checklist. Run `npm run preflight` before publishing.
 *
 * Answers one question: if I deploy right now, will the app be protected and
 * will it work? Checks the local roster, the secret guidance, the build output
 * and the mobile assets.
 */

import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { execSync } from 'node:child_process';

const C = {
  reset: '\x1b[0m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  bold: '\x1b[1m',
};

let problems = 0;
let warnings = 0;

const ok = (msg) => console.log(`  ${C.green}✔${C.reset} ${msg}`);
const bad = (msg) => {
  problems += 1;
  console.log(`  ${C.red}✘${C.reset} ${msg}`);
};
const warn = (msg) => {
  warnings += 1;
  console.log(`  ${C.yellow}!${C.reset} ${msg}`);
};
const info = (msg) => console.log(`  ${C.dim}·${C.reset} ${msg}`);
const section = (title) => console.log(`\n${C.bold}${title}${C.reset}`);

/* ---------------- supabase config ---------------- */

function readEnv() {
  const out = {};
  for (const file of ['.env.production', '.env.local', '.env']) {
    if (!existsSync(file)) continue;
    const text = readFileSync(file, 'utf8');
    for (const line of text.split('\n')) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)$/);
      if (!m) continue;
      const value = m[2].trim().replace(/^["']|["']$/g, '');
      if (value && !out[m[1]]) out[m[1]] = { value, file };
    }
  }
  return out;
}

const env = readEnv();
const sbUrl = env.VITE_SUPABASE_URL?.value;
const sbKey = env.VITE_SUPABASE_ANON_KEY?.value;

section('1. Supabase configuration');

if (!sbUrl || !sbKey) {
  bad('Supabase is not configured — nobody would be able to sign in.');
  info('Add these to .env.production (or your host\'s environment settings):');
  info('  VITE_SUPABASE_URL=https://your-project.supabase.co');
  info('  VITE_SUPABASE_ANON_KEY=your-anon-key');
  info('Find both in Supabase → Project Settings → API.');
} else {
  ok(`VITE_SUPABASE_URL found in ${env.VITE_SUPABASE_URL.file}`);

  // Shape check only — no network call.
  if (/^https:\/\/[a-z0-9-]+\.supabase\.(co|in)$/.test(sbUrl)) {
    ok('URL looks like a Supabase project');
  } else {
    warn(`URL does not look like https://<project>.supabase.co — got "${sbUrl}"`);
  }

  // The anon key is a JWT. The service_role key must NEVER be here.
  try {
    const payload = JSON.parse(Buffer.from(sbKey.split('.')[1] ?? '', 'base64').toString('utf8'));
    if (payload.role === 'service_role') {
      bad('DANGER: VITE_SUPABASE_ANON_KEY holds the SERVICE ROLE key. It grants full database access to anyone who opens the app. Replace it with the anon/public key immediately.');
    } else if (payload.role === 'anon') {
      ok('Key is the public anon key (safe to ship)');
    } else {
      warn(`Unexpected key role "${payload.role}" — expected "anon".`);
    }
    if (payload.ref && sbUrl && !sbUrl.includes(payload.ref)) {
      warn('The key and URL appear to belong to different projects.');
    }
  } catch {
    warn('Could not decode the anon key as a JWT — double-check it was pasted completely.');
  }
}

section('2. Access rules');
if (existsSync('supabase/setup.sql')) {
  ok('supabase/setup.sql present — run it once in the Supabase SQL Editor');
  info('It creates the profiles table, RLS policies and the owner role.');
} else {
  warn('supabase/setup.sql is missing.');
}
info('Keep public sign-up disabled: Supabase → Authentication → Sign In / Providers.');
info('Accounts are added by the owner; the app has no self-registration.');

section('3. Build output');
if (!existsSync('dist/index.html')) {
  warn('dist/ not built yet — run npm run build.');
} else {
  ok('dist/index.html exists');
  const assets = existsSync('dist/assets') ? execSync('ls dist/assets', { encoding: 'utf8' }).trim().split('\n') : [];
  const js = assets.filter((a) => a.endsWith('.js'));
  if (js.length === 0) bad('No JavaScript bundle in dist/assets.');
  else ok(`Bundle present (${js.join(', ')})`);

  if (sbKey) {
    try {
      const found = execSync(`grep -lF '${sbKey.slice(0, 40)}' dist/assets/*.js`, {
        encoding: 'utf8',
        stdio: ['pipe', 'pipe', 'ignore'],
      }).trim();
      if (found) ok('Supabase credentials are baked into the current build.');
      else warn('dist/ was built without Supabase credentials. Rebuild before deploying.');
    } catch {
      warn('dist/ was built without Supabase credentials. Rebuild before deploying.');
    }
  }

  // Guard against the single worst mistake: leaking the service role key.
  try {
    const hit = execSync(
      `grep -lE 'service_role|SERVICE_ROLE_KEY' dist/assets/*.js 2>/dev/null || true`,
      { encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'] },
    ).trim();
    if (hit) bad('A service_role reference appears in the bundle. Remove it — that key bypasses all security.');
    else ok('No service role key in the bundle');
  } catch {
    /* grep absence is fine */
  }
}

section('4. Mobile assets');
const required = [
  'dist/manifest.webmanifest',
  // Chrome will not offer "Install app" without a worker that fetches.
  'dist/sw.js',
  'dist/icons/icon-192.png',
  'dist/icons/icon-512.png',
  'dist/icons/icon-maskable-512.png',
  'dist/icons/icon-180.png',
];
const inSource = {
  'dist/manifest.webmanifest': 'public/manifest.webmanifest',
  'dist/sw.js': 'public/sw.js',
  'dist/icons/icon-192.png': 'public/icons/icon-192.png',
  'dist/icons/icon-512.png': 'public/icons/icon-512.png',
  'dist/icons/icon-maskable-512.png': 'public/icons/icon-maskable-512.png',
  'dist/icons/icon-180.png': 'public/icons/icon-180.png',
};
for (const asset of required) {
  const built = existsSync(asset);
  const source = existsSync(inSource[asset]);
  if (built) ok(asset);
  else if (source) warn(`${asset} missing from dist — rebuild.`);
  else bad(`${inSource[asset]} is missing from the repo.`);
}

if (existsSync('dist/index.html')) {
  const html = readFileSync('dist/index.html', 'utf8');
  const checks = [
    ['manifest link', /rel="manifest"/.test(html)],
    ['apple-touch-icon', /apple-touch-icon/.test(html)],
    ['apple-mobile-web-app-capable', /apple-mobile-web-app-capable/.test(html)],
    ['viewport-fit=cover', /viewport-fit=cover/.test(html)],
    ['theme-color', /theme-color/.test(html)],
  ];
  for (const [label, passed] of checks) {
    if (passed) ok(label);
    else bad(`${label} missing from index.html`);
  }
}

/* Android installability: manifest icons must be real files Chrome can fetch,
   and the worker must actually handle fetch events. Both were missing and are
   the reason "Install app" never appeared on Android. */
if (existsSync('public/manifest.webmanifest')) {
  try {
    const manifest = JSON.parse(readFileSync('public/manifest.webmanifest', 'utf8'));
    const icons = Array.isArray(manifest.icons) ? manifest.icons : [];
    const sizes = new Set(icons.map((i) => i.sizes));
    const dataUrls = icons.filter((i) => String(i.src ?? '').startsWith('data:'));
    if (sizes.has('192x192') && sizes.has('512x512')) ok('manifest declares 192x192 and 512x512 icons');
    else bad('manifest is missing a 192x192 or 512x512 icon — Chrome will not offer install');
    if (icons.some((i) => i.purpose === 'maskable')) ok('manifest has a maskable icon for Android');
    else warn('no maskable icon — Android will letterbox the icon');
    if (dataUrls.length) {
      bad(`${dataUrls.length} manifest icon(s) are base64 data URLs — Chrome only accepts real files`);
    } else {
      ok('manifest icons are real files, not data URLs');
    }
  } catch {
    warn('Could not parse public/manifest.webmanifest.');
  }
}

if (existsSync('public/sw.js')) {
  const sw = readFileSync('public/sw.js', 'utf8');
  if (/addEventListener\(\s*['"]fetch['"]/.test(sw)) ok('service worker handles fetch events');
  else bad('sw.js has no fetch handler — Chrome treats the app as not installable');
  const version = /CACHE_VERSION\s*=\s*['"]([^'"]+)['"]/.exec(sw);
  if (version) ok(`service worker cache version: ${version[1]}`);
  else warn('sw.js has no CACHE_VERSION to bump when caching changes');
}

section('5. Cambridge book material');
if (existsSync('src/content/cambridge/index.ts')) {
  ok('Cambridge content tree present');
  info('Recordings are streamed from the owner\'s Google Drive, so they are not in dist/.');
  info('Each book file must stay shared as "Anyone with the link".');

  // A Drive recording that lost its sharing is the failure mode that silently
  // breaks a listening test, so check the ids are at least well formed.
  try {
    const files = readdirSync('src/content/cambridge').filter((f) => /^c13-test\d+\.ts$/.test(f));
    let total = 0;
    for (const file of files) {
      const src = readFileSync(`src/content/cambridge/${file}`, 'utf8');
      const ids = [...src.matchAll(/driveId:\s*'([^']+)'/g)].map((m) => m[1]);
      if (ids.length === 4) ok(`${file}: 4 Drive recordings registered`);
      else warn(`${file}: ${ids.length} Drive recordings — expected 4 per test`);
      for (const id of ids) {
        total += 1;
        if (!/^[A-Za-z0-9_-]{20,}$/.test(id)) bad(`Drive id looks malformed: ${id}`);
      }
    }
    info(`${files.length} Cambridge test file(s) · ${total} recordings in total`);
  } catch {
    warn('Could not read the Cambridge listening content.');
  }
  info('Run npm run check:cambridge to verify every answer against the printed key.');

  // The passages must never be compiled into the public bundle.
  if (existsSync('supabase/cambridge-content.sql')) {
    ok('cambridge_tests schema present');
  } else {
    bad('supabase/cambridge-content.sql is missing — the book text has nowhere to load into.');
  }
  if (existsSync('supabase/generated/cambridge-content.sql')) {
    warn('Generated content SQL is present. Load it into Supabase, then it can be deleted.');
  } else {
    info('Run npm run export:cambridge to regenerate the SQL that seeds cambridge_tests.');
  }
  info('Run npm run check:bundle to prove no book text reached dist/.');
} else {
  warn('No Cambridge content yet.');
}

section('6. HTTPS check');
info('Sign-in and the microphone recorder need HTTPS (or localhost).');
info('GitHub Pages, Netlify, Vercel and Cloudflare Pages all provide it.');
info('A LAN address like http://192.168.x.x does NOT — iOS disables Web Crypto there.');

/* ---------------- summary ---------------- */

console.log('');
if (problems === 0 && warnings === 0) {
  console.log(`${C.green}${C.bold}✔ Ready to publish.${C.reset}`);
} else if (problems === 0) {
  console.log(`${C.yellow}${C.bold}! ${warnings} warning(s), no blockers.${C.reset}`);
  console.log(`${C.dim}You can publish, but review the warnings above.${C.reset}`);
} else {
  console.log(`${C.red}${C.bold}✘ ${problems} blocker(s) — fix these before publishing.${C.reset}`);
}
console.log('');

process.exit(problems === 0 ? 0 : 1);
