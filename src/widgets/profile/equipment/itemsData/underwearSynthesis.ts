export type UnderwearRole = "боец" | "лучник" | "чародей" | "лекарь";

export type UnderwearSynthesisEffect = {
  id: number;
  role: UnderwearRole;
  label: string;
  value: number;
  isPercent: boolean;
};

export const UNDERWEAR_SYNTHESIS_EFFECTS: UnderwearSynthesisEffect[] = [
  { id: 1, role: "боец", label: "Шанс критического удара в ближнем бою", value: 4.8, isPercent: true },
  { id: 2, role: "боец", label: "Сила атаки в ближнем бою", value: 21.8, isPercent: false },
  { id: 3, role: "боец", label: "Дополнительный урон умений в ближнем бою", value: 3.8, isPercent: true },
  { id: 4, role: "боец", label: "Пробивание брони", value: 522, isPercent: false },
  { id: 5, role: "боец", label: "Тактическая подготовка", value: 660, isPercent: false },
  { id: 6, role: "боец", label: "Защита", value: 723, isPercent: false },
  { id: 7, role: "боец", label: "Сопротивление", value: 723, isPercent: false },
  { id: 8, role: "боец", label: "Здоровье", value: 930, isPercent: false },
  { id: 9, role: "боец", label: "Устойчивость к атакам ближнего боя", value: 6.7, isPercent: true },
  { id: 10, role: "боец", label: "Устойчивость к атакам дальнего боя", value: 6.7, isPercent: true },
  { id: 11, role: "боец", label: "Устойчивость к заклинаниям", value: 6.7, isPercent: true },
  { id: 12, role: "боец", label: "Устойчивость к атакам в PvP", value: 373, isPercent: false },
  { id: 13, role: "боец", label: "Устойчивость к критическому урону", value: 824, isPercent: false },
  { id: 14, role: "боец", label: "Урон в ближнем бою со спины", value: 7.9, isPercent: true },
  { id: 15, role: "боец", label: "Шанс обхода обороны", value: 12, isPercent: true },
  { id: 16, role: "лучник", label: "Шанс критического удара в дальнем бою", value: 4.8, isPercent: true },
  { id: 17, role: "лучник", label: "Сила атаки в дальнем бою", value: 21.8, isPercent: false },
  { id: 18, role: "лучник", label: "Дополнительный урон умений в дальнем бою", value: 3.8, isPercent: true },
  { id: 19, role: "лучник", label: "Пробивание брони", value: 522, isPercent: false },
  { id: 20, role: "лучник", label: "Тактическая подготовка", value: 660, isPercent: false },
  { id: 21, role: "лучник", label: "Защита", value: 723, isPercent: false },
  { id: 22, role: "лучник", label: "Сопротивление", value: 723, isPercent: false },
  { id: 23, role: "лучник", label: "Здоровье", value: 930, isPercent: false },
  { id: 24, role: "лучник", label: "Устойчивость к атакам ближнего боя", value: 6.7, isPercent: true },
  { id: 25, role: "лучник", label: "Устойчивость к атакам дальнего боя", value: 6.7, isPercent: true },
  { id: 26, role: "лучник", label: "Устойчивость к заклинаниям", value: 6.7, isPercent: true },
  { id: 27, role: "лучник", label: "Устойчивость к атакам в PvP", value: 373, isPercent: false },
  { id: 28, role: "лучник", label: "Устойчивость к критическому урону", value: 824, isPercent: false },
  { id: 29, role: "чародей", label: "Шанс критического удара заклинанием", value: 4.8, isPercent: true },
  { id: 30, role: "чародей", label: "Сила заклинаний", value: 21.8, isPercent: false },
  { id: 31, role: "чародей", label: "Дополнительный урон умений заклинаниями", value: 3.8, isPercent: true },
  { id: 32, role: "чародей", label: "Игнорирование сопротивления", value: 522, isPercent: false },
  { id: 33, role: "чародей", label: "Тактическая подготовка", value: 660, isPercent: false },
  { id: 34, role: "чародей", label: "Защита", value: 723, isPercent: false },
  { id: 35, role: "чародей", label: "Сопротивление", value: 723, isPercent: false },
  { id: 36, role: "чародей", label: "Здоровье", value: 930, isPercent: false },
  { id: 37, role: "чародей", label: "Устойчивость к атакам ближнего боя", value: 6.7, isPercent: true },
  { id: 38, role: "чародей", label: "Устойчивость к атакам дальнего боя", value: 6.7, isPercent: true },
  { id: 39, role: "чародей", label: "Устойчивость к заклинаниям", value: 6.7, isPercent: true },
  { id: 40, role: "чародей", label: "Устойчивость к атакам в PvP", value: 373, isPercent: false },
  { id: 41, role: "чародей", label: "Устойчивость к критическому урону", value: 824, isPercent: false },
  { id: 42, role: "лекарь", label: "Шанс критического эффекта исцеления", value: 4.8, isPercent: true },
  { id: 43, role: "лекарь", label: "Эффективность исцеления", value: 21.8, isPercent: false },
  { id: 44, role: "лекарь", label: "Дополнительная эффективность умений целителя", value: 3.8, isPercent: true },
  { id: 45, role: "лекарь", label: "Игнорирование сопротивления", value: 522, isPercent: false },
  { id: 46, role: "лекарь", label: "Тактическая подготовка", value: 660, isPercent: false },
  { id: 47, role: "лекарь", label: "Защита", value: 723, isPercent: false },
  { id: 48, role: "лекарь", label: "Сопротивление", value: 723, isPercent: false },
  { id: 49, role: "лекарь", label: "Здоровье", value: 930, isPercent: false },
  { id: 50, role: "лекарь", label: "Устойчивость к атакам ближнего боя", value: 6.7, isPercent: true },
  { id: 51, role: "лекарь", label: "Устойчивость к атакам дальнего боя", value: 6.7, isPercent: true },
  { id: 52, role: "лекарь", label: "Устойчивость к заклинаниям", value: 6.7, isPercent: true },
  { id: 53, role: "лекарь", label: "Устойчивость к атакам в PvP", value: 373, isPercent: false },
  { id: 54, role: "лекарь", label: "Устойчивость к критическому урону", value: 824, isPercent: false },
];

