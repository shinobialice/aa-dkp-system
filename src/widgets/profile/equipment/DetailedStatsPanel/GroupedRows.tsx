import { BONUS_COLOR } from "../statColors";

import type { Row, RowGroup } from "./statRows";

function RowLine({
  row,
  engravingBonuses,
}: {
  row: Row;
  engravingBonuses: Map<string, number>;
}) {
  let boosted = false;
  let value: string;

  if (row.kind === "static") {
    value = row.value;
  } else if (row.kind === "engraving") {
    const delta = engravingBonuses.get(row.engravingKey) ?? 0;
    boosted = delta !== 0;
    value = `${(row.base + delta).toFixed(row.decimals)}${row.unit}`;
  } else {
    boosted = row.boosted;
    value = `${row.value.toFixed(row.decimals)}${row.unit}`;
  }

  return (
    <div className="flex items-center justify-between gap-3 text-xs">
      <span
        className={
          row.indent ? "pl-3 text-muted-foreground/70" : "text-muted-foreground"
        }
      >
        {row.indent ? `- ${row.label}` : row.label}
      </span>
      <span
        className="whitespace-nowrap font-medium tabular-nums"
        style={{ color: boosted ? BONUS_COLOR : undefined }}
      >
        {value}
      </span>
    </div>
  );
}

export default function GroupedRows({
  groups,
  withHeaders,
  engravingBonuses,
}: {
  groups: RowGroup[];
  withHeaders: boolean;
  engravingBonuses: Map<string, number>;
}) {
  return (
    <div className="space-y-3">
      {groups.map((group, i) => (
        <div key={i}>
          {i > 0 && <div className="mb-3 border-t" />}
          {withHeaders && group.title && (
            <div className="mb-1.5 text-sm font-semibold">{group.title}</div>
          )}
          <div className="space-y-1.5">
            {group.rows.map((row) => (
              <RowLine
                key={row.label}
                row={row}
                engravingBonuses={engravingBonuses}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
