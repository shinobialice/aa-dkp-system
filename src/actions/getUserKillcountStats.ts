"use server";
import sql from "@/shared/lib/db";

export type KillcountStats = {
  kills: number;
  avgKills: number;
  avgHonor: number;
  place: number;
  isCurrentWar: boolean;
};

export async function getUserKillcountStats(
  userId: number,
): Promise<KillcountStats | null> {
  try {
    const [row] = await sql<any[]>`
      WITH season AS (
        SELECT * FROM (
          SELECT started_at, NULL::timestamp AS ended_at, true AS is_current
          FROM guild_status_settings
          WHERE id = 1 AND mode = 'pvp' AND started_at IS NOT NULL
          UNION ALL
          (
            SELECT started_at, ended_at, false AS is_current
            FROM guild_period_history
            WHERE mode = 'pvp'
            ORDER BY ended_at DESC
            LIMIT 1
          )
        ) periods
        ORDER BY is_current DESC
        LIMIT 1
      ),
      totals AS (
        SELECT
          s.user_id,
          SUM(s.end_kills - s.start_kills)::int AS kills,
          SUM(s.end_honor - s.start_honor)::int AS honor,
          ROUND(AVG(s.end_kills - s.start_kills))::int AS "avgKills",
          ROUND(AVG(s.end_honor - s.start_honor))::int AS "avgHonor"
        FROM killcount_stats s
        CROSS JOIN season
        WHERE s.recorded_at >= season.started_at
          AND (season.ended_at IS NULL OR s.recorded_at < season.ended_at)
        GROUP BY s.user_id
      ),
      ranked AS (
        SELECT
          totals.*,
          ROW_NUMBER() OVER (ORDER BY kills DESC, honor DESC, user_id)::int AS place
        FROM totals
      )
      SELECT ranked.*, season.is_current AS "isCurrentWar"
      FROM ranked
      CROSS JOIN season
      WHERE ranked.user_id = ${userId}
    `;

    if (!row) return null;

    return {
      kills: row.kills,
      avgKills: row.avgKills,
      avgHonor: row.avgHonor,
      place: row.place,
      isCurrentWar: row.isCurrentWar,
    };
  } catch (error) {
    console.error("Ошибка при получении киллкаунта игрока:", error);
    return null;
  }
}
