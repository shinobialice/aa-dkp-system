"use client";

import { useEffect, useState } from "react";
import supabase from "@/shared/lib/supabase";
import type { MaintenanceWindow } from "@/shared/config/bossRespawn";

export function useMaintenanceWindows(): MaintenanceWindow[] {
  const [windows, setWindows] = useState<MaintenanceWindow[]>([]);

  useEffect(() => {
    async function fetchWindows() {
      const { data } = await supabase
        .from("boss_maintenance_windows")
        .select("start_at,end_at")
        .gt("end_at", new Date().toISOString());
      if (data) {
        setWindows(
          data.map((row: { start_at: string; end_at: string }) => ({
            startAt: row.start_at,
            endAt: row.end_at,
          })),
        );
      }
    }
    fetchWindows();

    const channel = supabase
      .channel("boss_maintenance_windows-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "boss_maintenance_windows" },
        () => fetchWindows(),
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return windows;
}
