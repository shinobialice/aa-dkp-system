"use client";

import { useMemo, useRef, useState } from "react";
import Image from "next/image";
import { cn } from "@/shared/lib/tw-merge";
import WarUserLink from "./WarUserLink";
import {
  MeterBar,
  PlaceNumber,
  SCROLL_LIST,
  SectionEmpty,
  SegmentedButtons,
  WarSection,
} from "./WarParts";
import {
  formatDecimal,
  formatNum,
  plural,
  sortFighters,
  type Fighter,
  type FighterSort,
} from "./warModel";

const COLUMNS =
  "grid-cols-[28px_minmax(0,1fr)_88px_96px_76px] md:grid-cols-[28px_minmax(0,1fr)_112px_112px_92px]";

const SORT_OPTIONS: { value: FighterSort; label: string }[] = [
  { value: "kills", label: "Киллы" },
  { value: "honor", label: "Хонор" },
  { value: "raids", label: "Рейды" },
];

const METRIC_LABEL: Record<FighterSort, string> = {
  kills: "киллы",
  honor: "хонор",
  raids: "рейды",
};

function RankBadge({ fighter }: { fighter: Fighter }) {
  if (fighter.rank) {
    return (
      <Image
        src={fighter.rank.icon}
        alt={fighter.rank.name}
        title={fighter.rank.name}
        width={32}
        height={32}
        className="size-8 shrink-0 object-contain"
      />
    );
  }
  return (
    <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-[11px] font-semibold text-muted-foreground">
      {fighter.name.slice(0, 2)}
    </span>
  );
}

export default function WarFightersCard({
  fighters,
  totalRaids,
  hasKillcount,
}: {
  fighters: Fighter[];
  totalRaids: number;
  hasKillcount: boolean;
}) {
  const [sort, setSort] = useState<FighterSort>(
    hasKillcount ? "kills" : "raids",
  );
  const listRef = useRef<HTMLDivElement>(null);

  const sorted = useMemo(() => {
    const pool =
      sort === "raids"
        ? fighters
        : fighters.filter((fighter) => fighter.kills !== null);
    return sortFighters(pool, sort);
  }, [fighters, sort]);
  const max = useMemo(
    () => ({
      kills: Math.max(1, ...fighters.map((fighter) => fighter.kills ?? 0)),
      honor: Math.max(1, ...fighters.map((fighter) => fighter.honor ?? 0)),
      raids: Math.max(1, totalRaids),
    }),
    [fighters, totalRaids],
  );

  const changeSort = (next: FighterSort) => {
    setSort(next);
    listRef.current?.scrollTo({ top: 0 });
  };

  const format = (key: FighterSort, value: number | null) => {
    if (value === null) return "—";
    return key === "raids"
      ? `${formatDecimal(value)}/${totalRaids}`
      : formatNum(value);
  };

  return (
    <WarSection
      title="Бойцы"
      description={
        sort === "raids"
          ? `${sorted.length} ${plural(sorted.length, "игрок", "игрока", "игроков")} на ПВП-рейдах`
          : `${sorted.length} ${plural(sorted.length, "игрок", "игрока", "игроков")} в киллкаунте за период`
      }
      action={
        <SegmentedButtons
          options={SORT_OPTIONS}
          value={sort}
          onChange={changeSort}
          ariaLabel="Сортировка бойцов"
          className="w-full sm:w-auto"
        />
      }
    >
      {sorted.length === 0 ? (
        <SectionEmpty>
          {sort === "raids"
            ? "Пока никого — данные появятся после первых рейдов"
            : "В киллкаунте за этот период пока никого нет"}
        </SectionEmpty>
      ) : (
        <div
          ref={listRef}
          className={cn(
            SCROLL_LIST,
            "max-h-[min(70vh,640px)] rounded-b-xl border-t sm:border-t-0",
          )}
        >
          <div
            className={cn(
              "sticky top-0 z-10 hidden items-center gap-3 border-y bg-muted px-4 py-2 text-xs font-medium text-muted-foreground sm:grid",
              COLUMNS,
            )}
          >
            <span>#</span>
            <span>Игрок</span>
            {SORT_OPTIONS.map((option) => (
              <span
                key={option.value}
                className={cn(
                  "text-right",
                  option.value === sort && "text-foreground",
                )}
              >
                {option.label}
              </span>
            ))}
          </div>

          <ol>
            {sorted.map((fighter, index) => (
              <li
                key={fighter.userId}
                className="border-b border-border/60 px-4 py-1 last:border-b-0"
              >
                <div
                  className={cn(
                    "hidden min-h-[52px] items-center gap-3 sm:grid",
                    COLUMNS,
                  )}
                >
                  <PlaceNumber place={index + 1} />
                  <div className="flex min-w-0 items-center gap-2.5">
                    <RankBadge fighter={fighter} />
                    <div className="min-w-0">
                      <WarUserLink
                        userId={fighter.userId}
                        name={fighter.name}
                        className="block font-semibold"
                      />
                      {fighter.rank && (
                        <span className="block truncate text-xs text-muted-foreground">
                          {fighter.rank.name}
                        </span>
                      )}
                    </div>
                  </div>
                  {SORT_OPTIONS.map(({ value: key }) => {
                    const value = fighter[key];
                    const active = key === sort;
                    return (
                      <div
                        key={key}
                        className="flex flex-col items-end gap-1.5"
                      >
                        <span
                          className={cn(
                            "tabular-nums",
                            value === null
                              ? "text-muted-foreground/60"
                              : active
                                ? "font-bold"
                                : "font-medium text-foreground/80",
                          )}
                        >
                          {format(key, value)}
                        </span>
                        {active && value !== null && (
                          <MeterBar
                            percent={(value / max[key]) * 100}
                            barClassName="bg-red-500/80"
                          />
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className="grid min-h-14 grid-cols-[22px_32px_minmax(0,1fr)_auto] items-center gap-2.5 sm:hidden">
                  <PlaceNumber place={index + 1} />
                  <RankBadge fighter={fighter} />
                  <div className="min-w-0">
                    <WarUserLink
                      userId={fighter.userId}
                      name={fighter.name}
                      className="block font-semibold"
                    />
                    <span className="block truncate text-xs text-muted-foreground">
                      {SORT_OPTIONS.filter((option) => option.value !== sort)
                        .map(
                          (option) =>
                            `${METRIC_LABEL[option.value]} ${format(option.value, fighter[option.value])}`,
                        )
                        .join(" · ")}
                    </span>
                  </div>
                  <span
                    className={cn(
                      "text-[15px] font-bold tabular-nums",
                      fighter[sort] === null &&
                        "font-medium text-muted-foreground/60",
                    )}
                  >
                    {format(sort, fighter[sort])}
                  </span>
                </div>
              </li>
            ))}
          </ol>
        </div>
      )}
    </WarSection>
  );
}
