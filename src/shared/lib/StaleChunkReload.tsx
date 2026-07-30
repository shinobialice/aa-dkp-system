"use client";

import { useEffect } from "react";

// После деплоя у вкладки, открытой ещё со старой версии сайта, может
// остаться смесь старых и новых JS-чанков. React Context тогда ломается
// между модулями (например, react-day-picker падает с "useDayPicker()
// must be used within a custom component"), как и обычные динамические
// импорты ("Loading chunk N failed"). Лечится обычным reload — делаем это
// автоматически один раз, вместо того чтобы человек упирался в белый экран.
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

export function StaleChunkReload() {
  useEffect(() => {
    const onError = (event: ErrorEvent) => {
      if (isStaleChunkError(event.message, event.error?.name)) {
        reloadOnce();
      }
    };
    const onRejection = (event: PromiseRejectionEvent) => {
      const reason = event.reason;
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

  return null;
}
