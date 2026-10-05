"use client";

import { useEffect } from "react";
import { toast } from "sonner";
import { getExpenses } from "@/actions/expenseActions";
import { getGuildFunds } from "@/actions/financeActions";
import { getActiveUsers } from "@/actions/getActiveUsers";
import { getItemTypes, getLoot } from "@/actions/lootActions";
import { getMiscLootTotals } from "@/actions/miscLootTotals";
import { useAsyncData } from "@/hooks/useAsyncData";
import { useLiveChanges } from "@/hooks/useLiveChanges";

export type TreasuryData = ReturnType<typeof useTreasuryData>;

export function useTreasuryData(month: number, year: number, isAdmin: boolean) {
  const loot = useAsyncData("loot", getLoot);
  const expenses = useAsyncData("expenses", getExpenses);
  const itemTypes = useAsyncData("item-types", getItemTypes);
  const misc = useAsyncData(`misc:${year}-${month}`, () =>
    getMiscLootTotals(month, year),
  );
  const fund = useAsyncData(`fund:${year}-${month}`, () =>
    getGuildFunds(month, year),
  );
  const users = useAsyncData(isAdmin ? "active-users" : null, getActiveUsers);

  const loadFailed = [loot, expenses, itemTypes].some(
    (source) => source.error !== undefined && source.data === undefined,
  );
  useEffect(() => {
    if (loadFailed) toast.error("Не удалось загрузить казну");
  }, [loadFailed]);

  useLiveChanges(["loot"], () => {
    loot.reload();
    expenses.reload();
    misc.reload();
  });
  useLiveChanges(["finance"], fund.reload);

  return {
    loot: loot.data ?? [],
    expenses: expenses.data ?? [],
    itemTypes: itemTypes.data ?? [],
    misc: misc.data ?? [],
    fund: fund.data ?? null,
    users: users.data ?? [],
    loaded: !loot.isLoading && !expenses.isLoading && !itemTypes.isLoading,
    fundLoaded: !fund.isLoading,
    refreshLoot: loot.reload,
    refreshExpenses: expenses.reload,
    refreshMisc: misc.reload,
  };
}
