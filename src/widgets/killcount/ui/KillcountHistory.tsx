"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ChevronRight, Trophy } from "lucide-react";
import { cn } from "@/shared/lib/tw-merge";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/shared/ui";
import type { KillCountHistoryData, KillCountWar } from "../types";
import { StatSuffix, StatTile } from "./KillcountHeader";
import {
  ALL_DAYS,
  avatarSrc,
  dayKey,
  daysTotal,
  formatNumber,
  longDate,
  shortDate,
  warTitle,
  weekday,
} from "./killcountModel";

const dayHref = (day: KillCountHistoryData) =>
  `/kill-counter/history/${dayKey(day.date)}`;

function WarChip({
  active,
  onClick,
  title,
  children,
}: {
  active: boolean;
  onClick: () => void;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        "flex max-w-80 min-w-44 shrink-0 cursor-pointer flex-col gap-0.5 rounded-xl border bg-card px-3 py-2 text-left transition-colors hover:border-foreground/25",
        active && "border-foreground ring-1 ring-foreground",
      )}
    >
      <span className="truncate text-[13px] font-semibold">{title}</span>
      <span className="text-[11.5px] text-muted-foreground">{children}</span>
    </button>
  );
}

export function KillcountHistory({
  history,
  wars,
}: {
  history: KillCountHistoryData[];
  wars: KillCountWar[];
}) {
  const [warId, setWarId] = useState(wars.at(0)?.id ?? ALL_DAYS);

  const days = useMemo(
    () =>
      warId === ALL_DAYS ? history : history.filter((d) => d.warId === warId),
    [history, warId],
  );
  const daysCount = (id: string) =>
    history.filter((d) => d.warId === id).length;

  // history приходит от новых к старым; график — слева направо по времени.
  const chronological = [...days].reverse();
  const total = daysTotal(days);
  const max = Math.max(0, ...days.map((d) => Number(d.totalKills)));
  const best = days.find((d) => Number(d.totalKills) === max && max > 0);

  return (
    <div className="flex flex-col gap-4">
      <div
        role="group"
        aria-label="Вар"
        className="-mx-4 flex gap-1.5 overflow-x-auto px-4 pb-0.5 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:px-0"
      >
        {wars.map((war) => (
          <WarChip
            key={war.id}
            active={warId === war.id}
            onClick={() => setWarId(war.id)}
            title={warTitle(war)}
          >
            {war.endedAt ? (
              `${shortDate(war.startedAt)} – ${shortDate(war.endedAt)}`
            ) : (
              <span className="inline-flex items-center gap-1.5 font-semibold text-red-600 dark:text-red-400">
                <span className="size-1.5 rounded-full bg-current" />с{" "}
                {shortDate(war.startedAt)} · идёт сейчас
              </span>
            )}
            {` · ${daysCount(war.id)} дн.`}
          </WarChip>
        ))}
        <WarChip
          active={warId === ALL_DAYS}
          onClick={() => setWarId(ALL_DAYS)}
          title="Все дни"
        >
          за всё время · {history.length} дн.
        </WarChip>
      </div>

      <section
        aria-label="Итоги"
        className="grid grid-cols-2 gap-2.5 lg:grid-cols-4"
      >
        <StatTile label="Всего килов" accent>
          {formatNumber(total)}
        </StatTile>
        <StatTile label="Дней">{days.length}</StatTile>
        <StatTile label="В среднем за день">
          {days.length ? formatNumber(Math.round(total / days.length)) : 0}
        </StatTile>
        <StatTile label="Лучший день">
          {best ? (
            <>
              {formatNumber(max)}
              <StatSuffix>{shortDate(best.date)}</StatSuffix>
            </>
          ) : (
            "—"
          )}
        </StatTile>
      </section>

      {days.length === 0 ? (
        <div className="rounded-xl border bg-card py-12 text-center text-muted-foreground">
          За этот вар киллкаунт ещё не добавляли
        </div>
      ) : (
        <>
          <section className="flex min-w-0 flex-col gap-2 rounded-xl border bg-card p-4">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h2 className="text-[15px] font-semibold">Килы по дням</h2>
              <span className="text-xs text-muted-foreground">
                нажмите на столбик, чтобы открыть день
              </span>
            </div>
            <div className="flex h-40 items-end gap-[3px] border-b pt-5">
              {chronological.map((day) => {
                const value = Number(day.totalKills);
                const isBest = day === best;
                return (
                  <Tooltip key={day.date}>
                    <TooltipTrigger asChild>
                      <Link
                        prefetch={false}
                        href={dayHref(day)}
                        aria-label={`${longDate(day.date)}: ${value} килов`}
                        className={cn(
                          "relative min-w-1 flex-1 rounded-t bg-red-500/70 transition-colors hover:bg-red-500",
                          isBest && "bg-red-500",
                        )}
                        style={{
                          height: `${max > 0 ? Math.max(2, (value / max) * 100) : 0}%`,
                        }}
                      >
                        {isBest && (
                          <span className="absolute -top-4 left-1/2 -translate-x-1/2 text-[11px] text-amber-500">
                            ★
                          </span>
                        )}
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent>
                      {longDate(day.date)}: {formatNumber(value)} килов
                    </TooltipContent>
                  </Tooltip>
                );
              })}
            </div>
            <div className="flex justify-between font-mono text-[10.5px] text-muted-foreground">
              <span>{shortDate(chronological[0].date)}</span>
              <span>{shortDate(chronological.at(-1)!.date)}</span>
            </div>
          </section>

          <section className="@container/days min-w-0 overflow-hidden rounded-xl border bg-card">
            <div className="max-h-[min(30rem,calc(100dvh-14rem))] overflow-auto overscroll-contain">
              <div className="sticky top-0 z-10 hidden grid-cols-[6.5rem_minmax(8rem,1fr)_5rem_minmax(9rem,13rem)_1rem] gap-3.5 bg-muted px-3.5 shadow-[0_1px_0_var(--color-border)] py-2 text-[11px] font-semibold tracking-wide text-muted-foreground uppercase @[44rem]/days:grid">
                <span>Дата</span>
                <span>Килы</span>
                <span className="text-right">Игроков</span>
                <span>Топ дня</span>
                <span />
              </div>
              {days.map((day) => {
                const value = Number(day.totalKills);
                return (
                  <Link
                    key={day.date}
                    prefetch={false}
                    href={dayHref(day)}
                    className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3.5 gap-y-1.5 border-b px-3.5 py-2.5 last:border-b-0 hover:bg-muted/50 @[44rem]/days:grid-cols-[6.5rem_minmax(8rem,1fr)_5rem_minmax(9rem,13rem)_1rem]"
                  >
                    <span className="leading-tight">
                      <span className="block font-semibold">
                        {longDate(day.date)}
                      </span>
                      <span className="text-[11.5px] text-muted-foreground">
                        {weekday(day.date)}
                      </span>
                    </span>
                    <span className="col-span-2 row-start-2 flex items-center gap-2.5 @[44rem]/days:col-span-1 @[44rem]/days:row-start-auto">
                      <span className="block h-2 flex-1 overflow-hidden rounded bg-muted">
                        <span
                          className="block h-full rounded bg-red-500"
                          style={{
                            width: `${max > 0 ? (value / max) * 100 : 0}%`,
                          }}
                        />
                      </span>
                      <span className="min-w-9 text-right text-[15px] font-bold tabular-nums">
                        {formatNumber(value)}
                      </span>
                    </span>
                    <span className="col-start-2 row-start-1 text-right text-[12.5px] text-muted-foreground tabular-nums @[44rem]/days:col-start-auto @[44rem]/days:row-start-auto">
                      {day.playersCount} игр.
                    </span>
                    <span className="col-span-2 flex min-w-0 items-center gap-1.5 text-[13px] @[44rem]/days:col-span-1">
                      {day.topUserName ? (
                        <>
                          <Trophy className="size-3.5 shrink-0 text-amber-500" />
                          <Avatar className="size-6 shrink-0">
                            <AvatarImage
                              src={avatarSrc(day.topUserName, day.topAvatarUrl)}
                              alt=""
                            />
                            <AvatarFallback className="text-[9px]">
                              {day.topUserName.slice(0, 2)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="truncate">{day.topUserName}</span>
                          <span className="text-muted-foreground tabular-nums">
                            {day.topKills}
                          </span>
                        </>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </span>
                    <ChevronRight className="hidden size-4 text-muted-foreground @[44rem]/days:block" />
                  </Link>
                );
              })}
            </div>
          </section>
        </>
      )}
    </div>
  );
}
