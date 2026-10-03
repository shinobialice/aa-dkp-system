import { formatNumber } from "@/shared/lib/format";
import { GoldAmount } from "@/shared/ui";
import { monthLabel, salaryModifiers, type SalaryEntry } from "./financeModel";

type Props = {
  row: SalaryEntry;
  place: number;
  month: number;
};

export default function MySalaryCard({ row, place, month }: Props) {
  const modifiers = salaryModifiers(row).map((modifier) => modifier.text);
  if (!row.penaltyPercent) modifiers.push("штрафов нет");
  const sent =
    row.sentAmount > 0 ? ` · выслано ${formatNumber(row.sentAmount, 0)}` : "";

  return (
    <section
      aria-label="Моя зарплата"
      className="flex flex-col gap-2 rounded-xl border border-green-200 bg-green-50 px-4 py-3.5 sm:flex-row sm:items-center sm:gap-6 sm:px-5 dark:border-green-500/25 dark:bg-green-500/5"
    >
      <div className="flex flex-col gap-1">
        <span className="text-xs font-semibold text-green-700 dark:text-green-400">
          Моя зарплата за {monthLabel(month)}
        </span>
        <GoldAmount value={row.total} size="lg" />
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <span className="text-sm text-green-800 dark:text-green-300">
          {place}-е место · посещаемость {Math.round(row.totalPercent)}% · вес{" "}
          {Math.round(row.weightPercent)}%{sent}
        </span>
        <div className="flex flex-wrap gap-1.5">
          {modifiers.map((modifier) => (
            <span
              key={modifier}
              className="rounded-full bg-background px-2 py-0.5 text-xs font-medium text-foreground/80"
            >
              {modifier}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
