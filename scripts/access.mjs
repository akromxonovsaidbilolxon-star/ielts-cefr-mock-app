#!/usr/bin/env node
/**
 * Access-roster helper for the IELTS mock app.
 *
 *   npm run access:hash                      hash a password
 *   npm run access:new -- --user mariam      create a user from scratch
 *   npm run access:add -- --file roster.json add/update a user in a roster file
 *   npm run access:list -- --file roster.json show accounts
 *
 * The project uses PBKDF2-SHA256 (210k iterations) so the hashes written here
 * match exactly what the browser derives at sign-in.
 */

import { randomBytes, pbkdf2Sync } from 'node:crypto';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { createInterface } from 'node:readline/promises';
import { stdin, stdout } from 'node:process';

const ITERATIONS = 210_000;
const KEY_BYTES = 32;

/* ---------------- helpers ---------------- */

function parseArgs(argv) {
  const out = { _: [] };
  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (token.startsWith('--')) {
      const key = token.slice(2);
      const next = argv[i + 1];
      if (next && !next.startsWith('--')) {
        out[key] = next;
        i += 1;
      } else {
        out[key] = true;
      }
    } else {
      out._.push(token);
    }
  }
  return out;
}

function hashPassword(password, saltB64, iterations = ITERATIONS) {
  const salt = Buffer.from(saltB64, 'base64');
  const bits = pbkdf2Sync(password, salt, iterations, KEY_BYTES, 'sha256');
  return bits.toString('base64');
}

function makeSalt() {
  return randomBytes(16).toString('base64');
}

function toEnvLine(users) {
  const json = JSON.stringify(users);
  return `VITE_ACCESS_ROSTER=${Buffer.from(json, 'utf8').toString('base64')}`;
}

