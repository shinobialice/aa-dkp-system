"use client";

import { useEffect } from "react";
import supabase from "@/shared/lib/supabase";
import { getRealtimeAuthToken } from "@/actions/getRealtimeAuthToken";

// JWT для приватных realtime-каналов живёт 1 час на сервере (см.
// getRealtimeAuthToken.ts) — обновляем заметно чаще, чтобы не словить
// протухший токен, даже если вкладка долго провисела свёрнутой.
const REFRESH_INTERVAL_MS = 45 * 60 * 1000;

let resolveReady: () => void;
// Разрешается один раз, как только первая попытка авторизации завершилась
// (успешно или нет). useBroadcastPing дожидается этого перед .subscribe()
// на приватный канал — иначе join может уйти раньше, чем applied setAuth(),
// и Realtime закроет канал с CHANNEL_ERROR из-за RLS на realtime.messages.
export const realtimeAuthReady = new Promise<void>((resolve) => {
  resolveReady = resolve;
});

export function useRealtimeAuth() {
  useEffect(() => {
    let cancelled = false;

    const refresh = async () => {
      try {
        const token = await getRealtimeAuthToken();
        if (!cancelled && token) await supabase.realtime.setAuth(token);
      } finally {
        resolveReady();
      }
    };

    refresh();
    const interval = setInterval(refresh, REFRESH_INTERVAL_MS);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);
}
