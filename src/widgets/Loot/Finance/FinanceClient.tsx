"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { getUnpaidSalaryReasons } from "@/actions/getUnpaidSalaryReasons";
import { recalculateFinanceForMonthAsAdmin } from "@/actions/recalculateFinanceForMonth";
import { useAsyncData } from "@/hooks/useAsyncData";
import { shiftYearMonth } from "@/shared/config/months";
import FinanceHeader from "./FinanceHeader";
import FinanceSummary from "./FinanceSummary";
import { salaryPlace } from "./financeModel";
import MySalaryCard from "./MySalaryCard";
import SalaryTable from "./SalaryTable";
import { useFinanceMonth } from "./useFinanceMonth";

type Props = {
  currentMonth: number;
  currentYear: number;
  currentUserId: number | null;
  isAdmin: boolean;
};

export default function FinanceClient({
  currentMonth,
  currentYear,
  currentUserId,
  isAdmin,
}: Props) {
  const [period, setPeriod] = useState({
    month: currentMonth,
    year: currentYear,
  });
  const [recalculating, setRecalculating] = useState(false);
  const { month, year } = period;
  const finance = useFinanceMonth(month, year);

  const unpaidIds = finance.salaries
    .filter((row) => row.total <= 0)
    .map((row) => row.userId);
  const reasons = useAsyncData(
    unpaidIds.length > 0 ? `${year}-${month}:${unpaidIds.join(",")}` : null,
    () => getUnpaidSalaryReasons(month, year, unpaidIds),
  );

  const myRow = finance.salaries.find(
    (row) => row.userId === currentUserId && row.total > 0,
  );

  const handleRecalculate = async () => {
    setRecalculating(true);
    try {
      await recalculateFinanceForMonthAsAdmin(month, year);
      await finance.refresh();
    } finally {
      setRecalculating(false);
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-6xl min-w-0 flex-col gap-4">
      <FinanceHeader
        month={month}
        year={year}
        isAdmin={isAdmin}
        isLatestMonth={year * 12 + month >= currentYear * 12 + currentMonth}
        recalculating={recalculating}
        updatedAt={finance.updatedAt}
        onShiftMonth={(delta) => setPeriod(shiftYearMonth(period, delta))}
        onRecalculate={handleRecalculate}
      />

      {!finance.isLoaded && (
        <div className="flex items-center justify-center gap-2 py-16 text-sm text-muted-foreground">
          <Loader2 className="size-4 animate-spin" /> Загрузка…
        </div>
      )}
      {finance.isLoaded && (
        <>
          {myRow && (
            <MySalaryCard
              row={myRow}
              place={salaryPlace(finance.salaries, myRow)}
              month={month}
            />
          )}
          {finance.fund && (
            <FinanceSummary
              fund={finance.fund}
              salaries={finance.salaries}
              month={month}
            />
          )}
          {!finance.fund && (
            <p className="rounded-xl border border-dashed px-4 py-8 text-center text-sm text-muted-foreground">
              Фонд за этот месяц ещё не рассчитан
            </p>
          )}
          {finance.salaries.length > 0 && (
            <SalaryTable
              rows={finance.salaries}
              month={month}
              currentUserId={currentUserId}
              unpaidReasons={(!reasons.isLoading && reasons.data) || {}}
              advance={{
                isAdmin,
                onChange: finance.changeAdvance,
                onEditStart: finance.startEditing,
                onEditEnd: finance.stopEditing,
              }}
            />
          )}
        </>
      )}
    </div>
  );
}
