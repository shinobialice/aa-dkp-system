import { NextRequest, NextResponse } from "next/server";
import { Receiver } from "@upstash/qstash";
import { sendVkMessage } from "@/shared/lib/vkBot";
import { getVkMentionTag } from "@/shared/lib/vkQuietHours";
import { getVkNotificationSettings } from "@/actions/vkNotificationSettings";
import { getMaintenanceWindows } from "@/actions/maintenanceWindows";
import { resolveNotifyMinutes } from "@/shared/config/vkNotificationDefaults";
import {
  bossEmoji,
  isMaintenanceWindow,
  type BossName,
} from "@/shared/config/bossRespawn";

export const runtime = "nodejs";

const receiver = new Receiver({
  currentSigningKey: process.env.QSTASH_CURRENT_SIGNING_KEY!,
  nextSigningKey: process.env.QSTASH_NEXT_SIGNING_KEY!,
});

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("upstash-signature") ?? "";

  let isValid = false;
  try {
    isValid = await receiver.verify({
      body,
      signature,
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/notify-respawn`,
    });
  } catch {
    isValid = false;
  }

  if (!isValid) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { boss } = JSON.parse(body) as { boss: BossName };

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
    `${tag} ${bossEmoji[boss]}${boss}${bossEmoji[boss]} Респавн ожидается через ${minutes} мин.`,
  );

  return NextResponse.json({ ok: true });
}
