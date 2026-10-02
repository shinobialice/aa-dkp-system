"use client";

import Image from "next/image";
import type { ReactNode } from "react";
import { cn } from "@/shared/lib/tw-merge";
import {
  formatGold,
  MONTHS_GENITIVE,
  type Fund,
  type SalaryRow,
} from "./financeModel";

const GOLD_ICON = "https://archeagecodex.com/items/gold.png";

function Gold({ value, size = "lg" }: { value: number; size?: "lg" | "md" }) {
  return (
    <span
      className={cn(
        "flex items-center gap-2 leading-tight font-bold tabular-nums",
        size === "lg" ? "text-2xl sm:text-[28px]" : "text-xl",
      )}
    >
      <Image
        src={GOLD_ICON}
        alt=""
        width={20}
        height={20}
        className="size-[18px] sm:size-5"
      />
      {formatGold(value)}
    </span>
  );
}

function Split({ parts }: { parts: { value: number; className: string }[] }) {
  const visible = parts.filter((part) => part.value > 0);
  if (visible.length === 0) {
    return <span className="block h-2.5 rounded bg-muted" />;
  }
  return (
    <span className="flex h-2.5 gap-[3px] overflow-hidden rounded">
      {visible.map((part, index) => (
        <span
          key={index}
          className={part.className}
          style={{ flexGrow: part.value }}
        />
      ))}
    </span>
  );
}

function Line({
  label,
  value,
  swatch,
  muted,
}: {
  label: string;
  value: ReactNode;
  swatch?: string;
  muted?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex items-center justify-between gap-3 text-[13px]",
        muted && "text-muted-foreground",
      )}
    >
      <span className="flex items-center gap-1.5">
        {swatch && <span className={cn("size-2 rounded-[2px]", swatch)} />}
        {label}
      </span>
      <span className={cn("tabular-nums", !muted && "font-semibold")}>
        {value}
      </span>
    </div>
  );
}

function Card({ label, children }: { label: string; children: ReactNode }) {
  return (
    <section
      aria-label={label}
      className="flex min-w-0 flex-col gap-2.5 rounded-xl border bg-card px-4 py-3.5 sm:px-[18px] sm:py-4"
    >
      <span className="text-[13px] font-medium text-muted-foreground">
        {label}
      </span>
      {children}
    </section>
  );
}

export default function FinanceSummary({
  fund,
  salaries,
  month,
}: {
  fund: Fund;
  salaries: SalaryRow[];
  month: number;
}) {
  const totalSalaries = salaries.length
    ? salaries.reduce((sum, row) => sum + row.total, 0)
    : fund.salaryBudget;
  const advanceSent = fund.advanceSent ?? 0;
  const inTreasury = fund.inTreasury ?? 0;
  const remainingSalaries = totalSalaries - advanceSent;
  const freeGold = inTreasury - remainingSalaries;
  const paidCount = salaries.filter((row) => row.total > 0).length;
  const monthName = MONTHS_GENITIVE[month - 1];

  return (
    <div className="grid gap-3 md:grid-cols-3">
      <Card label={`Заработано за ${monthName}`}>
        <Gold value={fund.totalIncome} />
        <Split
          parts={[
            { value: fund.salaryBudget, className: "bg-green-600" },
            { value: fund.treasuryBudget, className: "bg-muted-foreground/40" },
          ]}
        />
        <div className="flex flex-col gap-1">
          <Line
            label="Зарплатный фонд · 70%"
            value={formatGold(fund.salaryBudget)}
            swatch="bg-green-600"
          />
          <Line
            label="Доход казны · 30%"
            value={formatGold(fund.treasuryBudget)}
            swatch="bg-muted-foreground/40"
          />
          <Line label="Расходы" value={formatGold(fund.totalExpenses)} muted />
        </div>
      </Card>

      <Card label="В казне сейчас">
        <Gold value={inTreasury} />
        <Split
          parts={[
            {
              value: Math.max(0, remainingSalaries),
              className: "bg-amber-500",
            },
            { value: Math.max(0, freeGold), className: "bg-green-600" },
          ]}
        />
        <div className="flex flex-col gap-1">
          <Line
            label="Отложено на зарплаты"
            value={formatGold(remainingSalaries)}
            swatch="bg-amber-500"
          />
          <Line
            label="Свободно"
            value={formatGold(freeGold)}
            swatch="bg-green-600"
          />
          <Line
            label="Перенесено с прошлого месяца"
            value={formatGold(fund.carryOver ?? 0)}
            muted
          />
        </div>
      </Card>

      <Card label={`Выплаты за ${monthName}`}>
        <span className="text-2xl leading-tight font-bold tabular-nums sm:text-[28px]">
          {formatGold(advanceSent)}{" "}
          <span className="text-base font-medium text-muted-foreground">
            из {formatGold(totalSalaries)}
          </span>
        </span>
        <span className="relative block h-2.5 overflow-hidden rounded bg-muted">
          <span
            className="absolute inset-y-0 left-0 rounded bg-green-600"
            style={{
              width: `${totalSalaries > 0 ? Math.min(100, (advanceSent / totalSalaries) * 100) : 0}%`,
            }}
          />
        </span>
        <div className="flex flex-col gap-1">
          <Line
            label="Осталось выплатить"
            value={formatGold(remainingSalaries)}
          />
          <Line label="Выслано авансом" value={formatGold(advanceSent)} />
          <Line
            label="Получают зарплату"
            value={`${paidCount} из ${salaries.length}`}
            muted
          />
        </div>
      </Card>
    </div>
  );
}

export function MySalaryCard({
  row,
  place,
  month,
}: {
  row: SalaryRow;
  place: number | null;
  month: number;
}) {
  const mods = [
    row.tenurePercent ? `стаж +${Math.round(row.tenurePercent)}%` : null,
    row.customBonusPercent
      ? `бонус +${Math.round(row.customBonusPercent)}%`
      : null,
    row.penaltyPercent
      ? `штраф −${Math.round(row.penaltyPercent)}%`
      : "штрафов нет",
  ].filter(Boolean) as string[];

  return (
    <section
      aria-label="Моя зарплата"
      className="flex flex-col gap-2 rounded-xl border border-green-200 bg-green-50 px-4 py-3.5 sm:flex-row sm:items-center sm:gap-6 sm:px-5 dark:border-green-500/25 dark:bg-green-500/5"
    >
      <div className="flex flex-col gap-1">
        <span className="text-xs font-semibold text-green-700 dark:text-green-400">
          Моя зарплата за {MONTHS_GENITIVE[month - 1]}
        </span>
        <Gold value={row.total} />
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <span className="text-[13px] text-green-800 dark:text-green-300">
          {place ? `${place}-е место · ` : ""}посещаемость{" "}
          {Math.round(row.totalPercent)}% · вес {Math.round(row.weightPercent)}%
          {row.sentAmount > 0 && ` · выслано ${formatGold(row.sentAmount)}`}
        </span>
        <div className="flex flex-wrap gap-1.5">
          {mods.map((mod) => (
            <span
              key={mod}
              className="rounded-full bg-background px-2 py-0.5 text-xs font-medium text-foreground/80"
            >
              {mod}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
