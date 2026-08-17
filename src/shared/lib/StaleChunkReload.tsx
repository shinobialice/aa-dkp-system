"use client";

import { useEffect } from "react";

const STALE_CHUNK_PATTERNS = [
  /Loading chunk [\d]+ failed/i,
  /Failed to fetch dynamically imported module/i,
  /must be used within a (custom component|provider)/i,
];

const RELOAD_FLAG_KEY = "stale-chunk-reload-at";
const RELOAD_COOLDOWN_MS = 10_000;

function isStaleChunkError(message?: string, name?: string): boolean {
  if (name === "ChunkLoadError") return true;
  if (!message) return false;
  return STALE_CHUNK_PATTERNS.some((pattern) => pattern.test(message));
}

function reloadOnce() {
  const lastReload = Number(sessionStorage.getItem(RELOAD_FLAG_KEY) ?? 0);
  if (Date.now() - lastReload < RELOAD_COOLDOWN_MS) return;
  sessionStorage.setItem(RELOAD_FLAG_KEY, String(Date.now()));
  window.location.reload();
}

const VERSION_CHECK_INTERVAL_MS = 3 * 60 * 1000;

async function checkVersionAndMaybeReload() {
  if (!document.hidden) return;
  try {
    const res = await fetch("/api/version", { cache: "no-store" });
    const data = await res.json();
    if (data.sha && data.sha !== process.env.NEXT_PUBLIC_BUILD_SHA) {
      reloadOnce();
    }
  } catch {
  }
}

// Ошибки из чужих расширений браузера (антивирусы, блокировщики рекламы и
// т.п.) — не наш баг и никогда им не станет, чинить нечего. Расширение,
// которое ловит и репортит эти ошибки, может залипнуть в цикл и засыпать
// сервер десятками одинаковых репортов в секунду — отсекаем их до отправки.
const EXTENSION_ORIGIN_PATTERN =
  /\b(chrome|moz|safari-web|edge)-extension:\/\//i;

function isFromBrowserExtension(...sources: (string | undefined)[]): boolean {
  return sources.some((s) => s && EXTENSION_ORIGIN_PATTERN.test(s));
}

const REPORT_DEDUPE_MS = 30_000;
const recentlyReported = new Map<string, number>();

function reportError(message: string, stack?: string) {
  if (isFromBrowserExtension(stack, message)) return;

  const key = `${message}\n${stack ?? ""}`;
  const now = Date.now();
  const lastReportedAt = recentlyReported.get(key);
  if (lastReportedAt && now - lastReportedAt < REPORT_DEDUPE_MS) return;
  recentlyReported.set(key, now);

  try {
    fetch("/api/log-client-error", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      keepalive: true,
      body: JSON.stringify({
        message,
        stack,
        url: window.location.href,
        userAgent: navigator.userAgent,
      }),
    }).catch(() => {});
  } catch {
  }
}

export function StaleChunkReload() {
  useEffect(() => {
    const onError = (event: ErrorEvent) => {
      if (isFromBrowserExtension(event.filename, event.error?.stack)) return;
      reportError(event.message, event.error?.stack);
      if (isStaleChunkError(event.message, event.error?.name)) {
        reloadOnce();
      }
    };
    const onRejection = (event: PromiseRejectionEvent) => {
      const reason = event.reason;
      reportError(reason?.message ?? String(reason), reason?.stack);
      if (isStaleChunkError(reason?.message, reason?.name)) {
        reloadOnce();
      }
    };

    window.addEventListener("error", onError);
    window.addEventListener("unhandledrejection", onRejection);
    return () => {
      window.removeEventListener("error", onError);
      window.removeEventListener("unhandledrejection", onRejection);
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(
      checkVersionAndMaybeReload,
      VERSION_CHECK_INTERVAL_MS,
    );
    const onVisibilityChange = () => {
      if (document.hidden) checkVersionAndMaybeReload();
    };
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, []);

  return null;
}
