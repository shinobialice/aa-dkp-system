"use client";

import { useEffect, useRef } from "react";

export function useVisiblePolling(callback: () => void, intervalMs: number) {
  const savedCallback = useRef(callback);
  useEffect(() => {
    savedCallback.current = callback;
  });

  useEffect(() => {
    const interval = setInterval(() => {
      if (document.hidden) return;
      savedCallback.current();
    }, intervalMs);
    return () => clearInterval(interval);
  }, [intervalMs]);
}
