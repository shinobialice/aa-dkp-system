export type CostumeRole = "боец" | "лучник" | "чародей" | "лекарь";

export type CostumeSynthesisEffect = {
  id: number;
  role: CostumeRole;
  label: string;
  value: number;
  isPercent: boolean;
};

export const COSTUME_SYNTHESIS_EFFECTS: CostumeSynthesisEffect[] = [
  { id: 1, role: "боец", label: "Шанс критического удара в ближнем бою", value: 5.4, isPercent: true },
  { id: 2, role: "боец", label: "Критический урон в ближнем бою", value: 22.5, isPercent: true },
  { id: 3, role: "боец", label: "Сила атаки в ближнем бою", value: 47.5, isPercent: false },
  { id: 4, role: "боец", label: "Дополнительный урон умений в ближнем бою", value: 3.6, isPercent: true },
  { id: 5, role: "боец", label: "Дополнительный урон умений в ближнем бою в PvE", value: 6.4, isPercent: true },
  { id: 6, role: "боец", label: "Пробивание брони", value: 755, isPercent: false },
  { id: 7, role: "боец", label: "Тактическая подготовка", value: 960, isPercent: false },
  { id: 8, role: "боец", label: "Защита", value: 1210, isPercent: false },
  { id: 9, role: "боец", label: "Сопротивление", value: 1210, isPercent: false },
  { id: 10, role: "боец", label: "Здоровье", value: 1550, isPercent: false },
  { id: 11, role: "боец", label: "Устойчивость при сражении с монстрами", value: 4.6, isPercent: true },
  { id: 12, role: "боец", label: "Устойчивость к атакам ближнего боя", value: 3.1, isPercent: true },
  { id: 13, role: "боец", label: "Устойчивость к атакам дальнего боя", value: 3.1, isPercent: true },
  { id: 14, role: "боец", label: "Устойчивость к заклинаниям", value: 3.1, isPercent: true },
  { id: 15, role: "боец", label: "Устойчивость к атакам", value: 3.8, isPercent: true },
  { id: 16, role: "боец", label: "Восприимчивость к исцелению", value: 11, isPercent: true },
  { id: 17, role: "боец", label: "Уклонение", value: 3.5, isPercent: true },
  { id: 18, role: "боец", label: "Устойчивость к атакам в PvP", value: 295, isPercent: false },
  { id: 19, role: "боец", label: "Устойчивость к критическому урону", value: 910, isPercent: false },
  { id: 20, role: "боец", label: "Дальность обнаружения скрытных существ", value: 28, isPercent: true },
  { id: 21, role: "боец", label: "Скорость передвижения", value: 5, isPercent: true },
  { id: 22, role: "боец", label: "Парирование", value: 3.5, isPercent: true },
  { id: 23, role: "боец", label: "Блокирование", value: 2.9, isPercent: true },
  { id: 24, role: "боец", label: "Урон в ближнем бою со спины", value: 8.2, isPercent: true },
  { id: 25, role: "лучник", label: "Шанс критического удара в дальнем бою", value: 5.4, isPercent: true },
  { id: 26, role: "лучник", label: "Критический урон в дальнем бою", value: 22.5, isPercent: true },
  { id: 27, role: "лучник", label: "Сила атаки в дальнем бою", value: 47.5, isPercent: false },
  { id: 28, role: "лучник", label: "Дополнительный урон умений в дальнем бою", value: 3.6, isPercent: true },
  { id: 29, role: "лучник", label: "Дополнительный урон умений в дальнем бою в PvE", value: 6.4, isPercent: true },
  { id: 30, role: "лучник", label: "Пробивание брони", value: 755, isPercent: false },
  { id: 31, role: "лучник", label: "Тактическая подготовка", value: 960, isPercent: false },
  { id: 32, role: "лучник", label: "Защита", value: 1210, isPercent: false },
  { id: 33, role: "лучник", label: "Сопротивление", value: 1210, isPercent: false },
  { id: 34, role: "лучник", label: "Здоровье", value: 1550, isPercent: false },
  { id: 35, role: "лучник", label: "Устойчивость при сражении с монстрами", value: 4.6, isPercent: true },
  { id: 36, role: "лучник", label: "Устойчивость к атакам ближнего боя", value: 3.1, isPercent: true },
  { id: 37, role: "лучник", label: "Устойчивость к атакам дальнего боя", value: 3.1, isPercent: true },
  { id: 38, role: "лучник", label: "Устойчивость к заклинаниям", value: 3.1, isPercent: true },
  { id: 39, role: "лучник", label: "Устойчивость к атакам", value: 3.8, isPercent: true },
  { id: 40, role: "лучник", label: "Восприимчивость к исцелению", value: 11, isPercent: true },
  { id: 41, role: "лучник", label: "Уклонение", value: 3.5, isPercent: true },
  { id: 42, role: "лучник", label: "Устойчивость к атакам в PvP", value: 295, isPercent: false },
  { id: 43, role: "лучник", label: "Устойчивость к критическому урону", value: 910, isPercent: false },
  { id: 44, role: "лучник", label: "Дальность обнаружения скрытных существ", value: 28, isPercent: true },
  { id: 45, role: "лучник", label: "Скорость передвижения", value: 5, isPercent: true },
  { id: 46, role: "чародей", label: "Шанс критического удара заклинанием", value: 5.4, isPercent: true },
  { id: 47, role: "чародей", label: "Критический урон заклинаний", value: 22.5, isPercent: true },
  { id: 48, role: "чародей", label: "Сила заклинаний", value: 47.5, isPercent: false },
  { id: 49, role: "чародей", label: "Дополнительный урон умений заклинаниями", value: 3.6, isPercent: true },
  { id: 50, role: "чародей", label: "Дополнительный урон умений заклинаниями в PvE", value: 6.4, isPercent: true },
  { id: 51, role: "чародей", label: "Игнорирование сопротивления", value: 755, isPercent: false },
  { id: 52, role: "чародей", label: "Тактическая подготовка", value: 960, isPercent: false },
  { id: 53, role: "чародей", label: "Защита", value: 1210, isPercent: false },
  { id: 54, role: "чародей", label: "Сопротивление", value: 1210, isPercent: false },
  { id: 55, role: "чародей", label: "Здоровье", value: 1550, isPercent: false },
  { id: 56, role: "чародей", label: "Устойчивость при сражении с монстрами", value: 4.6, isPercent: true },
  { id: 57, role: "чародей", label: "Устойчивость к атакам ближнего боя", value: 3.1, isPercent: true },
  { id: 58, role: "чародей", label: "Устойчивость к атакам дальнего боя", value: 3.1, isPercent: true },
  { id: 59, role: "чародей", label: "Устойчивость к заклинаниям", value: 3.1, isPercent: true },
  { id: 60, role: "чародей", label: "Устойчивость к атакам", value: 3.8, isPercent: true },
  { id: 61, role: "чародей", label: "Восприимчивость к исцелению", value: 11, isPercent: true },
  { id: 62, role: "чародей", label: "Уклонение", value: 3.5, isPercent: true },
  { id: 63, role: "чародей", label: "Устойчивость к атакам в PvP", value: 295, isPercent: false },
  { id: 64, role: "чародей", label: "Устойчивость к критическому урону", value: 910, isPercent: false },
  { id: 65, role: "чародей", label: "Дальность обнаружения скрытных существ", value: 28, isPercent: true },
  { id: 66, role: "чародей", label: "Скорость передвижения", value: 5, isPercent: true },
  { id: 67, role: "чародей", label: "Время применения умений", value: 4.6, isPercent: true },
  { id: 68, role: "лекарь", label: "Шанс критического эффекта исцеления", value: 5.4, isPercent: true },
  { id: 69, role: "лекарь", label: "Критический эффект исцеления", value: 22.5, isPercent: true },
  { id: 70, role: "лекарь", label: "Эффективность исцеления", value: 47.5, isPercent: false },
  { id: 71, role: "лекарь", label: "Дополнительный урон умений заклинаниями", value: 3.6, isPercent: true },
  { id: 72, role: "лекарь", label: "Дополнительный урон умений заклинаниями в PvE", value: 6.4, isPercent: true },
  { id: 73, role: "лекарь", label: "Игнорирование сопротивления", value: 755, isPercent: false },
  { id: 74, role: "лекарь", label: "Тактическая подготовка", value: 960, isPercent: false },
  { id: 75, role: "лекарь", label: "Защита", value: 1210, isPercent: false },
  { id: 76, role: "лекарь", label: "Сопротивление", value: 1210, isPercent: false },
  { id: 77, role: "лекарь", label: "Здоровье", value: 1550, isPercent: false },
  { id: 78, role: "лекарь", label: "Устойчивость при сражении с монстрами", value: 4.6, isPercent: true },
  { id: 79, role: "лекарь", label: "Устойчивость к атакам ближнего боя", value: 3.1, isPercent: true },
  { id: 80, role: "лекарь", label: "Устойчивость к атакам дальнего боя", value: 3.1, isPercent: true },
  { id: 81, role: "лекарь", label: "Устойчивость к заклинаниям", value: 3.1, isPercent: true },
  { id: 82, role: "лекарь", label: "Устойчивость к атакам", value: 3.8, isPercent: true },
  { id: 83, role: "лекарь", label: "Восприимчивость к исцелению", value: 11, isPercent: true },
  { id: 84, role: "лекарь", label: "Уклонение", value: 3.5, isPercent: true },
  { id: 85, role: "лекарь", label: "Устойчивость к атакам в PvP", value: 295, isPercent: false },
  { id: 86, role: "лекарь", label: "Устойчивость к критическому урону", value: 910, isPercent: false },
  { id: 87, role: "лекарь", label: "Дальность обнаружения скрытных существ", value: 28, isPercent: true },
  { id: 88, role: "лекарь", label: "Скорость передвижения", value: 5, isPercent: true },
  { id: 89, role: "лекарь", label: "Время применения умений", value: 4.6, isPercent: true },
  { id: 90, role: "лекарь", label: "Дополнительная эффективность умений целителя", value: 3.6, isPercent: true },
];

