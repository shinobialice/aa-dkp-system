"use client";

import { useEffect, useRef } from "react";

// Как setInterval, но не вызывает callback, пока вкладка находится в фоне —
// пользователь всё равно не видит обновлений, а сервер продолжает получать
// вызовы за каждую открытую (и забытую) вкладку. При возврате на вкладку
// опрос просто продолжается по расписанию; если нужен мгновенный рефреш при
// возврате — подписывайтесь на visibilitychange отдельно (как FinanceClient).
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
