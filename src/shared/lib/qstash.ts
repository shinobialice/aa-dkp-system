import "server-only";
import { Client } from "@upstash/qstash";

const qstash = new Client({
  baseUrl: process.env.QSTASH_URL!,
  token: process.env.QSTASH_TOKEN!,
});

export async function scheduleRespawnNotification(
  boss: string,
  notifyAt: Date,
  previousMessageId: string | null,
): Promise<string | null> {
  if (previousMessageId) {
    try {
      await qstash.messages.delete(previousMessageId);
    } catch {
      // сообщение уже доставлено или истекло — отменять нечего
    }
  }

  if (notifyAt.getTime() <= Date.now()) return null;

  const { messageId } = await qstash.publishJSON({
    url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/notify-respawn`,
    body: { boss },
    notBefore: Math.floor(notifyAt.getTime() / 1000),
  });

  return messageId;
}