/** Reads a roster from disk, accepting either the env file or raw JSON. */
function readRosterFile(path) {
  const text = readFileSync(path, 'utf8');
  const match = text.match(/VITE_ACCESS_ROSTER\s*=\s*(.+)/);
  const value = (match ? match[1] : text).trim().replace(/^["']|["']$/g, '');
  const json = value.startsWith('[') ? value : Buffer.from(value, 'base64').toString('utf8');
  const parsed = JSON.parse(json);
  if (!Array.isArray(parsed)) throw new Error('Roster is not an array');
  return parsed;
}

function validateUsername(username) {
  if (!username || username.length < 3) return 'Username must be at least 3 characters.';
  if (username.length > 32) return 'Username must be 32 characters or fewer.';
  if (!/^[a-zA-Z0-9._-]+$/.test(username)) {
    return 'Use only letters, numbers, dot, dash or underscore.';
  }
  return null;
}

function validatePassword(password) {
  if (password.length < 8) return 'Password must be at least 8 characters.';
  if (!/[a-zA-Z]/.test(password) || !/[0-9]/.test(password)) {
    return 'Password must contain at least one letter and one number.';
  }
  return null;
}

async function askHidden(question) {
  const rl = createInterface({ input: stdin, output: stdout });
  const answer = await rl.question(question);
  rl.close();
  return answer;
}

/* ---------------- commands ---------------- */

async function cmdHash(args) {
  const password = args.password ?? (await askHidden('Password to hash: '));
  const problem = validatePassword(password);
  if (problem) {
    console.error(`✖ ${problem}`);
    process.exit(1);
  }
  const salt = makeSalt();
  const hash = hashPassword(password, salt);
  console.log('\nAdd these to the roster entry for this person:\n');
  console.log(`  "salt": "${salt}",`);
  console.log(`  "hash": "${hash}",`);
  console.log(`  "iterations": ${ITERATIONS}`);
  console.log('\nOr replace the whole line in .env.production with the output of');
  console.log('`npm run access:add -- --file <roster> --user <name> --password <pw>`.\n');
}

async function cmdNew(args) {
  const username = (args.user ?? (await askHidden('Username: '))).trim().toLowerCase();
  const problem = validateUsername(username);
  if (problem) {
    console.error(`✖ ${problem}`);
    process.exit(1);
  }
  const password = args.password ?? (await askHidden('Password: '));
  const pwProblem = validatePassword(password);
  if (pwProblem) {
    console.error(`✖ ${pwProblem}`);
    process.exit(1);
  }
  const salt = makeSalt();
  const user = {
    username,
    displayName: args.name ?? username,
    role: args.role === 'owner' ? 'owner' : 'user',
    salt,
    hash: hashPassword(password, salt),
    iterations: ITERATIONS,
    status: 'active',
    createdAtISO: new Date().toISOString(),
    ...(args.expires ? { expiresAtISO: new Date(args.expires).toISOString() } : {}),
  };
  console.log('\nSingle-user roster:\n');
  console.log(toEnvLine([user]));
  console.log('');
}

async function cmdAdd(args) {
  const file = args.file;
  if (!file) {
    console.error('✖ Pass --file <roster file> (creates it if missing).');
    process.exit(1);
  }
  const users = existsSync(file) ? readRosterFile(file) : [];
  const username = (args.user ?? (await askHidden('Username: '))).trim().toLowerCase();
  const problem = validateUsername(username);
  if (problem) {
    console.error(`✖ ${problem}`);
    process.exit(1);
  }
  const password = args.password ?? (await askHidden('Password: '));
  const pwProblem = validatePassword(password);
  if (pwProblem) {
    console.error(`✖ ${pwProblem}`);
    process.exit(1);
  }

  const salt = makeSalt();
  const hash = hashPassword(password, salt);
  const existing = users.findIndex((u) => u.username === username);
  const role = args.role === 'owner' ? 'owner' : 'user';

  if (existing >= 0) {
    users[existing] = { ...users[existing], salt, hash, iterations: ITERATIONS };
    console.log(`✔ Updated password for "${username}".`);
  } else {
    users.push({
      username,
      displayName: args.name ?? username,
      role,
      salt,
      hash,
      iterations: ITERATIONS,
      status: 'active',
      createdAtISO: new Date().toISOString(),
      ...(args.expires ? { expiresAtISO: new Date(args.expires).toISOString() } : {}),
      ...(args.note ? { note: args.note } : {}),
    });
    console.log(`✔ Added "${username}" (${role}).`);
  }

  writeFileSync(file, `${toEnvLine(users)}\n`, { mode: 0o600 });
  console.log(`✔ ${users.length} account(s) written to ${file}`);
  console.log('\nNext: rebuild and redeploy so the new roster is baked in.');
}

async function cmdList(args) {
  const file = args.file;
  if (!file) {
    console.error('✖ Pass --file <roster file>.');
    process.exit(1);
  }
  if (!existsSync(file)) {
    console.error(`✖ ${file} does not exist.`);
    process.exit(1);
  }
  const users = readRosterFile(file);
  console.log(`\n${users.length} account(s) in ${file}:\n`);
  for (const user of users) {
    const flags = [
      user.role ?? 'user',
      user.status ?? 'active',
      user.expiresAtISO ? `expires ${new Date(user.expiresAtISO).toLocaleDateString()}` : null,
    ].filter(Boolean);
    console.log(`  @${user.username.padEnd(18)} ${(user.displayName ?? '').padEnd(22)} [${flags.join(', ')}]`);
  }
  console.log('');
}

/* ---------------- main ---------------- */

const [, , command, ...rest] = process.argv;
const args = parseArgs(rest);

const commands = {
  hash: cmdHash,
  new: cmdNew,
  add: cmdAdd,
  list: cmdList,
};

const runner = commands[command];
if (!runner) {
  console.log(`
Access roster helper

  npm run access:hash                          hash a password for a manual edit
  npm run access:new  -- --user <name>         print a one-user roster line
  npm run access:add  -- --file <path>         add or update a user in a roster
  npm run access:list -- --file <path>         list accounts

Options:
  --user <username>    --name <display name>   --password <password>
  --role owner|user    --expires <YYYY-MM-DD>  --note <text>
`);
  process.exit(command ? 1 : 0);
}

await runner(args);
