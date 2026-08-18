"use server";

import sql from "@/shared/lib/db";

const MONTHS = [
  "Январь",
  "Февраль",
  "Март",
  "Апрель",
  "Май",
  "Июнь",
  "Июль",
  "Август",
  "Сентябрь",
  "Октябрь",
  "Ноябрь",
  "Декабрь",
];

async function getMonthlyAttendance(year: number, type: string) {
  let data;
  try {
    data = await sql<any[]>`
      SELECT * FROM get_monthly_attendance(${year}, ${type})
    `;
  } catch {
    throw new Error("Ошибка при загрузке посещаемости");
  }

  const percentByMonth = new Map<number, number>(
    (data ?? []).map((row: { month: number; percent: number }) => [
      row.month,
      Number(row.percent),
    ]),
  );

  return MONTHS.map((label, i) => ({
    month: label,
    percent: percentByMonth.get(i + 1) ?? 0,
  }));
}

export async function getGuildPrimeStatsByYear(year: number) {
  return getMonthlyAttendance(year, "Прайм");
}

export async function getGuildAglStatsByYear(year: number) {
  return getMonthlyAttendance(year, "АГЛ");
}
