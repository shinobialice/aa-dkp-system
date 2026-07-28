"use server";
import supabase from "@/shared/lib/supabase";
import type { Database } from "@/types/supabase";

type RaidRow = Database["public"]["Tables"]["raid"]["Row"];

// Босс-события "Кошка"/"Морф" не учитываются в проценте учёта баллов.
const EXCLUDED_FROM_POINTS_ACCOUNTING_BOSS_IDS = [14, 11];

type RaidWithRelations = RaidRow & {
  raid_boss: Array<{ boss_id: number }>;
  raid_attendance: Array<{
    user_id: number;
    is_late: boolean;
  }>;
};

export async function getUserMonthlyAttendance(
  userId: number,
  year: number,
  month: number,
) {
  const startDate = new Date(Date.UTC(year, month - 1, 1)).toISOString();
  const endDate = new Date(
    Date.UTC(month === 12 ? year + 1 : year, month % 12, 1),
  ).toISOString();

  const { data, error } = await supabase
    .from("raid")
    .select(
      `
      id,
      type,
      start_date,
      dkp_summary,
      raid_boss(boss_id),
      raid_attendance(user_id, is_late)
    `,
    )
    .gte("start_date", startDate)
    .lt("start_date", endDate);

  if (error || !data) {
    console.error("Ошибка при получении рейдов:", error);
    throw new Error("Не удалось загрузить рейды");
  }

  const raids = data as unknown as RaidWithRelations[];

  // Праймы/АГЛ % — доля посещённых рейдов от общего числа рейдов этого типа
  // (опоздание всё ещё считается посещением).
  let totalPrimeRaids = 0;
  let userPrimeRaids = 0;
  let totalAglRaids = 0;
  let userAglRaids = 0;

  // Учёт баллов % — доля набранных DKP от общего числа доступных за месяц
  // (без Кошки/Морфа). Опоздание даёт половину очков за рейд.
  let totalPointsAvailable = 0;
  let userPointsEarned = 0;

  let userDkp = 0;

  for (const raid of raids) {
    const dkp = raid.dkp_summary ?? 0;
    const attendance = raid.raid_attendance.find((a) => a.user_id === userId);
    const attended = !!attendance;
    const earnedDkp = attendance ? (attendance.is_late ? dkp / 2 : dkp) : 0;
    const bossId = raid.raid_boss[0]?.boss_id;
    const excludedFromAccounting =
      EXCLUDED_FROM_POINTS_ACCOUNTING_BOSS_IDS.includes(bossId as number);

    if (raid.type === "Прайм") {
      totalPrimeRaids += 1;
      if (attended) userPrimeRaids += 1;
    } else if (raid.type === "АГЛ") {
      totalAglRaids += 1;
      if (attended) userAglRaids += 1;
    }

    userDkp += earnedDkp;

    if (!excludedFromAccounting) {
      totalPointsAvailable += dkp;
      userPointsEarned += earnedDkp;
    }
  }

  return {
    aglPercent: totalAglRaids ? (userAglRaids / totalAglRaids) * 100 : 0,
    primePercent: totalPrimeRaids
      ? (userPrimeRaids / totalPrimeRaids) * 100
      : 0,
    totalPercent: totalPointsAvailable
      ? (userPointsEarned / totalPointsAvailable) * 100
      : 0,
    dkp: userDkp,
  };
}
