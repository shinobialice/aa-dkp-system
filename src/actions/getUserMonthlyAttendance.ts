"use server";
import supabase from "@/shared/lib/supabaseAdmin";
import type { Database } from "@/types/supabase";

type RaidRow = Database["public"]["Tables"]["raid"]["Row"];

type RaidWithRelations = RaidRow & {
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
  const monthStart = new Date(Date.UTC(year, month - 1, 1));
  const endDate = new Date(
    Date.UTC(month === 12 ? year + 1 : year, month % 12, 1),
  ).toISOString();

  const { data: userRow, error: userError } = await supabase
    .from("user")
    .select("joined_at")
    .eq("id", userId)
    .maybeSingle();

  if (userError) {
    console.error("Ошибка при получении пользователя:", userError);
    throw new Error("Не удалось загрузить пользователя");
  }

  // Если вступил в гильдию в течение расчётного месяца — считаем только с
  // даты вступления, а не с начала месяца.
  const joinedAt = userRow?.joined_at ? new Date(userRow.joined_at) : null;
  const effectiveStart =
    joinedAt && joinedAt > monthStart ? joinedAt : monthStart;
  const startDate = effectiveStart.toISOString();

  const { data, error } = await supabase
    .from("raid")
    .select(
      `
      id,
      type,
      start_date,
      dkp_summary,
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
  // (с даты вступления, если она позже начала месяца).
  // Опоздание (is_late) считается за половину посещения, не за полное.
  let totalPrimeRaids = 0;
  let userPrimeRaids = 0;
  let totalAglRaids = 0;
  let userAglRaids = 0;

  // Учёт баллов % — доля набранных DKP от общего числа доступных за месяц.
  // Опоздание даёт половину очков за рейд.
  let totalPointsAvailable = 0;
  let userPointsEarned = 0;

  let userDkp = 0;

  for (const raid of raids) {
    const dkp = raid.dkp_summary ?? 0;
    const attendance = raid.raid_attendance.find((a) => a.user_id === userId);
    const earnedDkp = attendance ? (attendance.is_late ? dkp / 2 : dkp) : 0;

    const attendanceWeight = attendance ? (attendance.is_late ? 0.5 : 1) : 0;

    if (raid.type === "Прайм") {
      totalPrimeRaids += 1;
      userPrimeRaids += attendanceWeight;
    } else if (raid.type === "АГЛ") {
      totalAglRaids += 1;
      userAglRaids += attendanceWeight;
    }

    userDkp += earnedDkp;
    totalPointsAvailable += dkp;
    userPointsEarned += earnedDkp;
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
