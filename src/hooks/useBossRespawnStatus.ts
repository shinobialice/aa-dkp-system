"use client";

import { getBossRespawnStatus } from "@/actions/getBossRespawnStatus";
import { bosses, isBossName, type BossName } from "@/shared/config/bossRespawn";
import { createLiveStore } from "./createLiveStore";

export type BossRespawnState = {
  lastKill: string | null;
  updatedAt: string | null;
  markedBy: string | null;
};

export type BossRespawnStates = Record<BossName, BossRespawnState>;

const EMPTY_STATE: BossRespawnState = {
  lastKill: null,
  updatedAt: null,
  markedBy: null,
};

const respawnStore = createLiveStore<BossRespawnStates | null>(
  async () => {
    const rows = await getBossRespawnStatus([...bosses]);
    const states = Object.fromEntries(
      bosses.map((boss) => [boss, EMPTY_STATE]),
    ) as BossRespawnStates;
    for (const row of rows) {
      if (!isBossName(row.boss_name)) continue;
      states[row.boss_name] = {
        lastKill: row.last_kill,
        updatedAt: row.updated_at,
        markedBy: row.marked_by,
      };
    }
    return states;
  },
  ["respawn"],
  null,
);

export const useBossRespawnStatus = respawnStore.use;
export const refreshBossRespawnStatus = respawnStore.refresh;
