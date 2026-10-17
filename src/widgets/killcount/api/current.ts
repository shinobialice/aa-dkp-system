"use server";

import sql from "@/shared/lib/db";
import { getBaseUrl } from "@/shared/lib";
import { sendVkMessage } from "@/shared/lib/vkBot";
import ensurePrivilieges from "@/actions/ensurePrivilieges";
import { KILLCOUNT_EDITOR_TAGS } from "@/server/killcountEditors";
import { type KillCount } from "../types";

export const getKillCountCurrent = async () => {
  try {
    const currentData = await sql<KillCount[]>`
			SELECT 
			u.username AS "userName",
			u.id AS "userId",
			u.class AS "role",
			u.avatar_url AS "avatarUrl",
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
  await ensurePrivilieges(KILLCOUNT_EDITOR_TAGS);
  await insertKillCountRows(dto);
  await notifyKillCountAdded();
};

export const addKillCountRowToday = async (row: KillCount) => {
  await ensurePrivilieges(KILLCOUNT_EDITOR_TAGS);
  await insertKillCountRows([row]);
};

const insertKillCountRows = async (dto: KillCount[]) => {
  try {
    const userNames = dto.map((item) => item.userName);

    const users = await sql<{ id: number; username: string }[]>`
      SELECT id, username FROM "user" WHERE username IN ${sql(userNames)}
    `;
    const userIdByName = new Map(users.map((user) => [user.username, user.id]));

    const missingUsernames = userNames.filter(
      (name) => !userIdByName.has(name),
    );
    if (missingUsernames.length > 0) {
      throw new Error(`Не найдены пользователи: ${missingUsernames}`);
    }

    const recordedAt = new Date().toISOString();
    const dataToInsert = dto.flatMap((row) => {
      const userId = userIdByName.get(row.userName);
      if (userId === undefined) return [];
      return {
        user_id: userId,
        event_id: 1,
        start_honor: row.startHonor,
        end_honor: row.endHonor,
        start_kills: row.startKills,
        end_kills: row.endKills,
        class: row.playerClass,
        recorded_at: recordedAt,
        comment: row.comment,
      };
    });

    await sql`
    	INSERT INTO killcount_stats ${sql(dataToInsert, "user_id", "event_id", "class", "start_honor", "end_honor", "start_kills", "end_kills", "recorded_at", "comment")}`;
  } catch (error) {
    throw new Error("Не удалось установить актуальный киллкаунт", {
      cause: error,
    });
  }
};

const notifyKillCountAdded = async () => {
  try {
    const [top] = await sql<
      { date: string; userName: string; kills: number }[]
    >`
      SELECT
        CURRENT_DATE::text AS date,
        u.username AS "userName",
        (s.end_kills - s.start_kills) AS kills
      FROM killcount_stats s
      JOIN "user" u ON u.id = s.user_id
      WHERE s.recorded_at >= CURRENT_DATE
        AND s.recorded_at < CURRENT_DATE + INTERVAL '1 day'
      ORDER BY kills DESC, (s.end_honor - s.start_honor) DESC
      LIMIT 1
    `;

    if (!top) return;

    const displayDate = top.date.split("-").reverse().join(".");

    await sendVkMessage(
      [
        `⚔️ Добавлен киллкаунт за ${displayDate}`,
        `🏆 Топ по киллам сегодня: ${top.userName} — ${top.kills} 🎉`,
        `📊 ${getBaseUrl()}/kill-counter/history/${top.date}`,
      ].join("\n"),
    );
  } catch (error) {
    console.error("Не удалось отправить уведомление о киллкаунте в ВК:", error);
  }
};
