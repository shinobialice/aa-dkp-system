import type { UserEquipment } from "@/actions/getUserEquipment";
import { findGearItem } from "./itemsData";
import { ARMOR_TYPE, type ArmorWeight } from "./itemsData/armorType";
import { ARMOR_QUALITY_BUFF_RATES } from "./itemsData/gameArmorQualityBuffs";
import { GAME_ITEM_LEVELS } from "./itemsData/gameItemLevels";
import { qualitySetTexts, type QualitySetValues } from "./qualitySetTiersData";

const ARMOR_SLOTS = [
  "head",
  "chest",
  "belt",
  "bracers",
  "hands",
  "legs",
  "feet",
] as const;

const SET_SIZE = 4;
const BUFF_LEVEL_SCALE = 100;
const PER_MILLE_IN_PERCENT = 10;

type EquippedArmor = { grade: number; level: number };

export type QualitySetBuff = QualitySetValues & {
  weight: ArmorWeight;
  grade: number;
  icon: string;
  title: string;
  description: string;
};

// Бонус активен при 4+ предметах одного типа брони; его грейд — грейд 4-го
// по убыванию предмета ("не менее 4-х предметов качеством не ниже X").
export function getActiveQualitySetBuffs(
  equipment: UserEquipment[],
): QualitySetBuff[] {
  const armorByWeight = equippedArmorByWeight(equipment);
  const buffs: QualitySetBuff[] = [];

  (Object.keys(armorByWeight) as ArmorWeight[]).forEach((weight) => {
    const armor = armorByWeight[weight];
    if (armor.length < SET_SIZE) return;

    const grades = armor.map((piece) => piece.grade).sort((a, b) => b - a);
    const grade = grades[SET_SIZE - 1];
    const rates = ARMOR_QUALITY_BUFF_RATES[weight][grade];
    if (!rates) return;

    const buffLevel = qualityBuffLevel(armor);
    const values = {
      health: Math.round((rates.health * buffLevel) / BUFF_LEVEL_SCALE),
      mana: Math.round((rates.mana * buffLevel) / BUFF_LEVEL_SCALE),
      skillDamagePercent:
        Math.round((rates.skillDamage * buffLevel) / BUFF_LEVEL_SCALE) /
        PER_MILLE_IN_PERCENT,
    };
    const texts = qualitySetTexts(weight, grade, values);
    if (!texts) return;

    buffs.push({ weight, grade, ...values, ...texts });
  });

  return buffs;
}

// Уровень баффа в игре — сумма уровней надетых доспехов этого типа плюс 1 за
// каждый предмет: так сходится с игрой на полных комплектах из 7 вещей.
function qualityBuffLevel(armor: EquippedArmor[]): number {
  return armor.reduce((sum, piece) => sum + piece.level + 1, 0);
}

function equippedArmorByWeight(
  equipment: UserEquipment[],
): Record<ArmorWeight, EquippedArmor[]> {
  const result: Record<ArmorWeight, EquippedArmor[]> = {
    light: [],
    medium: [],
    heavy: [],
  };

  for (const slotKey of ARMOR_SLOTS) {
    const eq = equipment.find((e) => e.slot === slotKey);
    if (!eq?.item_name) continue;
    const gearItem = findGearItem(slotKey, eq.item_name);
    if (!gearItem) continue;
    const weight = ARMOR_TYPE[gearItem.id];
    if (!weight) continue;
    result[weight].push({
      grade: eq.grade,
      level: GAME_ITEM_LEVELS[gearItem.id],
    });
  }

  return result;
}
