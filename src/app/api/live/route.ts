import { subscribeToChanges } from "@/server/liveChanges";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const PING_MS = 25_000;
const RETRY_MS = 5_000;

export function GET(request: Request) {
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

      const unsubscribe = subscribeToChanges((topics) =>
        send(`data: ${topics.join(",")}\n\n`),
      );
      const ping = setInterval(() => send(": ping\n\n"), PING_MS);
      stop = () => {
        clearInterval(ping);
        unsubscribe();
      };

      request.signal.addEventListener("abort", stop);
      send(`retry: ${RETRY_MS}\n\n`);
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
