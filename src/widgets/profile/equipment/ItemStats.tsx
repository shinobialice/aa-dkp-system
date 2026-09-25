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

export function ItemStats({
  itemId,
  grade,
  enchant = 0,
  bare = false,
}: {
  itemId: number;
  grade: number;
  enchant?: number;
  bare?: boolean;
}) {
  const gradeStats = getItemGradeStats(itemId, grade);
  const bonusStats = getItemGradeBonusStats(itemId, grade);
  const base = gradeStats ?? ITEM_STATS[itemId];
  if (!base && !bonusStats) return null;

  const entries = STAT_ORDER.filter(
    (key) => (base && key in base) || (bonusStats && key in bonusStats),
  );
  if (entries.length === 0) return null;

  return (
    <div
      className={
        bare ? "space-y-1 text-sm" : "space-y-1 rounded-md border p-2 text-sm"
      }
    >
      {entries.map((key) => {
        const value =
          bonusStats && key in bonusStats
            ? bonusStats[key]
            : gradeStats
              ? base![key]
              : scaleStat(base![key], grade, enchant, key);
        const sign = value > 0 ? "+" : "";
        return (
          <div key={key} className="flex items-center justify-between">
            <span className="text-muted-foreground">{STAT_LABELS[key]}</span>
            <span className="font-medium">
              {sign}
              {value}
              {STAT_UNITS[key] ?? ""}
            </span>
          </div>
        );
      })}
    </div>
  );
}
