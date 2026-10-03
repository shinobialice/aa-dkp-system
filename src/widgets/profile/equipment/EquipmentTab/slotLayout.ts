import { EQUIPMENT_SLOTS, type EquipmentSlot } from "../equipmentData";

export const DEFAULT_GRADE = 1;

const ARMOR_SLOTS = [
  "head",
  "chest",
  "belt",
  "bracers",
  "hands",
  "legs",
  "feet",
];
const WEAPON_SLOTS = ["weapon_main", "weapon_off", "weapon_ranged"];

// Заточка кубами есть только у брони и оружия.
export const CUBE_ELIGIBLE_SLOTS = new Set([...ARMOR_SLOTS, ...WEAPON_SLOTS]);

function slotsFor(keys: string[]): EquipmentSlot[] {
  return keys.flatMap((key) =>
    EQUIPMENT_SLOTS.filter((slot) => slot.key === key),
  );
}

export const TOP_SLOTS = slotsFor(["costume"]);

export const LEFT_SLOTS = slotsFor([
  "head",
  "chest",
  "belt",
  "bracers",
  "hands",
  "cloak",
  "legs",
  "feet",
  "underwear",
]);

export const RIGHT_SLOTS = slotsFor([
  "necklace",
  "earring1",
  "earring2",
  "ring1",
  "ring2",
  ...WEAPON_SLOTS,
  "instrument",
]);

export const LIST_GROUPS = [
  { title: "Доспехи", slots: slotsFor(ARMOR_SLOTS) },
  {
    title: "Плащ, костюм и бельё",
    slots: slotsFor(["cloak", "costume", "underwear"]),
  },
  {
    title: "Украшения",
    slots: slotsFor(["necklace", "earring1", "earring2", "ring1", "ring2"]),
  },
  {
    title: "Оружие и инструмент",
    slots: slotsFor([...WEAPON_SLOTS, "instrument"]),
  },
];

export function getFixedGrade(name: string, grade: number): number | null {
  if (name.includes("проклятого") || name.includes("возрожденного")) return 12;
  if (name.includes("ранга")) return grade;
  return null;
}
