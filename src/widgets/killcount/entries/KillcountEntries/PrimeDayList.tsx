import Link from "next/link";
import { Trophy } from "lucide-react";
import type { PrimeDay } from "@/server/killcountEntries/types";
import { formatNumber } from "@/shared/lib/format";
import { cn } from "@/shared/lib/tw-merge";
import { longDate, weekday } from "../../ui/killcountModel";
import { entryHref, playersText } from "./killcountEntriesModel";

type Props = {
  days: PrimeDay[];
  selectedDay: string | null;
};

export default function PrimeDayList({ days, selectedDay }: Props) {
  const maxKills = Math.max(1, ...days.map((day) => day.totalKills));
  return (
    <section
      aria-label="Праймы"
      className="min-w-0 overflow-hidden rounded-xl border bg-card"
    >
      <div className="flex items-baseline justify-between gap-2 border-b px-3.5 py-2.5">
        <h2 className="font-semibold">Праймы</h2>
        <span className="text-xs text-muted-foreground">
          {days.length} с киллкаунтом
        </span>
      </div>
      <ol className="max-h-[min(40rem,calc(100dvh-14rem))] overflow-auto overscroll-contain">
        {days.map((day) => (
          <li key={day.day} className="border-b last:border-b-0">
            <Link
              prefetch={false}
              href={entryHref("prime", day.day)}
              aria-current={day.day === selectedDay ? "page" : undefined}
              className={cn(
                "grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 gap-y-1 px-3.5 py-2.5 hover:bg-muted/50",
                day.day === selectedDay &&
                  "bg-muted/70 shadow-[inset_3px_0_0_var(--color-red-500)]",
              )}
            >
              <span className="leading-tight">
                <span className="block font-semibold">{longDate(day.day)}</span>
                <span className="text-2xs text-muted-foreground">
                  {weekday(day.day)} · {playersText(day.fighters)}
                  {day.window && " · сканер"}
                </span>
              </span>
              <span className="text-right text-base font-bold tabular-nums">
                {formatNumber(day.totalKills)}
              </span>
              <span className="col-span-2 flex items-center gap-2.5">
                <span className="block h-1.5 flex-1 overflow-hidden rounded bg-muted">
                  <span
                    className="block h-full rounded bg-red-500"
                    style={{ width: `${(day.totalKills / maxKills) * 100}%` }}
                  />
                </span>
                {day.topUserName && (
                  <span className="flex min-w-0 items-center gap-1 text-2xs text-muted-foreground">
                    <Trophy className="size-3 shrink-0 text-amber-500" />
                    <span className="truncate">{day.topUserName}</span>
                    <span className="tabular-nums">{day.topKills}</span>
                  </span>
                )}
              </span>
            </Link>
          </li>
        ))}
      </ol>
    </section>
  );
}
