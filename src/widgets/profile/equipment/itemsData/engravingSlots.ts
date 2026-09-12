export type EngravingCategory = "armor" | "cloak" | "underwear" | "weapon" | "none";

const ARMOR_SLOT_KEYS = new Set([
  "head",
  "chest",
  "belt",
  "bracers",
  "hands",
  "legs",
  "feet",
]);

const WEAPON_SLOT_KEYS = new Set([
  "weapon_main",
  "weapon_off",
  "weapon_ranged",
  "instrument",
]);

export function getEngravingCategory(slotKey: string): EngravingCategory {
  if (ARMOR_SLOT_KEYS.has(slotKey)) return "armor";
  if (slotKey === "cloak") return "cloak";
  if (slotKey === "underwear") return "underwear";
  if (WEAPON_SLOT_KEYS.has(slotKey)) return "weapon";
  return "none";
}

export function getEngravingSlotCount(slotKey: string, grade: number): number {
  const category = getEngravingCategory(slotKey);

  if (category === "armor") {
    if (grade >= 12) return 8;
    if (grade >= 11) return 7;
    if (grade >= 8) return 6;
    if (grade >= 2) return 5;
    return 0;
  }

  if (category === "underwear") {
    if (grade >= 8) return 4;
    if (grade >= 7) return 3;
    if (grade >= 5) return 2;
    if (grade >= 2) return 1;
    return 0;
  }

  if (category === "weapon") {
    if (grade >= 12) return 9;
    if (grade >= 11) return 8;
    if (grade >= 8) return 7;
    if (grade >= 2) return 6;
    return 0;
  }

  return 0;
}
