"use server";

import supabase from "@/shared/lib/supabaseAdmin";
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

  const { data: registered, error } = await supabase.rpc(
    "register_boss_kill",
    {
      p_boss_name: boss,
      p_kill_time: killTimeIso,
      p_action: action,
      p_user_id: userId,
      p_next_respawn: nextRespawn.toISOString(),
      p_cooldown_seconds: cooldownSeconds,
    },
  );

  if (error || !registered) {
    return { registered: false };
  }

  const { data: row } = await supabase
    .from("boss_respawn")
    .select("notify_message_id")
    .eq("boss_name", boss)
    .maybeSingle();

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
    row?.notify_message_id ?? null,
  );

  await supabase
    .from("boss_respawn")
    .update({ notify_message_id: messageId })
    .eq("boss_name", boss);

  return { registered: true };
}
