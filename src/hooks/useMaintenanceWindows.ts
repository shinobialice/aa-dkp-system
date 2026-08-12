"use client";

import { useEffect, useState } from "react";
import type { RealtimeChannel } from "@supabase/supabase-js";
import supabase from "@/shared/lib/supabase";
import type { MaintenanceWindow } from "@/shared/config/bossRespawn";

// Module-level store shared by every consumer of this hook. Several
// components (RespawnTracker, useUpcomingEvents) render at the same time and
// each used to open its own realtime channel under the same hardcoded name.
// Supabase's `.channel(topic)` returns the *existing* channel when the topic
// already exists, so the second caller's `.on()` landed on a channel that
// the first caller had already `.subscribe()`d, which Supabase rejects with
// "cannot add postgres_changes callbacks after subscribe()". Sharing one
// fetch + one channel across all consumers avoids the collision entirely
// (and avoids duplicate fetches/connections as a bonus).
let windows: MaintenanceWindow[] = [];
const listeners = new Set<(windows: MaintenanceWindow[]) => void>();
let channel: RealtimeChannel | null = null;

async function fetchWindows() {
  const { data } = await supabase
    .from("boss_maintenance_windows")
    .select("start_at,end_at")
    .gt("end_at", new Date().toISOString());
  if (data) {
    windows = data.map((row: { start_at: string; end_at: string }) => ({
      startAt: row.start_at,
      endAt: row.end_at,
    }));
    listeners.forEach((listener) => listener(windows));
  }
}

function subscribe(listener: (windows: MaintenanceWindow[]) => void): () => void {
  listeners.add(listener);

  if (!channel) {
    fetchWindows();
    channel = supabase
      .channel("boss_maintenance_windows-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "boss_maintenance_windows" },
        () => fetchWindows(),
      )
      .subscribe();
  } else {
    // A subscription already exists: hand the new listener the latest
    // known snapshot instead of waiting for the next change event.
    listener(windows);
  }

  return () => {
    listeners.delete(listener);
    if (listeners.size === 0 && channel) {
      supabase.removeChannel(channel);
      channel = null;
    }
  };
}

export function useMaintenanceWindows(): MaintenanceWindow[] {
  const [state, setState] = useState<MaintenanceWindow[]>(windows);

  useEffect(() => subscribe(setState), []);

  return state;
}