export function findUnderwearSynthesisEffect(
  id: number,
): UnderwearSynthesisEffect | undefined {
  return UNDERWEAR_SYNTHESIS_EFFECTS.find((e) => e.id === id);
}

export function getUnderwearRole(itemName: string): UnderwearRole | undefined {
  if (itemName.includes("бойца")) return "боец";
  if (itemName.includes("лучника")) return "лучник";
  if (itemName.includes("чародея")) return "чародей";
  if (itemName.includes("лекаря")) return "лекарь";
  return undefined;
}

export function getUnderwearSynthesisEffectsForRole(
  role: UnderwearRole,
): UnderwearSynthesisEffect[] {
  return UNDERWEAR_SYNTHESIS_EFFECTS.filter((e) => e.role === role);
}

export function isValidUnderwearSynthesisEffectId(
  id: number,
  role: UnderwearRole,
): boolean {
  return UNDERWEAR_SYNTHESIS_EFFECTS.some(
    (e) => e.id === id && e.role === role,
  );
}

const UNDERWEAR_SYNTHESIS_BREAKPOINTS: [grade: number, slots: number][] = [
  [2, 1],
  [4, 2],
  [5, 3],
  [6, 4],
  [10, 5],
];

export function getUnderwearSynthesisSlotCount(grade: number): number {
  let slots = 0;
  for (const [breakpointGrade, breakpointSlots] of UNDERWEAR_SYNTHESIS_BREAKPOINTS) {
    if (grade >= breakpointGrade) slots = breakpointSlots;
  }
  return slots;
}
