"use server";
import supabase from "@/shared/lib/supabase";

export const generateGuildFunds = async (month: number, year: number) => {
  const startDate = new Date(`${year}-${month}-01`);
  const endDate =
    month === 12
      ? new Date(`${year + 1}-01-01`)
      : new Date(`${year}-${month + 1}-01`);

  const startIso = startDate.toISOString();
  const endIso = endDate.toISOString();

  // 1. Fetch sold loot with itemType joined
  const { data: loot, error: lootError } = await supabase
    .from("loot")
    .select("quantity, price")
    .eq("status", "Продано")
    .gte("sold_at", startIso)
    .lt("sold_at", endIso);

  if (lootError || !loot) {
    console.error("Ошибка при получении лута:", lootError);
    throw new Error("Не удалось загрузить проданный лут");
  }

  // 2. Calculate total income
  const totalIncome = loot.reduce((sum, item) => {
    return sum + (item.price ?? 0); // ✅ price — это уже итоговая сумма продажи
  }, 0);

  // 3. Fetch expenses
  const { data: expenses, error: expensesError } = await supabase
    .from("Expense")
    .select("amount")
    .gte("date", startIso)
    .lt("date", endIso);

  if (expensesError || !expenses) {
    console.error("Ошибка при получении расходов:", expensesError);
    throw new Error("Не удалось загрузить расходы");
  }

  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);

  // 4. Calculate profit, budget, treasury
  const profit = totalIncome - totalExpenses;
  const salaryBudget = Math.floor(profit * 0.7);
  const treasuryLeft = profit - salaryBudget;

  // 5. Delete previous fund record for the month
  const { error: deleteError } = await supabase
    .from("GuildFunds")
    .delete()
    .eq("year", year)
    .eq("month", month);

  if (deleteError) {
    console.error("Ошибка при удалении предыдущего фонда:", deleteError);
    throw new Error("Не удалось очистить старые данные фонда");
  }

  // 6. Insert new guild fund record
  const { error: insertError } = await supabase.from("GuildFunds").insert([
    {
      year,
      month,
      totalIncome: Math.round(totalIncome),
      totalExpenses: totalExpenses,
      profit,
      salaryBudget: salaryBudget,
      treasuryLeft: treasuryLeft,
    },
  ]);

  if (insertError) {
    console.error("Ошибка при создании фонда:", insertError);
    throw new Error("Не удалось создать фонд гильдии");
  }
};
