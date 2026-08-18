"use server";
import sql from "@/shared/lib/db";

export async function getUserMonthlyAttendance(
  userId: number,
  year: number,
  month: number,
) {
  const monthStart = new Date(Date.UTC(year, month - 1, 1));
  const endDate = new Date(
    Date.UTC(month === 12 ? year + 1 : year, month % 12, 1),
  ).toISOString();

  let userRow;
  try {
    [userRow] = await sql<any[]>`
      SELECT joined_at FROM "user" WHERE id = ${userId}
    `;
  } catch (userError) {
    console.error("Ошибка при получении пользователя:", userError);
    throw new Error("Не удалось загрузить пользователя");
  }

  // Если вступил в гильдию в течение расчётного месяца — считаем только с
  // даты вступления, а не с начала месяца.
  const joinedAt = userRow?.joined_at ? new Date(userRow.joined_at) : null;
  const effectiveStart =
    joinedAt && joinedAt > monthStart ? joinedAt : monthStart;
  const startDate = effectiveStart.toISOString();

  let rows;
  try {
    rows = await sql<any[]>`
      SELECT r.id, r.type, r.dkp_summary, ra.user_id, ra.is_late
      FROM raid r
      LEFT JOIN raid_attendance ra ON ra.raid_id = r.id
      WHERE r.start_date >= ${startDate} AND r.start_date < ${endDate}
    `;
  } catch (error) {
    console.error("Ошибка при получении рейдов:", error);
    throw new Error("Не удалось загрузить рейды");
  }

  // Группируем плоский результат join'а обратно по рейду.
  const raidMap = new Map<
    number,
    { type: string; dkp_summary: number; attendance: { user_id: number; is_late: boolean }[] }
  >();
  for (const row of rows) {
    let raid = raidMap.get(row.id);
    if (!raid) {
      raid = { type: row.type, dkp_summary: row.dkp_summary, attendance: [] };
      raidMap.set(row.id, raid);
    }
    if (row.user_id !== null) raid.attendance.push({ user_id: row.user_id, is_late: row.is_late });
  }

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

  for (const raid of raidMap.values()) {
    const dkp = raid.dkp_summary ?? 0;
    const attendance = raid.attendance.find((a) => a.user_id === userId);
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
    totalPointsAvailable,
  };
}
