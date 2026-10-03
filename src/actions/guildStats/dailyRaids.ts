"use server";

import sql from "@/shared/lib/db";

export type DailyRaidStat = {
  id: number;
  start_date: string;
  type: string;
  bosses: string[];
  attendeeCount: number;
  activeUserCount: number | null;
};

export async function getRaidsByDay(date: string): Promise<DailyRaidStat[]> {
  try {
    return await sql<DailyRaidStat[]>`
      SELECT
        r.id,
        r.start_date,
        r.type,
        r.active_user_count AS "activeUserCount",
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
        ) AS "attendeeCount"
      FROM raid r
      WHERE r.start_date >= ${date}::date AND r.start_date < ${date}::date + 1
      ORDER BY r.start_date ASC
    `;
  } catch (error) {
    console.error("Ошибка при получении рейдов за день:", error);
    throw new Error("Не удалось загрузить рейды за день");
  }
}
