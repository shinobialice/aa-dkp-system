import StatDiff from "../StatDiff";

import { rowValue, type Row, type RowGroup } from "./statRows";

type Props = {
  groups: RowGroup[];
  withHeaders: boolean;
  bonuses: Map<string, number>;
  viewerGroups: RowGroup[] | null;
  viewerBonuses: Map<string, number> | null;
};

export default function GroupedRows({
  groups,
  withHeaders,
  bonuses,
  viewerGroups,
  viewerBonuses,
}: Props) {
  const viewerAmounts = new Map<string, number>();
  if (viewerGroups && viewerBonuses) {
    for (const row of viewerGroups.flatMap((group) => group.rows)) {
      const { amount } = rowValue(row, viewerBonuses);
      if (amount !== null) viewerAmounts.set(row.label, amount);
    }
  }

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
                bonuses={bonuses}
                viewerAmount={viewerAmounts.get(row.label)}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

type RowLineProps = {
  row: Row;
  bonuses: Map<string, number>;
  viewerAmount: number | undefined;
};

function RowLine({ row, bonuses, viewerAmount }: RowLineProps) {
  const { text, amount, decimals } = rowValue(row, bonuses);

  return (
    <div className="flex items-center justify-between gap-3 text-xs">
      <span
        className={
          row.indent ? "pl-3 text-muted-foreground/70" : "text-muted-foreground"
        }
      >
        {row.indent ? `- ${row.label}` : row.label}
      </span>
      <span className="inline-flex shrink-0 items-baseline gap-1.5 whitespace-nowrap font-medium tabular-nums">
        {text}
        {amount !== null && (
          <StatDiff
            label={row.label}
            viewer={viewerAmount}
            owner={amount}
            decimals={decimals}
          />
        )}
      </span>
    </div>
  );
}
