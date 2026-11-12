#!/usr/bin/env node
/**
 * Pre-deploy checklist. Run `npm run preflight` before publishing.
 *
 * Answers one question: if I deploy right now, will the app be protected and
 * will it work? Checks the local roster, the secret guidance, the build output
 * and the mobile assets.
 */

import { existsSync, readFileSync, statSync } from 'node:fs';
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

/* ---------------- roster ---------------- */

function readRoster() {
  for (const file of ['.env.production', '.env.local', '.env']) {
    if (!existsSync(file)) continue;
    const text = readFileSync(file, 'utf8');
    const match = text.match(/VITE_ACCESS_ROSTER\s*=\s*(.+)/);
    if (!match) continue;
    const value = match[1].trim().replace(/^["']|["']$/g, '');
    try {
      const json = value.startsWith('[')
        ? value
        : Buffer.from(value, 'base64').toString('utf8');
      const parsed = JSON.parse(json);
      if (Array.isArray(parsed)) return { file, users: parsed };
    } catch {
      return { file, users: [], error: 'could not decode the value' };
    }
  }
  return null;
}

section('1. Access roster');
const roster = readRoster();

if (!roster) {
  warn('No local roster file found (.env.production).');
  info('Create one: npm run access:add -- --file .env.production --user owner --password "YourPass1" --role owner');
  info('Then add the value as the VITE_ACCESS_ROSTER repository secret.');
} else {
  ok(`Found ${roster.file} with ${roster.users.length} account(s)`);
  const owners = roster.users.filter((u) => u.role === 'owner');
  const active = roster.users.filter((u) => (u.status ?? 'active') === 'active');
  const missingHash = roster.users.filter((u) => !u.hash || !u.salt);

  if (owners.length === 0) {
    bad('No owner account in the roster — you would not be able to reach the owner panel.');
  } else {
    ok(`Owner account present: @${owners[0].username}`);
  }
  if (active.length === 0) bad('Every account is suspended — nobody could sign in.');
  else info(`${active.length} active account(s), ${roster.users.length - active.length} blocked`);
  if (missingHash.length > 0) {
    bad(`${missingHash.length} account(s) are missing a password hash and can never sign in.`);
  }
  for (const user of roster.users) {
    if (!user.expiresAtISO) continue;
    if (new Date(user.expiresAtISO).getTime() <= Date.now()) {
      warn(`@${user.username} expired on ${new Date(user.expiresAtISO).toLocaleDateString()}`);
    }
  }
  if (roster.users.some((u) => /^(password|12345678|qwerty)/i.test(u.hash ?? ''))) {
    bad('A password hash looks like a placeholder value.');
  }
}

section('2. Repository secret');
try {
  const remote = execSync('git remote get-url origin', { encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'] }).trim();
  const slug = remote.replace(/\.git$/, '').replace(/^.*[:/]([^/]+\/[^/]+)$/, '$1');
  info(`Set it at: https://github.com/${slug}/settings/secrets/actions`);
  info('Name: VITE_ACCESS_ROSTER  ·  value: everything after the "=" in .env.production');
} catch {
  info('Could not detect the GitHub repo. Set VITE_ACCESS_ROSTER in your host settings.');
}
info('The deploy workflow fails on a malformed secret and warns loudly when it is missing.');

section('3. Build output');
if (!existsSync('dist/index.html')) {
  warn('dist/ not built yet — run npm run build.');
} else {
  ok('dist/index.html exists');
  const assets = existsSync('dist/assets') ? execSync('ls dist/assets', { encoding: 'utf8' }).trim().split('\n') : [];
  const js = assets.filter((a) => a.endsWith('.js'));
  if (js.length === 0) bad('No JavaScript bundle in dist/assets.');
  else ok(`Bundle present (${js.join(', ')})`);

  if (roster && roster.users.length > 0) {
    const encoded = roster.users.length
      ? execSync('cat .env.production')
          .toString()
          .match(/VITE_ACCESS_ROSTER\s*=\s*(.+)/)?.[1]
          .trim()
          .slice(0, 60)
      : null;
    if (encoded) {
      try {
        const found = execSync(`grep -lF '${encoded}' dist/assets/*.js`, {
          encoding: 'utf8',
          stdio: ['pipe', 'pipe', 'ignore'],
        }).trim();
        if (found) ok('Access roster is baked into the current build — login will be enforced.');
        else bad('dist/ was built WITHOUT the roster. Rebuild with npm run build before deploying.');
      } catch {
        bad('dist/ was built WITHOUT the roster. Rebuild with npm run build before deploying.');
      }
    }
  } else {
    warn('No roster to verify — the build would be unlocked.');
  }
}

section('4. Mobile assets');
const required = [
  'dist/manifest.webmanifest',
  'dist/icons/icon-192.png',
  'dist/icons/icon-512.png',
  'dist/icons/icon-maskable-512.png',
  'dist/icons/icon-180.png',
];
const inSource = {
  'dist/manifest.webmanifest': 'public/manifest.webmanifest',
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

section('5. HTTPS check');
info('Password hashing and the microphone recorder need HTTPS (or localhost).');
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
