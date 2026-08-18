"use server";
import sql from "@/shared/lib/db";

export async function getCurrentMonthSalaries() {
  const now = new Date();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();

  let data;
  try {
    data = await sql<any[]>`
      SELECT "userId", total FROM "Salary" WHERE month = ${month} AND year = ${year}
    `;
  } catch (error) {
    console.error("Ошибка при получении зарплат:", error);
    return {};
  }

  const salaries: Record<number, number> = {};
  for (const row of data) {
    salaries[row.userId] = row.total ?? 0;
  }
  return salaries;
}
