import "server-only";
import type {
  MissingActivityOverridesRow,
  WeekScheduleEventRow,
} from "@/shared/lib/dbTypes";
import { getMoscowISOString } from "@/utils/getMoscowISOString";
import {
  WEEKDAY_NAMES,
  findMissingTimes,
  groupBy,
  pad,
  pushTo,
  requiredTimesByBoss,
  toDateLabel,
} from "./slotMatching";

export type MissingSlot = {
  date: string;
  rawDate: string;
  time: string;
  bossName: string;
  isManual: boolean;
  overrideId?: number;
};

export type MissingActivities = {
  hasDeficit: boolean;
  missingSlots: MissingSlot[];
};

export type MonthRaid = {
  start: string;
  type: string | null;
  bosses: string[];
};

export type ScheduleRow = Pick<
  WeekScheduleEventRow,
  "weekday" | "time" | "boss_name"
>;

export type OverrideRow = Pick<
  MissingActivityOverridesRow,
  "id" | "activity_date" | "time" | "boss_name" | "kind"
>;

export type MissingActivitiesInput = {
  year: number;
  month: number;
  lastDay: number;
  raids: MonthRaid[];
  schedule: ScheduleRow[];
  morphKillTimes: string[];
  overrides: OverrideRow[];
};

const AGL_BOSS_KEYS: Record<string, string | null> = {
  Кошка: "Кошка",
  Морф: "Морф",
  "Марли Прок": null,
};

export function computeMissingActivities(
  input: MissingActivitiesInput,
): MissingActivities {
  const { dismissedKeys, manualSlots } = collectOverrides(input.overrides);
  const actualTimes = collectActualTimes(input.raids);
  const morphTimes = collectMorphTimes(input.morphKillTimes);
  const scheduleByWeekday = groupBy(input.schedule, (row) => row.weekday);

  const missingSlots: MissingSlot[] = [];
  for (let day = 1; day <= input.lastDay; day++) {
    const datePart = `${input.year}-${pad(input.month)}-${pad(day)}`;
    const weekday =
      WEEKDAY_NAMES[
        new Date(Date.UTC(input.year, input.month - 1, day)).getUTCDay()
      ];
    const required = requiredTimesByBoss(
      scheduleByWeekday.get(weekday) ?? [],
      weekday,
    );
    const requiredMorph = morphTimes.get(datePart) ?? [];
    if (requiredMorph.length > 0) {
      required.set("Морф", [...(required.get("Морф") ?? []), ...requiredMorph]);
    }

    for (const [bossName, times] of required) {
      const actual = actualTimes.get(`${datePart}|${bossName}`) ?? [];
      const missing = findMissingTimes(times.sort(), actual).filter(
        (time) => !dismissedKeys.has(`${datePart}|${time}|${bossName}`),
      );
      missingSlots.push(
        ...missing.map((time) => ({
          date: toDateLabel(datePart),
          rawDate: datePart,
          time,
          bossName,
          isManual: false,
        })),
      );
    }
  }

  missingSlots.push(...manualSlots);
  missingSlots.sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));

  return { hasDeficit: missingSlots.length > 0, missingSlots };
}

function collectOverrides(rows: OverrideRow[]) {
  const dismissedKeys = new Set<string>();
  const manualSlots: MissingSlot[] = [];
  for (const row of rows) {
    const time = row.time.slice(0, 5);
    if (row.kind === "dismiss") {
      dismissedKeys.add(`${row.activity_date}|${time}|${row.boss_name}`);
    } else if (row.kind === "manual") {
      manualSlots.push({
        date: toDateLabel(row.activity_date),
        rawDate: row.activity_date,
        time,
        bossName: row.boss_name,
        isManual: true,
        overrideId: row.id,
      });
    }
  }
  return { dismissedKeys, manualSlots };
}

// У Морфа нет расписания: рейд нужен тогда, когда его отметили убитым в
// трекере респавна и отметку ещё не отклонили.
function collectMorphTimes(killTimes: string[]) {
  const byDate = new Map<string, string[]>();
  for (const killTime of killTimes) {
    const moscow = getMoscowISOString(new Date(killTime));
    pushTo(byDate, moscow.slice(0, 10), moscow.slice(11, 16));
  }
  return byDate;
}

function collectActualTimes(raids: MonthRaid[]) {
  const byKey = new Map<string, string[]>();
  for (const raid of raids) {
    const [datePart, timePart] = raid.start.split("T");
    const time = timePart.slice(0, 5);
    for (const bossKey of actualBossKeys(raid)) {
      pushTo(byKey, `${datePart}|${bossKey}`, time);
    }
  }
  for (const times of byKey.values()) times.sort();
  return byKey;
}

function actualBossKeys(raid: MonthRaid): string[] {
  if (raid.type === "Прайм") return raid.bosses;
  if (raid.type !== "АГЛ") return [];
  if (raid.bosses.length === 0) return ["АГЛ"];
  return raid.bosses.flatMap((name) => {
    const key = name in AGL_BOSS_KEYS ? AGL_BOSS_KEYS[name] : "АГЛ";
    return key ? [key] : [];
  });
}
