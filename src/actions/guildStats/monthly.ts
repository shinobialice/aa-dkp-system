"use server";

import supabase from "@/shared/lib/supabaseAdmin";

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
  const { data, error } = await supabase.rpc("get_monthly_attendance", {
    p_year: year,
    p_type: type,
  });

  if (error) throw new Error("Ошибка при загрузке посещаемости");

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
