"use client";

import { useSyncExternalStore } from "react";

// Один общий поллинг на всех подписчиков: self-hosted Postgres не даёт
// realtime-подписок, а несколько компонентов читают одни и те же данные
// одновременно — без общего стора каждый плодил бы свои запросы.
export function createPolledStore<T>(
  fetchValue: (current: T) => Promise<T>,
  intervalMs: number,
  initial: T,
) {
  let value = initial;
  const listeners = new Set<() => void>();
  let timer: ReturnType<typeof setInterval> | null = null;

  const refresh = async () => {
    try {
      value = await fetchValue(value);
      listeners.forEach((listener) => listener());
    } catch (error) {
      console.error(
        "Не удалось обновить данные, оставлен прежний снимок:",
        error,
      );
    }
  };

  const subscribe = (onChange: () => void) => {
    listeners.add(onChange);
    if (!timer) {
      refresh();
      timer = setInterval(refresh, intervalMs);
    }
    return () => {
      listeners.delete(onChange);
      if (listeners.size === 0 && timer) {
        clearInterval(timer);
        timer = null;
      }
    };
  };

  const getSnapshot = () => value;
  const getServerSnapshot = () => initial;

  const use = () =>
    useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  return { use, refresh };
}
