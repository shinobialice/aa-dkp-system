"use server";

import sql from "@/shared/lib/db";
import ensurePrivilieges from "./ensurePrivilieges";
import { revalidatePath } from "next/cache";
import {
  DEFAULT_VK_NOTIFICATION_SETTINGS,
  ALL_WEEK_DAYS,
  type VkNotificationSettings,
} from "@/shared/config/vkNotificationDefaults";

export async function getVkNotificationSettings(): Promise<VkNotificationSettings> {
  let data;
  try {
    [data] = await sql<any[]>`
      SELECT * FROM vk_notification_settings WHERE id = 1
    `;
  } catch (error) {
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
    primeTime: data.prime_time ?? null,
    primeDays: (data.prime_days ?? ALL_WEEK_DAYS) as number[],
  };
}

export async function updateVkNotificationSettings(
  settings: VkNotificationSettings,
) {
  await ensurePrivilieges(["Администратор"]);

  try {
    await sql<any[]>`
      INSERT INTO vk_notification_settings
        (id, enabled_bosses, notify_before_minutes, notify_minutes_by_event,
         quiet_hours_enabled, quiet_hours_start, quiet_hours_end, prime_time, prime_days, updated_at)
      VALUES (
        1, ${settings.enabledBosses}, ${settings.defaultNotifyBeforeMinutes},
        ${sql.json(settings.notifyMinutesByEvent)},
        ${settings.quietHoursEnabled}, ${settings.quietHoursStart}, ${settings.quietHoursEnd},
        ${settings.primeTime}, ${settings.primeDays}, now()
      )
      ON CONFLICT (id) DO UPDATE SET
        enabled_bosses = EXCLUDED.enabled_bosses,
        notify_before_minutes = EXCLUDED.notify_before_minutes,
        notify_minutes_by_event = EXCLUDED.notify_minutes_by_event,
        quiet_hours_enabled = EXCLUDED.quiet_hours_enabled,
        quiet_hours_start = EXCLUDED.quiet_hours_start,
        quiet_hours_end = EXCLUDED.quiet_hours_end,
        prime_time = EXCLUDED.prime_time,
        prime_days = EXCLUDED.prime_days,
        updated_at = EXCLUDED.updated_at
    `;
  } catch (error) {
    console.error("Ошибка при сохранении настроек уведомлений ВК:", error);
    throw new Error("Не удалось сохранить настройки уведомлений ВК");
  }

  revalidatePath("/settings");
}
