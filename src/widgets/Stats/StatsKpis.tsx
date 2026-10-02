"use client";

import Image from "next/image";
import { cn } from "@/shared/lib/tw-merge";
import type { BossIncomeStat } from "@/actions/guildStats";
import { GOLD_ICON } from "../Loot/LootBuy/LootItemList";
import {
  AGL_COLOR,
  averagePercent,
  formatNumber,
  isRaidDay,
  PRIME_COLOR,
  type DailyAttendance,
} from "./statsModel";

function Delta({ value, unit = "" }: { value: number | null; unit?: string }) {
  if (value === null) {
    return <span className="text-[11.5px] text-muted-foreground">—</span>;
  }
  const rounded = Math.round(value);
  const up = rounded >= 0;
  return (
    <span
      className={cn(
        "self-start rounded-full px-2 py-px text-[11.5px] font-semibold whitespace-nowrap",
        up
          ? "bg-green-100 text-green-800 dark:bg-green-500/15 dark:text-green-300"
          : "bg-red-100 text-red-800 dark:bg-red-500/15 dark:text-red-300",
      )}
    >
      {up ? "+" : "−"}
      {formatNumber(Math.abs(rounded))}
      {unit} к прошлому
    </span>
  );
}

function Kpi({
  label,
  swatch,
  children,
  delta,
}: {
  label: string;
  swatch?: string;
  children: React.ReactNode;
  delta?: React.ReactNode;
}) {
  return (
    <div className="flex min-w-0 flex-col gap-1 rounded-xl border bg-card px-3.5 py-3 last:col-span-2 sm:last:col-span-1">
      <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
        {swatch && (
          <span
            className="size-2.5 rounded-[3px]"
            style={{ backgroundColor: swatch }}
          />
        )}
        {label}
      </span>
      <span className="flex items-baseline gap-1.5 text-2xl font-bold tracking-tight tabular-nums">
        {children}
      </span>
      {delta}
    </div>
  );
}

function difference(current: number | null, previous: number | null) {
  return current === null || previous === null ? null : current - previous;
}

export default function StatsKpis({
  days,
  previousDaily,
  income,
  previousIncome,
  rosterCount,
}: {
  days: { prime: number; agl: number }[];
  previousDaily: DailyAttendance;
  income: BossIncomeStat[];
  previousIncome: BossIncomeStat[];
  rosterCount: number | null;
}) {
  const prime = averagePercent(days as DailyAttendance, "prime");
  const agl = averagePercent(days as DailyAttendance, "agl");
  const total = income.reduce((sum, row) => sum + row.income, 0);
  const previousTotal = previousIncome.reduce(
    (sum, row) => sum + row.income,
    0,
  );
  const raidDays = days.filter(isRaidDay).length;

  return (
    <section
      aria-label="Итоги месяца"
      className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-5"
    >
      <Kpi
        label="Прайм, средняя"
        swatch={PRIME_COLOR}
        delta={
          <Delta
            value={difference(prime, averagePercent(previousDaily, "prime"))}
            unit=" п.п."
          />
        }
      >
        {prime === null ? "—" : `${Math.round(prime)}%`}
      </Kpi>
      <Kpi
        label="АГЛ, средняя"
        swatch={AGL_COLOR}
        delta={
          <Delta
            value={difference(agl, averagePercent(previousDaily, "agl"))}
            unit=" п.п."
          />
        }
      >
        {agl === null ? "—" : `${Math.round(agl)}%`}
      </Kpi>
      <Kpi label="Рейдовых дней">
        {raidDays}
        <span className="text-[13px] font-medium text-muted-foreground">
          из {days.length}
        </span>
      </Kpi>
      <Kpi
        label="Доход от боссов"
        delta={<Delta value={total - previousTotal} />}
      >
        <Image src={GOLD_ICON} alt="" width={20} height={20} />
        {formatNumber(total)}
      </Kpi>
      <Kpi label="Активный состав">
        {rosterCount ?? "—"}
        <span className="text-[13px] font-medium text-muted-foreground">
          игроков
        </span>
      </Kpi>
    </section>
  );
}
