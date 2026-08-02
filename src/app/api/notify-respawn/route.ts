import { NextRequest, NextResponse } from "next/server";
import { Receiver } from "@upstash/qstash";
import { sendVkMessage } from "@/shared/lib/vkBot";
import { getVkNotificationSettings } from "@/actions/vkNotificationSettings";
import type { BossName } from "@/shared/config/bossRespawn";

export const runtime = "nodejs";

const receiver = new Receiver({
  currentSigningKey: process.env.QSTASH_CURRENT_SIGNING_KEY!,
  nextSigningKey: process.env.QSTASH_NEXT_SIGNING_KEY!,
});

// start === end трактуем как «весь день не тихий», а не «весь день тихий» —
// иначе одинаковые значения в форме молча вырубили бы все уведомления.
// start > end — интервал через полночь (например 23-7).
function isQuietHours(start: number, end: number): boolean {
  if (start === end) return false;

  const moscowHour = Number(
    new Date().toLocaleString("en-US", {
      timeZone: "Europe/Moscow",
      hour: "2-digit",
      hour12: false,
    }),
  );

  return start < end
    ? moscowHour >= start && moscowHour < end
    : moscowHour >= start || moscowHour < end;
}

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
  const settings = await getVkNotificationSettings();

  // Проверяем тихие часы и включённость босса на момент фактической
  // доставки, а не постановки в очередь — так правки настроек между
  // регистрацией килла и респауном тоже учитываются.
  if (
    settings.quietHoursEnabled &&
    isQuietHours(settings.quietHoursStart, settings.quietHoursEnd)
  ) {
    return NextResponse.json({ ok: true, skipped: "quiet_hours" });
  }

  if (!settings.enabledBosses.includes(boss)) {
    return NextResponse.json({ ok: true, skipped: "boss_disabled" });
  }

  await sendVkMessage(
    `@all ⚠️ Скоро ${boss}! Респаун ожидается через ~${settings.notifyBeforeMinutes} мин.`,
  );

  return NextResponse.json({ ok: true });
}
