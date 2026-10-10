"use server";
import sql from "@/shared/lib/db";
import { getKillCountWars } from "@/widgets/killcount/api/history";
import { ALL_DAYS } from "@/widgets/killcount/ui/killcountModel";

export type UserKillcountRecord = {
  playerClass: string | null;
  comment: string | null;
  kills: number;
  honor: number;
  place: number;
};

export type UserKillcountDay = {
  date: string;
  warId: string | null;
  players: number;
  guildAvgKills: number;
  mine: UserKillcountRecord | null;
};

export type UserKillcountPlace = {
  warId: string;
  place: number;
  players: number;
};

export type UserKillcountHistory = Awaited<
  ReturnType<typeof getUserKillcountHistory>
>;

export async function getUserKillcountHistory(userId: number) {
  const warPeriods = sql`
    SELECT 'current' AS id, started_at, NULL::timestamp AS ended_at
    FROM guild_status_settings
    WHERE id = 1 AND mode = 'pvp' AND started_at IS NOT NULL
    UNION ALL
    SELECT id::text, started_at, ended_at
    FROM guild_period_history
    WHERE mode = 'pvp'
  `;
  const records = sql`
    SELECT
      s.user_id,
      s.recorded_at,
      s.class,
      NULLIF(s.comment, '') AS comment,
      w.id AS war_id,
      DATE_TRUNC('day', s.recorded_at) AS day,
      COALESCE(s.end_kills - s.start_kills, 0) AS kills,
      COALESCE(s.end_honor - s.start_honor, 0) AS honor
    FROM killcount_stats s
    LEFT JOIN (${warPeriods}) w
      ON s.recorded_at >= w.started_at
      AND (w.ended_at IS NULL OR s.recorded_at < w.ended_at)
  `;

  try {
    const [wars, days, places] = await Promise.all([
      getKillCountWars(),
      sql<UserKillcountDay[]>`
        WITH records AS (${records}),
        guild_days AS (
          SELECT
            day,
            (ARRAY_AGG(war_id ORDER BY recorded_at DESC))[1] AS war_id,
            COUNT(*)::int AS players,
            ROUND(AVG(kills))::int AS guild_avg_kills
          FROM records
          GROUP BY day
        ),
        ranked AS (
          SELECT
            records.*,
            ROW_NUMBER() OVER (
              PARTITION BY day ORDER BY kills DESC, honor DESC
            )::int AS place
          FROM records
        )
        SELECT
          to_char(g.day, 'YYYY-MM-DD') AS date,
          g.war_id AS "warId",
          g.players,
          g.guild_avg_kills AS "guildAvgKills",
          CASE WHEN r.user_id IS NULL THEN NULL ELSE json_build_object(
            'playerClass', r.class,
            'comment', r.comment,
            'kills', r.kills,
            'honor', r.honor,
            'place', r.place
          ) END AS mine
        FROM guild_days g
        LEFT JOIN ranked r ON r.day = g.day AND r.user_id = ${userId}
        ORDER BY g.day DESC, r.place
      `,
      sql<UserKillcountPlace[]>`
        WITH records AS (${records})
        SELECT "warId", place, players
        FROM (
          SELECT
            war_id AS "warId",
            user_id,
            ROW_NUMBER() OVER (
              PARTITION BY war_id
              ORDER BY SUM(kills) DESC, SUM(honor) DESC, user_id
            )::int AS place,
            COUNT(*) OVER (PARTITION BY war_id)::int AS players
          FROM records
          WHERE war_id IS NOT NULL
          GROUP BY war_id, user_id
          UNION ALL
          SELECT
            ${ALL_DAYS}::text,
            user_id,
            ROW_NUMBER() OVER (
              ORDER BY SUM(kills) DESC, SUM(honor) DESC, user_id
            )::int,
            COUNT(*) OVER ()::int
          FROM records
          GROUP BY user_id
        ) ranked
        WHERE user_id = ${userId}
      `,
    ]);

    return { wars, days, places };
  } catch (error) {
    throw new Error("Не удалось получить киллкаунт игрока", { cause: error });
  }
}
