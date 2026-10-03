"use server";
import sql from "@/shared/lib/db";

export type UserMonthlyRaid = {
  id: number;
  type: string | null;
  startDate: string | null;
  dkpSummary: number;
  isLate: boolean;
  bosses: string[];
};

export async function getUserMonthlyRaids(
  userId: number,
  year: number,
  month: number,
): Promise<UserMonthlyRaid[]> {
  const startDate = new Date(Date.UTC(year, month - 1, 1)).toISOString();
  const endDate = new Date(Date.UTC(year, month, 1)).toISOString();

  try {
    return await sql<UserMonthlyRaid[]>`
      SELECT
        r.id,
        r.type,
        r.start_date AS "startDate",
        COALESCE(r.dkp_summary, 0) AS "dkpSummary",
        ra.is_late AS "isLate",
        COALESCE(
          (
            SELECT array_agg(b.boss_name ORDER BY b.id)
            FROM raid_boss rb
            JOIN boss b ON b.id = rb.boss_id
            WHERE rb.raid_id = r.id
          ),
          '{}'
        ) AS bosses
      FROM raid r
      JOIN raid_attendance ra ON ra.raid_id = r.id AND ra.user_id = ${userId}
      WHERE r.start_date >= ${startDate} AND r.start_date < ${endDate}
      ORDER BY r.start_date DESC
    `;
  } catch (error) {
    console.error("Ошибка при получении рейдов пользователя:", error);
    throw new Error("Не удалось загрузить рейды пользователя");
  }
}
