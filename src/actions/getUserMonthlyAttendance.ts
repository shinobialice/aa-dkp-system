"use server";
import sql from "@/shared/lib/db";
import type { UserRow } from "@/shared/lib/dbTypes";
import { summarizeAttendance, type AttendedRaid } from "@/server/attendance";

export async function getUserMonthlyAttendance(
  userId: number,
  year: number,
  month: number,
) {
  const monthStart = new Date(Date.UTC(year, month - 1, 1));
  const endDate = new Date(Date.UTC(year, month, 1)).toISOString();

  let userRow: Pick<UserRow, "joined_at"> | undefined;
  try {
    [userRow] = await sql<Pick<UserRow, "joined_at">[]>`
      SELECT joined_at FROM "user" WHERE id = ${userId}
    `;
  } catch (userError) {
    console.error("Ошибка при получении пользователя:", userError);
    throw new Error("Не удалось загрузить пользователя");
  }

  const joinedAt = userRow?.joined_at ? new Date(userRow.joined_at) : null;
  const effectiveStart =
    joinedAt && joinedAt > monthStart ? joinedAt : monthStart;

  let raids: AttendedRaid[];
  try {
    raids = await sql<AttendedRaid[]>`
      SELECT r.type, r.dkp_summary, ra.is_late
      FROM raid r
      LEFT JOIN raid_attendance ra ON ra.raid_id = r.id AND ra.user_id = ${userId}
      WHERE r.start_date >= ${effectiveStart.toISOString()} AND r.start_date < ${endDate}
    `;
  } catch (error) {
    console.error("Ошибка при получении рейдов:", error);
    throw new Error("Не удалось загрузить рейды");
  }

  return summarizeAttendance(raids);
}
