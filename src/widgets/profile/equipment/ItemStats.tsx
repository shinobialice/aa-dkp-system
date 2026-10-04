import type { EpheStatMultipliers } from "../ephe/epheSealsBonus";
import { getItemStatLines, type ItemStatLine } from "./itemStatLines";
import StatDiff from "./StatDiff";

type Props = {
  itemId: number;
  grade: number;
  enchant: number;
  epheMultipliers: EpheStatMultipliers;
  compareLines?: ItemStatLine[];
  bare?: boolean;
};

export default function ItemStats({
  itemId,
  grade,
  enchant,
  epheMultipliers,
  compareLines,
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
      {lines.map((line) => {
        const viewer = compareLines
          ? (compareLines.find((other) => other.key === line.key)?.value ?? 0)
          : undefined;
        const decimals =
          Number.isInteger(line.value) && Number.isInteger(viewer ?? 0) ? 0 : 1;
        return (
          <div key={line.key} className="flex items-center justify-between">
            <span className="text-muted-foreground">{line.label}</span>
            <span className="inline-flex items-baseline gap-1.5 font-medium">
              {line.value > 0 && "+"}
              {line.value}
              {line.unit}
              <StatDiff
                label={line.label}
                viewer={viewer}
                owner={line.value}
                decimals={decimals}
              />
            </span>
          </div>
        );
      })}
    </div>
  );
}
