"use server";

import { revalidatePath } from "next/cache";
import {
  toGuildFaction,
  toGuildMode,
  toGuildServer,
  type GuildFaction,
  type GuildMode,
} from "@/shared/config/guildStatus";
import sql from "@/shared/lib/db";
import type { GuildStatusSettingsRow } from "@/shared/lib/dbTypes";
import { getMoscowISOString, toMoscowIso } from "@/utils/getMoscowISOString";
import type { GuildServer } from "@/utils/guildServers";
import ensurePrivilieges from "./ensurePrivilieges";
import { getSessionUserId } from "./getSessionUserId";

export type GuildStatus = {
  mode: GuildMode;
  server: GuildServer;
  faction: GuildFaction;
  startedAt: string | null;
  opponentGuild: string | null;
};

type ModeRow = { mode: string };

export async function getGuildStatus(): Promise<GuildStatus> {
  let status:
    | Pick<
        GuildStatusSettingsRow,
        "mode" | "server" | "faction" | "started_at" | "opponent_guild"
      >
    | undefined;
  try {
    [status] = await sql<NonNullable<typeof status>[]>`
      SELECT mode, server, faction, started_at, opponent_guild
      FROM guild_status_settings WHERE id = 1
    `;
  } catch (error) {
    console.error("Ошибка при получении статуса гильдии:", error);
    throw new Error("Не удалось загрузить статус гильдии");
  }

  return {
    mode: toGuildMode(status?.mode),
    server: toGuildServer(status?.server),
    faction: toGuildFaction(status?.faction),
    startedAt: toMoscowIso(status?.started_at ?? null),
    opponentGuild: status?.opponent_guild ?? null,
  };
}

// Режим гильдии, действовавший на указанную дату/время (а не текущий) —
// нужен, чтобы рейд, задним числом созданный или отредактированный уже после
// смены фришка<->пвп, всё равно считался по ставкам того периода, в который
// реально попадает дата рейда. Периоды не пересекаются (смена режима
// закрывает предыдущий период), так что "последний период, начавшийся не
// позже даты" однозначно её содержит.
export async function getGuildModeAtDate(
  date: Date | string,
): Promise<GuildMode> {
  const naive = typeof date === "string" ? date : getMoscowISOString(date);
  const periods = sql`
    SELECT mode, started_at FROM guild_period_history
    UNION ALL
    SELECT mode, started_at FROM guild_status_settings WHERE id = 1
  `;

  try {
    const [match] = await sql<ModeRow[]>`
      SELECT mode FROM (${periods}) periods
      WHERE started_at IS NOT NULL AND started_at <= ${naive}::timestamp
      ORDER BY started_at DESC
      LIMIT 1
    `;
    if (match) return toGuildMode(match.mode);

    // Дата раньше самого раннего зафиксированного периода — берём режим
    // самого старого известного периода как лучшее приближение.
    const [earliest] = await sql<ModeRow[]>`
      SELECT mode FROM (${periods}) periods
      ORDER BY started_at ASC NULLS LAST
      LIMIT 1
    `;
    return toGuildMode(earliest?.mode);
  } catch (error) {
    console.error("Ошибка при определении режима гильдии на дату:", error);
    throw new Error("Не удалось определить режим гильдии на указанную дату");
  }
}

export async function updateGuildStatus(mode: GuildMode) {
  await ensurePrivilieges(["Администратор"]);

  try {
    const [current] = await sql<GuildStatusSettingsRow[]>`
      SELECT * FROM guild_status_settings WHERE id = 1
    `;
    if (current && current.mode !== mode) {
      await switchPeriod(current, mode);
    } else {
      await sql`
        INSERT INTO guild_status_settings (id, mode, updated_at)
        VALUES (1, ${mode}, now())
        ON CONFLICT (id) DO UPDATE SET
          mode = EXCLUDED.mode,
          updated_at = EXCLUDED.updated_at
      `;
    }
  } catch (error) {
    console.error("Ошибка при сохранении статуса гильдии:", error);
    throw new Error("Не удалось сохранить статус гильдии");
  }

  revalidatePath("/settings");
  revalidatePath("/war");
  revalidatePath("/", "layout");
}

export async function updateGuildLocation(
  server: GuildServer,
  faction: GuildFaction,
) {
  await ensurePrivilieges(["Администратор"]);

  try {
    await sql`
      INSERT INTO guild_status_settings (id, server, faction, updated_at)
      VALUES (1, ${server}, ${faction}, now())
      ON CONFLICT (id) DO UPDATE SET
        server = EXCLUDED.server,
        faction = EXCLUDED.faction,
        updated_at = EXCLUDED.updated_at
    `;
  } catch (error) {
    console.error("Ошибка при сохранении сервера гильдии:", error);
    throw new Error("Не удалось сохранить сервер гильдии");
  }

  revalidatePath("/settings");
  revalidatePath("/", "layout");
}

// Реальная смена режима (фришка <-> вар): закрываем текущий период в историю
// и открываем новый — обнуляем таймер и имя соперника. started_at/ended_at
// хранятся как naive-московское время: нельзя писать сюда postgres now() —
// он вернёт время в таймзоне сессии БД (обычно UTC), и toMoscowIso потом
// сдвинул бы момент старта на 3 часа в прошлое.
async function switchPeriod(current: GuildStatusSettingsRow, mode: GuildMode) {
  const nowMoscow = getMoscowISOString(new Date());
  const userId = await getSessionUserId();

  try {
    await sql.begin(async (tx) => {
      const [history] = await tx<{ id: number }[]>`
        INSERT INTO guild_period_history
          (mode, server, faction, opponent_guild, opponent_ended_at,
           started_at, ended_at, ended_by_user_id)
        VALUES (
          ${current.mode}, ${current.server}, ${current.faction},
          ${current.opponent_guild}, ${current.opponent_ended_at},
          ${current.started_at}, ${nowMoscow}, ${userId}
        )
        RETURNING id
      `;
      await tx`
        UPDATE guild_war_opponents
        SET period_history_id = ${history.id}
        WHERE period_history_id IS NULL
      `;
    });
  } catch (error) {
    // Не блокируем саму смену режима, если запись истории не удалась.
    console.error("Не удалось записать историю периода:", error);
  }

  await sql`
    INSERT INTO guild_status_settings
      (id, mode, opponent_guild, opponent_ended_at, started_at, updated_at)
    VALUES (1, ${mode}, NULL, NULL, ${nowMoscow}, now())
    ON CONFLICT (id) DO UPDATE SET
      mode = EXCLUDED.mode,
      opponent_guild = EXCLUDED.opponent_guild,
      opponent_ended_at = EXCLUDED.opponent_ended_at,
      started_at = EXCLUDED.started_at,
      updated_at = EXCLUDED.updated_at
  `;
}
