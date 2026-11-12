import type { Cefr } from '../types';

/**
 * Official IELTS Listening raw-score to band conversion (Academic/General
 * Listening is the same). Scores are out of 40.
 */
const LISTENING_TABLE: [number, number][] = [
  [39, 9], [37, 8.5], [35, 8], [32, 7.5], [30, 7], [26, 6.5],
  [23, 6], [18, 5.5], [16, 5], [13, 4.5], [11, 4], [8, 3.5],
  [6, 3], [4, 2.5], [3, 2], [2, 1.5], [1, 1], [0, 0],
];

/** Academic Reading raw-score to band conversion. */
const READING_TABLE: [number, number][] = [
  [39, 9], [37, 8.5], [35, 8], [33, 7.5], [30, 7], [27, 6.5],
  [23, 6], [19, 5.5], [15, 5], [13, 4.5], [10, 4], [8, 3.5],
  [6, 3], [4, 2.5], [3, 2], [2, 1.5], [1, 1], [0, 0],
];

function bandFromTable(table: [number, number][], correct: number): number {
  for (const [minCorrect, band] of table) {
    if (correct >= minCorrect) return band;
  }
  return 0;
}

export function listeningBand(correct: number): number {
  return bandFromTable(LISTENING_TABLE, Math.max(0, Math.min(40, correct)));
}

export function readingBand(correct: number): number {
  return bandFromTable(READING_TABLE, Math.max(0, Math.min(40, correct)));
}

/** IELTS band to CEFR level (public conversion widely used by test providers). */
export function bandToCefr(band: number): Cefr {
  if (band >= 8.5) return 'C2';
  if (band >= 7) return 'C1';
  if (band >= 5.5) return 'B2';
  if (band >= 4) return 'B1';
  if (band >= 3) return 'A2';
  return 'A1';
}

export const CEFR_DESCRIPTIONS: Record<Cefr, string> = {
  C2: 'Mastery — understands with ease virtually everything heard or read.',
  C1: 'Advanced — fluent and effective use of the language for complex purposes.',
  B2: 'Upper-intermediate — clear, detailed communication on a wide range of topics.',
  B1: 'Intermediate — handles familiar matters and most everyday situations.',
  A2: 'Elementary — simple, direct exchange of routine information.',
  A1: 'Beginner — basic phrases and very familiar everyday expressions.',
};

/** IELTS rounds the average of the four skills to the nearest half band. */
export function overallBand(bands: number[]): number | null {
  if (bands.length === 0) return null;
  const mean = bands.reduce((a, b) => a + b, 0) / bands.length;
  return Math.round(mean * 2) / 2;
}

export function formatBand(band: number | null | undefined): string {
  if (band === null || band === undefined) return '—';
  return Number.isInteger(band) ? band.toFixed(1) : band.toFixed(1);
}

/* ------------------------------------------------------------------ */
/* Answer checking                                                     */
/* ------------------------------------------------------------------ */

const REGEX_SPECIALS = new Set<string>([
  ...'./^$*+?()|[]{}',
  '-',
  String.fromCharCode(92), // backslash
]);
const BACKSLASH = String.fromCharCode(92);

/** Escape a literal string so it can be used inside a RegExp. */
export function escapeRegex(text: string): string {
  let out = '';
  for (const ch of text) {
    out += REGEX_SPECIALS.has(ch) ? BACKSLASH + ch : ch;
  }
  return out;
}

const SHORT_TOKENS = new Set([
  'yes', 'no', 'true', 'false', 'not', 'given', 'ng', 'y', 'n',
]);

const NUMBER_UNITS: Record<string, number> = {
  zero: 0, one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7,
  eight: 8, nine: 9, ten: 10, eleven: 11, twelve: 12, thirteen: 13,
  fourteen: 14, fifteen: 15, sixteen: 16, seventeen: 17, eighteen: 18,
  nineteen: 19,
};

const NUMBER_TENS: Record<string, number> = {
  twenty: 20, thirty: 30, forty: 40, fifty: 50, sixty: 60, seventy: 70,
  eighty: 80, ninety: 90,
};

function isNumberWord(word: string): boolean {
  return (
    word in NUMBER_UNITS ||
    word in NUMBER_TENS ||
    word === 'hundred' ||
    word === 'thousand'
  );
}

/**
 * Convert spelled-out numbers to digits so "twenty-two" and "22" both match,
 * which is how IELTS accepts gap-fill answers.
 */
