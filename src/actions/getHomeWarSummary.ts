"use server";

import { getSessionUserId } from "./getSessionUserId";
import { getStatsForPeriod } from "./guildPvpStats";
import { getGuildStatus } from "./guildStatusSettings";

const TOP_SIZE = 3;

export type HomeWarSummary = NonNullable<
  Awaited<ReturnType<typeof getHomeWarSummary>>
>;

export async function getHomeWarSummary() {
  const status = await getGuildStatus();
  if (status.mode !== "pvp" || !status.startedAt) return null;

  const [stats, userId] = await Promise.all([
    getStatsForPeriod(status.startedAt),
    getSessionUserId(),
  ]);
  const myIndex = stats.players.findIndex((player) => player.userId === userId);

  return {
    startedAt: status.startedAt,
    totalKills: stats.totalKills,
    totalHonor: stats.totalHonor,
    fightersCount: stats.players.length,
    top: stats.players.slice(0, TOP_SIZE),
    me:
      myIndex === -1 ? null : { ...stats.players[myIndex], place: myIndex + 1 },
  };
}
