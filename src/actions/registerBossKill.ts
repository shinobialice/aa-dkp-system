"use server";

import sql from "@/shared/lib/db";
import {
  scheduleRespawnNotification,
  scheduleMissedRespawnNotification,
} from "@/shared/lib/qstash";
import {
  BossName,
  respawnHoursByBoss,
  respawnWindow,
  getRespawnStart,
  isMaintenanceWindow,
  maintenanceStartedDuring,
} from "@/shared/config/bossRespawn";
import { getVkNotificationSettings } from "./vkNotificationSettings";
import { resolveNotifyMinutes } from "@/shared/config/vkNotificationDefaults";
import { getMaintenanceWindows } from "./maintenanceWindows";
import { upsertRaidSuggestion } from "./raidSuggestions";

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
    await upsertRaidSuggestion(boss, killTimeIso);
  } catch (suggestionError) {
    console.error(
      "Не удалось обновить подсказку по созданию рейда:",
      suggestionError,
    );
  }

  try {
    const [respawnRow] = await sql<any[]>`
      SELECT notify_message_id, missed_message_id FROM boss_respawn WHERE boss_name = ${boss}
    `;

    const vkSettings = await getVkNotificationSettings();
    const maintenanceWindows = await getMaintenanceWindows();
    const bossEnabled = vkSettings.enabledBosses.includes(boss);
    const notifyAt =
      bossEnabled && !isMaintenanceWindow(nextRespawn, maintenanceWindows)
        ? new Date(
            nextRespawn.getTime() -
              resolveNotifyMinutes(vkSettings, boss) * 60 * 1000,
          )
        : null;

    const respawnEnd = new Date(
      nextRespawn.getTime() + respawnWindow * 60 * 60 * 1000,
    );
    const cascadedNextStart = new Date(
      nextRespawn.getTime() +
        (respawnHoursByBoss[boss] + respawnWindow) * 60 * 60 * 1000,
    );
    const cascadedNextEnd = new Date(
      cascadedNextStart.getTime() + respawnWindow * 60 * 60 * 1000,
    );
    const missedNotifyAt =
      bossEnabled &&
      !maintenanceStartedDuring(
        new Date(killTimeIso),
        respawnEnd,
        maintenanceWindows,
      ) &&
      !maintenanceStartedDuring(respawnEnd, cascadedNextEnd, maintenanceWindows)
        ? new Date(
            cascadedNextStart.getTime() -
              resolveNotifyMinutes(vkSettings, boss) * 60 * 1000,
          )
        : null;

    const messageId = await scheduleRespawnNotification(
      boss,
      notifyAt,
      respawnRow?.notify_message_id ?? null,
    );
    const missedMessageId = await scheduleMissedRespawnNotification(
      boss,
      killTimeIso,
      missedNotifyAt,
      respawnRow?.missed_message_id ?? null,
    );

    await sql<any[]>`
      UPDATE boss_respawn
      SET notify_message_id = ${messageId}, missed_message_id = ${missedMessageId}
      WHERE boss_name = ${boss}
    `;
  } catch (notifyError) {
    console.error("Не удалось запланировать VK-уведомление:", notifyError);
  }

  return { registered: true };
}
