import { formatNumber } from "@/shared/lib/format";
import { Card } from "@/shared/ui";
import type { BossSales } from "../treasuryModel";

type Props = {
  rows: BossSales[];
  monthLabel: string;
};

export default function BossSalesCard({ rows, monthLabel }: Props) {
  const total = rows.reduce((sum, row) => sum + row.total, 0);
  const max = rows[0]?.total ?? 0;
  const caption = rows.length
    ? `За ${monthLabel}, всего ${formatNumber(total)}`
    : `За ${monthLabel} продаж не было`;

  return (
    <Card className="gap-3 p-4">
      <div>
        <h3 className="font-semibold">Продажи по боссам</h3>
        <p className="text-xs text-muted-foreground">{caption}</p>
      </div>
      {rows.length > 0 && (
        <ul className="space-y-2.5">
          {rows.map((row) => (
            <li
              key={row.name}
              className="grid grid-cols-[88px_minmax(0,1fr)_72px] items-center gap-2.5 text-sm"
            >
              <span className="truncate" title={row.name}>
                {row.name}
              </span>
              <span className="block h-3 border-l" aria-hidden>
                <span
                  className="block h-full rounded-r-[4px] bg-primary"
                  style={{
                    width: `max(2px, ${max ? (row.total / max) * 100 : 0}%)`,
                  }}
                />
              </span>
              <span className="text-right tabular-nums">
                {formatNumber(row.total)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
