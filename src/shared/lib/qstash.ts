import "server-only";
import { Client } from "@upstash/qstash";
import { getBaseUrl } from "./getBaseUrl";

const qstash = new Client({
  baseUrl: process.env.QSTASH_URL!,
  token: process.env.QSTASH_TOKEN!,
});

async function scheduleQstashNotification(
  url: string,
  body: Record<string, unknown>,
  notifyAt: Date | null,
  previousMessageId: string | null,
): Promise<string | null> {
  if (previousMessageId) {
    try {
      await qstash.messages.delete(previousMessageId);
    } catch {}
  }

  if (!notifyAt || notifyAt.getTime() <= Date.now()) return null;

  const { messageId } = await qstash.publishJSON({
    url,
    body,
    notBefore: Math.floor(notifyAt.getTime() / 1000),
  });

  return messageId;
}

export async function scheduleRespawnNotification(
  boss: string,
  notifyAt: Date | null,
  previousMessageId: string | null,
): Promise<string | null> {
  return scheduleQstashNotification(
    `${getBaseUrl()}/api/notify-respawn`,
    { boss },
    notifyAt,
    previousMessageId,
  );
}

export async function scheduleMissedRespawnNotification(
  boss: string,
  killTimeIso: string,
  notifyAt: Date | null,
  previousMessageId: string | null,
): Promise<string | null> {
  return scheduleQstashNotification(
    `${getBaseUrl()}/api/notify-respawn-missed`,
    { boss, killTimeIso },
    notifyAt,
    previousMessageId,
  );
}
