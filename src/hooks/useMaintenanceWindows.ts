"use client";

import { getMaintenanceWindows } from "@/actions/maintenanceWindows";
import type { MaintenanceWindow } from "@/shared/config/bossRespawn";
import { createPolledStore } from "./createPolledStore";

const POLL_INTERVAL_MS = 30_000;

const maintenanceStore = createPolledStore<MaintenanceWindow[]>(
  async () => {
    const rows = await getMaintenanceWindows();
    return rows.map((row) => ({ startAt: row.startAt, endAt: row.endAt }));
  },
  POLL_INTERVAL_MS,
  [],
);

export const useMaintenanceWindows = maintenanceStore.use;
