"use server";
import supabase from "@/lib/supabase";
import type { Database } from "@/types/supabase";

type RaidRow = Database["public"]["Tables"]["raid"]["Row"];

type RaidWithRelations = RaidRow & {
  raid_boss: Array<{
    boss: Database["public"]["Tables"]["boss"]["Row"]; // boss — это объект
  }>;
  raid_attendance: Array<{
    user_id: number;
  }>;
};

export async function getUserMonthlyAttendance(
  userId: number,
  year: number,
  month: number
) {
  const startDate = new Date(year, month - 1, 1).toISOString();
  const endDate = new Date(year, month, 1).toISOString();

  const { data, error } = await supabase
    .from("raid")
    .select(
      `
      id,
      type,
      start_date,
      raid_boss(boss(dkp_points)),
      raid_attendance(user_id)
    `
    )
    .gte("start_date", startDate)
    .lt("start_date", endDate);

  if (error || !data) {
    console.error("Ошибка при получении рейдов:", error);
    throw new Error("Не удалось загрузить рейды");
  }

  const raids = data as unknown as RaidWithRelations[];

  let totalAgl = 0;
  let totalPrime = 0;
  let userAgl = 0;
  let userPrime = 0;

  for (const raid of raids) {
    const dkp = raid.raid_boss.reduce((sum, rb) => {
      const points = rb.boss?.dkp_points ?? 0;
      return sum + points;
    }, 0);

    const attended = raid.raid_attendance.some((a) => a.user_id === userId);

    if (raid.type === "Прайм") {
      totalPrime += dkp;
      if (attended) userPrime += dkp;
    } else if (raid.type === "АГЛ") {
      totalAgl += dkp;
      if (attended) userAgl += dkp;
    }
  }

  const totalDKP = totalAgl + totalPrime;
  const userDKP = userAgl + userPrime;

  return {
    aglPercent: totalAgl ? (userAgl / totalAgl) * 100 : 0,
    primePercent: totalPrime ? (userPrime / totalPrime) * 100 : 0,
    totalPercent: totalDKP ? (userDKP / totalDKP) * 100 : 0,
    dkp: userDKP,
  };
}
