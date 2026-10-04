import type { UserEquipment } from "@/actions/getUserEquipment";
import {
  getEpheStatMultipliers,
  type EpheStatMultipliers,
} from "../ephe/epheSealsBonus";
import { findGearItem, ITEM_STATS } from "./itemsData";
import {
  getItemGradeStats,
  getItemGradeBonusStats,
} from "./itemsData/itemGradeStats";
import {
  STAT_ORDER,
  STAT_LABELS,
  STAT_UNITS,
  scaleStat,
} from "./itemsData/statsFormula";

export type ItemStatLine = {
  key: string;
  label: string;
  value: number;
  unit: string;
};

const WEAPON_DAMAGE_STAT = "weapon_dps";

export function getItemStatLines(
  itemId: number,
  grade: number,
  enchant: number,
  epheMultipliers: EpheStatMultipliers,
): ItemStatLine[] {
  const gradeStats = getItemGradeStats(itemId, grade);
  const bonusStats = getItemGradeBonusStats(itemId, grade);
  const base = gradeStats ?? ITEM_STATS[itemId];

  const lines: ItemStatLine[] = [];
  for (const key of STAT_ORDER) {
    let value: number;
    if (bonusStats && key in bonusStats) value = bonusStats[key];
    else if (base && key in base) {
      value = gradeStats
        ? base[key]
        : scaleStat(base[key], grade, enchant, key);
    } else continue;

    const multiplier = epheMultipliers[key];
    const decimals = key === WEAPON_DAMAGE_STAT ? 1 : 0;
    lines.push({
      key,
      label: STAT_LABELS[key],
      unit: STAT_UNITS[key] ?? "",
      value:
        multiplier === undefined
          ? value
          : roundTo(value * multiplier, decimals),
    });
  }
  return lines;
}

export function getEquipmentStatLines(eq: UserEquipment): ItemStatLine[] {
  const gearItem = findGearItem(eq.slot, eq.item_name);
  if (!gearItem) return [];
  return getItemStatLines(
    gearItem.id,
    eq.grade,
    eq.enchant,
    getEpheStatMultipliers(eq),
  );
}

function roundTo(value: number, decimals: number): number {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}
