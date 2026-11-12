import { AUDIO_MANIFEST, audioFor, hasRealAudio, audioKeys } from '../src/lib/audioManifest';
import { ML_LISTENING_PARTS } from '../src/content/multilevel/listening';
import { LISTENING_PARTS } from '../src/content/listening';

let f = 0;
const check = (n: string, c: boolean) => { if (!c) { f++; console.log(`  FAIL ${n}`); } else console.log(`  ok ${n}`); };

console.log('\n== AUDIO MANIFEST ==');
check('manifest is an object', typeof AUDIO_MANIFEST === 'object');
check('audioKeys.ielts builds correct key', audioKeys.ielts(3) === 'ielts-3');
check('audioKeys.multilevel builds correct key', audioKeys.multilevel(5) === 'ml-5');
check('falls back when no real audio registered', !hasRealAudio('ielts-1'));
check('audioFor returns undefined when absent', audioFor('ielts-1') === undefined);

console.log('\n== FALLBACK SAFETY: every part has a script ==');
check('all 4 IELTS parts have scripts', LISTENING_PARTS.every(p => p.script.length > 3));
check('all 6 Multilevel parts have scripts', ML_LISTENING_PARTS.every(p => p.script.length > 3));
check('every IELTS part maps to a distinct key',
  new Set(LISTENING_PARTS.map(p => audioKeys.ielts(p.id))).size === 4);
check('every Multilevel part maps to a distinct key',
  new Set(ML_LISTENING_PARTS.map(p => audioKeys.multilevel(p.id))).size === 6);

console.log(`\n${f === 0 ? 'ALL AUDIO CHECKS PASSED' : f + ' FAILED'}\n`);
process.exit(f === 0 ? 0 : 1);
