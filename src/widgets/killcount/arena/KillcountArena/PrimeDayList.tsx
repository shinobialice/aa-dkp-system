import Link from "next/link";
import type { PrimeDay } from "@/server/killcountArena/types";
import { formatNumber } from "@/shared/lib/format";
import { cn } from "@/shared/lib/tw-merge";
import ArenaPanel from "@/widgets/arena/ArenaPanel";
import { shortDate } from "../../ui/killcountModel";
import { arenaHref, fightersText, weekdayLong } from "./killcountArenaModel";

type Props = {
  days: PrimeDay[];
  selectedDay: string | null;
};

export default function PrimeDayList({ days, selectedDay }: Props) {
  const maxKills = Math.max(1, ...days.map((day) => day.totalKills));
  return (
    <ArenaPanel
      title="Праймы"
      meta={`${days.length} с киллкаунтом`}
      className="gap-0 p-0 sm:p-0 [&>div:first-child]:px-5 [&>div:first-child]:pt-4 [&>div:first-child]:pb-3"
    >
      <ol className="max-h-[720px] overflow-auto border-t [scrollbar-width:thin]">
        {days.map((day) => (
          <li
            key={day.day}
            className="border-b border-border/60 last:border-b-0"
          >
            <Link
              href={arenaHref("prime", day.day)}
              aria-current={day.day === selectedDay ? "page" : undefined}
              className={cn(
                "grid min-h-14 grid-cols-[64px_minmax(0,1fr)_76px] items-center gap-3 px-5 py-2 hover:bg-muted/60",
                day.day === selectedDay &&
                  "bg-green-50 shadow-[inset_3px_0_0_var(--color-green-500)] dark:bg-green-950",
              )}
            >
              <span className="-skew-x-12 justify-self-start border bg-muted px-2.5 py-1">
                <span className="inline-block skew-x-12 font-display text-sm text-green-700 dark:text-green-400">
                  {shortDate(day.day)}
                </span>
              </span>
              <span className="min-w-0">
                <span className="block truncate font-semibold capitalize">
                  {weekdayLong(day.day)}
                </span>
                <span className="block truncate text-xs text-muted-foreground">
                  {fightersText(day.fighters)}
                  {day.topUserName &&
                    ` · топ ${day.topUserName} ${day.topKills}`}
                </span>
              </span>
              <span className="flex flex-col items-end gap-1.5">
                <span className="font-display text-[15px] tabular-nums">
                  {formatNumber(day.totalKills)}
                </span>
                <span className="relative block h-1.5 w-full -skew-x-[20deg] overflow-hidden bg-muted">
                  <span
                    className="absolute inset-y-0 left-0 bg-green-500"
                    style={{ width: `${(day.totalKills / maxKills) * 100}%` }}
                  />
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ol>
    </ArenaPanel>
  );
}
