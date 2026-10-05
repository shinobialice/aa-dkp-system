import "server-only";
import sql from "@/shared/lib/db";
import { LIVE_TOPICS, type LiveTopic } from "@/shared/config/liveTopics";

type Listener = (topics: string[]) => void;

const CHANNEL = "live_changes";
const BATCH_MS = 300;

const listeners = new Set<Listener>();
const pendingTopics = new Set<string>();
let flushTimer: ReturnType<typeof setTimeout> | null = null;
let listenRequest: Promise<unknown> | null = null;
let hasListened = false;

export async function publishChanges(...topics: LiveTopic[]) {
  try {
    await sql.notify(CHANNEL, topics.join(","));
  } catch (error) {
    console.error("Не удалось разослать обновление по темам:", topics, error);
  }
}

export function subscribeToChanges(listener: Listener) {
  listeners.add(listener);
  listenRequest ??= startListening();
  return () => {
    listeners.delete(listener);
  };
}

function startListening() {
  return sql
    .listen(CHANNEL, queueTopics, handleListen)
    .catch((error: unknown) => {
      console.error("Не удалось подписаться на обновления:", error);
      listenRequest = null;
    });
}

// postgres.js переподключает LISTEN сам, но уведомления за время обрыва
// теряются — после повторной подписки считаем, что изменилось всё.
function handleListen() {
  if (hasListened) queueTopics(LIVE_TOPICS.join(","));
  hasListened = true;
}

function queueTopics(payload: string) {
  for (const topic of payload.split(",")) pendingTopics.add(topic);
  flushTimer ??= setTimeout(flush, BATCH_MS);
}

function flush() {
  const topics = [...pendingTopics];
  pendingTopics.clear();
  flushTimer = null;
  for (const listener of listeners) listener(topics);
}
