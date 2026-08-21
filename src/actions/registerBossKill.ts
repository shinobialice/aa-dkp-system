"use server";

import sql from "@/shared/lib/db";
import { scheduleRespawnNotification } from "@/shared/lib/qstash";
import {
  BossName,
  respawnHoursByBoss,
  getRespawnStart,
  isMaintenanceWindow,
} from "@/shared/config/bossRespawn";
import { getVkNotificationSettings } from "./vkNotificationSettings";
import { resolveNotifyMinutes } from "@/shared/config/vkNotificationDefaults";
import { getMaintenanceWindows } from "./maintenanceWindows";

export async function registerBossKill(
  boss: BossName,
  killTimeIso: string,
  action: string,
  userId: number,
  cooldownSeconds: number,
): Promise<{ registered: boolean }> {
  const nextRespawn = getRespawnStart(killTimeIso, respawnHoursByBoss[boss]);

  let registered = false;
  try {
    // Последний параметр — сколько паков нужно на босса, эта механика была
    // только у Кириоса и с его удалением всегда null (сигнатуру
    // register_boss_kill в БД не трогаем, чтобы не городить миграцию).
    const [row] = await sql<any[]>`
      SELECT register_boss_kill(
        ${boss}, ${killTimeIso}, ${action}, ${userId}, ${nextRespawn.toISOString()},
        ${cooldownSeconds}, ${null}
      ) AS registered
    `;
    registered = !!row?.registered;
  } catch {
    return { registered: false };
  }

  if (!registered) {
    return { registered: false };
  }

  try {
    const [respawnRow] = await sql<any[]>`
      SELECT notify_message_id FROM boss_respawn WHERE boss_name = ${boss}
    `;

    const vkSettings = await getVkNotificationSettings();
    const maintenanceWindows = await getMaintenanceWindows();
    const notifyAt =
      vkSettings.enabledBosses.includes(boss) &&
      !isMaintenanceWindow(nextRespawn, maintenanceWindows)
        ? new Date(
            nextRespawn.getTime() -
              resolveNotifyMinutes(vkSettings, boss) * 60 * 1000,
          )
        : null;

    const messageId = await scheduleRespawnNotification(
      boss,
      notifyAt,
      respawnRow?.notify_message_id ?? null,
    );

    await sql<any[]>`
      UPDATE boss_respawn SET notify_message_id = ${messageId} WHERE boss_name = ${boss}
    `;
  } catch (notifyError) {
    console.error("Не удалось запланировать VK-уведомление:", notifyError);
  }

  return { registered: true };
}
