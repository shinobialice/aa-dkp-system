import type {
  UserKillcountDay,
  UserKillcountRecord,
} from "@/actions/getUserKillcountHistory";
import { plural } from "@/shared/lib/format";
import type { KillCountWar } from "@/widgets/killcount/types";
import {
  ALL_DAYS,
  shortDate,
  warTitle,
} from "@/widgets/killcount/ui/killcountModel";

export type PlayedDay = UserKillcountDay & { mine: UserKillcountRecord };

export type KillcountChartPoint = {
  date: string;
  label: string;
  kills: number | null;
  guildAvgKills: number;
  place: number | null;
  players: number;
};

export function warOptions(wars: KillCountWar[]) {
  return [
    ...wars.map((war) => ({ value: war.id, label: warLabel(war) })),
    { value: ALL_DAYS, label: "За всё время" },
  ];
}

export function daysOfWar(days: UserKillcountDay[], warId: string) {
  if (warId === ALL_DAYS) return days;
  return days.filter((day) => day.warId === warId);
}

export function playedDays(days: UserKillcountDay[]) {
  return days.filter((day): day is PlayedDay => day.mine !== null);
}

export function participationText(played: number, total: number) {
  if (total === 0) return "Киллкаунт за этот период ещё не добавляли";
  return `В киллкаунте ${played} из ${total} ${plural(total, "дня", "дней", "дней")}`;
}

export function killcountSummary(played: PlayedDay[]) {
  const kills = sumBy(played, (day) => day.mine.kills);
  const honor = sumBy(played, (day) => day.mine.honor);
  const guildKills = sumBy(played, (day) => day.guildAvgKills);
  const best = played.reduce<PlayedDay | null>(
    (top, day) => (top && top.mine.kills >= day.mine.kills ? top : day),
    null,
  );

  return {
    kills,
    honor,
    avgKills: average(kills, played.length),
    avgHonor: average(honor, played.length),
    guildAvgKills: average(guildKills, played.length),
    best,
  };
}

export function chartPoints(days: UserKillcountDay[]): KillcountChartPoint[] {
  return [...days].reverse().map((day) => ({
    date: day.date,
    label: shortDate(day.date),
    kills: day.mine?.kills ?? null,
    guildAvgKills: day.guildAvgKills,
    place: day.mine?.place ?? null,
    players: day.players,
  }));
}

export function maxKills(played: PlayedDay[]) {
  return Math.max(0, ...played.map((day) => day.mine.kills));
}

export function placeTone(place: number) {
  if (place === 1) return "text-amber-500";
  if (place <= 3) return "text-foreground";
  return "text-muted-foreground";
}

function warLabel(war: KillCountWar) {
  if (!war.endedAt) return `${warTitle(war)} · сейчас`;
  return `${warTitle(war)} · ${shortDate(war.startedAt)}–${shortDate(war.endedAt)}`;
}

function sumBy(days: PlayedDay[], value: (day: PlayedDay) => number) {
  return days.reduce((sum, day) => sum + value(day), 0);
}

function average(total: number, count: number) {
  return count > 0 ? Math.round(total / count) : 0;
}
