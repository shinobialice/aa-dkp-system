"use client";

import Image from "next/image";
import { cn } from "@/shared/lib/tw-merge";
import type { BossIncomeStat } from "@/actions/guildStats";
import {
  AGL_COLOR,
  averagePercent,
  isRaidDay,
  PRIME_COLOR,
  type DailyAttendance,
} from "./statsModel";
import { formatNumber } from "@/shared/lib/format";
import { StatTile, StatUnit, GOLD_ICON_URL } from "@/shared/ui";

function Delta({ value, unit = "" }: { value: number | null; unit?: string }) {
  if (value === null) {
    return <span className="text-2xs text-muted-foreground">—</span>;
  }
  const rounded = Math.round(value);
  const up = rounded >= 0;
  return (
    <span
      className={cn(
        "self-start rounded-full px-2 py-px text-2xs font-semibold whitespace-nowrap",
        up
          ? "bg-green-100 text-green-800 dark:bg-green-500/15 dark:text-green-300"
          : "bg-red-100 text-red-800 dark:bg-red-500/15 dark:text-red-300",
      )}
    >
      {up ? "+" : "−"}
      {formatNumber(Math.abs(rounded), 0)}
      {unit} к прошлому
    </span>
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
      <StatTile
        label="Прайм, средняя"
        swatch={PRIME_COLOR}
        hint={
          <Delta
            value={difference(prime, averagePercent(previousDaily, "prime"))}
            unit=" п.п."
          />
        }
      >
        {prime === null ? "—" : `${Math.round(prime)}%`}
      </StatTile>
      <StatTile
        label="АГЛ, средняя"
        swatch={AGL_COLOR}
        hint={
          <Delta
            value={difference(agl, averagePercent(previousDaily, "agl"))}
            unit=" п.п."
          />
        }
      >
        {agl === null ? "—" : `${Math.round(agl)}%`}
      </StatTile>
      <StatTile label="Рейдовых дней">
        {raidDays}
        <StatUnit>из {days.length}</StatUnit>
      </StatTile>
      <StatTile
        label="Доход от боссов"
        hint={<Delta value={total - previousTotal} />}
      >
        <Image src={GOLD_ICON_URL} alt="" width={20} height={20} />
        {formatNumber(total, 0)}
      </StatTile>
      <StatTile label="Активный состав" className="col-span-2 sm:col-span-1">
        {rosterCount ?? "—"}
        <StatUnit>игроков</StatUnit>
      </StatTile>
    </section>
  );
}
