"use server";
import supabase from "@/lib/supabase";
import type { Database } from "@/types/supabase";

type RaidRow = Database["public"]["Tables"]["raid"]["Row"];

// What Supabase actually returns for the joins
type RaidWithRelations = RaidRow & {
  raid_bosses: Array<{
    boss: Database["public"]["Tables"]["boss"]["Row"][]; // always an array
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
      raid_bosses(boss(dkp_points)),
      raid_attendance(user_id)
    `
    )
    .gte("start_date", startDate)
    .lt("start_date", endDate);

  if (error || !data) {
    console.error("Ошибка при получении рейдов:", error);
    throw new Error("Не удалось загрузить рейды");
  }

  // 3. Cast to our explicit type
  const raids = data as RaidWithRelations[];

  let totalAgl = 0;
  let totalPrime = 0;
  let userAgl = 0;
  let userPrime = 0;

  for (const raid of raids) {
    // Now TS knows raid.raid_bosses is Array<{ boss: Row[] }>
    const dkp = raid.raid_bosses.reduce((sum, rb) => {
      const bossArray = rb.boss;
      const points = bossArray[0]?.dkp_points ?? 0;
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
