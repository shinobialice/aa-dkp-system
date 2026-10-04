"use server";

import { revalidatePath } from "next/cache";
import sql from "@/shared/lib/db";
import type { GuildBuffSettingsRow } from "@/shared/lib/dbTypes";
import {
  GUILD_BUFFS,
  isValidBuffSelection,
  pickBuffs,
  parseSelectedBuffs,
  type SelectedBuffs,
} from "@/widgets/profile/equipment/characterBuffs";
import ensurePrivilieges from "./ensurePrivilieges";

export async function getGuildBuffSettings(): Promise<SelectedBuffs> {
  try {
    const [data] = await sql<Pick<GuildBuffSettingsRow, "levels">[]>`
      SELECT levels FROM guild_buff_settings WHERE id = 1
    `;
    if (!data) return {};
    return pickBuffs(parseSelectedBuffs(data.levels), GUILD_BUFFS);
  } catch (error) {
    console.error("Ошибка при получении гильдейских баффов:", error);
    throw new Error("Не удалось загрузить гильдейские баффы");
  }
}

export async function updateGuildBuffSettings(levels: SelectedBuffs) {
  await ensurePrivilieges(["Администратор"]);

  if (!isValidBuffSelection(levels, GUILD_BUFFS)) {
    throw new Error("Некорректный набор гильдейских баффов");
  }

  try {
    await sql`
      INSERT INTO guild_buff_settings (id, levels, updated_at)
      VALUES (1, ${sql.json(levels)}, now())
      ON CONFLICT (id) DO UPDATE SET
        levels = EXCLUDED.levels,
        updated_at = EXCLUDED.updated_at
    `;
  } catch (error) {
    console.error("Ошибка при сохранении гильдейских баффов:", error);
    throw new Error("Не удалось сохранить гильдейские баффы");
  }

  revalidatePath("/settings");
}
