export type EngravingCategory =
  | "armor"
  | "cloak"
  | "underwear"
  | "weapon"
  | "jewelry"
  | "none";

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

const JEWELRY_SLOT_KEYS = new Set(["ring1", "ring2", "earring1", "earring2"]);

export function getEngravingCategory(slotKey: string): EngravingCategory {
  if (ARMOR_SLOT_KEYS.has(slotKey)) return "armor";
  if (slotKey === "cloak") return "cloak";
  if (slotKey === "underwear") return "underwear";
  if (WEAPON_SLOT_KEYS.has(slotKey)) return "weapon";
  if (JEWELRY_SLOT_KEYS.has(slotKey)) return "jewelry";
  return "none";
}

type SlotThreshold = [minGrade: number, slots: number];

const SLOT_THRESHOLDS: Partial<
  Record<EngravingCategory | "beltOrBracers", SlotThreshold[]>
> = {
  beltOrBracers: [
    [12, 6],
    [11, 5],
    [8, 4],
    [2, 3],
  ],
  armor: [
    [12, 8],
    [11, 7],
    [8, 6],
    [2, 5],
  ],
  underwear: [
    [8, 4],
    [7, 3],
    [5, 2],
    [2, 1],
  ],
  weapon: [
    [12, 9],
    [11, 8],
    [8, 7],
    [2, 6],
  ],
  jewelry: [
    [12, 3],
    [10, 2],
    [7, 1],
  ],
};

export function getEngravingSlotCount(slotKey: string, grade: number): number {
  const key =
    slotKey === "belt" || slotKey === "bracers"
      ? "beltOrBracers"
      : getEngravingCategory(slotKey);
  const thresholds = SLOT_THRESHOLDS[key] ?? [];
  return thresholds.find(([minGrade]) => grade >= minGrade)?.[1] ?? 0;
}
