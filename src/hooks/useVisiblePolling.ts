"use client";

import { useEffect, useEffectEvent } from "react";

// Возврат на вкладку шлёт и visibilitychange, и focus — второй вызов лишний.
const MIN_GAP_MS = 1000;

export function useVisiblePolling(callback: () => void, intervalMs: number) {
  const tick = useEffectEvent(() => {
    if (!document.hidden) callback();
  });

  useEffect(() => {
    let lastRun = 0;
    const run = () => {
      const now = Date.now();
      if (now - lastRun < MIN_GAP_MS) return;
      lastRun = now;
      tick();
    };
    const interval = setInterval(run, intervalMs);
    document.addEventListener("visibilitychange", run);
    window.addEventListener("focus", run);
    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", run);
      window.removeEventListener("focus", run);
    };
  }, [intervalMs]);
}
