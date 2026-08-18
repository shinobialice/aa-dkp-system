"use server";
import sql from "@/shared/lib/db";

export async function getUserCurrentMonthSalary(userId: number) {
  const now = new Date();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();

  try {
    const [data] = await sql<any[]>`
      SELECT total FROM "Salary"
      WHERE "userId" = ${userId} AND month = ${month} AND year = ${year}
    `;
    return data?.total ?? null;
  } catch (error) {
    console.error("Ошибка при получении зарплаты:", error);
    return null;
  }
}
