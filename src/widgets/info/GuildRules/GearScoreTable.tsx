import { formatNumber } from "@/shared/lib/format";

export default function GearScoreTable({
  averageGuildGS,
}: {
  averageGuildGS: number;
}) {
  const rows = [
    { who: "Тактики, барды, танцоры", formula: "средний −2000", delta: -2000 },
    { who: "Хилы (дуалы/щит)", formula: "средний", delta: 0 },
    {
      who: "Лучники, милики, маги (дуалы/щит)",
      formula: "средний +500",
      delta: 500,
    },
    {
      who: "Хилы, лучники, милики, маги (двурук)",
      formula: "средний −500",
      delta: -500,
    },
  ];
  const known = averageGuildGS > 0;

  return (
    <div className="overflow-hidden rounded-lg border text-sm">
      <div className="flex items-center justify-between gap-3 bg-muted/50 px-3.5 py-2.5">
        <span className="text-muted-foreground">Средний ГС гильдии сейчас</span>
        <span className="font-bold tabular-nums">
          {known ? formatNumber(averageGuildGS) : "нет данных"}
        </span>
      </div>
      {rows.map((row) => (
        <div
          key={row.who}
          className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 border-t border-border/60 px-3.5 py-2 sm:grid-cols-[minmax(0,1fr)_132px_84px]"
        >
          <span>{row.who}</span>
          <span className="order-3 text-xs text-muted-foreground tabular-nums sm:order-none sm:text-sm">
            {row.formula}
          </span>
          <span className="row-span-2 text-right font-bold tabular-nums sm:row-span-1">
            {known ? formatNumber(averageGuildGS + row.delta) : "—"}
          </span>
        </div>
      ))}
    </div>
  );
}
