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

// Цвета — по цветам рамок icon_gradeN.png (архейджовская система грейдов).
// Для грейда 1 (Обычный) цвет не задан — в игровом клиенте это белый,
// который на светлой теме сайта был бы не виден, поэтому используется
// обычный цвет текста.
export const SEAL_GRADES = [
  { grade: 0, label: "Бесполезный", color: "#9D9D9D" },
  { grade: 1, label: "Обычный", color: null },
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

export function getSealGradeColor(grade: number): string | null {
  return SEAL_GRADES.find((g) => g.grade === grade)?.color ?? null;
}
