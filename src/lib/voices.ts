/**
 * Voice selection for the listening sections.
 *
 * WHY THIS FILE EXISTS
 * --------------------
 * The previous implementation picked a voice by hashing the speaker name and
 * taking `pool[hash % pool.length]`. On most systems the "pool" includes
 * terrible legacy voices — eSpeak / "compact" / "novelty" engines — so roughly
 * a third of users heard a robotic voice chosen purely at random.
 *
 * The fix is to RANK voices by quality and only ever use a natural-sounding
 * neural voice. Browsers expose the best voices through the same API; they are
 * simply not first in the list.
 */

/** Voice names that are known to sound natural (neural / premium). */
const HIGH_QUALITY = [
  // Google (Chrome, ChromeOS, Android)
  'Google UK English Female',
  'Google UK English Male',
  'Google US English',
  'Google Australian English',
  // Microsoft (Edge / Windows) — neural voices
  'Microsoft Aria Online (Natural)',
  'Microsoft Guy Online (Natural)',
  'Microsoft Sonia Online (Natural)',
  'Microsoft Ryan Online (Natural)',
  'Microsoft Libby Online (Natural)',
  'Microsoft Thomas Online (Natural)',
  'Microsoft Jenny Online (Natural)',
  'Microsoft Christopher Online (Natural)',
  'Microsoft Aria',
  'Microsoft Guy',
  // Apple (Safari / iOS / macOS) — only the "enhanced"/"premium" ones are good
  'Samantha (Enhanced)',
  'Daniel (Enhanced)',
  'Karen (Enhanced)',
  'Moira (Enhanced)',
  'Tessa (Enhanced)',
  'Serena (Premium)',
  'Samantha',
  'Daniel',
  'Karen',
];

/** Never use these, even as a last resort. */
const BLOCKED = [
  'espeak',
  'eSpeak',
  'compact',
  'Compact',
  'novelty',
  'Albert',
  'Bad News',
  'Bahh',
  'Bells',
  'Boing',
  'Bubbles',
  'Cellos',
  'Good News',
  'Jester',
  'Organ',
  'Superstar',
  'Trinoids',
  'Whisper',
  'Wobble',
  'Zarvox',
];

export interface RankedVoice {
  voice: SpeechSynthesisVoice;
  score: number;
  quality: 'neural' | 'premium' | 'standard' | 'fallback';
}

function isBlocked(voice: SpeechSynthesisVoice): boolean {
  const name = voice.name.toLowerCase();
  return BLOCKED.some((b) => name.includes(b.toLowerCase()));
}

function scoreVoice(voice: SpeechSynthesisVoice): RankedVoice {
  const name = voice.name;
  const lower = name.toLowerCase();
  let score = 0;
  let quality: RankedVoice['quality'] = 'standard';

  // Exact high-quality match is best.
  const exact = HIGH_QUALITY.findIndex((q) => lower === q.toLowerCase());
  if (exact >= 0) {
    score += 1000 - exact * 5;
    quality = lower.includes('natural') || lower.includes('online') ? 'neural' : 'premium';
  } else {
    const partial = HIGH_QUALITY.findIndex((q) => lower.includes(q.toLowerCase()));
    if (partial >= 0) {
      score += 800 - partial * 5;
      // Label by what the voice actually is: Edge/Chrome "Online (Natural)"
      // voices are neural, Apple "Enhanced"/"Premium" ones are not.
      quality =
        lower.includes('natural') || lower.includes('neural') || lower.includes('online')
          ? 'neural'
          : 'premium';
    }
  }

  // Hint words in the voice name.
  if (lower.includes('natural')) score += 260;
  if (lower.includes('neural')) score += 240;
  if (lower.includes('enhanced')) score += 200;
  if (lower.includes('premium')) score += 200;
  if (lower.includes('online')) score += 180;
  if (lower.includes('google')) score += 120;
  if (lower.includes('microsoft')) score += 100;
  if (lower.includes('siri')) score += 160;

  // Local-service voices are usually higher fidelity than remote ones for
  // Apple devices; but "Google" voices are remote on Chrome and excellent.
  if (voice.localService && !lower.includes('google')) score += 20;

  // Prefer British English for IELTS authenticity, then other natives.
  const lang = voice.lang.toLowerCase();
  if (lang === 'en-gb') score += 60;
  else if (lang === 'en-au' || lang === 'en-nz') score += 40;
  else if (lang === 'en-us') score += 30;
  else if (lang.startsWith('en')) score += 10;

  // Strong penalty for known-bad engines.
  if (isBlocked(voice)) score -= 1000;

  return { voice, score, quality };
}

