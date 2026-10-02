"use client";

import { Check, Users } from "lucide-react";
import type { RangeRaid } from "@/actions/getRaidsInRange";
import { cn } from "@/shared/lib/tw-merge";
import {
  formatDay,
  percent,
  RAID_BG,
  RAID_TEXT,
  raidColorStyle,
  raidKind,
  raidsCount,
  raidTitle,
  SHORT_DAYS,
  WEEK_DAYS,
  type MyStats,
} from "./attendanceModel";

function raidState(raid: RangeRaid) {
  if (raid.people === 0) return "empty";
  return raid.attended ? "attended" : "missed";
}

function RaidCard({
  raid,
  onOpen,
}: {
  raid: RangeRaid;
  onOpen: (id: number) => void;
}) {
  const state = raidState(raid);
  const prime = raidKind(raid) === "prime";
  return (
    <button
      type="button"
      onClick={() => onOpen(raid.id)}
      style={raidColorStyle(raid)}
      className={cn(
        "flex w-full cursor-pointer flex-col gap-px rounded-lg border px-[7px] py-[5px] text-left transition-colors hover:border-foreground/30",
        state === "attended" &&
          "border-green-200 bg-green-50 dark:border-green-500/30 dark:bg-green-500/10",
        state === "empty" &&
          "border-amber-300 bg-amber-50 dark:border-amber-500/40 dark:bg-amber-500/10",
        state === "missed" && "bg-card",
      )}
    >
      <span className="flex items-center justify-between gap-1 text-[11.5px] text-muted-foreground tabular-nums">
        {raid.start.slice(11, 16)}
        {state === "empty" ? (
          <span className="font-bold text-amber-700 dark:text-amber-400">
            пусто
          </span>
        ) : (
          <span className="inline-flex items-center gap-0.5">
            <Users className="size-[11px]" />
            {raid.people}
          </span>
        )}
      </span>
      <span className="flex items-center justify-between gap-1">
        <span
          className={cn(
            "min-w-0 text-[12.5px] leading-tight",
            RAID_TEXT,
            prime ? "font-bold" : "font-semibold",
          )}
        >
          {raidTitle(raid)}
        </span>
        {state === "attended" && (
          <Check
            aria-label="Вы были"
            className="size-3.5 shrink-0 text-green-600 dark:text-green-400"
          />
        )}
      </span>
    </button>
  );
}

export function WeekColumns({
  days,
  byDay,
  todayKey,
  onOpen,
}: {
  days: string[];
  byDay: Map<string, RangeRaid[]>;
  todayKey: string;
  onOpen: (id: number) => void;
}) {
  return (
    <div className="grid grid-cols-7 items-start gap-2">
      {days.map((day, index) => {
        const raids = byDay.get(day) ?? [];
        const today = day === todayKey;
        return (
          <section
            key={day}
            aria-label={WEEK_DAYS[index]}
            className={cn(
              "flex min-w-0 flex-col overflow-hidden rounded-xl border bg-card",
              today && "border-green-300 dark:border-green-500/40",
            )}
          >
            <div
              className={cn(
                "flex flex-col px-2.5 py-1.5 leading-tight",
                today
                  ? "bg-green-100 text-green-800 dark:bg-green-500/15 dark:text-green-300"
                  : "bg-muted/50",
              )}
            >
              <span className="truncate text-[13.5px] font-bold">
                {WEEK_DAYS[index]}
              </span>
              <span className="text-[11.5px] font-medium opacity-80">
                {formatDay(day, { day: "numeric", month: "short" })}
                {raids.length > 0 && ` · ${raidsCount(raids.length)}`}
              </span>
            </div>
            <div className="flex flex-col gap-1 p-[5px]">
              {raids.length === 0 ? (
                <span className="px-1 py-3.5 text-center text-xs text-muted-foreground">
                  {day > todayKey ? "Ещё впереди" : "Нет рейдов"}
                </span>
              ) : (
                raids.map((raid) => (
                  <RaidCard key={raid.id} raid={raid} onOpen={onOpen} />
                ))
              )}
            </div>
          </section>
        );
      })}
    </div>
  );
}

