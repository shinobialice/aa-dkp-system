"use client";

import { useMemo } from "react";
import { bosses } from "@/shared/config/bossRespawn";
import {
  upcomingEvents,
  type LastKills,
  type UpcomingEvent,
} from "@/shared/lib/upcomingEvents";
import { useBossRespawnStatus } from "./useBossRespawnStatus";
import { useClock } from "./useClock";
import { useMaintenanceWindows } from "./useMaintenanceWindows";

const CLOCK_TICK_MS = 10_000;

export function useUpcomingEvents(): UpcomingEvent[] {
  const respawn = useBossRespawnStatus();
  const maintenanceWindows = useMaintenanceWindows();
  const now = useClock(CLOCK_TICK_MS);

  return useMemo(() => {
    if (now === null) return [];
    const lastKills = Object.fromEntries(
      bosses.map((boss) => [boss, respawn?.[boss].lastKill ?? null]),
    ) as LastKills;
    return upcomingEvents(new Date(now), lastKills, maintenanceWindows);
  }, [now, respawn, maintenanceWindows]);
}
