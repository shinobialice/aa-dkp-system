// Коэффициент масштабирования статов по качеству (индекс = grade, 0-12) —
// снят с archeagecodex.com: один и тот же ряд коэффициентов для всех
// проверенных предметов и статов (броня/сопротивление/атрибуты), только
// базовое (grade=1) значение отличается у каждого предмета.
const GRADE_MULTIPLIERS = [
  0.8, 1.0, 1.05, 1.1, 1.15, 1.2, 1.25, 1.35, 1.5, 1.7, 1.9, 2.0, 2.1,
];

export function scaleStatByGrade(base: number, grade: number): number {
  const mult = GRADE_MULTIPLIERS[grade] ?? GRADE_MULTIPLIERS[1];
  return Math.round(base * mult);
}

// Суммарный прирост базы от заточки эфенскими кубами (официальная таблица
// игры). До +10 куб поднимает предмет сразу с 0 до 10 — промежуточных
// уровней 1-9 не существует.
export const ENCHANT_BONUS_PERCENT: Record<number, number> = {
  0: 0,
  10: 10,
  11: 11,
  12: 12,
  13: 13,
  14: 14,
  15: 15,
  16: 16,
  17: 17,
  18: 18,
  19: 19,
  20: 20,
  21: 20.5,
  22: 21,
  23: 21.5,
  24: 22,
  25: 22.5,
  26: 23,
  27: 23.5,
  28: 24,
  29: 24.5,
  30: 25,
  31: 26,
  32: 27.5,
  33: 29.5,
  34: 32,
  35: 35,
};

export const DEFAULT_ENCHANT = 0;
export const MAX_ENCHANT = 35;

// В самой игре куб прыгает сразу с 0 на 10 (промежуточных +1…+9 не бывает),
// но поле ввода — свободное число 0-35: для непопадающих в таблицу
// уровней bonus просто 0%, это безопасный фолбэк.
export function isValidEnchantLevel(level: number): boolean {
  return Number.isInteger(level) && level >= 0 && level <= MAX_ENCHANT;
}

// Заточка увеличивает только Защиту и Сопротивление — атрибуты не трогает.
const ENCHANT_AFFECTED_STATS = new Set([
  "wearable_armor",
  "wearable_magic_resistance",
]);

export function scaleStat(
  base: number,
  grade: number,
  enchant: number,
  statKey: string,
): number {
  const gradeMult = GRADE_MULTIPLIERS[grade] ?? GRADE_MULTIPLIERS[1];
  const gradeScaled = base * gradeMult;

  if (!ENCHANT_AFFECTED_STATS.has(statKey)) {
    return Math.round(gradeScaled);
  }

  const bonusPercent = ENCHANT_BONUS_PERCENT[enchant] ?? 0;
  return Math.round(gradeScaled * (1 + bonusPercent / 100));
}

export const STAT_ORDER = [
  "wearable_armor",
  "wearable_magic_resistance",
  "str",
  "dex",
  "sta",
  "int",
  "spi",
];

export const STAT_LABELS: Record<string, string> = {
  wearable_armor: "Защита",
  wearable_magic_resistance: "Сопротивление",
  str: "Сила",
  dex: "Ловкость",
  sta: "Выносливость",
  int: "Интеллект",
  spi: "Сила духа",
};
