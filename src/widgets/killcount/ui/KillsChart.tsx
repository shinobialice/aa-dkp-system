import Link from "next/link";
import { cn } from "@/shared/lib/tw-merge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/shared/ui";
import { formatNumber } from "@/shared/lib/format";
import type { KillCountHistoryData } from "../types";
import { longDate, shortDate } from "./killcountModel";
import { dayHref } from "./WarChip";

type Props = {
  days: KillCountHistoryData[];
  best: KillCountHistoryData | undefined;
  max: number;
};

export default function KillsChart({ days, best, max }: Props) {
  return (
    <section className="flex min-w-0 flex-col gap-2 rounded-xl border bg-card p-4">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="text-base font-semibold">Килы по дням</h2>
        <span className="text-xs text-muted-foreground">
          нажмите на столбик, чтобы открыть день
        </span>
      </div>
      <div className="flex h-40 items-end gap-0.75 border-b pt-5">
        {days.map((day) => {
          const value = Number(day.totalKills);
          const isBest = day === best;
          return (
            <Tooltip key={day.date}>
              <TooltipTrigger asChild>
                <Link
                  prefetch={false}
                  href={dayHref(day)}
                  aria-label={`${longDate(day.date)}: ${value} килов`}
                  className={cn(
                    "relative min-w-1 flex-1 rounded-t bg-red-500/70 transition-colors hover:bg-red-500",
                    isBest && "bg-red-500",
                  )}
                  style={{
                    height: `${max > 0 ? Math.max(2, (value / max) * 100) : 0}%`,
                  }}
                >
                  {isBest && (
                    <span className="absolute -top-4 left-1/2 -translate-x-1/2 text-2xs text-amber-500">
                      ★
                    </span>
                  )}
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                {longDate(day.date)}: {formatNumber(value)} килов
              </TooltipContent>
            </Tooltip>
          );
        })}
      </div>
      <div className="flex justify-between font-mono text-2xs text-muted-foreground">
        <span>{shortDate(days[0].date)}</span>
        <span>{shortDate(days[days.length - 1].date)}</span>
      </div>
    </section>
  );
}
