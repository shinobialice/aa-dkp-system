"use client";

import { useMemo, useState } from "react";
import { buildJournal } from "./journalModel";
import { buildStockGroups } from "./stockModel";
import TreasuryDialogs from "./TreasuryDialogs";
import TreasuryHeader from "./TreasuryHeader";
import {
  buildBossSales,
  buildMonthStats,
  expensesForMonth,
  monthName,
} from "./treasuryModel";
import TreasuryStats from "./TreasuryStats";
import TreasuryTabs from "./TreasuryTabs";
import type { StockView } from "./treasuryView";
import { useTreasuryActions } from "./useTreasuryActions";
import { useTreasuryData } from "./useTreasuryData";

type Props = {
  isAdmin: boolean;
};

export default function TreasuryPage({ isAdmin }: Props) {
  const [period, setPeriod] = useState(() => {
    const now = new Date();
    return { month: now.getMonth() + 1, year: now.getFullYear() };
  });
  const [view, setView] = useState<StockView>({
    tab: "stock",
    search: "",
    sort: "value",
  });
  const { month, year } = period;
  const data = useTreasuryData(month, year, isAdmin);
  const actions = useTreasuryActions(data, month, year);
  const { loot, expenses, misc } = data;

  const stock = useMemo(() => buildStockGroups(loot, new Date()), [loot]);
  const journal = useMemo(
    () => buildJournal(loot, month, year),
    [loot, month, year],
  );
  const bossSales = useMemo(
    () => buildBossSales(loot, month, year),
    [loot, month, year],
  );
  const monthExpenses = useMemo(
    () => expensesForMonth(expenses, month, year),
    [expenses, month, year],
  );
  const stats = useMemo(
    () => buildMonthStats({ loot, expenses, misc, stock, month, year }),
    [loot, expenses, misc, stock, month, year],
  );

  return (
    <div className="mx-auto flex w-full max-w-6xl min-w-0 flex-col gap-6">
      <TreasuryHeader
        month={month}
        year={year}
        isAdmin={isAdmin}
        onMonthChange={(nextMonth, nextYear) =>
          setPeriod({ month: nextMonth, year: nextYear })
        }
        onAddDrop={() => actions.openAddLoot()}
        onAddTreasury={() => actions.openAddLoot("В казну")}
        onAddExpense={() => actions.openExpense()}
      />

      <TreasuryStats
        stats={stats}
        fund={data.fund}
        month={month}
        loading={!data.loaded}
        fundLoading={!data.fundLoaded}
      />

      <TreasuryTabs
        view={view}
        onViewChange={setView}
        stock={stock}
        stats={stats}
        journal={journal}
        bossSales={bossSales}
        monthExpenses={monthExpenses}
        misc={misc}
        itemTypes={data.itemTypes}
        isAdmin={isAdmin}
        loading={!data.loaded}
        periodKey={`${year}-${month}`}
        monthLabel={monthName(month)}
        actions={actions}
      />

      {isAdmin && (
        <TreasuryDialogs
          actions={actions}
          itemTypes={data.itemTypes}
          users={data.users}
          onStockChanged={data.refreshLoot}
        />
      )}
    </div>
  );
}
