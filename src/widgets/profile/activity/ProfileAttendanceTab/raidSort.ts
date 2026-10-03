import type { UserMonthlyRaid } from "@/actions/getUserMonthlyRaids";

export type SortKey = "startDate" | "dkp";

export type RaidSort = { key: SortKey; desc: boolean };

export function raidPoints(raid: UserMonthlyRaid): number {
  return raid.isLate ? raid.dkpSummary / 2 : raid.dkpSummary;
}

function raidTime(raid: UserMonthlyRaid) {
  return new Date(raid.startDate ?? 0).getTime();
}

export function sortRaids(raids: UserMonthlyRaid[], sort: RaidSort) {
  const sorted = [...raids].sort((a, b) =>
    sort.key === "dkp"
      ? raidPoints(a) - raidPoints(b)
      : raidTime(a) - raidTime(b),
  );
  return sort.desc ? sorted.reverse() : sorted;
}