export function findCostumeSynthesisEffect(
  id: number,
): CostumeSynthesisEffect | undefined {
  return COSTUME_SYNTHESIS_EFFECTS.find((e) => e.id === id);
}

export function getCostumeRole(itemName: string): CostumeRole | undefined {
  if (itemName.includes("бойца")) return "боец";
  if (itemName.includes("лучника")) return "лучник";
  if (itemName.includes("чародея")) return "чародей";
  if (itemName.includes("лекаря")) return "лекарь";
  return undefined;
}

export function getCostumeSynthesisEffectsForRole(
  role: CostumeRole,
): CostumeSynthesisEffect[] {
  return COSTUME_SYNTHESIS_EFFECTS.filter((e) => e.role === role);
}

export function isValidCostumeSynthesisEffectId(
  id: number,
  role: CostumeRole,
): boolean {
  return COSTUME_SYNTHESIS_EFFECTS.some((e) => e.id === id && e.role === role);
}

const COSTUME_SYNTHESIS_BREAKPOINTS: [grade: number, slots: number][] = [
  [2, 1],
  [3, 2],
  [4, 3],
  [6, 4],
  [10, 5],
];

export function getCostumeSynthesisSlotCount(grade: number): number {
  let slots = 0;
  for (const [breakpointGrade, breakpointSlots] of COSTUME_SYNTHESIS_BREAKPOINTS) {
    if (grade >= breakpointGrade) slots = breakpointSlots;
  }
  return slots;
}
