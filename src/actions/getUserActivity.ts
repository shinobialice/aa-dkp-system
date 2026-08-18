"use server";

import sql from "@/shared/lib/db";

export async function getUserActivity(userId: number) {
  let rows;
  try {
    rows = await sql<any[]>`
      SELECT r.start_date, r.type
      FROM raid_attendance ra
      JOIN raid r ON r.id = ra.raid_id
      WHERE ra.user_id = ${userId}
    `;
  } catch (error) {
    console.error("Ошибка при получении активности пользователя:", error);
    throw new Error("Не удалось получить активность пользователя");
  }

  const grouped: Record<string, { праймы: number; агл: number }> = {};

  rows.forEach((r) => {
    if (!r?.start_date) return;

    const date = r.start_date.split("T")[0];
    const type = r.type === "Прайм" ? "праймы" : "агл";

    if (!grouped[date]) {
      grouped[date] = { праймы: 0, агл: 0 };
    }
    grouped[date][type]++;
  });

  return Object.entries(grouped)
    .map(([date, data]) => ({ date, ...data }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}
