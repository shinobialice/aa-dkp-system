import { NextRequest, NextResponse } from "next/server";
import { Receiver } from "@upstash/qstash";
import { sendVkMessage } from "@/shared/lib/vkBot";

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

  const { boss } = JSON.parse(body) as { boss: string };
  await sendVkMessage(`@all ⚠️ Скоро ${boss}! Респаун ожидается через ~10 мин.`);

  return NextResponse.json({ ok: true });
}
