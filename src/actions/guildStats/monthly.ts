"use server";

import sql from "@/shared/lib/db";
import { MONTH_NAMES } from "@/shared/config/months";

async function getMonthlyAttendance(year: number, type: string) {
  let data: { month: number; percent: number }[];
  try {
    data = await sql<{ month: number; percent: number }[]>`
      SELECT * FROM get_monthly_attendance(${year}, ${type})
    `;
  } catch {
    throw new Error("Ошибка при загрузке посещаемости");
  }

  const percentByMonth = new Map(
    data.map((row) => [row.month, Number(row.percent)]),
  );

  return MONTH_NAMES.map((label, index) => ({
    month: label,
    percent: percentByMonth.get(index + 1) ?? 0,
  }));
}

export async function getGuildPrimeStatsByYear(year: number) {
  return getMonthlyAttendance(year, "Прайм");
}

export async function getGuildAglStatsByYear(year: number) {
  return getMonthlyAttendance(year, "АГЛ");
}
