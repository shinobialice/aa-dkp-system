"use server";
import supabase from "@/shared/lib/supabaseAdmin";

// Остаток ("свободная" голда) предыдущего месяца — то, что не занято под
// ещё не выплаченные ЗП этого месяца. Именно эта сумма становится
// стартовым остатком нового месяца, если для предыдущего уже есть фонд.
async function getCarryOverFromPreviousMonth(
  month: number,
  year: number,
): Promise<number> {
  const prevMonth = month === 1 ? 12 : month - 1;
  const prevYear = month === 1 ? year - 1 : year;

  const { data: prevFund } = await supabase
    .from("GuildFunds")
    .select("inTreasury")
    .eq("month", prevMonth)
    .eq("year", prevYear)
    .maybeSingle();

  if (!prevFund) return 0;

  const { data: prevSalaries } = await supabase
    .from("Salary")
    .select("total, sentAmount")
    .eq("month", prevMonth)
    .eq("year", prevYear);

  const totalSalaries = (prevSalaries ?? []).reduce(
    (sum, s) => sum + (s.total ?? 0),
    0,
  );
  const sentAmount = (prevSalaries ?? []).reduce(
    (sum, s) => sum + (s.sentAmount ?? 0),
    0,
  );
  const remainingSalaries = totalSalaries - sentAmount;

  return prevFund.inTreasury - remainingSalaries;
}

// Аванс за месяц считается только от реальных отметок по игрокам
// (Salary.sentAmount) — никакого отдельно хранимого значения, которое
// могло бы разойтись с реальностью.
async function getLiveAdvanceSent(month: number, year: number): Promise<number> {
  const { data: salaries } = await supabase
    .from("Salary")
    .select("sentAmount")
    .eq("month", month)
    .eq("year", year);

  return (salaries ?? []).reduce((sum, s) => sum + (s.sentAmount ?? 0), 0);
}

export const generateGuildFunds = async (month: number, year: number) => {
  const advanceSent = await getLiveAdvanceSent(month, year);

  const startDate = new Date(Date.UTC(year, month - 1, 1));
  const endDate = new Date(Date.UTC(month === 12 ? year + 1 : year, month % 12, 1));

  const startIso = startDate.toISOString();
  const endIso = endDate.toISOString();

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

  const lootIncome = loot.reduce((sum, item) => {
    return sum + (item.price ?? 0); // ✅ price — это уже итоговая сумма продажи
  }, 0);

  const { data: miscTotals, error: miscError } = await supabase
    .from("misc_loot_totals")
    .select("amount")
    .eq("month", month)
    .eq("year", year);

  if (miscError) {
    console.error("Ошибка при получении сумм по разному:", miscError);
    throw new Error("Не удалось загрузить суммы по разному");
  }

  const miscIncome = (miscTotals ?? []).reduce(
    (sum, item) => sum + (item.amount ?? 0),
    0,
  );

  const totalIncome = lootIncome + miscIncome;

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

  const carryOver = await getCarryOverFromPreviousMonth(month, year);

  const salaryBudget = Math.floor(totalIncome * 0.7);
  const treasuryBudget = Math.floor(totalIncome * 0.3);
  const inTreasury =
    carryOver + totalIncome + treasuryIncomeSum - totalExpenses - advanceSent;

  const { error: deleteError } = await supabase
    .from("GuildFunds")
    .delete()
    .eq("year", year)
    .eq("month", month);

  if (deleteError) {
    console.error("Ошибка при удалении предыдущего фонда:", deleteError);
    throw new Error("Не удалось очистить старые данные фонда");
  }

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
      carryOver: carryOver,
    },
  ]);

  if (insertError) {
    console.error("Ошибка при создании фонда:", insertError);
    throw new Error("Не удалось создать фонд гильдии");
  }
};
