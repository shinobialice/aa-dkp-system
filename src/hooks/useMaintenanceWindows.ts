"use client";

import { getMaintenanceWindows } from "@/actions/maintenanceWindows";
import type { MaintenanceWindow } from "@/shared/config/bossRespawn";
import { createLiveStore } from "./createLiveStore";

const maintenanceStore = createLiveStore<MaintenanceWindow[]>(
  async () => {
    const rows = await getMaintenanceWindows();
    return rows.map((row) => ({ startAt: row.startAt, endAt: row.endAt }));
  },
  ["maintenance"],
  [],
);

export const useMaintenanceWindows = maintenanceStore.use;
