// Список печатей героя и их редкостей (архейджовская система грейдов
// icon_gradeN.png — та же, что уже используется для инвентаря/лута).

export const SEAL_NAMES = [
  "Олло",
  "Инох",
  "Джин",
  "Мелисара",
  "Верк",
  "Аранзебия",
  "Анна",
  "Аранзеб",
  "Орхидна",
  "Таян",
  "Морфеос",
  "Луций",
  "Кипроза",
  "Наима",
] as const;

export type SealName = (typeof SEAL_NAMES)[number];

export const MAX_USER_SEALS = 3;

// Стиль игры и роли каждой печати (из таблицы бонусов печати.xlsx) — чисто
// справочная информация для UI выбора печати, на сохранение не влияет.
export const SEAL_INFO: Record<
  SealName,
  { playstyle: string; roles: string[] }
> = {
  Олло: { playstyle: "Оборона", roles: ["для танков"] },
  Инох: { playstyle: "Сопротивление", roles: ["для танков"] },
  Джин: { playstyle: "Нападение", roles: ["для миликов"] },
  Мелисара: { playstyle: "Скрытность", roles: ["для миликов"] },
  Верк: { playstyle: "Коварство", roles: ["для миликов"] },
  Аранзебия: { playstyle: "Гипноз", roles: ["для магов", "для танков"] },
  Анна: { playstyle: "Мистицизм", roles: ["для магов", "для танков"] },
  Аранзеб: { playstyle: "Волшебство", roles: ["для магов"] },
  Орхидна: { playstyle: "Гнев", roles: ["для магов"] },
  Таян: { playstyle: "Преследование", roles: ["для луков"] },
  Морфеос: { playstyle: "Стрельба", roles: ["для луков"] },
  Луций: { playstyle: "Воодушевление", roles: ["для луков", "для хилов"] },
  Кипроза: { playstyle: "Исцеление", roles: ["для хилов"] },
  Наима: { playstyle: "Танец", roles: ["для хилов"] },
};

// Цвета ролей — для подсветки тегов вида "(для танков)" в селекте выбора
// печати.
export const SEAL_ROLE_COLORS: Record<string, string> = {
  "для танков": "#4CAF50",
  "для миликов": "#FF9800",
  "для магов": "#B983FF",
  "для луков": "#F2C94C",
  "для хилов": "#FF6FA5",
};

export const SEAL_ICON_URL = "/api/uploads/misc-icons/seal-icon.png";

// Цвета — по цветам рамок icon_gradeN.png (архейджовская система грейдов).
export const SEAL_GRADES = [
  { grade: 0, label: "Бесполезный", color: "#9D9D9D" },
  { grade: 1, label: "Обычный", color: "#BA976D" },
  { grade: 2, label: "Необычный", color: "#72BF59" },
  { grade: 3, label: "Редкий", color: "#3B92FF" },
  { grade: 4, label: "Уникальный", color: "#ED6DFF" },
  { grade: 5, label: "Эпический", color: "#FFC457" },
  { grade: 6, label: "Легендарный", color: "#FF7E50" },
  { grade: 7, label: "Реликвия", color: "#F72D45" },
  { grade: 8, label: "Эпохи чудес", color: "#C97B5E" },
  { grade: 9, label: "Эпохи сказаний", color: "#9FB0AC" },
  { grade: 10, label: "Эпохи легенд", color: "#E0B15A" },
  { grade: 11, label: "Эпохи мифов", color: "#E5493D" },
  { grade: 12, label: "Эпохи Двенадцати", color: "#8C7EE0" },
] as const;

export function isValidSealGrade(grade: number): boolean {
  return SEAL_GRADES.some((g) => g.grade === grade);
}

// Уровень прокачки печати героя: 0 (не качалась) — 144, по 12 уровней на
// каждую редкость выше "Бесполезного" (1-12 = Обычный, 13-24 = Необычный,
// ..., 133-144 = Эпохи Двенадцати). Детальные бонусы по уровням — в
// sealLevelsData.ts.
export const MIN_SEAL_LEVEL = 0;
export const MAX_SEAL_LEVEL = 144;
export const LEVELS_PER_GRADE = 12;
export const DEFAULT_SEAL_LEVEL = 1;

export function isValidSealLevel(level: number): boolean {
  return (
    Number.isInteger(level) &&
    level >= MIN_SEAL_LEVEL &&
    level <= MAX_SEAL_LEVEL
  );
}

// Редкость (см. SEAL_GRADES), которой соответствует уровень прокачки печати.
export function getSealGradeForLevel(level: number): number {
  if (level <= 0) return 0;
  return Math.min(12, Math.ceil(level / LEVELS_PER_GRADE));
}

export function isValidSealName(name: string): name is SealName {
  return (SEAL_NAMES as readonly string[]).includes(name);
}

export function getSealGradeLabel(grade: number): string {
  return SEAL_GRADES.find((g) => g.grade === grade)?.label ?? "Обычный";
}

export function getSealGradeIconUrl(grade: number): string {
  return `/api/uploads/grade-icons/grade${grade}.png`;
}

export function getSealGradeColor(grade: number): string | null {
  return SEAL_GRADES.find((g) => g.grade === grade)?.color ?? null;
}
