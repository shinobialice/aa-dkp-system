import { NextRequest, NextResponse } from "next/server";
import { Receiver } from "@upstash/qstash";
import { sendVkMessage } from "@/shared/lib/vkBot";
import { getBaseUrl } from "@/shared/lib";
import { getVkMentionTag } from "@/shared/lib/vkQuietHours";
import { getVkNotificationSettings } from "@/actions/vkNotificationSettings";
import { getMaintenanceWindows } from "@/actions/maintenanceWindows";
import { resolveNotifyMinutes } from "@/shared/config/vkNotificationDefaults";
import {
  bossEmoji,
  missedAdjectiveByBoss,
  isMaintenanceWindow,
  type BossName,
} from "@/shared/config/bossRespawn";

export const runtime = "nodejs";

const receiver = new Receiver({
  currentSigningKey: process.env.QSTASH_CURRENT_SIGNING_KEY!,
  nextSigningKey: process.env.QSTASH_NEXT_SIGNING_KEY!,
});

function formatMoscowTime(date: Date): string {
  return date.toLocaleString("ru-RU", {
    hour12: false,
    timeZone: "Europe/Moscow",
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("upstash-signature") ?? "";

  let isValid = false;
  try {
    isValid = await receiver.verify({
      body,
      signature,
      url: `${getBaseUrl()}/api/notify-respawn-missed`,
    });
  } catch {
    isValid = false;
  }

  if (!isValid) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { boss, killTimeIso } = JSON.parse(body) as {
    boss: BossName;
    killTimeIso: string;
  };

  const maintenanceWindows = await getMaintenanceWindows();
  if (isMaintenanceWindow(new Date(), maintenanceWindows)) {
    return NextResponse.json({ ok: true, skipped: "maintenance_window" });
  }

  const settings = await getVkNotificationSettings();
  if (!settings.enabledBosses.includes(boss)) {
    return NextResponse.json({ ok: true, skipped: "boss_disabled" });
  }

  const tag = getVkMentionTag(
    settings.quietHoursEnabled,
    settings.quietHoursStart,
    settings.quietHoursEnd,
  );
  const minutes = resolveNotifyMinutes(settings, boss);

  await sendVkMessage(
    `${tag} ${bossEmoji[boss]}${boss}${bossEmoji[boss]} ${missedAdjectiveByBoss[boss]}! Прошлый респавн (${formatMoscowTime(
      new Date(killTimeIso),
    )}) не зафармили. Следующий ожидается через ${minutes} мин.`,
  );

  return NextResponse.json({ ok: true });
}
