"use server";

import sql from "@/shared/lib/db";

export type PvpPlayerStats = {
  userId: number;
  userName: string;
  avatarUrl: string | null;
  userClass: string | null;
  kills: number;
  honor: number;
};

export type GuildPvpStats = {
  totalHonor: number;
  totalKills: number;
  players: PvpPlayerStats[];
};

export async function getStatsForPeriod(
  startDate: string,
  endDate: string | null = null,
): Promise<GuildPvpStats> {
  const rangeEnd = endDate ?? "infinity";
  try {
    const [[totals], players] = await Promise.all([
      sql<{ totalKills: number; totalHonor: number }[]>`
        SELECT
          COALESCE(SUM(end_kills - start_kills), 0)::float8 AS "totalKills",
          COALESCE(SUM(end_honor - start_honor), 0)::float8 AS "totalHonor"
        FROM killcount_stats
        WHERE recorded_at >= ${startDate} AND recorded_at < ${rangeEnd}
      `,
      sql<PvpPlayerStats[]>`
        SELECT
          u.id AS "userId",
          u.username AS "userName",
          u.avatar_url AS "avatarUrl",
          u.class AS "userClass",
          SUM(s.end_kills - s.start_kills)::float8 AS kills,
          SUM(s.end_honor - s.start_honor)::float8 AS honor
        FROM killcount_stats s
        JOIN "user" u ON s.user_id = u.id
        WHERE s.recorded_at >= ${startDate} AND s.recorded_at < ${rangeEnd}
        GROUP BY u.id, u.username, u.avatar_url, u.class
        ORDER BY kills DESC, honor DESC, u.id
      `,
    ]);

    return {
      totalKills: totals?.totalKills ?? 0,
      totalHonor: totals?.totalHonor ?? 0,
      players,
    };
  } catch (error) {
    console.error(
      "Ошибка при получении статистики киллкаунта за период:",
      error,
    );
    return { totalHonor: 0, totalKills: 0, players: [] };
  }
}
