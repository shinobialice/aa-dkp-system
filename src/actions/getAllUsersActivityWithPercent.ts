"use server";

import supabase from "@/shared/lib/supabaseAdmin";

export type MonthlyAttendance = {
  primePercent: number;
  aglPercent: number;
  totalPercent: number;
  dkp: number;
};

// Считает посещаемость/учёт баллов за месяц сразу для всех переданных
// пользователей одним запросом рейдов, вместо того чтобы дергать этот же
// запрос отдельно на каждого игрока (см. getSalaryReasons/computeUserSalaryWeight,
// где раньше был N+1 к per-user getUserMonthlyAttendance).
export async function computeMonthlyAttendanceForUsers(
  users: { id: number; joined_at: string | null }[],
  month: number,
  year: number,
): Promise<Record<number, MonthlyAttendance>> {
  const monthStart = new Date(Date.UTC(year, month - 1, 1));
  const startDate = monthStart.toISOString();
  const endDate = new Date(
    Date.UTC(month === 12 ? year + 1 : year, month % 12, 1),
  ).toISOString();

  const { data: raids, error: raidsError } = await supabase
    .from("raid")
    .select(`id, type, start_date, dkp_summary, raid_attendance(user_id, is_late)`)
    .gte("start_date", startDate)
    .lt("start_date", endDate);

  if (raidsError || !raids) {
    console.error("Ошибка при получении рейдов:", raidsError);
    throw new Error("Не удалось получить рейды");
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

  for (const user of users) {
    // Если вступил в течение месяца — считаем только с даты вступления.
    const joinedAt = user.joined_at ? new Date(user.joined_at) : null;
    const effectiveStart =
      joinedAt && joinedAt > monthStart ? joinedAt : monthStart;

    let totalPrimeRaids = 0;
    let userPrimeRaids = 0;
    let totalAglRaids = 0;
    let userAglRaids = 0;
    let totalPointsAvailable = 0;
    let userPointsEarned = 0;
    let userDkp = 0;

    for (const raid of raids) {
      if (new Date(raid.start_date as string) < effectiveStart) continue;

      const dkp = raid.dkp_summary ?? 0;
      const attendance = (
        raid.raid_attendance as { user_id: number; is_late: boolean }[]
      ).find((a) => a.user_id === user.id);
      const attendanceWeight = attendance
        ? attendance.is_late
          ? 0.5
          : 1
        : 0;
      const earnedDkp = attendance
        ? attendance.is_late
          ? dkp / 2
          : dkp
        : 0;

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

    result[user.id] = {
      primePercent: totalPrimeRaids
        ? (userPrimeRaids / totalPrimeRaids) * 100
        : 0,
      aglPercent: totalAglRaids ? (userAglRaids / totalAglRaids) * 100 : 0,
      totalPercent: totalPointsAvailable
        ? (userPointsEarned / totalPointsAvailable) * 100
        : 0,
      dkp: userDkp,
    };
  }

  return result;
}