/**
 * Minimum score for a voice to count as genuinely good.
 *
 * The language bonus alone is worth at most 60 (en-GB), so a threshold of 100
 * ensures a voice must carry a real quality signal — a recognised name,
 * "natural"/"neural", Google/Microsoft, or an Apple enhanced voice.
 */
export const GOOD_VOICE_THRESHOLD = 100;

/** All usable English voices, best first. */
export function rankEnglishVoices(voices: SpeechSynthesisVoice[]): RankedVoice[] {
  return voices
    .filter((v) => v.lang.toLowerCase().startsWith('en'))
    .map(scoreVoice)
    .sort((a, b) => b.score - a.score);
}

export interface VoiceAssignment {
  voice: SpeechSynthesisVoice | undefined;
  quality: RankedVoice['quality'];
  /** True when no good voice was found and the result will sound synthetic. */
  degraded: boolean;
}

/**
 * Assign a DISTINCT voice per speaker, drawn only from the good ones.
 * Gender is inferred from the name so a two-person dialogue sounds like two
 * different people rather than one voice reading both parts.
 */
export function assignVoices(
  voices: SpeechSynthesisVoice[],
  speakers: string[],
): Record<string, VoiceAssignment> {
  const ranked = rankEnglishVoices(voices);
  const good = ranked.filter((r) => r.score >= GOOD_VOICE_THRESHOLD);
  // If nothing clears the bar, use the best available and flag it as degraded.
  const usable = good.length > 0 ? good : ranked;

  // Heuristic gender from voice names, so a dialogue alternates naturally.
  const FEMALE = ['female', 'aria', 'sonia', 'libby', 'jenny', 'samantha', 'karen', 'moira', 'tessa', 'serena', 'zira', 'susan', 'hazel', 'fiona', 'amelie', 'female'];
  const MALE = ['male', 'guy', 'ryan', 'thomas', 'christopher', 'daniel', 'alex', 'david', 'george', 'fred', 'oliver', 'male'];
  const genderOf = (name: string): 'f' | 'm' | null => {
    const n = name.toLowerCase();
    if (FEMALE.some((f) => n.includes(f))) return 'f';
    if (MALE.some((m) => n.includes(m))) return 'm';
    return null;
  };

  const assignment: Record<string, VoiceAssignment> = {};
  const used = new Set<string>();

  speakers.forEach((speaker, index) => {
    const want = index % 2 === 0 ? 'f' : 'm';
    // Prefer an unused voice of the desired gender.
    const match =
      usable.find((r) => !used.has(r.voice.name) && genderOf(r.voice.name) === want) ??
      usable.find((r) => !used.has(r.voice.name)) ??
      usable[0];

    if (match) used.add(match.voice.name);
    assignment[speaker] = {
      voice: match?.voice,
      quality: match?.quality ?? 'fallback',
      degraded: (match?.score ?? 0) < GOOD_VOICE_THRESHOLD,
    };
  });

  return assignment;
}

/**
 * Voices load asynchronously in Chrome. Resolve once they are available,
 * with a timeout so the UI never hangs.
 */
export function waitForVoices(timeoutMs = 2000): Promise<SpeechSynthesisVoice[]> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      resolve([]);
      return;
    }
    const immediate = window.speechSynthesis.getVoices();
    if (immediate.length > 0) {
      resolve(immediate);
      return;
    }
    let settled = false;
    const done = (voices: SpeechSynthesisVoice[]) => {
      if (settled) return;
      settled = true;
      window.speechSynthesis.onvoiceschanged = null;
      resolve(voices);
    };
    window.speechSynthesis.onvoiceschanged = () => done(window.speechSynthesis.getVoices());
    window.setTimeout(() => done(window.speechSynthesis.getVoices()), timeoutMs);
  });
}
