"use server";

import sql from "@/shared/lib/db";
import ensurePrivilieges from "./ensurePrivilieges";
import { revalidatePath } from "next/cache";

export type GuildMode = "freeshard" | "pvp";

const DEFAULT_MODE: GuildMode = "freeshard";

export async function getGuildStatus(): Promise<{ mode: GuildMode }> {
  let data;
  try {
    [data] = await sql<any[]>`
      SELECT mode FROM guild_status_settings WHERE id = 1
    `;
  } catch (error) {
    console.error("Ошибка при получении статуса гильдии:", error);
    throw new Error("Не удалось загрузить статус гильдии");
  }

  if (!data) return { mode: DEFAULT_MODE };

  return { mode: data.mode as GuildMode };
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
