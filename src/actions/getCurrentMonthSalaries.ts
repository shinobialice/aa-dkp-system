"use server";
import sql from "@/shared/lib/db";
import type { SalaryRow } from "@/shared/lib/dbTypes";
import { getMoscowYearMonth } from "@/utils/getMoscowISOString";

export async function getCurrentMonthSalaries() {
  const { month, year } = getMoscowYearMonth(new Date());

  let data: Pick<SalaryRow, "userId" | "total">[];
  try {
    data = await sql<Pick<SalaryRow, "userId" | "total">[]>`
      SELECT "userId", total FROM "Salary" WHERE month = ${month} AND year = ${year}
    `;
  } catch (error) {
    console.error("Ошибка при получении зарплат:", error);
    return {};
  }

  const salaries: Record<number, number> = {};
  for (const row of data) {
    salaries[row.userId] = row.total;
  }
  return salaries;
}
