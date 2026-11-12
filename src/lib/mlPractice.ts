import { ML_LISTENING_PARTS } from '../content/multilevel/listening';
import { ML_READING_PARTS } from '../content/multilevel/reading';
import type { MlLevel } from '../content/multilevel/types';
import { LEVEL_ORDER } from './multilevel';
import type { PracticeSkill } from './mlStorage';

/**
 * PRACTICE MODE
 *
 * `partNumber` is the exam TASK FORMAT (Listening 1-6, Reading 1-5).
 * `difficulty` is the LEVEL of the material.
 *
 * The app keeps them separate so a learner can practise the SAME task format
 * at a different level — "Listening Part 1 at B2", for instance. Where a
 * level has no material for that part number yet, we fall back to the nearest
 * available level and say so, rather than silently showing the wrong thing.
 */

export interface PracticeOption {
  partNumber: number;
  difficulty: MlLevel;
  /** True when this is the closest match rather than an exact one. */
  approximate: boolean;
  title: string;
}

/** Parts available for a skill at a given level, nearest-level fallback. */
export function practiceOptionsFor(
  skill: PracticeSkill,
  level: MlLevel,
): PracticeOption[] {
  const source =
    skill === 'listening'
      ? ML_LISTENING_PARTS.map((p) => ({ partNumber: p.partNumber, difficulty: p.difficulty, title: p.title }))
      : skill === 'reading'
        ? ML_READING_PARTS.map((p) => ({ partNumber: p.partNumber, difficulty: p.difficulty, title: p.title }))
        : [];

  const partNumbers = [...new Set(source.map((p) => p.partNumber))].sort((a, b) => a - b);

  return partNumbers.map((partNumber) => {
    const exact = source.find((p) => p.partNumber === partNumber && p.difficulty === level);
    if (exact) {
      return { partNumber, difficulty: level, approximate: false, title: exact.title };
    }
    // Nearest level available for this part number.
    const candidates = source.filter((p) => p.partNumber === partNumber);
    const targetIndex = LEVEL_ORDER.indexOf(level);
    candidates.sort(
      (a, b) =>
        Math.abs(LEVEL_ORDER.indexOf(a.difficulty) - targetIndex) -
        Math.abs(LEVEL_ORDER.indexOf(b.difficulty) - targetIndex),
    );
    const nearest = candidates[0];
    return {
      partNumber,
      difficulty: nearest.difficulty,
      approximate: true,
      title: nearest.title,
    };
  });
}

/** Levels we actually have material for, in order. */
export function availableLevels(skill: PracticeSkill): MlLevel[] {
  const source =
    skill === 'listening' ? ML_LISTENING_PARTS : skill === 'reading' ? ML_READING_PARTS : [];
  const levels = new Set(source.map((p) => p.difficulty));
  return LEVEL_ORDER.filter((l) => levels.has(l));
}

/**
 * After a practice set, suggest the next level for that skill.
 *   >= 80%  -> move up
 *   <= 40%  -> move down
 *   between -> stay
 */
export function nextLevelFor(
  current: MlLevel,
  correct: number,
  total: number,
  unlocked: MlLevel[],
): { level: MlLevel; direction: 'up' | 'down' | 'stay' } {
  const ratio = total > 0 ? correct / total : 0;
  const index = LEVEL_ORDER.indexOf(current);
  const moveUp = () => {
    const higher = LEVEL_ORDER.slice(index + 1).find((l) => unlocked.includes(l));
    return higher ? { level: higher, direction: 'up' as const } : { level: current, direction: 'stay' as const };
  };
  const moveDown = () => {
    const lower = [...LEVEL_ORDER.slice(0, index)].reverse().find((l) => unlocked.includes(l));
    return lower ? { level: lower, direction: 'down' as const } : { level: current, direction: 'stay' as const };
  };

  if (ratio >= 0.8) return moveUp();
  if (ratio <= 0.4) return moveDown();
  return { level: current, direction: 'stay' };
}

/**
 * A short placement quiz: a handful of items spread across levels. The
 * highest band where the learner scores at least half becomes the start level.
 */
export const PLACEMENT_ITEMS_PER_LEVEL = 3;

export function suggestLevelFromPlacement(
  results: { difficulty: MlLevel; correct: boolean }[],
): MlLevel {
  const byLevel = new Map<MlLevel, { correct: number; total: number }>();
  for (const r of results) {
    const entry = byLevel.get(r.difficulty) ?? { correct: 0, total: 0 };
    entry.total += 1;
    if (r.correct) entry.correct += 1;
    byLevel.set(r.difficulty, entry);
  }

  let best: MlLevel = 'B1';
  for (const level of LEVEL_ORDER) {
    const entry = byLevel.get(level);
    if (!entry || entry.total === 0) continue;
    if (entry.correct / entry.total >= 0.5) best = level;
    else break;
  }
  return best;
}
