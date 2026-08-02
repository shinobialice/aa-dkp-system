"use server";

import supabase from "@/shared/lib/supabaseAdmin";
import ensurePrivilieges from "./ensurePrivilieges";
import { revalidatePath } from "next/cache";
import {
  DEFAULT_VK_NOTIFICATION_SETTINGS,
  type VkNotificationSettings,
} from "@/shared/config/vkNotificationDefaults";

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

  if (!data) return DEFAULT_VK_NOTIFICATION_SETTINGS;

  return {
    enabledBosses: (data.enabled_bosses ?? []) as string[],
    defaultNotifyBeforeMinutes: data.notify_before_minutes,
    notifyMinutesByEvent: (data.notify_minutes_by_event ?? {}) as Record<
      string,
      number
    >,
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
    notify_before_minutes: settings.defaultNotifyBeforeMinutes,
    notify_minutes_by_event: settings.notifyMinutesByEvent,
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
