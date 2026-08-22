// Список печатей героя и их редкостей (архейджовская система грейдов
// icon_gradeN.png — та же, что уже используется для инвентаря/лута).

export const SEAL_NAMES = [
  "Джин",
  "Аранзебия",
  "Олло",
  "Инох",
  "Анна",
  "Таян",
  "Аранзеб",
  "Мелисара",
  "Луций",
  "Кипроза",
  "Орхидна",
  "Верк",
  "Морфеос",
  "Наима",
] as const;

export type SealName = (typeof SEAL_NAMES)[number];

export const MAX_USER_SEALS = 3;

export const SEAL_ICON_URL = "https://archeagecodex.com/items/icon_item_5888.png";

export const SEAL_GRADES = [
  { grade: 0, label: "Бесполезный" },
  { grade: 1, label: "Обычный" },
  { grade: 2, label: "Необычный" },
  { grade: 3, label: "Редкий" },
  { grade: 4, label: "Уникальный" },
  { grade: 5, label: "Эпический" },
  { grade: 6, label: "Легендарный" },
  { grade: 7, label: "Реликвия" },
  { grade: 8, label: "Эпохи чудес" },
  { grade: 9, label: "Эпохи сказаний" },
  { grade: 10, label: "Эпохи легенд" },
  { grade: 11, label: "Эпохи мифов" },
  { grade: 12, label: "Эпохи Двенадцати" },
] as const;

export const DEFAULT_SEAL_GRADE = 1;

export function isValidSealGrade(grade: number): boolean {
  return SEAL_GRADES.some((g) => g.grade === grade);
}

export function isValidSealName(name: string): name is SealName {
  return (SEAL_NAMES as readonly string[]).includes(name);
}

export function getSealGradeLabel(grade: number): string {
  return (
    SEAL_GRADES.find((g) => g.grade === grade)?.label ?? "Обычный"
  );
}

export function getSealGradeIconUrl(grade: number): string {
  return `https://archeagecodex.com/images/icon_grade${grade}.png`;
}
