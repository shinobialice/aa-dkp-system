"use server";
import sql from "@/shared/lib/db";

// Остаток ("свободная" голда) предыдущего месяца — то, что не занято под
// ещё не выплаченные ЗП этого месяца. Именно эта сумма становится
// стартовым остатком нового месяца, если для предыдущего уже есть фонд.
async function getCarryOverFromPreviousMonth(
  month: number,
  year: number,
): Promise<number> {
  const prevMonth = month === 1 ? 12 : month - 1;
  const prevYear = month === 1 ? year - 1 : year;

  const [prevFund] = await sql<any[]>`
    SELECT "inTreasury" FROM "GuildFunds" WHERE month = ${prevMonth} AND year = ${prevYear}
  `;

  if (!prevFund) return 0;

  const prevSalaries = await sql<any[]>`
    SELECT total, "sentAmount" FROM "Salary" WHERE month = ${prevMonth} AND year = ${prevYear}
  `;

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
  const salaries = await sql<any[]>`
    SELECT "sentAmount" FROM "Salary" WHERE month = ${month} AND year = ${year}
  `;

  return (salaries ?? []).reduce((sum, s) => sum + (s.sentAmount ?? 0), 0);
}

export const generateGuildFunds = async (month: number, year: number) => {
  const advanceSent = await getLiveAdvanceSent(month, year);

  const startDate = new Date(Date.UTC(year, month - 1, 1));
  const endDate = new Date(Date.UTC(month === 12 ? year + 1 : year, month % 12, 1));

  const startIso = startDate.toISOString();
  const endIso = endDate.toISOString();

  let loot;
  try {
    loot = await sql<any[]>`
      SELECT quantity, price FROM loot
      WHERE status = 'Продано' AND sold_at >= ${startIso} AND sold_at < ${endIso}
    `;
  } catch (lootError) {
    console.error("Ошибка при получении лута:", lootError);
    throw new Error("Не удалось загрузить проданный лут");
  }

  const lootIncome = loot.reduce((sum, item) => {
    return sum + (item.price ?? 0); // ✅ price — это уже итоговая сумма продажи
  }, 0);

  let miscTotals;
  try {
    miscTotals = await sql<any[]>`
      SELECT amount FROM misc_loot_totals WHERE month = ${month} AND year = ${year}
    `;
  } catch (miscError) {
    console.error("Ошибка при получении сумм по разному:", miscError);
    throw new Error("Не удалось загрузить суммы по разному");
  }

  const miscIncome = (miscTotals ?? []).reduce(
    (sum, item) => sum + (item.amount ?? 0),
    0,
  );

  const totalIncome = lootIncome + miscIncome;

  let treasuryIncome;
  try {
    treasuryIncome = await sql<any[]>`
      SELECT price FROM loot
      WHERE status = 'В казну' AND sold_at >= ${startIso} AND sold_at < ${endIso}
    `;
  } catch (treasuryError) {
    console.error("Ошибка при получении поступлений в казну:", treasuryError);
    throw new Error("Не удалось загрузить поступления в казну");
  }

  const treasuryIncomeSum = treasuryIncome.reduce(
    (sum, item) => sum + (item.price ?? 0),
    0,
  );

  let expenses;
  try {
    expenses = await sql<any[]>`
      SELECT amount FROM "Expense" WHERE date >= ${startIso} AND date < ${endIso}
    `;
  } catch (expensesError) {
    console.error("Ошибка при получении расходов:", expensesError);
    throw new Error("Не удалось загрузить расходы");
  }

  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);

  const carryOver = await getCarryOverFromPreviousMonth(month, year);

  const salaryBudget = Math.floor(totalIncome * 0.7);
  const treasuryBudget = Math.floor(totalIncome * 0.3);
  const inTreasury =
    carryOver + totalIncome + treasuryIncomeSum - totalExpenses - advanceSent;

  try {
    await sql<any[]>`DELETE FROM "GuildFunds" WHERE year = ${year} AND month = ${month}`;
  } catch (deleteError) {
    console.error("Ошибка при удалении предыдущего фонда:", deleteError);
    throw new Error("Не удалось очистить старые данные фонда");
  }

  try {
    await sql<any[]>`
      INSERT INTO "GuildFunds"
        (year, month, "totalIncome", "totalExpenses", "salaryBudget", "inTreasury", "advanceSent", "treasuryBudget", "carryOver")
      VALUES (
        ${year}, ${month}, ${Math.round(totalIncome)}, ${totalExpenses}, ${salaryBudget},
        ${inTreasury}, ${advanceSent}, ${treasuryBudget}, ${carryOver}
      )
    `;
  } catch (insertError) {
    console.error("Ошибка при создании фонда:", insertError);
    throw new Error("Не удалось создать фонд гильдии");
  }
};
