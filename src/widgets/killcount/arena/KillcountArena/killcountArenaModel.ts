import type {
  AglItem,
  ArenaFighter,
  ArenaWindow,
  PrimeDay,
} from "@/server/killcountArena/types";
import { formatDuration, formatNumber, plural } from "@/shared/lib/format";
import { parseMoscowISOString } from "@/utils/getMoscowISOString";
import { honor, kills, type SortKey } from "../../ui/killcountModel";

export type ArenaKind = "prime" | "agl";

export type ScoreTile = {
  label: string;
  value: string;
  hint: string;
};

export const KIND_LABEL: Record<ArenaKind, string> = {
  prime: "Прайм",
  agl: "АГЛ",
};

const MINUTE_MS = 60_000;
const LATE_AFTER_MINUTES = 3;
const PLACE_TONES = ["text-[#e8b450]", "text-[#aab3c5]", "text-[#c98552]"];
const WEEKDAYS = [
  "воскресенье",
  "понедельник",
  "вторник",
  "среда",
  "четверг",
  "пятница",
  "суббота",
];

export function arenaHref(kind: ArenaKind, key: string | null) {
  if (key === null) return `/kill-counter/new?kind=${kind}`;
  const param = kind === "prime" ? "day" : "record";
  return `/kill-counter/new?kind=${kind}&${param}=${key}`;
}

export function timeOf(naive: string) {
  return naive.slice(11, 16);
}

export function weekdayLong(day: string) {
  return WEEKDAYS[parseMoscowISOString(`${day}T12:00:00`).getUTCDay()];
}

export function windowMinutes(window: ArenaWindow) {
  const span =
    parseMoscowISOString(window.endedAt).getTime() -
    parseMoscowISOString(window.startedAt).getTime();
  return Math.max(1, Math.round(span / MINUTE_MS));
}

export function windowText(window: ArenaWindow) {
  return `${timeOf(window.startedAt)} – ${timeOf(window.endedAt)} · ${formatDuration(windowMinutes(window))} · записал(а) ${window.scannedBy} сканером`;
}

export function lateStart(fighter: ArenaFighter, window: ArenaWindow | null) {
  if (!fighter.startAt || !window) return null;
  const delay =
    parseMoscowISOString(fighter.startAt).getTime() -
    parseMoscowISOString(window.startedAt).getTime();
  return delay > LATE_AFTER_MINUTES * MINUTE_MS
    ? timeOf(fighter.startAt)
    : null;
}

export function fightersText(count: number) {
  return `${count} ${plural(count, "боец", "бойца", "бойцов")}`;
}

export function killsWord(count: number) {
  return plural(count, "кил", "кила", "килов");
}

export function killsText(count: number) {
  return `${formatNumber(count)} ${killsWord(count)}`;
}

export function sortFighters(fighters: ArenaFighter[], sort: SortKey) {
  const secondary: SortKey = sort === "kills" ? "honor" : "kills";
  return [...fighters].sort(
    (a, b) =>
      metricOf(b, sort) - metricOf(a, sort) ||
      metricOf(b, secondary) - metricOf(a, secondary),
  );
}

export function totalKills(fighters: ArenaFighter[]) {
  return fighters.reduce((sum, fighter) => sum + kills(fighter), 0);
}

export function totalHonor(fighters: ArenaFighter[]) {
  return fighters.reduce((sum, fighter) => sum + honor(fighter), 0);
}

export function placeTone(place: number) {
  return PLACE_TONES[place - 1] ?? "text-muted-foreground";
}

export function metricOf(fighter: ArenaFighter, sort: SortKey) {
  return sort === "kills" ? kills(fighter) : honor(fighter);
}

export function otherMetricText(fighter: ArenaFighter, sort: SortKey) {
  return sort === "kills"
    ? `хонор ${formatNumber(honor(fighter))}`
    : `киллы ${kills(fighter)}`;
}

export function primeScores(days: PrimeDay[]): ScoreTile[] {
  const total = days.reduce((sum, day) => sum + day.totalKills, 0);
  const best = days.reduce<PrimeDay | null>(
    (top, day) => (top && top.totalKills >= day.totalKills ? top : day),
    null,
  );
  return [
    {
      label: "Киллы за всё время",
      value: formatNumber(total),
      hint: days.length
        ? `≈ ${formatNumber(Math.round(total / days.length))} за прайм`
        : "",
    },
    {
      label: "Праймов",
      value: String(days.length),
      hint: "с киллкаунтом",
    },
    {
      label: "Лучший прайм",
      value: best ? formatNumber(best.totalKills) : "—",
      hint: best ? dayLabel(best.day) : "",
    },
    {
      label: "Со сканера",
      value: String(days.filter((day) => day.window).length),
      hint: "праймов пришло из программы",
    },
  ];
}

export function aglScores(items: AglItem[]): ScoreTile[] {
  const scanned = items.filter((item) => item.record);
  const total = scanned.reduce(
    (sum, item) => sum + (item.record?.totalKills ?? 0),
    0,
  );
  return [
    {
      label: "АГЛ со сканером",
      value: String(scanned.length),
      hint: `из ${items.length} в посещаемости`,
    },
    {
      label: "Киллы на АГЛ",
      value: formatNumber(total),
      hint: "в звания не идут",
    },
    {
      label: "Бойцов на АГЛ",
      value: formatNumber(
        scanned.reduce((sum, item) => sum + (item.record?.fighters ?? 0), 0),
      ),
      hint: "всего записей о бойцах",
    },
    {
      label: "Лучший АГЛ",
      value: formatNumber(
        Math.max(0, ...scanned.map((item) => item.record?.totalKills ?? 0)),
      ),
      hint: "килов за один АГЛ",
    },
  ];
}

export function dayLabel(day: string) {
  const [year, month, date] = day.split("-");
  return `${date}.${month}.${year}`;
}
