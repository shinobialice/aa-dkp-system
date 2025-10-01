"use server";
import supabase from "@/shared/lib/supabase";

export const generateGuildFunds = async (month: number, year: number, advanceSent: number = 0) => {
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

  // 2.1. Fetch all "В казну" поступления за месяц
  const { data: treasuryIncome, error: treasuryError } = await supabase
    .from("loot")
    .select("price")
    .eq("status", "В казну")
    .gte("sold_at", startIso)
    .lt("sold_at", endIso);

  if (treasuryError || !treasuryIncome) {
    console.error("Ошибка при получении поступлений в казну:", treasuryError);
    throw new Error("Не удалось загрузить поступления в казну");
  }

  const treasuryIncomeSum = treasuryIncome.reduce(
    (sum, item) => sum + (item.price ?? 0),
    0
  );

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
  const salaryBudget = Math.floor(totalIncome * 0.7);
  const treasuryBudget = Math.floor(totalIncome * 0.3);
  const inTreasury = totalIncome + treasuryIncomeSum - totalExpenses;

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
      salaryBudget: salaryBudget,
      inTreasury: inTreasury,
      advanceSent: advanceSent,
      treasuryBudget: treasuryBudget,
    },
  ]);

  if (insertError) {
    console.error("Ошибка при создании фонда:", insertError);
    throw new Error("Не удалось создать фонд гильдии");
  }
};
