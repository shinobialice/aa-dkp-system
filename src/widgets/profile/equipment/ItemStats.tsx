import type { EpheStatMultipliers } from "../ephe/epheSealsBonus";
import { getItemStatLines } from "./itemStatLines";

type Props = {
  itemId: number;
  grade: number;
  enchant: number;
  epheMultipliers: EpheStatMultipliers;
  bare?: boolean;
};

export default function ItemStats({
  itemId,
  grade,
  enchant,
  epheMultipliers,
  bare = false,
}: Props) {
  const lines = getItemStatLines(itemId, grade, enchant, epheMultipliers);
  if (lines.length === 0) return null;

  return (
    <div
      className={
        bare ? "space-y-1 text-sm" : "space-y-1 rounded-md border p-2 text-sm"
      }
    >
      {lines.map((line) => (
        <div key={line.key} className="flex items-center justify-between">
          <span className="text-muted-foreground">{line.label}</span>
          <span className="font-medium">
            {line.value > 0 && "+"}
            {line.value}
            {line.unit}
            {line.epheBonus > 0 && (
              <span
                className="ml-1 text-xs font-normal text-green-500"
                title="Прибавка от печатей Эфе"
              >
                (+{line.epheBonus} Эфе)
              </span>
            )}
          </span>
        </div>
      ))}
    </div>
  );
}
