"use server";

import sql from "@/shared/lib/db";
import ensurePrivilieges from "./ensurePrivilieges";
import { getSessionUserId } from "./getSessionUserId";
import { revalidatePath } from "next/cache";
import type { GuildServer } from "@/utils/guildServers";

export type GuildMode = "freeshard" | "pvp";
export type GuildFaction = "nuian" | "hariharan";

const DEFAULT_MODE: GuildMode = "freeshard";
const DEFAULT_SERVER: GuildServer = "Луций";
const DEFAULT_FACTION: GuildFaction = "nuian";

export type GuildStatus = {
  mode: GuildMode;
  server: GuildServer;
  faction: GuildFaction;
  startedAt: string | null;
  opponentGuild: string | null;
};

// В базе started_at/ended_at хранятся как "naive" timestamp (без таймзоны,
// фактически московское время — см. комментарий про raid.start_date и
// src/shared/lib/db.ts). Без явного смещения new Date(...) на клиенте
// разберёт такую строку как локальное время браузера, а не московское —
// добавляем фиксированное +03:00 (у Москвы нет перехода на летнее с 2014),
// пока строка ещё на сервере, чтобы дальше это было однозначным моментом
// времени независимо от часового пояса зрителя.
function toMoscowIso(naive: string | null): string | null {
  if (!naive) return null;
  return /[+-]\d{2}:?\d{2}$|Z$/.test(naive) ? naive : `${naive}+03:00`;
}

export async function getGuildStatus(): Promise<GuildStatus> {
  let data;
  try {
    [data] = await sql<any[]>`
      SELECT mode, server, faction, started_at, opponent_guild
      FROM guild_status_settings WHERE id = 1
    `;
  } catch (error) {
    console.error("Ошибка при получении статуса гильдии:", error);
    throw new Error("Не удалось загрузить статус гильдии");
  }

  if (!data) {
    return {
      mode: DEFAULT_MODE,
      server: DEFAULT_SERVER,
      faction: DEFAULT_FACTION,
      startedAt: null,
      opponentGuild: null,
    };
  }

  return {
    mode: (data.mode as GuildMode) ?? DEFAULT_MODE,
    server: (data.server as GuildServer) ?? DEFAULT_SERVER,
    faction: (data.faction as GuildFaction) ?? DEFAULT_FACTION,
    startedAt: toMoscowIso(data.started_at ?? null),
    opponentGuild: data.opponent_guild ?? null,
  };
}

export async function updateGuildStatus(mode: GuildMode) {
  await ensurePrivilieges(["Администратор"]);

  try {
    const [current] = await sql<any[]>`
      SELECT mode, server, faction, opponent_guild, started_at
      FROM guild_status_settings WHERE id = 1
    `;

    if (current && current.mode !== mode) {
      // Реальная смена режима (фришка <-> вар) — закрываем текущий период
      // в историю и открываем новый: обнуляем таймер и имя соперника.
      const userId = await getSessionUserId();
      try {
        await sql`
          INSERT INTO guild_period_history
            (mode, server, faction, opponent_guild, started_at, ended_at, ended_by_user_id)
          VALUES (
            ${current.mode}, ${current.server}, ${current.faction},
            ${current.opponent_guild}, ${current.started_at}, now(), ${userId}
          )
        `;
      } catch (historyError) {
        // Не блокируем саму смену режима, если запись истории не удалась
        // (как с user_username_history в editUser.ts).
        console.error("Не удалось записать историю периода:", historyError);
      }

      await sql`
        INSERT INTO guild_status_settings (id, mode, opponent_guild, started_at, updated_at)
        VALUES (1, ${mode}, NULL, now(), now())
        ON CONFLICT (id) DO UPDATE SET
          mode = EXCLUDED.mode,
          opponent_guild = EXCLUDED.opponent_guild,
          started_at = EXCLUDED.started_at,
          updated_at = EXCLUDED.updated_at
      `;
    } else {
      await sql<any[]>`
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

export async function updateWarOpponent(opponentGuild: string | null) {
  await ensurePrivilieges(["Администратор"]);
  const trimmed = opponentGuild?.trim() || null;

  try {
    await sql<any[]>`
      UPDATE guild_status_settings
      SET opponent_guild = ${trimmed}, updated_at = now()
      WHERE id = 1
    `;
  } catch (error) {
    console.error("Ошибка при сохранении названия гильдии-противника:", error);
    throw new Error("Не удалось сохранить название гильдии-противника");
  }

  revalidatePath("/war");
}

export type WarPeriodHistoryRow = {
  id: number;
  mode: GuildMode;
  server: GuildServer;
  faction: GuildFaction;
  opponentGuild: string | null;
  startedAt: string;
  endedAt: string;
  endedByUserId: number | null;
};

export async function getWarPeriodHistory(
  page: number,
  pageSize: number,
): Promise<{ rows: WarPeriodHistoryRow[]; total: number }> {
  try {
    const [{ count }] = await sql<any[]>`
      SELECT count(*)::int AS count FROM guild_period_history
    `;
    const rows = await sql<any[]>`
      SELECT id, mode, server, faction, opponent_guild, started_at, ended_at, ended_by_user_id
      FROM guild_period_history
      ORDER BY ended_at DESC
      LIMIT ${pageSize} OFFSET ${(page - 1) * pageSize}
    `;
    return {
      rows: rows.map((r) => ({
        id: r.id,
        mode: r.mode as GuildMode,
        server: r.server as GuildServer,
        faction: r.faction as GuildFaction,
        opponentGuild: r.opponent_guild ?? null,
        startedAt: toMoscowIso(r.started_at)!,
        endedAt: toMoscowIso(r.ended_at)!,
        endedByUserId: r.ended_by_user_id ?? null,
      })),
      total: count as number,
    };
  } catch (error) {
    console.error("Ошибка при получении истории периодов:", error);
    return { rows: [], total: 0 };
  }
}

export async function updateGuildLocation(
  server: GuildServer,
  faction: GuildFaction,
) {
  await ensurePrivilieges(["Администратор"]);

  try {
    await sql<any[]>`
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
