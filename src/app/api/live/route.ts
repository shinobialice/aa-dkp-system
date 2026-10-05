import {
  getLastEventId,
  getMissedTopics,
  subscribeToChanges,
  type LiveEvent,
} from "@/server/liveChanges";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const PING_MS = 25_000;
const RETRY_MS = 5_000;

export function GET(request: Request) {
  const lastEventId =
    request.headers.get("last-event-id") ??
    new URL(request.url).searchParams.get("lastEventId");
  const encoder = new TextEncoder();
  let stop = () => {};

  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      const send = (chunk: string) => {
        try {
          controller.enqueue(encoder.encode(chunk));
        } catch {
          stop();
        }
      };
      const sendEvent = ({ id, topics }: LiveEvent) =>
        send(`id: ${id}\ndata: ${topics.join(",")}\n\n`);

      const unsubscribe = subscribeToChanges(sendEvent);
      const ping = setInterval(() => send(": ping\n\n"), PING_MS);
      stop = () => {
        clearInterval(ping);
        unsubscribe();
      };

      send(`retry: ${RETRY_MS}\n\n`);
      const missedTopics = lastEventId ? getMissedTopics(lastEventId) : [];
      if (missedTopics.length > 0) {
        sendEvent({ id: getLastEventId(), topics: missedTopics });
      } else {
        send(`event: hello\nid: ${getLastEventId()}\ndata: ok\n\n`);
      }
    },
    cancel() {
      stop();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      "X-Accel-Buffering": "no",
    },
  });
}
