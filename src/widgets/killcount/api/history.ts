"use server";

import sql from "@/shared/lib/db";
import {
  DB_GetKillCountDto,
  DB_UpdateKillCountDto,
} from "@/widgets/killcount/types";
import {
  KillCountHistoryData,
  KillCountWar,
} from "@/widgets/killcount/ui/history-table/history-table";

export const getKillCountWars = async () => {
  try {
    return await sql<KillCountWar[]>`
      SELECT
        'current' AS id,
        opponent_guild AS "opponentGuild",
        started_at AS "startedAt",
        NULL::timestamp AS "endedAt"
      FROM guild_status_settings
      WHERE id = 1 AND mode = 'pvp' AND started_at IS NOT NULL
      UNION ALL
      SELECT
        id::text,
        opponent_guild,
        started_at,
        ended_at
      FROM guild_period_history
      WHERE mode = 'pvp'
      ORDER BY "startedAt" DESC
    `;
  } catch (error) {
    throw new Error("Не удалось получить список варов для killcount", {
      cause: error,
    });
  }
};

export const getKillCountHistory = async () => {
  try {
    const currentData = await sql<KillCountHistoryData[]>`
      WITH wars AS (
        SELECT 'current' AS id, started_at, NULL::timestamp AS ended_at
        FROM guild_status_settings
        WHERE id = 1 AND mode = 'pvp' AND started_at IS NOT NULL
        UNION ALL
        SELECT id::text, started_at, ended_at
        FROM guild_period_history
        WHERE mode = 'pvp'
      ),
      days AS (
        SELECT
          DATE_TRUNC('day', s.recorded_at) AS date,
          SUM(s.end_kills - s.start_kills) AS "totalKills",
          COUNT(DISTINCT s.user_id)::int AS "playersCount",
          (ARRAY_AGG(w.id ORDER BY s.recorded_at DESC))[1] AS "warId"
        FROM killcount_stats s
        LEFT JOIN wars w
          ON s.recorded_at >= w.started_at
          AND (w.ended_at IS NULL OR s.recorded_at < w.ended_at)
        GROUP BY DATE_TRUNC('day', s.recorded_at)
      )
      SELECT
        days.*,
        top.user_id AS "topUserId",
        top.username AS "topUserName",
        top.kills AS "topKills"
      FROM days
      LEFT JOIN LATERAL (
        SELECT
          s.user_id,
          u.username,
          (s.end_kills - s.start_kills) AS kills
        FROM killcount_stats s
        JOIN "user" u ON u.id = s.user_id
        WHERE DATE_TRUNC('day', s.recorded_at) = days.date
        ORDER BY kills DESC, (s.end_honor - s.start_honor) DESC
        LIMIT 1
      ) top ON true
      ORDER BY days.date DESC
    `;

    return currentData;
  } catch (error) {
    throw new Error("Не удалось получить историю для killcount", {
      cause: error,
    });
  }
};

export const getKillCountByDate = async (date: string) => {
  try {
    const currentData = await sql<DB_GetKillCountDto[]>`
    SELECT 
      u.username AS "userName",
			u.id AS "userId",
			u.class AS "role",
			s.id,
      s.start_honor AS "startHonor",
      s.end_honor AS "endHonor",
      s.start_kills as "startKills",
			s.comment as "comment",
      s.end_kills as "endKills",
			s.class as "playerClass",
      (s.end_kills - s.start_kills) AS "totalKills",
      (s.end_honor - s.start_honor) AS "totalHonor"
			FROM killcount_stats s
		JOIN "user" u ON s.user_id = u.id
		WHERE s.recorded_at >= ${date}::date 
			AND s.recorded_at < ${date}::date + INTERVAL '1 day'
		ORDER BY "totalKills" DESC;
		`;

    return currentData;
  } catch (error) {
    throw new Error(`Не удалось получить историю за дату ${date}`, {
      cause: error,
    });
  }
};

export const updateKillCountById = async ({
  id,
  playerClass,
  startHonor,
  startKills,
  endHonor,
  endKills,
  comment,
}: DB_UpdateKillCountDto) => {
  try {
    const result = await sql`
    UPDATE killcount_stats
    SET 
      start_honor = ${startHonor},
      end_honor = ${endHonor},
      start_kills = ${startKills},
      end_kills = ${endKills},
			comment = ${comment ?? null},
			class = ${playerClass},
      updated_at = CURRENT_TIMESTAMP
    WHERE id = ${id}
    RETURNING *
  `;

    return result?.length > 0;
  } catch (error) {
    throw new Error(`Не удалось обновить запись ${id}`, { cause: error });
  }
};
