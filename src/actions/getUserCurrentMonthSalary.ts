"use server";
import sql from "@/shared/lib/db";
import type { SalaryRow } from "@/shared/lib/dbTypes";
import { getMoscowYearMonth } from "@/utils/getMoscowISOString";

export async function getUserCurrentMonthSalary(userId: number) {
  const { month, year } = getMoscowYearMonth(new Date());

  try {
    const [data] = await sql<Pick<SalaryRow, "total">[]>`
      SELECT total FROM "Salary"
      WHERE "userId" = ${userId} AND month = ${month} AND year = ${year}
    `;
    return data?.total ?? null;
  } catch (error) {
    console.error("Ошибка при получении зарплаты:", error);
    return null;
  }
}
