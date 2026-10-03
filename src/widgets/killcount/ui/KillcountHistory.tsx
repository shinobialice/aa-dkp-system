"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ChevronRight, Trophy } from "lucide-react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  StatTile,
  StatUnit,
} from "@/shared/ui";
import type { KillCountHistoryData, KillCountWar } from "../types";
import {
  ALL_DAYS,
  daysTotal,
  longDate,
  shortDate,
  warTitle,
  weekday,
} from "./killcountModel";
import { avatarSrc, formatNumber } from "@/shared/lib/format";
import WarChip, { dayHref } from "./WarChip";
import KillsChart from "./KillsChart";

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
        <StatTile label="Всего килов">
          <span className="text-red-600 dark:text-red-400">
            {formatNumber(total)}
          </span>
        </StatTile>
        <StatTile label="Дней">{days.length}</StatTile>
        <StatTile label="В среднем за день">
          {days.length ? formatNumber(Math.round(total / days.length)) : 0}
        </StatTile>
        <StatTile label="Лучший день">
          {best ? (
            <>
              {formatNumber(max)}
              <StatUnit>{shortDate(best.date)}</StatUnit>
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
          <KillsChart days={chronological} best={best} max={max} />

          <section className="@container/days min-w-0 overflow-hidden rounded-xl border bg-card">
            <div className="max-h-[min(30rem,calc(100dvh-14rem))] overflow-auto overscroll-contain">
              <div className="sticky top-0 z-10 hidden grid-cols-[6.5rem_minmax(8rem,1fr)_5rem_minmax(9rem,13rem)_1rem] gap-3.5 bg-muted px-3.5 shadow-[0_1px_0_var(--color-border)] py-2 text-2xs font-semibold tracking-wide text-muted-foreground uppercase @[44rem]/days:grid">
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
                      <span className="text-2xs text-muted-foreground">
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
                      <span className="min-w-9 text-right text-base font-bold tabular-nums">
                        {formatNumber(value)}
                      </span>
                    </span>
                    <span className="col-start-2 row-start-1 text-right text-xs text-muted-foreground tabular-nums @[44rem]/days:col-start-auto @[44rem]/days:row-start-auto">
                      {day.playersCount} игр.
                    </span>
                    <span className="col-span-2 flex min-w-0 items-center gap-1.5 text-sm @[44rem]/days:col-span-1">
                      {day.topUserName ? (
                        <>
                          <Trophy className="size-3.5 shrink-0 text-amber-500" />
                          <Avatar className="size-6 shrink-0">
                            <AvatarImage
                              src={avatarSrc(day.topUserName, day.topAvatarUrl)}
                              alt=""
                            />
                            <AvatarFallback className="text-2xs">
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
