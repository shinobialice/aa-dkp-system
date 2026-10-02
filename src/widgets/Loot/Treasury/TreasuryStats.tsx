"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { Clock, Coins } from "lucide-react";
import { Card, Skeleton } from "@/shared/ui";
import { cn } from "@/shared/lib/tw-merge";
import {
  STALE_DAYS,
  formatGold,
  formatShortDate,
  monthName,
  plural,
  type MonthStats,
} from "./treasuryModel";

function StatCard({
  label,
  value,
  hint,
  footer,
  footerOnMobile,
  loading,
}: {
  label: string;
  value: number;
  hint: string;
  footer: ReactNode;
  footerOnMobile?: boolean;
  loading: boolean;
}) {
  return (
    <Card className="gap-1.5 p-3 sm:p-5">
      <p className="text-xs text-muted-foreground sm:text-sm">{label}</p>
      {loading ? (
        <Skeleton className="h-7 w-28 sm:h-8 sm:w-32" />
      ) : (
        <p className="flex items-center gap-1.5 text-xl font-semibold tracking-tight whitespace-nowrap sm:gap-2 sm:text-2xl xl:text-[28px] xl:leading-9">
          {formatGold(value)}
          <Coins className="size-4 text-amber-500 sm:size-[18px]" aria-hidden />
        </p>
      )}
      <p className="text-xs text-muted-foreground">{hint}</p>
      <div
        className={cn(
          "mt-auto flex-wrap items-center justify-between gap-x-2 gap-y-1 border-t pt-3 text-xs",
          footerOnMobile ? "flex" : "hidden sm:flex",
        )}
      >
        {footer}
      </div>
    </Card>
  );
}

export function TreasuryStats({
  stats,
  month,
  loading,
  onShowStale,
}: {
  stats: MonthStats;
  month: number;
  loading: boolean;
  onShowStale: () => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
      <StatCard
        label={`Доход за ${monthName(month)}`}
        value={stats.income}
        loading={loading}
        hint={`продажи ${formatGold(stats.salesTotal)} + разное ${formatGold(stats.miscTotal)}`}
        footer={
          <>
            <span className="text-muted-foreground">70% в зарплаты, 30% в казну</span>
            <Link
              href="/loot/finance"
              className="font-medium text-green-700 hover:underline dark:text-green-400"
            >
              Финансы →
            </Link>
          </>
        }
      />
      <StatCard
        label="Сразу в казну"
        value={stats.treasuryTotal}
        loading={loading}
        hint={`${stats.treasuryCount} ${plural(stats.treasuryCount, "поступление", "поступления", "поступлений")}`}
        footer={
          <span className="text-muted-foreground">
            {stats.lastTreasury
              ? `${stats.treasuryCount > 1 ? "Последнее: " : ""}${stats.lastTreasury.source ?? "без источника"} · ${formatShortDate(stats.lastTreasury.at)}`
              : "Поступлений не было"}
          </span>
        }
      />
      <StatCard
        label="Расходы"
        value={stats.expensesTotal}
        loading={loading}
        hint={`${stats.expensesCount} ${plural(stats.expensesCount, "запись", "записи", "записей")}`}
        footer={
          <span className="text-muted-foreground">
            {stats.topExpense
              ? `Больше всего — ${stats.topExpense.target}, ${formatGold(stats.topExpense.amount)}`
              : "Расходов не было"}
          </span>
        }
      />
      <StatCard
        label="На складе сейчас"
        value={stats.stockValue}
        loading={loading}
        footerOnMobile={stats.staleCount > 0}
        hint={`${stats.stockQuantity} шт. · ${stats.stockPositions} ${plural(stats.stockPositions, "позиция", "позиции", "позиций")}`}
        footer={
          stats.staleCount > 0 ? (
            <button
              type="button"
              onClick={onShowStale}
              className="inline-flex cursor-pointer items-center gap-1.5 font-medium text-amber-700 hover:underline dark:text-amber-400"
            >
              <Clock className="size-3.5 shrink-0" aria-hidden />
              <span className="sm:hidden">
                {stats.staleCount}{" "}
                {plural(stats.staleCount, "лежит", "лежат", "лежат")} {STALE_DAYS}+ дн.
              </span>
              <span className="hidden sm:inline">
                {stats.staleCount}{" "}
                {plural(stats.staleCount, "позиция лежит", "позиции лежат", "позиций лежат")}{" "}
                дольше {STALE_DAYS} дней
              </span>
            </button>
          ) : (
            <span className="text-muted-foreground">
              Дольше {STALE_DAYS} дней ничего не лежит
            </span>
          )
        }
      />
    </div>
  );
}
