import type { MlAward, MlLevel } from '../content/multilevel/types';

/**
 * MULTILEVEL (Uzbekistan) SCORING
 *
 * Every section is scored on the 0-75 scale. The overall result is the
 * AVERAGE of the four sections, which is then placed on the certificate
 * bands:
 *
 *     C1        65 - 75
 *     B2        51 - 64
 *     B1        38 - 50
 *     Below B1   0 - 37
 *
 * The real exam computes Listening/Reading with a Rasch model, which is not
 * published as a raw-score table. The curve below is calibrated on the
 * best-known anchor points (18/35 -> 38, 24/35 -> 51, 28/35 -> 65,
 * 35/35 -> 75) and is therefore an APPROXIMATION. It is labelled as such in
 * the interface. Replace `anchorPoints` with real data if it becomes
 * available and the whole app follows automatically.
 */

export const SECTION_MAX = 75;

/** (correct answers out of 35, section score out of 75) */
const anchorPoints: [number, number][] = [
  [0, 0],
  [18, 38],
  [24, 51],
  [28, 65],
  [35, 75],
];

/**
 * Piecewise-linear interpolation between the anchor points. Monotonic, so a
 * higher raw score can never produce a lower section score.
 */
export function rawToSectionScore(correct: number, total = 35): number {
  const clampedTotal = total > 0 ? total : 35;
  const scaled = (correct / clampedTotal) * 35;
  const points = anchorPoints.slice();

  for (let i = 0; i < points.length - 1; i += 1) {
    const [x1, y1] = points[i];
    const [x2, y2] = points[i + 1];
    if (scaled <= x2) {
      const ratio = x2 === x1 ? 0 : (scaled - x1) / (x2 - x1);
      const value = y1 + ratio * (y2 - y1);
      return Math.round(value * 10) / 10;
    }
  }
  return SECTION_MAX;
}

/** Certificate award from an overall average (0-75). */
export function scoreToAward(overall: number): MlAward {
  if (overall >= 65) return 'C1';
  if (overall >= 51) return 'B2';
  if (overall >= 38) return 'B1';
  return 'Below B1';
}

/**
 * Indicative level for a single section score. A section is not certified on
 * its own, but learners expect per-section feedback, so the same bands are
 * applied and clearly labelled as indicative.
 */
export function sectionScoreToLevel(score: number): MlLevel | null {
  if (score >= 65) return 'C1';
  if (score >= 51) return 'B2';
  if (score >= 38) return 'B1';
  return null;
}

/** Human label for an award. */
export function awardLabel(award: MlAward): string {
  return award === 'Below B1' ? 'Below B1' : award;
}

export function awardRange(award: MlAward): string {
  switch (award) {
    case 'C1':
      return '65 – 75';
    case 'B2':
      return '51 – 64';
    case 'B1':
      return '38 – 50';
    default:
      return '0 – 37';
  }
}

export function awardColorClass(award: MlAward): string {
  switch (award) {
    case 'C1':
      return 'badge-ok';
    case 'B2':
      return 'badge-brand';
    case 'B1':
      return 'badge-warn';
    default:
      return 'badge-bad';
  }
}

/** Average of the sections that have been attempted. */
export function averageScore(scores: number[]): number | null {
  const valid = scores.filter((s) => typeof s === 'number' && Number.isFinite(s));
  if (valid.length === 0) return null;
  const mean = valid.reduce((a, b) => a + b, 0) / valid.length;
  return Math.round(mean * 10) / 10;
}

/* ------------------------------------------------------------------ */
/* CEFR descriptors used on the results screen                        */
/* ------------------------------------------------------------------ */

export const MULTILEVEL_DESCRIPTORS: Record<string, string> = {
  C1: 'Can understand demanding, longer texts and use English effectively for academic, professional and social purposes.',
  B2: 'Can discuss a range of topics, explain and defend an opinion, and write clear, detailed essays.',
  B1: 'Can deal with most travel situations, describe experiences, and write simple connected text on familiar topics.',
  'Below B1':
    'Currently at A1–A2: can introduce yourself, answer simple questions and handle everyday situations such as shopping and directions.',
};

export const LEVEL_ORDER: MlLevel[] = ['A1', 'A2', 'B1', 'B2', 'C1'];

/* ------------------------------------------------------------------ */
/* Writing section scoring                                            */
/* ------------------------------------------------------------------ */

/**
 * Part 1 is worth one third of the Writing section and Part 2 two thirds.
 * Within Part 1, Task 1.1 (~50 words) and Task 1.2 (120-150 words) are
 * weighted 1:2, which keeps the official 1/3 : 2/3 split between the parts
 * while respecting each task's length.
 *
 *     1.1 = 1/9   1.2 = 2/9   Task 2 = 6/9
 */
export const WRITING_WEIGHTS = { 'ml-w1': 1 / 9, 'ml-w2': 2 / 9, 'ml-w3': 6 / 9 } as const;

/** Combine per-task 0-75 estimates into the section score. */
export function combineWritingScores(
  scores: Partial<Record<keyof typeof WRITING_WEIGHTS, number>>,
): number {
  let total = 0;
  let weightUsed = 0;
  for (const [taskId, weight] of Object.entries(WRITING_WEIGHTS) as [
    keyof typeof WRITING_WEIGHTS,
    number,
  ][]) {
    const value = scores[taskId];
    if (typeof value !== 'number') continue;
    total += value * weight;
    weightUsed += weight;
  }
  if (weightUsed === 0) return 0;
  // Normalise if only some tasks were completed.
  return Math.round((total / weightUsed) * 10) / 10;
}

/* ------------------------------------------------------------------ */
/* Speaking section scoring                                           */
/* ------------------------------------------------------------------ */

/**
 * The four stages map onto increasing levels, so higher stages carry more of
 * the total: 1.1 A1-A2 (15%), 1.2 B1 (20%), 2 B2 (30%), 3 C1 (35%).
 */
export const SPEAKING_WEIGHTS = {
  'ml-s11': 0.15,
  'ml-s12': 0.2,
  'ml-s2': 0.3,
  'ml-s3': 0.35,
} as const;

export function combineSpeakingScores(
  scores: Partial<Record<keyof typeof SPEAKING_WEIGHTS, number>>,
): number {
  let total = 0;
  let weightUsed = 0;
  for (const [stageId, weight] of Object.entries(SPEAKING_WEIGHTS) as [
    keyof typeof SPEAKING_WEIGHTS,
    number,
  ][]) {
    const value = scores[stageId];
    if (typeof value !== 'number') continue;
    total += value * weight;
    weightUsed += weight;
  }
  if (weightUsed === 0) return 0;
  return Math.round((total / weightUsed) * 10) / 10;
}

/** Section score (0-75) -> a 0-9 style band used by the writing heuristics. */
export function sectionScoreToBand(score: number): number {
  // 0-75 mapped onto roughly 3.0-9.0 for reuse of the existing feedback text.
  const ratio = Math.max(0, Math.min(1, score / 75));
  return Math.round((3 + ratio * 6) * 2) / 2;
}

export function bandToSectionScore(band: number): number {
  const clamped = Math.max(3, Math.min(9, band));
  return Math.round(((clamped - 3) / 6) * 75 * 10) / 10;
}

export function formatScore(score: number | null | undefined): string {
  if (score === null || score === undefined) return '—';
  return Number.isInteger(score) ? String(score) : score.toFixed(1);
}
