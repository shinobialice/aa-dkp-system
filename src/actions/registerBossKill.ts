"use server";

import supabase from "@/shared/lib/supabaseAdmin";
import { scheduleRespawnNotification } from "@/shared/lib/qstash";
import {
  BossName,
  respawnHoursByBoss,
  getRespawnStart,
} from "@/shared/config/bossRespawn";

const notifyBeforeMinutes = 10;

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

  const notifyAt = new Date(
    nextRespawn.getTime() - notifyBeforeMinutes * 60 * 1000,
  );
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
