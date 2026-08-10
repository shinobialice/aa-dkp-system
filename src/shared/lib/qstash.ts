import "server-only";
import { Client } from "@upstash/qstash";
import { getBaseUrl } from "./getBaseUrl";

const qstash = new Client({
  baseUrl: process.env.QSTASH_URL!,
  token: process.env.QSTASH_TOKEN!,
});

export async function scheduleRespawnNotification(
  boss: string,
  notifyAt: Date | null,
  previousMessageId: string | null,
): Promise<string | null> {
  if (previousMessageId) {
    try {
      await qstash.messages.delete(previousMessageId);
    } catch {
      // сообщение уже доставлено или истекло — отменять нечего
    }
  }

  if (!notifyAt || notifyAt.getTime() <= Date.now()) return null;

  const { messageId } = await qstash.publishJSON({
    url: `${getBaseUrl()}/api/notify-respawn`,
    body: { boss },
    notBefore: Math.floor(notifyAt.getTime() / 1000),
  });

  return messageId;
}
