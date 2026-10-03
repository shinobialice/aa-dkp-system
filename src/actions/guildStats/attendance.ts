"use server";

import sql from "@/shared/lib/db";

async function getDailyAttendance(year: number, month: number, type: string) {
  let data: { date: string; percent: number }[];
  try {
    data = await sql<{ date: string; percent: number }[]>`
      SELECT * FROM get_daily_attendance(${year}, ${month}, ${type})
    `;
  } catch {
    throw new Error("Ошибка при загрузке посещаемости");
  }

  const daily = data.map((row) => ({
    date: row.date,
    value: Number(row.percent),
  }));

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
