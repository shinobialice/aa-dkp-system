"use server";

import supabase from "@/shared/lib/supabaseAdmin";

async function getDailyAttendance(year: number, month: number, type: string) {
  const { data, error } = await supabase.rpc("get_daily_attendance", {
    p_year: year,
    p_month: month,
    p_type: type,
  });

  if (error) throw new Error("Ошибка при загрузке посещаемости");

  const daily: { date: string; value: number }[] = (data ?? []).map(
    (row: { date: string; percent: number }) => ({
      date: row.date,
      value: Number(row.percent),
    }),
  );

  const percent =
    daily.reduce((acc, d) => acc + d.value, 0) / (daily.length || 1);

  return { percent, daily };
}

export async function getGuildAttendancePrime({
  year,
  month,
}: {
  year: number;
  month: number;
}) {
  return getDailyAttendance(year, month, "Прайм");
}

export async function getGuildAttendanceAgl({
  year,
  month,
}: {
  year: number;
  month: number;
}) {
  return getDailyAttendance(year, month, "АГЛ");
}
