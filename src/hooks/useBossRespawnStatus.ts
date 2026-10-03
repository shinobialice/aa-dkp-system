"use client";

import { getBossRespawnStatus } from "@/actions/getBossRespawnStatus";
import { bosses, isBossName, type BossName } from "@/shared/config/bossRespawn";
import { createPolledStore } from "./createPolledStore";

const POLL_INTERVAL_MS = 15_000;

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

const respawnStore = createPolledStore<BossRespawnStates | null>(
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
  POLL_INTERVAL_MS,
  null,
);

export const useBossRespawnStatus = respawnStore.use;
export const refreshBossRespawnStatus = respawnStore.refresh;
