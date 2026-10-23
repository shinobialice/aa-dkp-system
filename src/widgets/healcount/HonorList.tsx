import type { KillcountFighter } from "@/server/killcountEntries/types";
import { formatNumber } from "@/shared/lib/format";
import { totalHonor } from "@/widgets/killcount/entries/killcountEntriesModel";
import ClassBadge from "@/widgets/killcount/ui/KillcountDay/ClassBadge";
import CommentBadge from "@/widgets/killcount/ui/KillcountDay/CommentBadge";
import PlayerAvatar from "@/widgets/killcount/ui/KillcountDay/PlayerAvatar";
import PlayerName from "@/widgets/killcount/ui/KillcountDay/PlayerName";
import Range from "@/widgets/killcount/ui/KillcountDay/Range";
import { honor } from "@/widgets/killcount/ui/killcountModel";
import { byHonor } from "./healcountModel";

type Props = {
  fighters: KillcountFighter[];
};

export default function HonorList({ fighters }: Props) {
  const rows = byHonor(fighters);
  const best = Math.max(0, ...rows.map(honor));

  return (
    <section
      aria-label="Хилы"
      className="flex min-w-0 flex-col overflow-hidden rounded-xl border bg-card"
    >
      <ol className="max-h-[min(36rem,calc(100dvh-14rem))] overflow-auto overscroll-contain tabular-nums">
        {rows.map((row, index) => (
          <li
            key={row.id}
            className="grid grid-cols-[1.75rem_minmax(0,1fr)_auto] items-center gap-x-2.5 gap-y-1.5 border-b px-3.5 py-2.5 last:border-b-0"
          >
            <span className="text-center font-semibold text-muted-foreground">
              {index + 1}
            </span>
            <span className="flex min-w-0 items-center gap-2">
              <PlayerAvatar row={row} />
              <span className="flex min-w-0 flex-col items-start gap-0.5">
                <span className="flex max-w-full min-w-0 items-center gap-1.5">
                  <PlayerName row={row} />
                  <CommentBadge comment={row.comment} />
                </span>
                <ClassBadge row={row} />
              </span>
            </span>
            <span className="text-right leading-tight">
              <span className="block text-lg font-bold text-emerald-600 dark:text-emerald-400">
                {formatNumber(honor(row))}
              </span>
              <Range from={row.startHonor} to={row.endHonor} />
            </span>
            <span className="col-start-2 col-end-4">
              <HonorBar value={honor(row)} max={best} />
            </span>
          </li>
        ))}
      </ol>
      {rows.length === 0 && (
        <p className="py-10 text-center text-muted-foreground">
          Хилов в этой записи нет
        </p>
      )}
      <div className="flex justify-between gap-2 border-t bg-muted px-3.5 py-2.5 font-semibold tabular-nums">
        <span>Итого</span>
        <span>{formatNumber(totalHonor(rows))} хонора</span>
      </div>
    </section>
  );
}

function HonorBar({ value, max }: { value: number; max: number }) {
  return (
    <span className="block h-2 overflow-hidden rounded bg-muted">
      <span
        className="block h-full rounded bg-emerald-500"
        style={{ width: `${max > 0 ? (Math.max(0, value) / max) * 100 : 0}%` }}
      />
    </span>
  );
}
