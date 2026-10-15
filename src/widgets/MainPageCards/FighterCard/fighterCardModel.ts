import type { MyFighterCard } from "@/actions/getMyFighterCard";
import { formatNumber, plural } from "@/shared/lib/format";

const DAY_MS = 86_400_000;
const EMPTY = "—";

export type CardStat = {
  label: string;
  value: string;
};

export function frontStats(card: MyFighterCard, nowMs: number | null) {
  const { attendance } = card;
  return [
    { label: "Посещ.", value: percentText(attendance.totalPercent) },
    { label: "Прайм", value: percentText(attendance.primePercent) },
    { label: "АГЛ", value: percentText(attendance.aglPercent) },
    { label: "ДКП", value: formatNumber(attendance.dkp, 0) },
    { label: "Дней", value: daysInGuild(card.joinedAt, nowMs) },
    { label: "Зарплата", value: salaryText(card.salary) },
  ];
}

export function backMeters(card: MyFighterCard) {
  const { attendance } = card;
  return [
    { label: "Прайм", percent: attendance.primePercent },
    { label: "АГЛ", percent: attendance.aglPercent },
    { label: "Итого", percent: attendance.totalPercent },
  ];
}

export function backRows(card: MyFighterCard): CardStat[] {
  const { attendance, streak } = card;
  return [
    {
      label: "ДКП за месяц",
      value: `${formatNumber(attendance.dkp, 0)} из ${formatNumber(attendance.totalPointsAvailable, 0)}`,
    },
    {
      label: "Пропуски праймов",
      value: `${streak.skipsUsedThisMonth} из ${streak.skipAllowance}`,
    },
    { label: "Зарплата", value: salaryText(card.salary) },
  ];
}

export function gearScoreText(gearScore: number | null) {
  return gearScore === null ? EMPTY : formatNumber(gearScore, 0);
}

export function streakLabel(streak: number) {
  return plural(streak, "прайм", "прайма", "праймов");
}

export function monthName(nowMs: number | null) {
  if (nowMs === null) return "";
  return new Date(nowMs).toLocaleDateString("ru-RU", {
    month: "long",
    timeZone: "Europe/Moscow",
  });
}

export function percentText(percent: number) {
  return `${Math.round(percent)}%`;
}

function daysInGuild(joinedAt: string | null, nowMs: number | null) {
  if (!joinedAt || nowMs === null) return EMPTY;
  const days = Math.floor((nowMs - new Date(joinedAt).getTime()) / DAY_MS);
  return formatNumber(Math.max(0, days), 0);
}

function salaryText(salary: number | null) {
  return salary === null ? EMPTY : formatNumber(salary, 0);
}
