import { type NextRequest, NextResponse } from "next/server";
import { readVerifiedQstashBody } from "@/server/qstashSignature";
import sql from "@/shared/lib/db";
import { getBaseUrl } from "@/shared/lib";
import { sendVkMessage } from "@/shared/lib/vkBot";
import { getVkMentionTag } from "@/shared/lib/vkQuietHours";
import { getVkNotificationSettings } from "@/actions/vkNotificationSettings";
import { getMaintenanceWindows } from "@/actions/maintenanceWindows";
import { isMaintenanceWindow } from "@/shared/config/bossRespawn";
import {
  resolveNotifyMinutes,
  PRIME_EVENT_NAME,
} from "@/shared/config/vkNotificationDefaults";
import {
  schedule,
  dayNames,
  getMoscowTime,
  getDateWithTime,
  eventEmoji,
  vkScheduleEventName,
} from "@/shared/config/fixedSchedule";

export const runtime = "nodejs";

const DEDUP_RETENTION_DAYS = 3;

export async function POST(req: NextRequest) {
  const body = await readVerifiedQstashBody(req, "/api/notify-schedule");
  if (body === null) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const maintenanceWindows = await getMaintenanceWindows();
  if (isMaintenanceWindow(new Date(), maintenanceWindows)) {
    return NextResponse.json({ ok: true, skipped: "maintenance_window" });
  }

  const settings = await getVkNotificationSettings();
  const msk = getMoscowTime();
  const todayEvents: [string, string][] = [
    ...(schedule[dayNames[msk.getDay()]] ?? []),
  ];
  if (settings.primeTime && settings.primeDays.includes(msk.getDay())) {
    todayEvents.push([settings.primeTime, PRIME_EVENT_NAME]);
  }
  const tag = getVkMentionTag(
    settings.quietHoursEnabled,
    settings.quietHoursStart,
    settings.quietHoursEnd,
  );

  let sent = 0;

  for (const [time, boss] of todayEvents) {
    const settingsName = vkScheduleEventName(boss, time);
    if (!settings.enabledBosses.includes(settingsName)) continue;

    const leadMinutes = resolveNotifyMinutes(settings, settingsName);
    const start = getDateWithTime(msk, time, 0);
    const minutesUntilStart = (start.getTime() - msk.getTime()) / 60000;

    const isDue =
      minutesUntilStart <= leadMinutes && minutesUntilStart > leadMinutes - 1;
    if (!isDue) continue;

    const eventKey = `${boss}__${start.getTime()}`;
    let isFirstSend: boolean;
    try {
      const inserted = await sql`
        INSERT INTO vk_schedule_notify_log (event_key) VALUES (${eventKey})
        ON CONFLICT DO NOTHING
        RETURNING event_key
      `;
      isFirstSend = inserted.length > 0;
    } catch (logError) {
      console.error("Ошибка при записи лога уведомлений расписания:", logError);
      continue;
    }
    if (!isFirstSend) continue;

    const emoji = eventEmoji[boss] ?? "⚠️";
    await sendVkMessage(
      `${tag} ${emoji}${boss}${emoji} Начало в ${time} (через ${leadMinutes} мин).`,
    );
    sent += 1;
  }

  const cleanupThreshold = new Date(
    Date.now() - DEDUP_RETENTION_DAYS * 24 * 60 * 60 * 1000,
  ).toISOString();
  await sql`
    DELETE FROM vk_schedule_notify_log WHERE notified_at < ${cleanupThreshold}
  `;

  return NextResponse.json({ ok: true, sent });
}
