"use server";

import sql from "@/shared/lib/db";
import ensurePrivilieges from "./ensurePrivilieges";
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
};

export async function getGuildStatus(): Promise<GuildStatus> {
  let data;
  try {
    [data] = await sql<any[]>`
      SELECT mode, server, faction FROM guild_status_settings WHERE id = 1
    `;
  } catch (error) {
    console.error("Ошибка при получении статуса гильдии:", error);
    throw new Error("Не удалось загрузить статус гильдии");
  }

  if (!data) {
    return { mode: DEFAULT_MODE, server: DEFAULT_SERVER, faction: DEFAULT_FACTION };
  }

  return {
    mode: (data.mode as GuildMode) ?? DEFAULT_MODE,
    server: (data.server as GuildServer) ?? DEFAULT_SERVER,
    faction: (data.faction as GuildFaction) ?? DEFAULT_FACTION,
  };
}

export async function updateGuildStatus(mode: GuildMode) {
  await ensurePrivilieges(["Администратор"]);

  try {
    await sql<any[]>`
      INSERT INTO guild_status_settings (id, mode, updated_at)
      VALUES (1, ${mode}, now())
      ON CONFLICT (id) DO UPDATE SET
        mode = EXCLUDED.mode,
        updated_at = EXCLUDED.updated_at
    `;
  } catch (error) {
    console.error("Ошибка при сохранении статуса гильдии:", error);
    throw new Error("Не удалось сохранить статус гильдии");
  }

  revalidatePath("/settings");
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
