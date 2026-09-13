export type CursedSynthesisEffect = {
  id: number;
  label: string;
  value: number;
  isPercent: boolean;
};

export const CURSED_ARMOR_SYNTHESIS_EFFECTS: CursedSynthesisEffect[] = [
  { id: 0, label: "Здоровье", value: 300, isPercent: false },
  { id: 44, label: "Устойчивость к критическому урону", value: 311, isPercent: false },
  { id: 51, label: "Уязвимость к атакам ближнего боя", value: 1.8, isPercent: true },
  { id: 55, label: "Уязвимость к атакам дальнего боя", value: 1.8, isPercent: true },
  { id: 59, label: "Уязвимость к заклинаниям", value: 1.5, isPercent: true },
  { id: 38, label: "Шанс обхода обороны", value: 3.1, isPercent: true },
  { id: 48, label: "Уязвимость к осадному урону", value: 1.6, isPercent: true },
];

export const REBORN_ARMOR_BONUS_SYNTHESIS_EFFECTS: CursedSynthesisEffect[] = [
  { id: 1001, label: "Устойчивость к атакам монстров в ближнем бою", value: 13, isPercent: false },
  { id: 1002, label: "Устойчивость к атакам монстров в дальнем бою", value: 13, isPercent: false },
  { id: 1003, label: "Устойчивость к атакам монстров заклинаниями", value: 13, isPercent: false },
];

const CURSED_ARMOR_ITEM_IDS = new Set([
  55412, 55413, 55414, 55415, 55416, 55417, 55418,
  55419, 55420, 55421, 55422, 55423, 55424, 55425,
  55426, 55427, 55428, 55429, 55430, 55431, 55432,
  55433, 55434, 55435, 55436, 55437, 55438, 55439,
  55440, 55441, 55442, 55443, 55444, 55445, 55446,
]);

const REBORN_ARMOR_ITEM_IDS = new Set([
  900001, 900002, 900003, 900004, 900005, 900006, 900007, 900008, 900009,
  900010, 900011, 900012, 900013, 900014, 900015, 900016, 900017, 900018,
  900019, 900020, 900021, 900022, 900023, 900024, 900025, 900026, 900027,
  900028, 900029, 900030, 900031, 900032, 900033, 900034, 900035,
]);

export function isCursedOrRebornArmorItem(itemId: number): boolean {
  return CURSED_ARMOR_ITEM_IDS.has(itemId) || REBORN_ARMOR_ITEM_IDS.has(itemId);
}

export function isRebornArmorItem(itemId: number): boolean {
  return REBORN_ARMOR_ITEM_IDS.has(itemId);
}

export function getCursedArmorSynthesisSlotPools(
  itemId: number,
): CursedSynthesisEffect[][] {
  if (REBORN_ARMOR_ITEM_IDS.has(itemId)) {
    return [CURSED_ARMOR_SYNTHESIS_EFFECTS, REBORN_ARMOR_BONUS_SYNTHESIS_EFFECTS];
  }
  if (CURSED_ARMOR_ITEM_IDS.has(itemId)) {
    return [CURSED_ARMOR_SYNTHESIS_EFFECTS];
  }
  return [];
}

const ALL_CURSED_ARMOR_EFFECTS = [
  ...CURSED_ARMOR_SYNTHESIS_EFFECTS,
  ...REBORN_ARMOR_BONUS_SYNTHESIS_EFFECTS,
];

export function findCursedArmorSynthesisEffect(
  id: number,
): CursedSynthesisEffect | undefined {
  return ALL_CURSED_ARMOR_EFFECTS.find((e) => e.id === id);
}

export function isValidCursedArmorSynthesisEffectIds(
  itemId: number,
  ids: number[],
): boolean {
  const pools = getCursedArmorSynthesisSlotPools(itemId);
  if (ids.length > pools.length) return false;
  return ids.every((id, i) => pools[i]?.some((e) => e.id === id));
}
