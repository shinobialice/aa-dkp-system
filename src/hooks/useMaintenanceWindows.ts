"use client";

import { useEffect, useState } from "react";
import type { MaintenanceWindow } from "@/shared/config/bossRespawn";
import { getMaintenanceWindows } from "@/actions/maintenanceWindows";

// Module-level store shared by every consumer of this hook. Несколько
// компонентов (RespawnTracker, useUpcomingEvents) рендерятся одновременно —
// вместо realtime-подписки (была у Supabase, self-hosted Postgres такого не
// даёт) держим один общий поллинг на всех потребителей, чтобы не плодить
// лишние запросы.
let windows: MaintenanceWindow[] = [];
const listeners = new Set<(windows: MaintenanceWindow[]) => void>();
let pollTimer: ReturnType<typeof setInterval> | null = null;

async function fetchWindows() {
  try {
    const rows = await getMaintenanceWindows();
    windows = rows.map((row) => ({ startAt: row.startAt, endAt: row.endAt }));
    listeners.forEach((listener) => listener(windows));
  } catch {
    // сеть могла моргнуть — оставляем прежнее состояние, попробуем на
    // следующем тике поллинга
  }
}

function subscribe(listener: (windows: MaintenanceWindow[]) => void): () => void {
  listeners.add(listener);

  if (!pollTimer) {
    fetchWindows();
    pollTimer = setInterval(fetchWindows, 30_000);
  } else {
    // Поллинг уже идёт: отдаём новому подписчику последний известный снимок,
    // не дожидаясь следующего тика.
    listener(windows);
  }

  return () => {
    listeners.delete(listener);
    if (listeners.size === 0 && pollTimer) {
      clearInterval(pollTimer);
      pollTimer = null;
    }
  };
}

export function useMaintenanceWindows(): MaintenanceWindow[] {
  const [state, setState] = useState<MaintenanceWindow[]>(windows);

  useEffect(() => subscribe(setState), []);

  return state;
}
