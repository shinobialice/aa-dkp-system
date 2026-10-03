"use server";

import {
  getRespawnStart,
  isBossName,
  isMaintenanceWindow,
  KILL_ACTIONS,
  maintenanceStartedDuring,
  REGISTER_COOLDOWN_SECONDS,
  respawnHoursByBoss,
  respawnWindow,
  type BossName,
  type KillAction,
} from "@/shared/config/bossRespawn";
import { resolveNotifyMinutes } from "@/shared/config/vkNotificationDefaults";
import sql from "@/shared/lib/db";
import type { BossRespawnRow } from "@/shared/lib/dbTypes";
import {
  scheduleMissedRespawnNotification,
  scheduleRespawnNotification,
} from "@/shared/lib/qstash";
import { getSessionUserId } from "./getSessionUserId";
import { getMaintenanceWindows } from "./maintenanceWindows";
import { getVkNotificationSettings } from "./vkNotificationSettings";

const HOUR_MS = 60 * 60 * 1000;
const MINUTE_MS = 60 * 1000;

export async function registerBossKill(
  boss: BossName,
  killTimeIso: string,
  action: KillAction,
): Promise<{ registered: boolean }> {
  if (!isBossName(boss) || !KILL_ACTIONS.includes(action)) {
    throw new Error("Неизвестный босс или действие");
  }
  if (Number.isNaN(Date.parse(killTimeIso))) {
    throw new Error("Некорректное время убийства");
  }
  const userId = await getSessionUserId();
  if (userId === null) {
    throw new Error("Вы должны быть авторизованы для изменения времени!");
  }

  const nextRespawn = getRespawnStart(killTimeIso, respawnHoursByBoss[boss]);

  try {
    const [row] = await sql<{ registered: boolean }[]>`
      SELECT register_boss_kill(
        ${boss}, ${killTimeIso}, ${action}, ${userId}, ${nextRespawn.toISOString()},
        ${REGISTER_COOLDOWN_SECONDS}, ${null}
      ) AS registered
    `;
    if (!row?.registered) return { registered: false };
  } catch {
    return { registered: false };
  }

  try {
    await addRaidSuggestion(boss, killTimeIso);
  } catch (error) {
    console.error("Не удалось обновить подсказку по созданию рейда:", error);
  }

  try {
    await scheduleNotifications(boss, killTimeIso, nextRespawn);
  } catch (error) {
    console.error("Не удалось запланировать VK-уведомление:", error);
  }

  return { registered: true };
}

// Рейд нужно провести в момент респауна (когда босс стал доступен), а не в
// момент фактического килла — тот может случиться позже, если респаун словили
// не сразу. Момент респауна для этого килла — prev_kill_time (last_kill до
// перезаписи, только что вставленный в историю) + окно респауна. Каждая
// регистрация — своя строка: у Морфа и Марли бывает 2 килла в сутки, а от
// дублей на один килл защищает кулдаун в register_boss_kill.
async function addRaidSuggestion(boss: BossName, killTimeIso: string) {
  const [history] = await sql<{ prev_kill_time: string | null }[]>`
    SELECT prev_kill_time FROM boss_respawn_history
    WHERE boss_name = ${boss}
    ORDER BY created_at DESC
    LIMIT 1
  `;
  const raidTime = history?.prev_kill_time
    ? getRespawnStart(history.prev_kill_time, respawnHoursByBoss[boss])
    : new Date(killTimeIso);

  await sql`
    INSERT INTO boss_kill_raid_suggestions (boss_name, kill_time, created_at, status)
    VALUES (${boss}, ${raidTime.toISOString()}, now(), 'pending')
  `;
}

async function scheduleNotifications(
  boss: BossName,
  killTimeIso: string,
  nextRespawn: Date,
) {
  const [[respawnRow], vkSettings, maintenanceWindows] = await Promise.all([
    sql<Pick<BossRespawnRow, "notify_message_id" | "missed_message_id">[]>`
      SELECT notify_message_id, missed_message_id FROM boss_respawn WHERE boss_name = ${boss}
    `,
    getVkNotificationSettings(),
    getMaintenanceWindows(),
  ]);

  const bossEnabled = vkSettings.enabledBosses.includes(boss);
  const notifyLeadMs = resolveNotifyMinutes(vkSettings, boss) * MINUTE_MS;
  const respawnEnd = new Date(nextRespawn.getTime() + respawnWindow * HOUR_MS);
  const cycleMs = (respawnHoursByBoss[boss] + respawnWindow) * HOUR_MS;
  const nextCycleStart = new Date(nextRespawn.getTime() + cycleMs);
  const nextCycleEnd = new Date(
    nextCycleStart.getTime() + respawnWindow * HOUR_MS,
  );

  const notifyAt =
    bossEnabled && !isMaintenanceWindow(nextRespawn, maintenanceWindows)
      ? new Date(nextRespawn.getTime() - notifyLeadMs)
      : null;
  const cycleInterrupted =
    maintenanceStartedDuring(
      new Date(killTimeIso),
      respawnEnd,
      maintenanceWindows,
    ) || maintenanceStartedDuring(respawnEnd, nextCycleEnd, maintenanceWindows);
  const missedNotifyAt =
    bossEnabled && !cycleInterrupted
      ? new Date(nextCycleStart.getTime() - notifyLeadMs)
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

  await sql`
    UPDATE boss_respawn
    SET notify_message_id = ${messageId}, missed_message_id = ${missedMessageId}
    WHERE boss_name = ${boss}
  `;
}
