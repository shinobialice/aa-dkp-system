import { ITEM_STATS } from "./itemsData";
import { STAT_ORDER, STAT_LABELS, scaleStat } from "./itemsData/statsFormula";

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
  const base = ITEM_STATS[itemId];
  if (!base) return null;

  const entries = STAT_ORDER.filter((key) => key in base);
  if (entries.length === 0) return null;

  return (
    <div className={bare ? "space-y-1 text-sm" : "space-y-1 rounded-md border p-2 text-sm"}>
      {entries.map((key) => (
        <div key={key} className="flex items-center justify-between">
          <span className="text-muted-foreground">{STAT_LABELS[key]}</span>
          <span className="font-medium">
            {scaleStat(base[key], grade, enchant, key)}
          </span>
        </div>
      ))}
    </div>
  );
}