export function DayList({
  raids,
  future,
  onOpen,
}: {
  raids: RangeRaid[];
  future: boolean;
  onOpen: (id: number) => void;
}) {
  if (raids.length === 0) {
    return (
      <p className="rounded-xl border border-dashed px-4 py-6 text-center text-muted-foreground">
        {future ? "Ещё впереди" : "В этот день рейдов нет"}
      </p>
    );
  }
  return (
    <div className="flex flex-col overflow-hidden rounded-xl border bg-card">
      {raids.map((raid) => {
        const state = raidState(raid);
        return (
          <button
            key={raid.id}
            type="button"
            onClick={() => onOpen(raid.id)}
            style={raidColorStyle(raid)}
            className={cn(
              "flex min-h-[52px] cursor-pointer items-center gap-3 border-b px-3 py-1.5 text-left last:border-b-0",
              state === "attended" && "bg-green-50 dark:bg-green-500/10",
              state === "empty" && "bg-amber-50 dark:bg-amber-500/10",
            )}
          >
            <span className="w-11 shrink-0 text-[15px] font-semibold tabular-nums">
              {raid.start.slice(11, 16)}
            </span>
            <span className={cn("w-1 self-stretch rounded-full", RAID_BG)} />
            <span className="flex min-w-0 flex-1 flex-col leading-tight">
              <span
                className={cn(
                  RAID_TEXT,
                  raidKind(raid) === "prime" ? "font-bold" : "font-semibold",
                )}
              >
                {raidTitle(raid)}
              </span>
              {state === "empty" ? (
                <span className="text-xs font-semibold text-amber-700 dark:text-amber-400">
                  участники не добавлены
                </span>
              ) : (
                <span className="text-xs text-muted-foreground">
                  {raid.people} участников
                </span>
              )}
            </span>
            {state === "attended" && (
              <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-800 dark:bg-green-500/15 dark:text-green-300">
                <Check className="size-3" />
                был
              </span>
            )}
            {state === "missed" && (
              <span className="text-xs text-muted-foreground">не был</span>
            )}
          </button>
        );
      })}
    </div>
  );
}

function dayTone(attended: number, total: number) {
  if (total === 0) return null;
  if (attended === total) return "full";
  return attended > 0 ? "part" : "none";
}

const TONE_TEXT = {
  full: "text-green-700 dark:text-green-400",
  part: "text-amber-700 dark:text-amber-400",
  none: "text-red-700 dark:text-red-400",
};

const TONE_DOT = {
  full: "bg-green-600",
  part: "bg-amber-500",
  none: "bg-red-500",
};

