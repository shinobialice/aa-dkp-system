"use server";

import { recalculateFinanceForMonth } from "@/server/finance/recalc";
import ensurePrivilieges from "./ensurePrivilieges";

export async function recalculateFinanceForMonthAsAdmin(
  month: number,
  year: number,
) {
  await ensurePrivilieges(["Администратор"]);
  await recalculateFinanceForMonth(month, year);
}
