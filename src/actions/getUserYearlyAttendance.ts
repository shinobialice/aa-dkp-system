"use server";
import sql from "@/shared/lib/db";
import type { RaidRow, UserRow } from "@/shared/lib/dbTypes";
import { summarizeAttendance, type AttendedRaid } from "@/server/attendance";

type YearRaidRow = AttendedRaid & Pick<RaidRow, "start_date">;

export type UserMonthAttendance = {
  month: number;
  prime: number | null;
  agl: number | null;
};

export async function getUserYearlyAttendance(
  userId: number,
  year: number,
): Promise<UserMonthAttendance[]> {
  const yearStart = new Date(Date.UTC(year, 0, 1));
  const endDate = new Date(Date.UTC(year + 1, 0, 1)).toISOString();

  let userRow: Pick<UserRow, "joined_at"> | undefined;
  let raids: YearRaidRow[];
  try {
    [userRow] = await sql<Pick<UserRow, "joined_at">[]>`
      SELECT joined_at FROM "user" WHERE id = ${userId}
    `;
    const joinedAt = userRow?.joined_at ? new Date(userRow.joined_at) : null;
    const effectiveStart =
      joinedAt && joinedAt > yearStart ? joinedAt : yearStart;
    raids = await sql<YearRaidRow[]>`
      SELECT r.type, r.start_date, r.dkp_summary, ra.is_late
      FROM raid r
      LEFT JOIN raid_attendance ra ON ra.raid_id = r.id AND ra.user_id = ${userId}
      WHERE r.start_date >= ${effectiveStart.toISOString()} AND r.start_date < ${endDate}
    `;
  } catch (error) {
    console.error("Ошибка при получении посещаемости за год:", error);
    throw new Error("Не удалось загрузить посещаемость за год");
  }

  const raidsByMonth = Array.from({ length: 12 }, () => [] as YearRaidRow[]);
  for (const raid of raids) {
    if (!raid.start_date) continue;
    const month = Number(raid.start_date.slice(5, 7)) - 1;
    raidsByMonth[month].push(raid);
  }

  return raidsByMonth.map((monthRaids, month) => {
    const summary = summarizeAttendance(monthRaids);
    const hasPrime = monthRaids.some((raid) => raid.type === "Прайм");
    const hasAgl = monthRaids.some((raid) => raid.type === "АГЛ");
    return {
      month,
      prime: hasPrime ? summary.primePercent : null,
      agl: hasAgl ? summary.aglPercent : null,
    };
  });
}
