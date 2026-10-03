import "server-only";
import sql from "@/shared/lib/db";
import type { GuildFundsRow } from "@/shared/lib/dbTypes";

const SALARY_SHARE = 0.7;
const TREASURY_SHARE = 0.3;

type Sum = { sum: number };

export async function generateGuildFunds(month: number, year: number) {
  const startIso = new Date(Date.UTC(year, month - 1, 1)).toISOString();
  const endIso = new Date(Date.UTC(year, month, 1)).toISOString();

  let sums: [number, number, number, number, number];
  try {
    sums = await Promise.all([
      sumOf(sql<Sum[]>`
        SELECT COALESCE(SUM(price), 0)::float8 AS sum FROM loot
        WHERE status = 'Продано' AND sold_at >= ${startIso} AND sold_at < ${endIso}
      `),
      sumOf(sql<Sum[]>`
        SELECT COALESCE(SUM(amount), 0)::float8 AS sum FROM misc_loot_totals
        WHERE month = ${month} AND year = ${year}
      `),
      sumOf(sql<Sum[]>`
        SELECT COALESCE(SUM(price), 0)::float8 AS sum FROM loot
        WHERE status = 'В казну' AND sold_at >= ${startIso} AND sold_at < ${endIso}
      `),
      sumOf(sql<Sum[]>`
        SELECT COALESCE(SUM(amount), 0)::float8 AS sum FROM "Expense"
        WHERE date >= ${startIso} AND date < ${endIso}
      `),
      liveAdvanceSent(month, year),
    ]);
  } catch (error) {
    console.error("Ошибка при сборе данных фонда:", error);
    throw new Error("Не удалось загрузить данные для фонда гильдии");
  }

  const [lootIncome, miscIncome, treasuryIncome, totalExpenses, advanceSent] =
    sums;
  const totalIncome = lootIncome + miscIncome;
  const carryOver = await carryOverFromPreviousMonth(month, year);
  const fund = {
    year,
    month,
    totalIncome: Math.round(totalIncome),
    totalExpenses,
    salaryBudget: Math.floor(totalIncome * SALARY_SHARE),
    treasuryBudget: Math.floor(totalIncome * TREASURY_SHARE),
    inTreasury:
      carryOver + totalIncome + treasuryIncome - totalExpenses - advanceSent,
    advanceSent,
    carryOver,
  };

  try {
    await sql.begin(async (tx) => {
      await tx`DELETE FROM "GuildFunds" WHERE year = ${year} AND month = ${month}`;
      await tx`INSERT INTO "GuildFunds" ${tx(fund)}`;
    });
  } catch (error) {
    console.error("Ошибка при сохранении фонда:", error);
    throw new Error("Не удалось создать фонд гильдии");
  }
}

// Аванс за месяц считается только от реальных отметок по игрокам
// (Salary.sentAmount) — никакого отдельно хранимого значения, которое
// могло бы разойтись с реальностью.
function liveAdvanceSent(month: number, year: number) {
  return sumOf(sql<Sum[]>`
    SELECT COALESCE(SUM("sentAmount"), 0)::float8 AS sum FROM "Salary"
    WHERE month = ${month} AND year = ${year}
  `);
}

// Остаток ("свободная" голда) предыдущего месяца — то, что не занято под ещё
// не выплаченные ЗП этого месяца. Именно эта сумма становится стартовым
// остатком нового месяца, если для предыдущего уже есть фонд.
async function carryOverFromPreviousMonth(month: number, year: number) {
  const prevMonth = month === 1 ? 12 : month - 1;
  const prevYear = month === 1 ? year - 1 : year;

  const [prevFund] = await sql<Pick<GuildFundsRow, "inTreasury">[]>`
    SELECT "inTreasury" FROM "GuildFunds" WHERE month = ${prevMonth} AND year = ${prevYear}
  `;
  if (!prevFund) return 0;

  const unpaidSalaries = await sumOf(sql<Sum[]>`
    SELECT COALESCE(SUM(total - "sentAmount"), 0)::float8 AS sum FROM "Salary"
    WHERE month = ${prevMonth} AND year = ${prevYear}
  `);
  return (prevFund.inTreasury ?? 0) - unpaidSalaries;
}

async function sumOf(query: Promise<Sum[]>) {
  const [row] = await query;
  return row?.sum ?? 0;
}
