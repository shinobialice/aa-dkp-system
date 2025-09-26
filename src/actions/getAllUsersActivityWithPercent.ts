"use server";

import supabase from "@/shared/lib/supabase";

export async function getAllUsersActivityWithPercent() {
  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();
  const startDate = new Date(currentYear, currentMonth - 1, 1).toISOString();
  const endDate = new Date(currentYear, currentMonth, 1).toISOString();

  const { data: raids, error: raidsError } = await supabase
    .from("raid")
    .select(`id, type, start_date, raid_boss(boss(dkp_points)), raid_attendance(user_id)`)
    .gte("start_date", startDate)
    .lt("start_date", endDate);

  if (raidsError || !raids) {
    console.error("Ошибка при получении рейдов:", raidsError);
    throw new Error("Не удалось получить рейды");
  }

  let totalAgl = 0;
  let totalPrime = 0;
  const userScores: Record<number, { agl: number; prime: number }> = {};

  for (const raid of raids) {
    const dkp = Array.isArray(raid.raid_boss)
      ? raid.raid_boss.reduce((sum, rb) => {
          if (Array.isArray(rb.boss)) {
            return sum + rb.boss.reduce((bSum, bossObj) => bSum + (bossObj.dkp_points ?? 0), 0);
          } else {
            const bossObj = rb.boss as { dkp_points?: number };
            return sum + (bossObj.dkp_points ?? 0);
          }
        }, 0)
      : 0;

    if (raid.type === "Прайм") totalPrime += dkp;
    else if (raid.type === "АГЛ") totalAgl += dkp;

    if (Array.isArray(raid.raid_attendance)) {
      for (const att of raid.raid_attendance) {
        if (!userScores[att.user_id]) {
          userScores[att.user_id] = { agl: 0, prime: 0 };
        }
        if (raid.type === "Прайм") userScores[att.user_id].prime += dkp;
        else if (raid.type === "АГЛ") userScores[att.user_id].agl += dkp;
      }
    }
  }

  const totalDKP = totalAgl + totalPrime;

  const result: Record<
    number,
    {
      primePercent: number;
      aglPercent: number;
      totalPercent: number;
      dkp: number;
    }
  > = {};

  for (const [userIdStr, scores] of Object.entries(userScores)) {
    const userId = Number(userIdStr);
    const userDKP = scores.agl + scores.prime;
    const aglPercent = totalAgl ? (scores.agl / totalAgl) * 100 : 0;
    const primePercent = totalPrime ? (scores.prime / totalPrime) * 100 : 0;
    const totalPercent = totalDKP ? (userDKP / totalDKP) * 100 : 0;

    result[userId] = {
      aglPercent,
      primePercent,
      totalPercent,
      dkp: userDKP,
    };
  }

  return result;
}
