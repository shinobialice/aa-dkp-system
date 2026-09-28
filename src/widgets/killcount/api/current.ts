"use server";

import sql from "@/shared/lib/db";
import { KillCount } from "../types";

export const getKillCountCurrent = async () => {
  try {
    const currentData = await sql<KillCount[]>`
			SELECT 
			u.username AS "userName",
			u.id AS "userId", 
			s.id AS "id",
			s.start_honor AS "startHonor", 
			s.end_honor AS "endHonor", 
			s.start_kills AS "startKills", 
			s.end_kills AS "endKills", 
			s.class AS "playerClass",
			(s.end_kills - s.start_kills) AS "totalKills", 
			(s.end_honor - s.start_honor) AS "totalHonor"
			FROM killcount_stats s 
			JOIN "user" u ON s.user_id = u.id 
			WHERE s.recorded_at >= CURRENT_DATE 
			AND s.recorded_at < CURRENT_DATE + INTERVAL '1 day'
			ORDER BY "totalKills" DESC;
		`;

    return currentData;
  } catch (error) {
    throw new Error("Не удалось получить киллкаунт за сегодня", {
      cause: error,
    });
  }
};

export const setKillCountCurrent = async (dto: KillCount[]) => {
  try {
    const userNames = dto.map((item) => item.userName);

    const users =
      await sql`SELECT id, username FROM "user" WHERE username IN ${sql(userNames)}`;

    if (!users?.length) {
      return;
    }

    const mapUserNameToId = new Map<string, number>();

    for (const user of users) {
      mapUserNameToId.set(user?.username ?? "", user?.id);
    }

    const missingUsernames = userNames.filter(
      (userName) => !mapUserNameToId.has(userName),
    );

    if (missingUsernames.length > 0) {
      throw new Error(`Не найдены пользователи: ${missingUsernames}`);
    }

    const dataToInsert = dto
      .filter((row) => mapUserNameToId.has(row.userName))
      .map((row) => ({
        user_id: mapUserNameToId.get(row.userName)!,
        event_id: 1,
        start_honor: row.startHonor,
        end_honor: row.endHonor,
        start_kills: row.startKills,
        end_kills: row.endKills,
        class: row.playerClass,
        recorded_at: new Date().toISOString(),
        comment: row.comment,
      }));

    await sql`
    	INSERT INTO killcount_stats ${sql(dataToInsert, "user_id", "event_id", "class", "start_honor", "end_honor", "start_kills", "end_kills", "recorded_at", "comment")} RETURNING *`;
  } catch (error) {
    throw new Error("Не удалось установить актуальный киллкаунт", {
      cause: error,
    });
  }
};
