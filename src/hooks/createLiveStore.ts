"use client";

import { useSyncExternalStore } from "react";
import type { LiveTopic } from "@/shared/config/liveTopics";
import { subscribeToLiveChanges } from "./useLiveChanges";

// Один общий стор на всех подписчиков: несколько компонентов читают одни и
// те же данные одновременно — без него каждый плодил бы свои запросы.
export function createLiveStore<T>(
  fetchValue: (current: T) => Promise<T>,
  topics: readonly LiveTopic[],
  initial: T,
) {
  let value = initial;
  const listeners = new Set<() => void>();
  let unsubscribeLive: (() => void) | null = null;

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
    if (!unsubscribeLive) {
      refresh();
      unsubscribeLive = subscribeToLiveChanges(topics, refresh);
    }
    return () => {
      listeners.delete(onChange);
      if (listeners.size === 0 && unsubscribeLive) {
        unsubscribeLive();
        unsubscribeLive = null;
      }
    };
  };

  const getSnapshot = () => value;
  const getServerSnapshot = () => initial;

  const use = () =>
    useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  return { use, refresh };
}
