"use client";

import { useMemo, useRef, useState } from "react";
import { useFlipReorder } from "@/hooks/useFlipReorder";
import { plural } from "@/shared/lib/format";
import { cn } from "@/shared/lib/tw-merge";
import SkewTabs from "@/widgets/arena/SkewTabs";
import {
  SCROLL_LIST,
  sortFighters,
  type Fighter,
  type FighterSort,
} from "../warModel";
import WarSection from "../WarSection";
import FighterRow from "./FighterRow";
import { metricMax, SORT_OPTIONS } from "./fightersMeta";

type Props = {
  fighters: Fighter[];
  totalRaids: number;
  hasKillcount: boolean;
  myUserId: number | null;
  className?: string;
};

export default function WarFightersCard({
  fighters,
  totalRaids,
  hasKillcount,
  myUserId,
  className,
}: Props) {
  const [sort, setSort] = useState<FighterSort>(
    hasKillcount ? "kills" : "raids",
  );
  const listRef = useRef<HTMLDivElement>(null);
  useFlipReorder(listRef, sort);

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
      className={className}
      action={
        <SkewTabs
          options={SORT_OPTIONS}
          value={sort}
          onChange={handleSortChange}
          label="Сортировка бойцов"
          className="w-full sm:w-auto"
        />
      }
    >
      <div
        ref={listRef}
        className={cn(
          SCROLL_LIST,
          "relative max-h-[min(70vh,560px)] border-t lg:max-h-none lg:min-h-0 lg:flex-1 lg:basis-0",
        )}
      >
        <ol>
          {sorted.map((fighter, index) => (
            <FighterRow
              key={fighter.userId}
              fighter={fighter}
              place={index + 1}
              sort={sort}
              max={max}
              totalRaids={totalRaids}
              isMe={fighter.userId === myUserId}
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
