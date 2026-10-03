import { plural } from "@/shared/lib/format";

export type AfkMember = {
  id: number;
  username: string;
  avatar_url: string | null;
  vk_name: string | null;
  class: string | null;
  class_gear_score: number | null;
  daysInGuild: number;
  inactiveSince: string | null;
  tagSince: string | null;
  afkTagId: number | null;
  isInactive: boolean;
  isAfkTagged: boolean;
  salary: number | null;
  salaryReason: string | null;
};

export type Filter = "all" | "tag" | "left" | "long";

export const LONG_DAYS = 30;

const WARN_DAYS = 14;

const DAY_MS = 86_400_000;

export const ROW_GRID =
  "lg:grid-cols-[minmax(11rem,1.3fr)_6.5rem_4rem_minmax(10rem,1.2fr)_7.5rem_14rem]";

export const daysLabel = (n: number) =>
  `${n} ${plural(n, "день", "дня", "дней")}`;

export function afkDurationLabel(days: number | null) {
  if (days === null) return "неизвестно";
  if (days === 0) return "меньше дня";
  return daysLabel(days);
}

export function awaySince(member: AfkMember) {
  const dates = [
    member.isInactive ? member.inactiveSince : null,
    member.isAfkTagged ? member.tagSince : null,
  ]
    .filter((d): d is string => Boolean(d))
    .map((d) => new Date(d).getTime());
  return dates.length ? Math.min(...dates) : null;
}

export function awayDays(member: AfkMember, now: number) {
  const since = awaySince(member);
  return since === null
    ? null
    : Math.max(0, Math.floor((now - since) / DAY_MS));
}

export function tone(days: number | null) {
  if (days === null) {
    return { text: "text-muted-foreground", bar: "bg-muted-foreground/40" };
  }
  if (days >= LONG_DAYS) {
    return { text: "text-red-600 dark:text-red-400", bar: "bg-red-500" };
  }
  if (days >= WARN_DAYS) {
    return { text: "text-amber-600 dark:text-amber-400", bar: "bg-amber-500" };
  }
  return { text: "text-muted-foreground", bar: "bg-muted-foreground/60" };
}

export type MemberWithDays = { member: AfkMember; days: number | null };

export const FILTERS: { key: Filter; label: string }[] = [
  { key: "all", label: "Все" },
  { key: "tag", label: "Тег АФК" },
  { key: "left", label: "Ушли" },
  { key: "long", label: `Дольше ${LONG_DAYS} дней` },
];

export function countByFilter(rows: MemberWithDays[]): Record<Filter, number> {
  return {
    all: rows.length,
    tag: rows.filter(({ member }) => member.isAfkTagged).length,
    left: rows.filter(({ member }) => member.isInactive).length,
    long: rows.filter(({ days }) => (days ?? 0) >= LONG_DAYS).length,
  };
}

export function matchesAfkFilter(
  { member, days }: MemberWithDays,
  filter: Filter,
  term: string,
) {
  const matchesTerm =
    !term ||
    member.username.toLowerCase().includes(term) ||
    !!member.vk_name?.toLowerCase().includes(term);
  if (!matchesTerm) return false;
  if (filter === "tag") return member.isAfkTagged;
  if (filter === "left") return member.isInactive;
  if (filter === "long") return (days ?? 0) >= LONG_DAYS;
  return true;
}
