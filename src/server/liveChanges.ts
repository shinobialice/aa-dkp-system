import "server-only";
import sql from "@/shared/lib/db";
import { LIVE_TOPICS, type LiveTopic } from "@/shared/config/liveTopics";

export type LiveEvent = { id: string; topics: string[] };

type Listener = (event: LiveEvent) => void;

const CHANNEL = "live_changes";
const BATCH_MS = 300;
const HISTORY_SIZE = 200;
const BOOT_ID = Date.now().toString(36);

const listeners = new Set<Listener>();
const pendingTopics = new Set<string>();
const recentEvents: { seq: number; topics: string[] }[] = [];
let lastSeq = 0;
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

export function getLastEventId() {
  return `${BOOT_ID}-${lastSeq}`;
}

// Номер события из другого запуска сервера или слишком старый — значит,
// вкладка могла пропустить что угодно.
export function getMissedTopics(lastEventId: string): string[] {
  const [bootId, seqText] = lastEventId.split("-");
  const seq = Number(seqText);
  const oldestSeq = recentEvents[0]?.seq ?? lastSeq + 1;
  if (bootId !== BOOT_ID || !Number.isInteger(seq) || seq < oldestSeq - 1) {
    return [...LIVE_TOPICS];
  }

  const topics = new Set<string>();
  for (const event of recentEvents) {
    if (event.seq > seq) event.topics.forEach((topic) => topics.add(topic));
  }
  return [...topics];
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

  lastSeq += 1;
  recentEvents.push({ seq: lastSeq, topics });
  if (recentEvents.length > HISTORY_SIZE) recentEvents.shift();

  const event = { id: getLastEventId(), topics };
  for (const listener of listeners) listener(event);
}
