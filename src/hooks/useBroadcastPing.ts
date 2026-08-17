"use client";

import { useEffect, useRef } from "react";
import type { RealtimeChannel } from "@supabase/supabase-js";
import supabase from "@/shared/lib/supabase";
import { realtimeAuthReady } from "./useRealtimeAuth";
import { useVisiblePolling } from "./useVisiblePolling";

// Если broadcast-пинг из БД не дошёл (опечатка в RLS/триггере на стороне
// Supabase, оборвавшееся соединение) — данные не должны зависнуть надолго,
// поэтому держим редкий поллинг как страховку.
const SAFETY_NET_MS = 4 * 60 * 1000;

// Один канал на topic, общий для всех подписчиков (тот же паттерн, что и в
// useMaintenanceWindows.ts) — например LootTable и ExpenseTable оба слушают
// "loot-changes", не открываем два одинаковых сокет-подключения.
const listenersByTopic = new Map<string, Set<() => void>>();
const channelsByTopic = new Map<string, RealtimeChannel>();
const pendingTopics = new Set<string>();

async function ensureChannel(topic: string) {
  pendingTopics.add(topic);
  try {
    // Приватный канал не авторизуется, пока supabase.realtime.setAuth() не
    // отработал хотя бы раз (см. useRealtimeAuth) — иначе join уходит без
    // access_token, и Realtime сразу закрывает канал с CHANNEL_ERROR.
    await realtimeAuthReady;
    if (channelsByTopic.has(topic)) return;
    if (!listenersByTopic.get(topic)?.size) return; // все отписались, пока ждали

    const channel = supabase
      .channel(topic, { config: { private: true } })
      .on("broadcast", { event: "change" }, () => {
        listenersByTopic.get(topic)?.forEach((listener) => listener());
      })
      .subscribe();
    channelsByTopic.set(topic, channel);
  } finally {
    pendingTopics.delete(topic);
  }
}

function subscribe(topic: string, listener: () => void): () => void {
  let listeners = listenersByTopic.get(topic);
  if (!listeners) {
    listeners = new Set();
    listenersByTopic.set(topic, listeners);
  }
  listeners.add(listener);

  if (!channelsByTopic.has(topic) && !pendingTopics.has(topic)) {
    ensureChannel(topic);
  }

  return () => {
    listeners!.delete(listener);
    if (listeners!.size === 0) {
      listenersByTopic.delete(topic);
      const channel = channelsByTopic.get(topic);
      if (channel) {
        supabase.removeChannel(channel);
        channelsByTopic.delete(topic);
      }
    }
  };
}

/**
 * Подписывается на приватный broadcast-топик (см.
 * supabase-realtime-broadcast.sql) и вызывает refetch на каждый пинг
 * "в таблице что-то изменилось". Сам broadcast не несёт данных — refetch
 * должен читать через уже существующий, отдельно защищённый server action.
 * Плюс держит редкий поллинг как страховку на случай, если пинг не дошёл.
 */
export function useBroadcastPing(topic: string, refetch: () => void) {
  const refetchRef = useRef(refetch);
  useEffect(() => {
    refetchRef.current = refetch;
  });

  useEffect(() => subscribe(topic, () => refetchRef.current()), [topic]);

  useVisiblePolling(refetch, SAFETY_NET_MS);
}
