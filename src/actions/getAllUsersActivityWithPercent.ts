"use server";

import supabase from "@/shared/lib/supabase";

// Босс-события "Кошка"/"Морф" не учитываются в проценте учёта баллов.
const EXCLUDED_FROM_POINTS_ACCOUNTING_BOSS_IDS = [14, 11];

export async function getAllUsersActivityWithPercent() {
  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();
  const startDate = new Date(
    Date.UTC(currentYear, currentMonth - 1, 1),
  ).toISOString();
  const endDate = new Date(
    Date.UTC(currentMonth === 12 ? currentYear + 1 : currentYear, currentMonth % 12, 1),
  ).toISOString();

  const { data: raids, error: raidsError } = await supabase
    .from("raid")
    .select(
      `id, type, start_date, dkp_summary, raid_boss(boss_id), raid_attendance(user_id, is_late)`,
    )
    .gte("start_date", startDate)
    .lt("start_date", endDate);

  if (raidsError || !raids) {
    console.error("Ошибка при получении рейдов:", raidsError);
    throw new Error("Не удалось получить рейды");
  }

  // Праймы/АГЛ % — доля посещённых рейдов от общего числа рейдов этого типа.
  let totalPrimeRaids = 0;
  let totalAglRaids = 0;

  // Учёт баллов % — доля набранных DKP от общего числа доступных за месяц
  // (без Кошки/Морфа). Опоздание даёт половину очков за рейд.
  let totalPointsAvailable = 0;

  const userScores: Record<
    number,
    { primeRaids: number; aglRaids: number; pointsEarned: number; dkp: number }
  > = {};

  for (const raid of raids) {
    const dkp = raid.dkp_summary ?? 0;
    const bossId = (raid.raid_boss as { boss_id: number }[])?.[0]?.boss_id;
    const excludedFromAccounting =
      EXCLUDED_FROM_POINTS_ACCOUNTING_BOSS_IDS.includes(bossId as number);

    if (raid.type === "Прайм") totalPrimeRaids += 1;
    else if (raid.type === "АГЛ") totalAglRaids += 1;
    if (!excludedFromAccounting) totalPointsAvailable += dkp;

    if (Array.isArray(raid.raid_attendance)) {
      for (const att of raid.raid_attendance as {
        user_id: number;
        is_late: boolean;
      }[]) {
        if (!userScores[att.user_id]) {
          userScores[att.user_id] = {
            primeRaids: 0,
            aglRaids: 0,
            pointsEarned: 0,
            dkp: 0,
          };
        }
        const score = userScores[att.user_id];
        const earnedDkp = att.is_late ? dkp / 2 : dkp;

        if (raid.type === "Прайм") score.primeRaids += 1;
        else if (raid.type === "АГЛ") score.aglRaids += 1;
        score.dkp += earnedDkp;
        if (!excludedFromAccounting) score.pointsEarned += earnedDkp;
      }
    }
  }

  const result: Record<
    number,
    {
      primePercent: number;
      aglPercent: number;
      totalPercent: number;
      dkp: number;
    }
  > = {};

  for (const [userIdStr, score] of Object.entries(userScores)) {
    const userId = Number(userIdStr);

    result[userId] = {
      primePercent: totalPrimeRaids
        ? (score.primeRaids / totalPrimeRaids) * 100
        : 0,
      aglPercent: totalAglRaids ? (score.aglRaids / totalAglRaids) * 100 : 0,
      totalPercent: totalPointsAvailable
        ? (score.pointsEarned / totalPointsAvailable) * 100
        : 0,
      dkp: score.dkp,
    };
  }

  return result;
}
