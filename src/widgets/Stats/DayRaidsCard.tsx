"use client";

import { cn } from "@/shared/lib/tw-merge";
import type { DailyRaidStat } from "@/actions/guildStats";
import { dayLabel } from "./statsModel";

export default function DayRaidsCard({
  date,
  raids,
  loading,
}: {
  date: string | null;
  raids: DailyRaidStat[];
  loading: boolean;
}) {
  return (
    <section className="flex min-w-0 flex-col gap-3 rounded-xl border bg-card p-4">
      <div className="flex items-baseline justify-between gap-2">
        <h2 className="text-[15px] font-semibold">
          {date ? `Рейды ${dayLabel(date)}` : "Рейды"}
        </h2>
        <span className="text-xs text-muted-foreground">пришло / активных</span>
      </div>
      {loading ? (
        <p className="py-8 text-center text-sm text-muted-foreground">
          Загрузка…
        </p>
      ) : raids.length === 0 ? (
        <p className="py-8 text-center text-sm text-muted-foreground">
          {date ? "В этот день рейдов не было" : "Выберите день на графике"}
        </p>
      ) : (
        <div className="flex max-h-[340px] flex-col gap-1.5 overflow-y-auto">
          {raids.map((raid) => (
            <div
              key={raid.id}
              className="grid grid-cols-[2.75rem_auto_minmax(0,1fr)_auto] items-center gap-2 rounded-lg border px-2.5 py-2 text-[13px]"
            >
              <span className="font-mono text-xs text-muted-foreground">
                {raid.start_date.slice(11, 16)}
              </span>
              <span
                className={cn(
                  "rounded-full px-2 py-px text-[11px] font-semibold text-white",
                  raid.type === "Прайм" ? "bg-green-600" : "bg-blue-500",
                )}
              >
                {raid.type}
              </span>
              <span
                className="truncate"
                title={raid.bosses.join(", ") || undefined}
              >
                {raid.bosses.length > 0 ? raid.bosses.join(", ") : "Без боссов"}
              </span>
              <span className="font-semibold whitespace-nowrap tabular-nums">
                {raid.attendeeCount}
                {raid.activeUserCount ? (
                  <span className="font-normal text-muted-foreground">
                    {" "}
                    / {raid.activeUserCount}
                  </span>
                ) : (
                  <span className="font-normal text-muted-foreground">
                    {" "}
                    чел.
                  </span>
                )}
              </span>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
