"use client";

import { useRealtimeAuth } from "@/hooks/useRealtimeAuth";

// Авторизует приватные realtime broadcast-каналы (useBroadcastPing) для
// текущей сессии. Рендерится один раз в layout, ничего не выводит — тот же
// паттерн, что и у HeartbeatTracker.
export function RealtimeAuthTracker() {
  useRealtimeAuth();
  return null;
}
