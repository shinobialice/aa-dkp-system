"use server";

import sql from "@/shared/lib/db";
import {
  DB_GetKillCountDto,
  DB_UpdateKillCountDto,
} from "@/widgets/killcount/types";
import { KillCountHistoryData } from "@/widgets/killcount/ui/history-table/history-table";

export const getKillCountHistory = async () => {
  try {
    const currentData = await sql<KillCountHistoryData[]>`
		SELECT 
			DATE_TRUNC('day', recorded_at) AS date,
			SUM(end_kills - start_kills) AS "totalKills"
			FROM killcount_stats
			GROUP BY DATE_TRUNC('day', recorded_at)
			ORDER BY date DESC
			LIMIT 30;
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
