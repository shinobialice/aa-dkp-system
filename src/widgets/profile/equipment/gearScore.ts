import type { UserEquipment } from "@/actions/getUserEquipment";
import type { UserSeal } from "@/actions/getUserSeals";
import { findGearItem } from "./itemsData";
import { GAME_ITEM_LEVELS } from "./itemsData/gameItemLevels";
import { GAME_WEAPON_GEAR_SCORE } from "./itemsData/gameWeaponGearScore";

// wearable_slots.gear_score_multiplier из данных игры.
const WEARABLE_GEAR_SCORE: Record<string, number> = {
  head: 1.17,
  necklace: 0.47,
  chest: 1.95,
  belt: 0.39,
  legs: 1.56,
  hands: 0.78,
  feet: 0.78,
  bracers: 0.39,
  cloak: 0.8,
  earring1: 0.33,
  earring2: 0.33,
  ring1: 0.33,
  ring2: 0.33,
};

// Бельё и костюм в формуле игры считаются от грейда, без уровня предмета.
const GRADE_ONLY_SLOTS: Record<string, number> = {
  underwear: 0.64,
  costume: 0.71,
};
const GRADE_ONLY_ITEM_LEVEL = 150;

// Полной формулы ГС в данных нет, а печати героя там не описаны вовсе,
// поэтому коэффициенты подобраны по ГС из профилей игроков.
const EQUIPMENT_FACTOR = 0.2656;
const GEAR_SCORE_PER_SEAL_LEVEL = 27.7;

export function computeTestGearScore(
  equipment: UserEquipment[],
  seals: UserSeal[],
): number {
  const gear = equipment.reduce((sum, eq) => sum + itemGearScore(eq), 0);
  const sealLevels = seals.reduce((sum, seal) => sum + seal.level, 0);
  return Math.round(
    gear * EQUIPMENT_FACTOR + sealLevels * GEAR_SCORE_PER_SEAL_LEVEL,
  );
}

function itemGearScore(eq: UserEquipment): number {
  const gearItem = findGearItem(eq.slot, eq.item_name);
  if (!gearItem) return 0;
  const itemLevel = GAME_ITEM_LEVELS[gearItem.id] ?? 0;
  const weaponMultiplier = GAME_WEAPON_GEAR_SCORE[gearItem.id];
  if (weaponMultiplier !== undefined) {
    return weaponBase(itemLevel) * 0.6 * eq.grade * weaponMultiplier;
  }
  const gradeOnlyFactor = GRADE_ONLY_SLOTS[eq.slot];
  if (gradeOnlyFactor !== undefined) {
    return (
      wearableBase(GRADE_ONLY_ITEM_LEVEL) * gradeOnlyFactor * (eq.grade - 1)
    );
  }
  return (
    wearableBase(itemLevel) * eq.grade * (WEARABLE_GEAR_SCORE[eq.slot] ?? 0)
  );
}

function weaponBase(itemLevel: number): number {
  return itemLevel * 1.4 + 15 + itemLevel * 2.2 ** ((itemLevel / 100) * 3);
}

function wearableBase(itemLevel: number): number {
  return (itemLevel ** 1.1 * 85 + 10) * 0.03;
}
