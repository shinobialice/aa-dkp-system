import type { EpheStatMultipliers } from "../ephe/epheSealsBonus";
import { ITEM_STATS } from "./itemsData";
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
  epheBonus: number;
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

    const line = { key, label: STAT_LABELS[key], unit: STAT_UNITS[key] ?? "" };
    const multiplier = epheMultipliers[key];
    if (multiplier === undefined) {
      lines.push({ ...line, value, epheBonus: 0 });
      continue;
    }
    const decimals = key === WEAPON_DAMAGE_STAT ? 1 : 0;
    const shown = roundTo(value * multiplier, decimals);
    const epheBonus = roundTo(shown - roundTo(value, decimals), decimals);
    lines.push({ ...line, value: shown, epheBonus });
  }
  return lines;
}

function roundTo(value: number, decimals: number): number {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}
