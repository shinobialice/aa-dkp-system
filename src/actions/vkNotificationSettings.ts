"use server";

import supabase from "@/shared/lib/supabaseAdmin";
import ensurePrivilieges from "./ensurePrivilieges";
import { revalidatePath } from "next/cache";
import type { BossName } from "@/shared/config/bossRespawn";

export type VkNotificationSettings = {
  enabledBosses: BossName[];
  notifyBeforeMinutes: number;
  quietHoursEnabled: boolean;
  quietHoursStart: number;
  quietHoursEnd: number;
};

// Совпадает с DEFAULT'ами в migration_vk_notification_settings.sql —
// подстраховка на случай, если singleton-строка ещё не создана в БД.
const DEFAULT_SETTINGS: VkNotificationSettings = {
  enabledBosses: ["Марли", "Морф", "Кириос"],
  notifyBeforeMinutes: 10,
  quietHoursEnabled: true,
  quietHoursStart: 2,
  quietHoursEnd: 7,
};

// Читается и из настроек (клиентская форма), и из registerBossKill.ts /
// app/api/notify-respawn/route.ts — последний публичный (без сессии), не
// требует прав, поэтому не под ensurePrivilieges.
export async function getVkNotificationSettings(): Promise<VkNotificationSettings> {
  const { data, error } = await supabase
    .from("vk_notification_settings")
    .select("*")
    .eq("id", 1)
    .maybeSingle();

  if (error) {
    console.error("Ошибка при получении настроек уведомлений ВК:", error);
    throw new Error("Не удалось загрузить настройки уведомлений ВК");
  }

  if (!data) return DEFAULT_SETTINGS;

  return {
    enabledBosses: (data.enabled_bosses ?? []) as BossName[],
    notifyBeforeMinutes: data.notify_before_minutes,
    quietHoursEnabled: data.quiet_hours_enabled,
    quietHoursStart: data.quiet_hours_start,
    quietHoursEnd: data.quiet_hours_end,
  };
}

export async function updateVkNotificationSettings(
  settings: VkNotificationSettings,
) {
  await ensurePrivilieges(["Администратор"]);

  const { error } = await supabase.from("vk_notification_settings").upsert({
    id: 1,
    enabled_bosses: settings.enabledBosses,
    notify_before_minutes: settings.notifyBeforeMinutes,
    quiet_hours_enabled: settings.quietHoursEnabled,
    quiet_hours_start: settings.quietHoursStart,
    quiet_hours_end: settings.quietHoursEnd,
    updated_at: new Date().toISOString(),
  });

  if (error) {
    console.error("Ошибка при сохранении настроек уведомлений ВК:", error);
    throw new Error("Не удалось сохранить настройки уведомлений ВК");
  }

  revalidatePath("/settings/vk-notifications");
}
