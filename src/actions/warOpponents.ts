"use server";

import { revalidatePath } from "next/cache";
import sql from "@/shared/lib/db";
import type {
  GuildStatusSettingsRow,
  GuildWarOpponentsRow,
} from "@/shared/lib/dbTypes";
import { getMoscowISOString, toMoscowIso } from "@/utils/getMoscowISOString";
import ensurePrivilieges from "./ensurePrivilieges";

export type WarOpponent = {
  id: number;
  name: string;
  startedAt: string;
  endedAt: string | null;
};

export type WarOpponentsState = {
  primary: { name: string | null; endedAt: string | null };
  opponents: WarOpponent[];
};

export type WarOpponentDraft = {
  id: number | null;
  name: string;
  ended: boolean;
};

const EMPTY_WAR_OPPONENTS: WarOpponentsState = {
  primary: { name: null, endedAt: null },
  opponents: [],
};

export async function getCurrentWarOpponents(): Promise<WarOpponentsState> {
  try {
    return await selectWarOpponentsState();
  } catch (error) {
    console.error("Ошибка при получении противников вара:", error);
    return EMPTY_WAR_OPPONENTS;
  }
}

export async function saveWarOpponents(
  primary: { name: string | null; ended: boolean },
  opponents: WarOpponentDraft[],
): Promise<WarOpponentsState> {
  await ensurePrivilieges(["Администратор"]);
  const primaryName = primary.name?.trim() || null;
  const drafts = opponents.map((opponent) => ({
    ...opponent,
    name: opponent.name.trim(),
  }));
  if (drafts.some((draft) => !draft.name)) {
    throw new Error("Укажите название гильдии-противника");
  }

  const [status] = await sql<Pick<GuildStatusSettingsRow, "mode">[]>`
    SELECT mode FROM guild_status_settings WHERE id = 1
  `;
  if (status?.mode !== "pvp") throw new Error("Вар сейчас не идёт");

  const nowMoscow = getMoscowISOString(new Date());
  try {
    await sql.begin(async (tx) => {
      await tx`
        UPDATE guild_status_settings
        SET
          opponent_guild = ${primaryName},
          opponent_ended_at = CASE
            WHEN ${primary.ended}::boolean
            THEN COALESCE(opponent_ended_at, ${nowMoscow}::timestamp)
          END,
          updated_at = now()
        WHERE id = 1
      `;
      for (const draft of drafts) {
        if (draft.id === null) {
          await tx`
            INSERT INTO guild_war_opponents (name, started_at)
            VALUES (${draft.name}, ${nowMoscow})
          `;
          continue;
        }
        await tx`
          UPDATE guild_war_opponents
          SET
            name = ${draft.name},
            ended_at = CASE
              WHEN ${draft.ended}::boolean
              THEN COALESCE(ended_at, ${nowMoscow}::timestamp)
            END
          WHERE id = ${draft.id} AND period_history_id IS NULL
        `;
      }
    });
  } catch (error) {
    console.error("Ошибка при сохранении противников вара:", error);
    throw new Error("Не удалось сохранить противников");
  }

  revalidatePath("/war");
  return selectWarOpponentsState();
}

async function selectWarOpponentsState(): Promise<WarOpponentsState> {
  const [[status], rows] = await Promise.all([
    sql<Pick<GuildStatusSettingsRow, "opponent_guild" | "opponent_ended_at">[]>`
      SELECT opponent_guild, opponent_ended_at
      FROM guild_status_settings WHERE id = 1
    `,
    sql<
      Pick<GuildWarOpponentsRow, "id" | "name" | "started_at" | "ended_at">[]
    >`
      SELECT id, name, started_at, ended_at
      FROM guild_war_opponents
      WHERE period_history_id IS NULL
      ORDER BY started_at, id
    `,
  ]);
  return {
    primary: {
      name: status?.opponent_guild ?? null,
      endedAt: toMoscowIso(status?.opponent_ended_at ?? null),
    },
    opponents: rows.map((row) => ({
      id: row.id,
      name: row.name,
      startedAt: toMoscowIso(row.started_at),
      endedAt: toMoscowIso(row.ended_at),
    })),
  };
}
