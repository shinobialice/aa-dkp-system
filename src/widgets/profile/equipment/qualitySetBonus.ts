import type { UserEquipment } from "@/actions/getUserEquipment";
import { findGearItem } from "./itemsData";
import { ARMOR_TYPE, type ArmorWeight } from "./itemsData/armorType";
import { QUALITY_TIERS } from "./qualitySetTiersData";

const ARMOR_SLOTS = [
  "head",
  "chest",
  "belt",
  "bracers",
  "hands",
  "legs",
  "feet",
] as const;

export type QualitySetBuff = {
  weight: ArmorWeight;
  grade: number;
  icon: string;
  title: string;
  description: string;
};

function equippedGradesByWeight(
  equipment: UserEquipment[],
): Record<ArmorWeight, number[]> {
  const result: Record<ArmorWeight, number[]> = {
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
    result[weight].push(eq.grade);
  }

  return result;
}

// Бонус активен при 4+ предметах одного типа брони; его величина зависит
// от минимального грейда среди них — берём грейд 4-го по убыванию предмета
// (т.к. "не менее 4-х предметов качеством не ниже X").
export function getActiveQualitySetBuffs(
  equipment: UserEquipment[],
): QualitySetBuff[] {
  const gradesByWeight = equippedGradesByWeight(equipment);
  const buffs: QualitySetBuff[] = [];

  (Object.keys(gradesByWeight) as ArmorWeight[]).forEach((weight) => {
    const grades = [...gradesByWeight[weight]].sort((a, b) => b - a);
    if (grades.length < 4) return;

    const tierGrade = grades[3];
    const data = QUALITY_TIERS[weight][tierGrade];
    if (!data) return;

    buffs.push({ weight, grade: tierGrade, ...data });
  });

  return buffs;
}
