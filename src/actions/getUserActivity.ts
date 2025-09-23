"use server";

import supabase from "@/shared/lib/supabase";

export async function getUserActivity(userId: number) {
  const { data: attendances, error } = await supabase
    .from("raid_attendance")
    .select("raid(start_date, type)")
    .eq("user_id", userId);

  if (error || !attendances) {
    console.error("Ошибка при получении активности пользователя:", error);
    throw new Error("Не удалось получить активность пользователя");
  }

  const grouped: Record<string, { праймы: number; агл: number }> = {};

  attendances.forEach(({ raid }) => {
    // raid is an array, so grab the first element
    const r = Array.isArray(raid) ? raid[0] : raid;
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
