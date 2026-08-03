import { NextRequest, NextResponse } from "next/server";
import { Receiver } from "@upstash/qstash";
import supabase from "@/shared/lib/supabaseAdmin";
import { sendVkMessage } from "@/shared/lib/vkBot";
import { getVkMentionTag } from "@/shared/lib/vkQuietHours";
import { getVkNotificationSettings } from "@/actions/vkNotificationSettings";
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
} from "@/shared/config/fixedSchedule";

export const runtime = "nodejs";

const receiver = new Receiver({
  currentSigningKey: process.env.QSTASH_CURRENT_SIGNING_KEY!,
  nextSigningKey: process.env.QSTASH_NEXT_SIGNING_KEY!,
});

const DEDUP_RETENTION_DAYS = 3;

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("upstash-signature") ?? "";

  let isValid = false;
  try {
    isValid = await receiver.verify({
      body,
      signature,
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/notify-schedule`,
    });
  } catch {
    isValid = false;
  }

  if (!isValid) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const settings = await getVkNotificationSettings();
  const msk = getMoscowTime();
  const todayEvents: [string, string][] = [
    ...(schedule[dayNames[msk.getDay()]] ?? []),
  ];
  if (settings.primeTime) {
    todayEvents.push([settings.primeTime, PRIME_EVENT_NAME]);
  }
  const tag = getVkMentionTag(
    settings.quietHoursEnabled,
    settings.quietHoursStart,
    settings.quietHoursEnd,
  );

  let sent = 0;

  for (const [time, boss] of todayEvents) {
    if (!settings.enabledBosses.includes(boss)) continue;

    const leadMinutes = resolveNotifyMinutes(settings, boss);
    const start = getDateWithTime(msk, time, 0);
    const minutesUntilStart = (start.getTime() - msk.getTime()) / 60000;

    const isDue =
      minutesUntilStart <= leadMinutes && minutesUntilStart > leadMinutes - 1;
    if (!isDue) continue;

    const eventKey = `${boss}__${start.getTime()}`;
    const { error: logError } = await supabase
      .from("vk_schedule_notify_log")
      .insert({ event_key: eventKey });

    if (logError) {
      if (logError.code === "23505") continue;
      console.error("Ошибка при записи лога уведомлений расписания:", logError);
      continue;
    }

    const emoji = eventEmoji[boss] ?? "⚠️";
    await sendVkMessage(
      `${tag} ${emoji}${boss}${emoji} Начало в ${time} (через ${leadMinutes} мин).`,
    );
    sent += 1;
  }

  const cleanupThreshold = new Date(
    Date.now() - DEDUP_RETENTION_DAYS * 24 * 60 * 60 * 1000,
  ).toISOString();
  await supabase
    .from("vk_schedule_notify_log")
    .delete()
    .lt("notified_at", cleanupThreshold);

  return NextResponse.json({ ok: true, sent });
}
