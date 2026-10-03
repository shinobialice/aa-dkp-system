"use server";

import type { GuildMode } from "@/shared/config/guildStatus";
import { getStatsForPeriod, type GuildPvpStats } from "./guildPvpStats";
import {
  getPeriodAttendanceTop,
  type PeriodAttendanceResult,
} from "./warAttendance";
import {
  getPeriodFinanceSummary,
  getPeriodTopBuyers,
  getPeriodTopDrops,
  getPeriodTopIncomeSources,
  getPeriodTopSales,
  type WarEconomySnapshot,
} from "./warEconomy";
import {
  getPeriodMembershipChanges,
  type PeriodMembershipChanges,
} from "./warMembership";

export type WarPeriodSnapshot = {
  attendance: PeriodAttendanceResult;
  membership: PeriodMembershipChanges;
  economy: WarEconomySnapshot | null;
  pvpStats: GuildPvpStats | null;
};

// Экономика (доход, продажи, источники дохода, дроп) имеет смысл только на
// фришке, а килы/хонор — только на варе. Состав гильдии (пришли/ушли) от
// режима не зависит и считается всегда.
export async function getWarPeriodSnapshot(
  startedAt: string,
  endedAt: string | null,
  mode: GuildMode,
): Promise<WarPeriodSnapshot> {
  const isWar = mode === "pvp";
  const [attendance, membership, economy, pvpStats] = await Promise.all([
    getPeriodAttendanceTop(startedAt, endedAt, mode),
    getPeriodMembershipChanges(startedAt, endedAt),
    isWar ? null : getWarEconomy(startedAt, endedAt),
    isWar ? getStatsForPeriod(startedAt, endedAt) : null,
  ]);
  return { attendance, membership, economy, pvpStats };
}

async function getWarEconomy(
  startedAt: string,
  endedAt: string | null,
): Promise<WarEconomySnapshot> {
  const [finance, topSales, topBuyers, incomeSources, drops] =
    await Promise.all([
      getPeriodFinanceSummary(startedAt, endedAt),
      getPeriodTopSales(startedAt, endedAt),
      getPeriodTopBuyers(startedAt, endedAt),
      getPeriodTopIncomeSources(startedAt, endedAt),
      getPeriodTopDrops(startedAt, endedAt),
    ]);
  return { finance, topSales, topBuyers, incomeSources, drops };
}
