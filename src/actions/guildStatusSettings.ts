"use server";

import supabase from "@/shared/lib/supabaseAdmin";
import ensurePrivilieges from "./ensurePrivilieges";
import { revalidatePath } from "next/cache";

export type GuildMode = "freeshard" | "pvp";

const DEFAULT_MODE: GuildMode = "freeshard";

export async function getGuildStatus(): Promise<{ mode: GuildMode }> {
  const { data, error } = await supabase
    .from("guild_status_settings")
    .select("mode")
    .eq("id", 1)
    .maybeSingle();

  if (error) {
    console.error("Ошибка при получении статуса гильдии:", error);
    throw new Error("Не удалось загрузить статус гильдии");
  }

  if (!data) return { mode: DEFAULT_MODE };

  return { mode: data.mode as GuildMode };
}

export async function updateGuildStatus(mode: GuildMode) {
  await ensurePrivilieges(["Администратор"]);

  const { error } = await supabase.from("guild_status_settings").upsert({
    id: 1,
    mode,
    updated_at: new Date().toISOString(),
  });

  if (error) {
    console.error("Ошибка при сохранении статуса гильдии:", error);
    throw new Error("Не удалось сохранить статус гильдии");
  }

  revalidatePath("/settings");
}
