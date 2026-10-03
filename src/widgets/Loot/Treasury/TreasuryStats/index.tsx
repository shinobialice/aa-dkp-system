import Link from "next/link";
import { formatNumber, plural } from "@/shared/lib/format";
import { formatShortDate, monthName, type MonthStats } from "../treasuryModel";
import StaleStockFooter from "./StaleStockFooter";
import StatCard from "./StatCard";

type Props = {
  stats: MonthStats;
  month: number;
  loading: boolean;
  onShowStale: () => void;
};

export default function TreasuryStats({
  stats,
  month,
  loading,
  onShowStale,
}: Props) {
  const treasuryCount = `${stats.treasuryCount} ${plural(stats.treasuryCount, "поступление", "поступления", "поступлений")}`;
  const expensesCount = `${stats.expensesCount} ${plural(stats.expensesCount, "запись", "записи", "записей")}`;
  const positions = plural(
    stats.stockPositions,
    "позиция",
    "позиции",
    "позиций",
  );

  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
      <StatCard
        label={`Доход за ${monthName(month)}`}
        value={stats.income}
        loading={loading}
        hint={`продажи ${formatNumber(stats.salesTotal)} + разное ${formatNumber(stats.miscTotal)}`}
        footer={
          <>
            <span className="text-muted-foreground">
              70% в зарплаты, 30% в казну
            </span>
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
        hint={treasuryCount}
        footer={
          <span className="text-muted-foreground">
            {lastTreasuryLabel(stats)}
          </span>
        }
      />
      <StatCard
        label="Расходы"
        value={stats.expensesTotal}
        loading={loading}
        hint={expensesCount}
        footer={
          <span className="text-muted-foreground">
            {topExpenseLabel(stats)}
          </span>
        }
      />
      <StatCard
        label="На складе сейчас"
        value={stats.stockValue}
        loading={loading}
        footerOnMobile={stats.staleCount > 0}
        hint={`${stats.stockQuantity} шт. · ${stats.stockPositions} ${positions}`}
        footer={
          <StaleStockFooter
            staleCount={stats.staleCount}
            onShowStale={onShowStale}
          />
        }
      />
    </div>
  );
}

function lastTreasuryLabel({ lastTreasury, treasuryCount }: MonthStats) {
  if (!lastTreasury) return "Поступлений не было";
  const prefix = treasuryCount > 1 ? "Последнее: " : "";
  const source = lastTreasury.source ?? "без источника";
  return `${prefix}${source} · ${formatShortDate(lastTreasury.at)}`;
}

function topExpenseLabel({ topExpense }: MonthStats) {
  if (!topExpense) return "Расходов не было";
  return `Больше всего — ${topExpense.target}, ${formatNumber(topExpense.amount)}`;
}
