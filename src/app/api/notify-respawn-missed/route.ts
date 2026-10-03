import { type NextRequest, NextResponse } from "next/server";
import { readVerifiedQstashBody } from "@/server/qstashSignature";
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
  const body = await readVerifiedQstashBody(req, "/api/notify-respawn-missed");
  if (body === null) {
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
