"use client";

import { useCallback, useSyncExternalStore } from "react";

export function useClock(
  granularityMs: number,
  pollMs: number = granularityMs,
): number | null {
  const subscribe = useCallback(
    (onTick: () => void) => {
      const timer = setInterval(onTick, pollMs);
      return () => clearInterval(timer);
    },
    [pollMs],
  );

  return useSyncExternalStore(
    subscribe,
    () => Math.floor(Date.now() / granularityMs) * granularityMs,
    () => null,
  );
}
