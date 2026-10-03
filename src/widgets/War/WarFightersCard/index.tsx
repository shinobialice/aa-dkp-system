"use client";

import { useMemo, useRef, useState } from "react";
import { plural } from "@/shared/lib/format";
import { cn } from "@/shared/lib/tw-merge";
import { Segmented } from "@/shared/ui";
import {
  SCROLL_LIST,
  sortFighters,
  type Fighter,
  type FighterSort,
} from "../warModel";
import WarSection from "../WarSection";
import FighterRow from "./FighterRow";
import { FIGHTER_COLUMNS, metricMax, SORT_OPTIONS } from "./fightersMeta";

type Props = {
  fighters: Fighter[];
  totalRaids: number;
  hasKillcount: boolean;
};

export default function WarFightersCard({
  fighters,
  totalRaids,
  hasKillcount,
}: Props) {
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
    () => metricMax(fighters, totalRaids),
    [fighters, totalRaids],
  );

  const handleSortChange = (next: FighterSort) => {
    setSort(next);
    listRef.current?.scrollTo({ top: 0 });
  };

  const players = `${sorted.length} ${plural(sorted.length, "игрок", "игрока", "игроков")}`;
  const isRaids = sort === "raids";

  return (
    <WarSection
      title="Бойцы"
      description={
        isRaids
          ? `${players} на ПВП-рейдах`
          : `${players} в киллкаунте за период`
      }
      empty={sorted.length === 0 ? emptyText(isRaids) : null}
      action={
        <Segmented
          options={SORT_OPTIONS}
          value={sort}
          onChange={handleSortChange}
          label="Сортировка бойцов"
          className="w-full *:flex-1 sm:w-auto"
        />
      }
    >
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
            FIGHTER_COLUMNS,
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
            <FighterRow
              key={fighter.userId}
              fighter={fighter}
              place={index + 1}
              sort={sort}
              max={max}
              totalRaids={totalRaids}
            />
          ))}
        </ol>
      </div>
    </WarSection>
  );
}

function emptyText(isRaids: boolean) {
  if (isRaids) return "Пока никого — данные появятся после первых рейдов";
  return "В киллкаунте за этот период пока никого нет";
}
