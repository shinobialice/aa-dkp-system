const CHARACTER_LEVEL = 55;

// В данных игры (unit_formulas) парирование, уклонение, блок, точность и шанс
// крита считаются в рейтинге: 1% — это (уровень^1.3 + уровень × 3 + 17) × 100.
const RATING_PER_PERCENT =
  (CHARACTER_LEVEL ** 1.3 + CHARACTER_LEVEL * 3 + 17) * 100;

const PARRY_RATING = 100_000;
const DODGE_RATING = 50_000;
const BLOCK_RATING = 166_000;
const DEFENSE_CHANCE_POWER = 0.26;
const CRIT_LEVEL_POWER = 1.3009;
const ACCURACY_RATING_PER_POINT = 500;

export function computeParry(strTotal: number): number {
  return defenseChance(PARRY_RATING, strTotal);
}

export function computeDodge(dexTotal: number): number {
  return defenseChance(DODGE_RATING, dexTotal);
}

export function computeBlock(staTotal: number): number {
  return defenseChance(BLOCK_RATING, staTotal);
}

export function computeCritChance(
  attrTotal: number,
  heroicLevel: number,
): number {
  return (
    (attrTotal * (CHARACTER_LEVEL + heroicLevel) ** CRIT_LEVEL_POWER) /
    RATING_PER_PERCENT
  );
}

export function computeRatingPercent(points: number): number {
  return (points * 100) / RATING_PER_PERCENT;
}

// Рейтинг точности в данных игры — атрибут × 500; у заклинаний это половина
// интеллекта и половина силы духа. Как и другие формулы от атрибутов, игра
// считает её в целых единицах (здесь — десятых долях процента).
export function computeAttributeAccuracy(attrPoints: number): number {
  return (
    Math.trunc(
      (attrPoints * ACCURACY_RATING_PER_POINT * 10) / RATING_PER_PERCENT,
    ) / 10
  );
}

// Логарифм в формулах игры десятичный (множитель 9.12 в тактике — это ln(10)^2.65).
export function computeTacticalReadiness(strPlusDex: number): number {
  const average = strPlusDex / 2;
  if (average <= 0) return 0;
  return Math.trunc(Math.log10(average) ** 2.65 * 7.9 * 9.12);
}

// Формула игры даёт сокращение в десятых долях процента.
export function computeSkillTimeReduction(intPlusSpi: number): number {
  const scaled = intPlusSpi / 16;
  if (scaled <= 0) return 0;
  return Math.trunc((1.98 * Math.log10(scaled) - 0.1915) * 30.582) / 10;
}

export function computeManaRegen(spiTotal: number): number {
  return Math.trunc(spiTotal * 0.3 + 15);
}

export function computeHealthRegen(staTotal: number): number {
  return Math.trunc((staTotal / 100) * 13 + 50);
}

function defenseChance(rating: number, attrTotal: number): number {
  return (rating * attrTotal ** DEFENSE_CHANCE_POWER) / RATING_PER_PERCENT;
}
