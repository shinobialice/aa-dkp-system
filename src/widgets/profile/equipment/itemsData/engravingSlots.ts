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

const ENGRAVABLE_JEWELRY_ITEM_IDS = new Set([
  46590, // Перстень Дома Норьетт
  46591, // Перстень фаворита Дома Норьетт
  46592, // Перстень чемпиона Дома Норьетт
  46593, // Серьга Дома Норьетт
  46594, // Серьга фаворита Дома Норьетт
  46595, // Серьга чемпиона Дома Норьетт
  54860, // Серьга ифнирского бойца
  54891, // Серьга ифнирского лучника
  54892, // Серьга ифнирского чародея
  54893, // Серьга ифнирского лекаря
  54992, // Эфенская серьга
  54993, // Эфенское кольцо
  55034, // Искаженное эфенское кольцо
  55036, // Искаженная эфенская серьга
  55076, // Изначальное эфенское кольцо
  55078, // Изначальная эфенская серьга
  55118, // Обновленное эфенское кольцо
  55120, // Обновленная эфенская серьга
  55320, // Кольцо ифнирского бойца
  55321, // Кольцо ифнирского лучника
  55322, // Кольцо ифнирского чародея
  55323, // Кольцо ифнирского лекаря
  55801, // Драгоценная серьга ифнирского бойца
  55802, // Драгоценная серьга ифнирского лучника
  55803, // Драгоценная серьга ифнирского чародея
  55804, // Драгоценная серьга ифнирского лекаря
  55805, // Драгоценное кольцо ифнирского бойца
  55806, // Драгоценное кольцо ифнирского лучника
  55807, // Драгоценное кольцо ифнирского чародея
  55808, // Драгоценное кольцо ифнирского лекаря
  8003311, // Амальгамное эфенское кольцо
  8003313, // Амальгамная эфенская серьга
]);

export function getEngravingCategory(slotKey: string): EngravingCategory {
  if (ARMOR_SLOT_KEYS.has(slotKey)) return "armor";
  if (slotKey === "cloak") return "cloak";
  if (slotKey === "underwear") return "underwear";
  if (WEAPON_SLOT_KEYS.has(slotKey)) return "weapon";
  if (JEWELRY_SLOT_KEYS.has(slotKey)) return "jewelry";
  return "none";
}

type SlotThreshold = [minGrade: number, slots: number];

const ARMOR_SLOT_THRESHOLDS: Record<string, SlotThreshold[]> = {
  head: [
    [12, 8],
    [11, 7],
    [8, 6],
    [2, 5],
  ],
  chest: [
    [12, 9],
    [11, 8],
    [8, 7],
    [2, 6],
  ],
  legs: [
    [12, 8],
    [11, 7],
    [8, 6],
    [2, 5],
  ],
  hands: [
    [12, 7],
    [11, 6],
    [8, 5],
    [2, 4],
  ],
  feet: [
    [12, 7],
    [11, 6],
    [8, 5],
    [2, 4],
  ],
  belt: [
    [12, 6],
    [11, 5],
    [8, 4],
    [2, 3],
  ],
  bracers: [
    [12, 6],
    [11, 5],
    [8, 4],
    [2, 3],
  ],
};

const CATEGORY_THRESHOLDS: Partial<Record<EngravingCategory, SlotThreshold[]>> =
  {
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

export function canEngraveJewelry(itemId: number | undefined): boolean {
  return itemId === undefined || ENGRAVABLE_JEWELRY_ITEM_IDS.has(itemId);
}

export function getEngravingSlotCount(
  slotKey: string,
  grade: number,
  itemId: number | undefined,
): number {
  if (
    getEngravingCategory(slotKey) === "jewelry" &&
    !canEngraveJewelry(itemId)
  ) {
    return 0;
  }
  const thresholds =
    ARMOR_SLOT_THRESHOLDS[slotKey] ??
    CATEGORY_THRESHOLDS[getEngravingCategory(slotKey)] ??
    [];
  return thresholds.find(([minGrade]) => grade >= minGrade)?.[1] ?? 0;
}
