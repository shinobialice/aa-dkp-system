import type { PeriodAttendanceResult, RaidMark } from "@/actions/warAttendance";
import { getKillcountRank } from "@/shared/config/killcountRanks";
import { turnoutBucket, type Fighter } from "../warModel";

const STRIP_LIMIT = 40;

export type AttendanceSummary = ReturnType<typeof attendanceSummary>;

export function rankProgress(me: Fighter, fighters: Fighter[]) {
  const kills = me.kills ?? 0;
  const ranked = fighters
    .filter((fighter) => fighter.kills !== null)
    .sort((a, b) => (b.kills ?? 0) - (a.kills ?? 0));
  const place = ranked.findIndex((fighter) => fighter.userId === me.userId) + 1;
  const { current, next } = getKillcountRank(kills, place);
  const left = next ? next.minKills - kills : 0;
  const share = next
    ? (kills - current.minKills) / (next.minKills - current.minKills)
    : 1;
  return { current, next, place, rankedCount: ranked.length, left, share };
}

export function attendanceSummary(
  me: Fighter | undefined,
  attendance: PeriodAttendanceResult,
) {
  const total = attendance.totalRaidsInPeriod;
  const raids = me?.raids ?? 0;
  const share = total ? raids / total : 0;
  const sorted = [...attendance.top].sort(
    (a, b) => b.raidsAttended - a.raidsAttended,
  );
  const index = me
    ? sorted.findIndex((entry) => entry.userId === me.userId)
    : -1;
  return {
    raids,
    total,
    share,
    place: index === -1 ? null : index + 1,
    participants: attendance.participantsCount,
    bucket: turnoutBucket(share),
  };
}

export function stripMarks(marks: RaidMark[]) {
  return marks.slice(-STRIP_LIMIT);
}

export function isStripTrimmed(marks: RaidMark[]) {
  return marks.length > STRIP_LIMIT;
}

export function currentStreak(marks: RaidMark[]) {
  let streak = 0;
  for (let index = marks.length - 1; index >= 0; index--) {
    if (marks[index] === "missed") break;
    streak += 1;
  }
  return streak;
}

export function lateCount(marks: RaidMark[]) {
  return marks.filter((mark) => mark === "late").length;
}
