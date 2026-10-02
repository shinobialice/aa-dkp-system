"use server";

import sql from "@/shared/lib/db";
import { getSessionUserId } from "./getSessionUserId";

export type RangeRaid = {
  id: number;
  start: string;
  type: string;
  bosses: string[];
  people: number;
  attended: boolean;
};

export async function getRaidsInRange(
  from: string,
  to: string,
): Promise<RangeRaid[]> {
  const userId = (await getSessionUserId()) ?? -1;
  let rows;
  try {
    rows = await sql<any[]>`
      SELECT
        r.id,
        to_char(r.start_date, 'YYYY-MM-DD"T"HH24:MI') AS start,
        r.type,
        COALESCE(
          (
            SELECT array_agg(b.boss_name ORDER BY b.id)
            FROM raid_boss rb
            JOIN boss b ON b.id = rb.boss_id
            WHERE rb.raid_id = r.id
          ),
          '{}'
        ) AS bosses,
        (
          SELECT count(*)::int FROM raid_attendance ra WHERE ra.raid_id = r.id
        ) AS people,
        EXISTS (
          SELECT 1 FROM raid_attendance ra
          WHERE ra.raid_id = r.id AND ra.user_id = ${userId}
        ) AS attended
      FROM raid r
      WHERE r.start_date >= ${from}::date AND r.start_date < ${to}::date
      ORDER BY r.start_date
    `;
  } catch (error) {
    console.error("Ошибка при получении рейдов за период:", error);
    throw new Error("Не удалось загрузить рейды");
  }

  return rows.map((row) => ({
    id: row.id,
    start: row.start,
    type: row.type,
    bosses: row.bosses,
    people: row.people,
    attended: row.attended,
  }));
}
