import {
  getFixedTimesForBoss,
  getTakenAglTimesForDate,
} from "@/actions/getBossSchedule";
import {
  getMoscowISOString,
  parseMoscowISOString,
} from "@/utils/getMoscowISOString";
import { LOCKED_SINGLE_TIME_PRIME_BOSSES } from "@/utils/lockedBosses";

export type ScheduleMode =
  | "free"
  | "locked-single"
  | "agl-slots"
  | "cat-toggle";

export type BossSchedule = {
  times: string[];
  takenTimes: string[];
};

export function scheduleMode(
  category: string | null,
  selectedBoss: string | null,
): ScheduleMode {
  if (
    category === "Прайм" &&
    selectedBoss &&
    LOCKED_SINGLE_TIME_PRIME_BOSSES.includes(selectedBoss)
  ) {
    return "locked-single";
  }
  if (category === "АГЛ" && selectedBoss === "АГЛ") return "agl-slots";
  if (category === "АГЛ" && selectedBoss === "Кошка") return "cat-toggle";
  return "free";
}

export function combineDateAndTime(dateOnly: Date, hhmm: string): Date {
  const dayIso = getMoscowISOString(dateOnly).slice(0, 10);
  return parseMoscowISOString(`${dayIso}T${hhmm}:00`);
}

export async function loadBossSchedule(
  mode: ScheduleMode,
  bossName: string,
  weekday: string,
  date: Date,
): Promise<BossSchedule> {
  const times = await getFixedTimesForBoss(bossName, weekday);
  const takenTimes =
    mode === "agl-slots" ? await getTakenAglTimesForDate(date) : [];
  return { times, takenTimes };
}

export function availableTimes(mode: ScheduleMode, schedule: BossSchedule) {
  if (mode !== "agl-slots") return schedule.times;
  return schedule.times.filter((time) => !schedule.takenTimes.includes(time));
}
