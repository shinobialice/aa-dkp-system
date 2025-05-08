"use server";

import supabase from "@/lib/supabase";

export async function getUserMonthlyAttendance(
  userId: number,
  year: number,
  month: number
) {
  const startDate = new Date(year, month - 1, 1).toISOString();
  const endDate = new Date(year, month, 1).toISOString();

  // Fetch raids with bosses and attendance
  const { data: raids, error } = await supabase
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

  if (error || !raids) {
    console.error("Ошибка при получении рейдов:", error);
    throw new Error("Не удалось загрузить рейды");
  }

  let totalAgl = 0;
  let totalPrime = 0;
  let userAgl = 0;
  let userPrime = 0;

  for (const raid of raids) {
    const dkp = (raid.raid_bosses ?? []).reduce(
      (sum, rb) => sum + (rb.boss?.dkp_points || 0),
      0
    );
    const attended = (raid.raid_attendance ?? []).some(
      (a) => a.user_id === userId
    );

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