export function wordsToDigits(value: string): string {
  const tokens = value.split(' ');
  const out: string[] = [];
  let i = 0;

  while (i < tokens.length) {
    if (!isNumberWord(tokens[i])) {
      out.push(tokens[i]);
      i += 1;
      continue;
    }
    let total = 0;
    let current = 0;
    let j = i;
    while (j < tokens.length) {
      const word = tokens[j];
      // allow "one hundred and twenty"
      if (word === 'and' && j > i && isNumberWord(tokens[j + 1] ?? '')) {
        j += 1;
        continue;
      }
      if (word in NUMBER_UNITS) {
        current += NUMBER_UNITS[word];
      } else if (word in NUMBER_TENS) {
        current += NUMBER_TENS[word];
      } else if (word === 'hundred') {
        current = (current || 1) * 100;
      } else if (word === 'thousand') {
        total += (current || 1) * 1000;
        current = 0;
      } else {
        break;
      }
      j += 1;
    }
    out.push(String(total + current));
    i = j;
  }

  return out.join(' ');
}

export function normaliseAnswer(value: string): string {
  let v = value
    .toLowerCase()
    .replace(/[\u2018\u2019\u02bc]/g, "'")
    .replace(/[\u201c\u201d]/g, '"')
    .trim();

  // 14th -> 14, 21st -> 21
  v = v.replace(/\b(\d+)(st|nd|rd|th)\b/g, '$1');
  // Remove currency symbols and commas in numbers
  v = v.replace(/[£$€]/g, ' ').replace(/(\d),(?=\d)/g, '$1');
  v = v.replace(/[.?!"'()[\]{},:;£$€%]/g, ' ');
  v = v.replace(/[-–—_/\\]/g, ' ');
  v = v.replace(/\s+/g, ' ').trim();
  // Spelled-out numbers become digits: "twenty two" -> "22"
  v = wordsToDigits(v);
  // Drop a leading article
  v = v.replace(/^(a|an|the)\s+/, '');
  return v;
}

/**
 * Mark an answer. Accepts "answer|alternative" syntax and forgiving
 * whole-word containment for short noun answers (e.g. "Room 12" for "12").
 */
export function isCorrect(given: string | undefined, answer: string): boolean {
  if (!given) return false;
  const g = normaliseAnswer(given);
  if (!g) return false;

  const options = answer.split('|').map((a) => normaliseAnswer(a)).filter(Boolean);

  for (const option of options) {
    if (g === option) return true;
  }

  for (const option of options) {
    if (SHORT_TOKENS.has(option)) continue;
    if (option.split(' ').length > 2) continue;

    // Single-letter answers (paragraph matching, A-J): accept "paragraph d"
    // and "d" but nothing looser, so a stray letter cannot score.
    if (option.length === 1) {
      const letterOnly = g.replace(/^(paragraph|section|para)\s+/, '').trim();
      if (letterOnly === option) return true;
      continue;
    }

    // Numbers may be embedded ("7 pm", "room 12"); words must be whole.
    if (option.length < 3 && !/^\d+$/.test(option)) continue;

    const escaped = escapeRegex(option);
    if (new RegExp(`(^|\\s)${escaped}($|\\s)`).test(g)) return true;
  }

  return false;
}

/** Count how many questions were answered correctly. */
export function countCorrect(
  answers: Record<number, string>,
  questions: { number: number; answer: string }[],
): number {
  return questions.reduce(
    (total, q) => total + (isCorrect(answers[q.number], q.answer) ? 1 : 0),
    0,
  );
}

/* ------------------------------------------------------------------ */
/* Writing heuristics                                                  */
/* ------------------------------------------------------------------ */

const LINKERS = [
  'however', 'moreover', 'furthermore', 'therefore', 'consequently', 'nevertheless',
  'in addition', 'for example', 'for instance', 'on the other hand', 'in contrast',
  'whereas', 'although', 'despite', 'because', 'while', 'firstly', 'secondly',
  'finally', 'in conclusion', 'to conclude', 'overall', 'as a result', 'thus',
  'similarly', 'in particular', 'notably', 'meanwhile', 'hence', 'in summary',
];

const ACADEMIC_TERMS = [
  'significant', 'substantial', 'considerable', 'demonstrate', 'indicate', 'suggest',
  'evidence', 'factor', 'impact', 'trend', 'proportion', 'percentage', 'increase',
  'decrease', 'decline', 'rise', 'grow', 'majority', 'minority', 'approximately',
  'respectively', 'corresponding', 'consequence', 'benefit', 'drawback', 'advantage',
  'disadvantage', 'perspective', 'argue', 'justify', 'foster', 'enhance', 'reduce',
  'contribute', 'support', 'oppose', 'consumption', 'generation', 'employment',
  'education', 'opportunity', 'society', 'individual', 'policy', 'economic',
];

export interface WritingAnalysis {
  words: number;
  sentences: number;
  paragraphs: number;
  avgSentenceLength: number;
  uniqueRatio: number;
  linkerCount: number;
  academicCount: number;
  longWordRatio: number;
  repeated: { word: string; count: number }[];
}

const STOP_WORDS = new Set([
  'the', 'a', 'an', 'and', 'or', 'but', 'if', 'of', 'to', 'in', 'on', 'at', 'for',
  'with', 'by', 'from', 'as', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
  'it', 'its', 'this', 'that', 'these', 'those', 'they', 'them', 'their', 'there',
  'we', 'our', 'you', 'your', 'i', 'he', 'she', 'his', 'her', 'not', 'no', 'do',
  'does', 'did', 'has', 'have', 'had', 'will', 'would', 'can', 'could', 'should',
  'may', 'might', 'must', 'more', 'most', 'also', 'than', 'then', 'so', 'such',
  'which', 'who', 'whom', 'what', 'when', 'where', 'why', 'how', 'all', 'any',
  'some', 'one', 'two', 'about', 'into', 'over', 'very', 'many', 'much',
]);

export function analyseWriting(text: string): WritingAnalysis {
  const trimmed = text.trim();
  const wordList = trimmed ? trimmed.split(/\s+/).filter((w) => /[a-zA-Z0-9]/.test(w)) : [];
  const words = wordList.length;

  const lower = wordList.map((w) => w.toLowerCase().replace(/[^a-z']/g, '')).filter(Boolean);
  const unique = new Set(lower).size;

  const sentences = trimmed
    ? trimmed.split(/[.!?]+(?:\s|$)/).map((s) => s.trim()).filter((s) => s.split(/\s+/).length > 2).length
    : 0;

  const paragraphs = trimmed
    ? trimmed.split(/\n\s*\n|\n/).map((p) => p.trim()).filter((p) => p.length > 30).length
    : 0;

  // Punctuation must be stripped so "However," and "result." still count.
  const lowerText = ` ${trimmed
    .toLowerCase()
    .replace(/[^a-z0-9\s'_-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()} `;
  const countPhrase = (phrase: string): number => {
    const escaped = escapeRegex(phrase);
    return (lowerText.match(new RegExp(` ${escaped} `, 'g')) ?? []).length;
  };
  const linkerCount = LINKERS.reduce((count, linker) => count + countPhrase(linker), 0);
  const academicCount = ACADEMIC_TERMS.reduce((count, term) => count + countPhrase(term), 0);

  const longWords = lower.filter((w) => w.length >= 8).length;
  const longWordRatio = lower.length ? longWords / lower.length : 0;

  const freq = new Map<string, number>();
  for (const w of lower) {
    if (w.length < 5 || STOP_WORDS.has(w)) continue;
    freq.set(w, (freq.get(w) ?? 0) + 1);
  }
  const repeated = [...freq.entries()]
    .filter(([, c]) => c >= 4)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([word, count]) => ({ word, count }));

  return {
    words,
    sentences,
    paragraphs,
    avgSentenceLength: sentences ? Math.round((words / sentences) * 10) / 10 : 0,
    uniqueRatio: lower.length ? Math.round((unique / lower.length) * 100) / 100 : 0,
    linkerCount,
    academicCount,
    longWordRatio: Math.round(longWordRatio * 100) / 100,
    repeated,
  };
}

export interface WritingFeedback {
  band: number;
  wordCountOk: boolean;
  analysis: WritingAnalysis;
  strengths: string[];
  improvements: string[];
}

export function assessWriting(
  text: string,
  task: 1 | 2,
  minWords: number,
): WritingFeedback {
  const a = analyseWriting(text);
  const strengths: string[] = [];
  const improvements: string[] = [];

  // Bands are built from a 4.0 baseline: meeting every criterion lands near
  // 6.0-6.5, and only genuinely strong responses reach 7.5+.
  let score = 4.4;

  const targetWords = minWords;
  const wordRatio = a.words / targetWords;

  if (a.words === 0) {
    return {
      band: 0,
      wordCountOk: false,
      analysis: a,
      strengths: [],
      improvements: ['Write your response before submitting.'],
    };
  }

  // Task achievement
  if (wordRatio >= 1.35) { score += 0.9; strengths.push(`Comfortably over the ${targetWords}-word minimum, giving you room to develop ideas.`); }
  else if (wordRatio >= 1.1) { score += 0.6; strengths.push(`Meets and exceeds the ${targetWords}-word minimum.`); }
  else if (wordRatio >= 1) { score += 0.35; strengths.push(`Meets the ${targetWords}-word minimum.`); }
  else if (wordRatio >= 0.85) { score -= 0.5; improvements.push(`You are slightly under the ${targetWords}-word minimum — aim for at least ${targetWords} words.`); }
  else { score -= 1.2; improvements.push(`Well under the ${targetWords}-word minimum. Under-length responses lose marks for Task Achievement.`); }

  // Coherence: paragraphs
  const expectedParagraphs = task === 1 ? 3 : 4;
  if (a.paragraphs >= expectedParagraphs) { score += 0.55; strengths.push(`Clear paragraphing (${a.paragraphs} paragraphs) that guides the reader.`); }
  else if (a.paragraphs >= 2) { score += 0.1; improvements.push(task === 1
    ? 'Use three paragraphs: an introduction, an overview and a detailed comparison.'
    : 'Organise your essay into four paragraphs: introduction, two body paragraphs and a conclusion.'); }
  else { score -= 0.6; improvements.push('Break the response into distinct paragraphs — a single block of text loses Coherence marks.'); }

  // Lexical resource
  if (a.uniqueRatio >= 0.55) { score += 0.7; strengths.push('Good vocabulary range with little repetition.'); }
  else if (a.uniqueRatio >= 0.48) { score += 0.45; strengths.push('Reasonable vocabulary range across the response.'); }
  else if (a.uniqueRatio >= 0.4) { score += 0.15; }
  else { score -= 0.4; improvements.push('Vary your vocabulary — too many words are repeated.'); }

  if (a.longWordRatio >= 0.12) { score += 0.3; strengths.push('Uses some less common, academic vocabulary.'); }
  else { improvements.push('Try more precise academic vocabulary instead of common general words.'); }

  if (a.academicCount >= 5) { score += 0.2; }

  // Cohesion
  if (a.linkerCount >= 7) { score += 0.6; strengths.push(`Effective use of linking words (${a.linkerCount} found).`); }
  else if (a.linkerCount >= 4) { score += 0.3; strengths.push(`Uses cohesive devices (${a.linkerCount} found).`); }
  else if (a.linkerCount >= 2) { score += 0.05; improvements.push('Add a few more cohesive devices (however, furthermore, as a result).'); }
  else { score -= 0.35; improvements.push('Use linking words to connect ideas: however, moreover, therefore, for instance.'); }

  // Grammatical range (sentence length proxy)
  if (a.avgSentenceLength >= 12 && a.avgSentenceLength <= 24) { score += 0.5; strengths.push('Sentence length suggests a good mix of simple and complex structures.'); }
  else if (a.avgSentenceLength > 30) { score -= 0.25; improvements.push('Some sentences look very long — split them to keep meaning clear.'); }
  else if (a.avgSentenceLength < 9) { score -= 0.3; improvements.push('Link short sentences together to show grammatical range.'); }

  if (task === 1 && !/overall|in general|broadly/i.test(text)) {
    improvements.push('Task 1 needs an explicit overview sentence (e.g. "Overall, ...") — this is essential for Band 6+.');
    score -= 0.3;
  }

  if (a.repeated.length > 0) {
    improvements.push(
      `Repeated words to paraphrase: ${a.repeated.map((r) => `${r.word} (${r.count}×)`).join(', ')}.`,
    );
  }

  const band = Math.max(1, Math.min(9, Math.round(score * 2) / 2));

  if (strengths.length === 0) strengths.push('You submitted a response — now work on length and structure.');

  return {
    band,
    wordCountOk: a.words >= targetWords,
    analysis: a,
    strengths,
    improvements,
  };
}