export function MonthGrid({
  days,
  byDay,
  anchorKey,
  todayKey,
  onPickDay,
}: {
  days: string[];
  byDay: Map<string, RangeRaid[]>;
  anchorKey: string;
  todayKey: string;
  onPickDay: (day: string) => void;
}) {
  return (
    <div className="grid grid-cols-7 overflow-hidden rounded-xl border bg-card">
      {SHORT_DAYS.map((day) => (
        <span
          key={day}
          className="border-b bg-muted/50 px-1.5 py-1.5 text-xs font-semibold text-muted-foreground sm:px-2.5"
        >
          {day}
        </span>
      ))}
      {days.map((day) => {
        const inMonth = day.slice(0, 7) === anchorKey.slice(0, 7);
        const raids = (byDay.get(day) ?? []).filter((raid) => raid.people > 0);
        const primes = raids.filter((raid) => raidKind(raid) === "prime");
        const others = raids.filter((raid) => raidKind(raid) !== "prime");
        const primeAttended = primes.filter((raid) => raid.attended).length;
        const otherAttended = others.filter((raid) => raid.attended).length;
        const tone = dayTone(primeAttended, primes.length);
        return (
          <button
            key={day}
            type="button"
            onClick={() => onPickDay(day)}
            disabled={!inMonth}
            className={cn(
              "flex min-h-16 cursor-pointer flex-col items-start gap-0.5 border-r border-b px-1.5 py-1.5 text-left transition-colors last:border-r-0 hover:bg-muted/50 disabled:cursor-default disabled:bg-muted/30 disabled:hover:bg-muted/30 sm:min-h-[84px] sm:px-2.5 [&:nth-child(7n)]:border-r-0",
              day === todayKey && "bg-green-50 dark:bg-green-500/10",
            )}
          >
            <span
              className={cn(
                "flex items-center gap-1.5 text-[13px] font-semibold",
                !inMonth && "text-muted-foreground/50",
              )}
            >
              {Number(day.slice(8))}
              {inMonth && tone && (
                <span
                  className={cn("size-[7px] rounded-full", TONE_DOT[tone])}
                />
              )}
            </span>
            {inMonth && primes.length > 0 && tone && (
              <span
                className={cn(
                  "text-[11px] font-semibold sm:text-xs",
                  TONE_TEXT[tone],
                )}
              >
                <span className="hidden sm:inline">Праймы </span>
                {primeAttended}/{primes.length}
              </span>
            )}
            {inMonth && others.length > 0 && (
              <span className="hidden text-xs text-muted-foreground sm:inline">
                АГЛ {otherAttended}/{others.length}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

function StatBar({
  label,
  attended,
  total,
}: {
  label: string;
  attended: number;
  total: number;
}) {
  const value = percent(attended, total);
  return (
    <div className="flex min-w-0 flex-1 flex-col gap-1">
      <span className="flex items-baseline justify-between gap-2">
        <span className="truncate text-[12.5px] text-foreground/80">
          {label}
        </span>
        <span className="shrink-0 text-[15px] font-bold tabular-nums">
          {attended} из {total}{" "}
          <span
            className={cn(
              "text-[12.5px] font-semibold",
              value >= 50
                ? "text-green-700 dark:text-green-400"
                : "text-amber-700 dark:text-amber-400",
            )}
          >
            {value}%
          </span>
        </span>
      </span>
      <span className="block h-1.5 overflow-hidden rounded-full bg-green-100 dark:bg-green-500/15">
        <span
          className={cn(
            "block h-full rounded-full",
            value >= 50 ? "bg-green-600" : "bg-amber-500",
          )}
          style={{ width: `${value}%` }}
        />
      </span>
    </div>
  );
}

export function MyStatsCard({
  title,
  stats,
}: {
  title: string;
  stats: MyStats;
}) {
  const missed = stats.missedPrimes
    .slice(0, 3)
    .map(
      (raid) =>
        `${raidTitle(raid)}, ${formatDay(raid.start.slice(0, 10), { day: "numeric", month: "short" })}`,
    );
  return (
    <section
      aria-label={title}
      className="flex flex-col gap-2.5 rounded-xl border border-green-200 bg-green-50 px-4 py-3 dark:border-green-500/25 dark:bg-green-500/5"
    >
      <span className="text-[13px] font-semibold text-green-700 dark:text-green-400">
        {title}
      </span>
      <div className="flex flex-col gap-3 @[40rem]/att:flex-row @[40rem]/att:gap-6">
        <StatBar label="Праймы" {...stats.primes} />
        <StatBar label="АГЛ, Кошка, Морф, Марли" {...stats.others} />
      </div>
      {missed.length > 0 && (
        <span className="text-xs text-green-800 dark:text-green-300">
          Пропущен{missed.length > 1 ? "ы" : ""}: {missed.join("; ")}
          {stats.missedPrimes.length > 3 &&
            ` и ещё ${stats.missedPrimes.length - 3}`}
        </span>
      )}
    </section>
  );
}
