import { GAME_ITEM_SYNTHESIS } from "./gameSynthesis";
import {
  signedEffectValue,
  STAT_EFFECTS,
  type StatEffect,
} from "./statEffects";
import type { SynthesisLevel } from "./synthesisTypes";

export const NO_SYNTHESIS_EFFECT = -1;
export const MAX_SYNTHESIS_PERCENT = 100;

export type SynthesisRoll = {
  code: number;
  effect: StatEffect;
  value: number;
};

export function getSynthesisSlotCount(itemId: number, grade: number): number {
  return findLevels(itemId, grade)[0]?.[1].length ?? 0;
}

export function hasSynthesisGrowth(itemId: number, grade: number): boolean {
  return findLevels(itemId, grade).length > 1;
}

export function getSynthesisSlotOptions(
  itemId: number,
  grade: number,
  percent: number,
): SynthesisRoll[][] {
  const levels = findLevels(itemId, grade);
  const slots = levels[0]?.[1] ?? [];
  return slots.map((pool, slot) =>
    Object.keys(pool).flatMap((code) =>
      rollFor(levels, slot, Number(code), percent),
    ),
  );
}

export function getSynthesisRolls(
  itemId: number,
  grade: number,
  codes: number[],
  percent: number,
): SynthesisRoll[] {
  const levels = findLevels(itemId, grade);
  return codes.flatMap((code, slot) => rollFor(levels, slot, code, percent));
}

export function isValidSynthesisSelection(
  itemId: number,
  grade: number,
  codes: number[],
  percent: number,
): boolean {
  if (!Number.isInteger(percent)) return false;
  if (percent < 0 || percent > MAX_SYNTHESIS_PERCENT) return false;
  if (codes.length === 0) return true;
  const slots = findLevels(itemId, grade)[0]?.[1] ?? [];
  if (codes.length > slots.length) return false;
  return codes.every(
    (code, slot) => code === NO_SYNTHESIS_EFFECT || code in slots[slot],
  );
}

export function formatSynthesisValue({ effect, value }: SynthesisRoll): string {
  const sign = value > 0 ? "+" : "";
  const unit = effect.unit === "" ? " ед." : effect.unit;
  return `${sign}${value}${unit}`;
}

function findLevels(itemId: number, grade: number): SynthesisLevel[] {
  const synthesis = GAME_ITEM_SYNTHESIS[itemId];
  if (!synthesis) return [];
  let levels: SynthesisLevel[] = [];
  for (const [levelGrade, gradeLevels] of Object.entries(synthesis)) {
    if (Number(levelGrade) <= grade) levels = gradeLevels;
  }
  return levels;
}

function rollFor(
  levels: SynthesisLevel[],
  slot: number,
  code: number,
  percent: number,
): SynthesisRoll[] {
  const effect = STAT_EFFECTS[code];
  const pool = levels[0]?.[1][slot];
  if (!effect || !pool || !(code in pool)) return [];
  const value = roundEffect(valueAt(levels, slot, code, percent), effect);
  return [{ code, effect, value }];
}

function valueAt(
  levels: SynthesisLevel[],
  slot: number,
  code: number,
  percent: number,
): number {
  let lower = levels[0];
  let upper = levels[levels.length - 1];
  for (const level of levels) {
    if (level[0] <= percent) lower = level;
    if (level[0] >= percent) {
      upper = level;
      break;
    }
  }
  const from = lower[1][slot][code];
  const to = upper[1][slot][code];
  const span = upper[0] - lower[0];
  if (span === 0) return from;
  return from + ((to - from) * (percent - lower[0])) / span;
}

function roundEffect(value: number, effect: StatEffect): number {
  const factor = 10 ** effect.decimals;
  const rounded =
    effect.decimals === 0
      ? Math.floor(value + 1e-8)
      : Math.round(value * factor) / factor;
  return signedEffectValue(effect, rounded);
}
