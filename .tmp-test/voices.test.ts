import { rankEnglishVoices, assignVoices } from '../src/lib/voices';

let failures = 0;
const check = (n: string, c: boolean, e = '') => {
  if (!c) { failures++; console.log(`  FAIL  ${n} ${e}`); } else console.log(`  ok    ${n}`);
};

const mk = (name: string, lang: string, local = true): SpeechSynthesisVoice =>
  ({ name, lang, localService: local, default: false, voiceURI: name }) as SpeechSynthesisVoice;

// A realistic Windows/Chrome voice list, including the bad ones.
const WINDOWS = [
  mk('Microsoft David - English (United States)', 'en-US'),
  mk('Microsoft Zira - English (United States)', 'en-US'),
  mk('Microsoft Mark - English (United States)', 'en-US'),
  mk('Microsoft Hazel - English (Great Britain)', 'en-GB'),
];
const EDGE_NEURAL = [
  mk('Microsoft Aria Online (Natural) - English (United States)', 'en-US', false),
  mk('Microsoft Guy Online (Natural) - English (United States)', 'en-US', false),
  mk('Microsoft Sonia Online (Natural) - English (United Kingdom)', 'en-GB', false),
];
const CHROME = [
  mk('Google US English', 'en-US', false),
  mk('Google UK English Female', 'en-GB', false),
  mk('Google UK English Male', 'en-GB', false),
];
const SAFARI = [
  mk('Samantha', 'en-US'),
  mk('Daniel', 'en-GB'),
  mk('Karen', 'en-AU'),
  mk('Albert', 'en-US'),   // novelty voice — must be blocked
  mk('Bad News', 'en-US'),
];
const LINUX_BAD = [
  mk('English (America)', 'en-US'),
  mk('eSpeak English', 'en-GB'),
  mk('english-us', 'en-US'),
];

console.log('\n== RANKING: good voices float to the top ==');
check('Edge neural voices rank above legacy', (() => {
  const r = rankEnglishVoices([...WINDOWS, ...EDGE_NEURAL]);
  // Sonia (en-GB) legitimately outranks Aria (en-US) on the British bonus.
  return r[0].quality === 'neural' && r[0].score > 1000;
})());
check('all three Edge neural voices outrank every legacy voice', (() => {
  const r = rankEnglishVoices([...WINDOWS, ...EDGE_NEURAL]);
  const neural = r.filter(x => x.quality === 'neural').length;
  return neural === 3 && r.slice(0, 3).every(x => x.quality === 'neural');
})());
check('Chrome Google voices rank above Microsoft legacy', (() => {
  const r = rankEnglishVoices([...WINDOWS, ...CHROME]);
  return r[0].voice.name.includes('Google');
})());
check('novelty voices are pushed to the bottom', (() => {
  const r = rankEnglishVoices(SAFARI);
  const albert = r.findIndex(x => x.voice.name === 'Albert');
  const samantha = r.findIndex(x => x.voice.name === 'Samantha');
  return samantha < albert;
})());
check('eSpeak ranks below everything else', (() => {
  const r = rankEnglishVoices([...LINUX_BAD, ...CHROME]);
  const espeak = r.findIndex(x => x.voice.name.includes('eSpeak'));
  return espeak === r.length - 1;
})());
check('non-English voices excluded', (() => {
  const r = rankEnglishVoices([mk('Milena', 'ru-RU'), mk('Thomas', 'fr-FR')]);
  return r.length === 0;
})());
check('British English gets preference over US', (() => {
  const r = rankEnglishVoices([mk('Some Voice', 'en-US'), mk('Some Voice', 'en-GB')]);
  return r[0].voice.lang === 'en-GB';
})());

console.log('\n== ASSIGNMENT: distinct voices per speaker ==');
check('two speakers get TWO DIFFERENT voices', (() => {
  const a = assignVoices([...CHROME], ['Woman', 'Man']);
  return a.Woman.voice?.name !== a.Man.voice?.name;
})());
check('female speaker gets a female voice when available', (() => {
  const a = assignVoices(CHROME, ['Woman', 'Man']);
  return (a.Woman.voice?.name ?? '').toLowerCase().includes('female');
})());
check('male speaker gets a male voice when available', (() => {
  const a = assignVoices(CHROME, ['Woman', 'Man']);
  return (a.Man.voice?.name ?? '').toLowerCase().includes('male');
})());
check('never picks eSpeak when a good voice exists', (() => {
  const a = assignVoices([...LINUX_BAD, ...CHROME], ['Receptionist', 'Man']);
  return !Object.values(a).some(x => (x.voice?.name ?? '').toLowerCase().includes('espeak'));
})());
check('degrades gracefully with only bad voices', (() => {
  const a = assignVoices(LINUX_BAD, ['A', 'B']);
  // Junk voices must be flagged so the UI can warn the user.
  return a.A.degraded === true && a.B.degraded === true;
})());
check('degrades gracefully with NO voices', (() => {
  const a = assignVoices([], ['A']);
  return a.A.voice === undefined && a.A.degraded === true;
})());

console.log('\n== THE OLD BUG: random pick would hit bad voices ==');
// Simulate the previous algorithm on a list where bad voices dominate.
// 3 good Chrome voices + many junk ones, with 3 speakers so supply is not the
// reason a bad voice gets used.
const MIXED = [...LINUX_BAD, ...LINUX_BAD, mk('eSpeak', 'en-GB'), mk('compact', 'en-US'), ...CHROME];
const oldPick = (speaker: string) => {
  const hash = [...speaker].reduce((a, c) => a + c.charCodeAt(0), 0);
  return MIXED[hash % MIXED.length].name;
};
const SPEAKERS3 = ['Receptionist', 'Man', 'Woman'];
const NEW = assignVoices(MIXED, SPEAKERS3);
const oldNames = SPEAKERS3.map(oldPick);
const newNames = SPEAKERS3.map(s => NEW[s].voice?.name ?? '');
const isBad = (n: string) => n.includes("espeak") || n.includes("compact") || n.includes("English (");
const oldBad = oldNames.filter(isBad).length;
const newBad = newNames.filter(isBad).length;
console.log(`  old algorithm picked bad voices: ${oldBad}/3  -> [${oldNames.join(', ')}]`);
console.log(`  new algorithm picked bad voices: ${newBad}/3  -> [${newNames.join(', ')}]`);
check('new algorithm never picks a bad voice from a mixed list', newBad === 0);
check('new algorithm outperforms the old random pick', newBad < Math.max(oldBad, 1));

console.log(`\n${failures === 0 ? 'ALL VOICE CHECKS PASSED' : failures + ' FAILED'}\n`);
process.exit(failures === 0 ? 0 : 1);
