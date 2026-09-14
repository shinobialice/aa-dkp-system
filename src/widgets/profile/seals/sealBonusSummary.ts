import { SEAL_LEVEL_STATS } from "./sealLevelsData";

export type SealBonusTotal = {
  stat: string;
  value: number;
  isPercent: boolean;
};

export function formatStatValue(value: number, isPercent: boolean): string {
  const sign = value > 0 ? "+" : "";
  const rounded = Number.isInteger(value) ? value.toFixed(0) : value.toFixed(1);
  return `${sign}${rounded}${isPercent ? "%" : ""}`;
}

// Суммарный бонус от всех выбранных печатей: по каждому стату складываются
// бонусы всех пройденных уровней (row.level <= level) у всех веток.
export function computeSealBonusSummary(
  picks: { sealName: string; level: number }[],
): SealBonusTotal[] {
  const totals = new Map<string, SealBonusTotal>();

  for (const { sealName, level } of picks) {
    const rows = SEAL_LEVEL_STATS[sealName] ?? [];
    for (const row of rows) {
      if (row.level > level) continue;
      const existing = totals.get(row.stat);
      if (existing) {
        existing.value += row.value;
      } else {
        totals.set(row.stat, {
          stat: row.stat,
          value: row.value,
          isPercent: row.isPercent,
        });
      }
    }
  }

  return [...totals.values()]
    .map((t) => ({ ...t, value: Math.round(t.value * 10) / 10 }))
    .sort((a, b) => a.stat.localeCompare(b.stat, "ru"));
}
