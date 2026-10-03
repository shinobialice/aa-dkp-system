import { ArrowDown, ArrowUp } from "lucide-react";
import type { UserMonthlyRaid } from "@/actions/getUserMonthlyRaids";
import { cn } from "@/shared/lib/tw-merge";
import { formatNumber } from "@/shared/lib/format";
import { raidPoints, type RaidSort, type SortKey } from "./raidSort";

type Props = {
  raids: UserMonthlyRaid[];
  sort: RaidSort;
  onSort: (key: SortKey) => void;
};

const GRID = "sm:grid-cols-[150px_100px_minmax(0,1fr)_96px_72px]";

export default function RaidList({ raids, sort, onSort }: Props) {
  return (
    <div className="max-h-105 overflow-y-auto rounded-lg border [scrollbar-width:thin]">
      <div
        className={cn(
          "sticky top-0 z-10 hidden items-center gap-3 bg-muted px-3.5 py-2 text-xs font-medium text-muted-foreground sm:grid",
          GRID,
        )}
      >
        <SortButton sortKey="startDate" sort={sort} onSort={onSort}>
          Дата
        </SortButton>
        <span>Тип</span>
        <span>Боссы</span>
        <span>Опоздал</span>
        <SortButton sortKey="dkp" sort={sort} onSort={onSort} alignEnd>
          Баллы
        </SortButton>
      </div>
      <ul>
        {raids.map((raid) => (
          <RaidRow key={raid.id} raid={raid} />
        ))}
      </ul>
    </div>
  );
}

function SortButton({
  sortKey,
  sort,
  onSort,
  alignEnd,
  children,
}: {
  sortKey: SortKey;
  sort: RaidSort;
  onSort: (key: SortKey) => void;
  alignEnd?: boolean;
  children: React.ReactNode;
}) {
  const active = sort.key === sortKey;
  const Arrow = sort.desc ? ArrowDown : ArrowUp;
  return (
    <button
      type="button"
      onClick={() => onSort(sortKey)}
      className={cn(
        "inline-flex cursor-pointer items-center gap-1",
        alignEnd ? "justify-end" : "text-left",
        active && "text-foreground",
      )}
    >
      {children}
      {active && <Arrow className="size-3.5" />}
    </button>
  );
}

function RaidRow({ raid }: { raid: UserMonthlyRaid }) {
  const date = raid.startDate
    ? new Date(raid.startDate).toLocaleString("ru-RU", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "—";

  return (
    <li
      className={cn(
        "grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 gap-y-0.5 border-t border-border/60 px-3.5 py-2.5 first:border-t-0 sm:min-h-11 sm:py-1.5",
        GRID,
      )}
    >
      <span className="text-sm tabular-nums max-sm:order-2 max-sm:col-start-1 max-sm:text-xs max-sm:text-muted-foreground">
        {date}
        <span className="sm:hidden">
          {raid.type ? ` · ${raid.type}` : ""}
          {raid.isLate ? " · опоздал" : ""}
        </span>
      </span>
      <span className="hidden sm:block">
        {raid.type ? (
          <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium">
            {raid.type}
          </span>
        ) : (
          "—"
        )}
      </span>
      <span className="truncate font-medium max-sm:order-1">
        {raid.bosses.length > 0 ? raid.bosses.join(", ") : "—"}
      </span>
      <span
        className={cn(
          "hidden text-sm sm:block",
          raid.isLate
            ? "font-medium text-red-700 dark:text-red-400"
            : "text-muted-foreground",
        )}
      >
        {raid.isLate ? "да" : "нет"}
      </span>
      <span className="text-right font-bold tabular-nums max-sm:order-1 max-sm:row-span-2">
        {formatNumber(raidPoints(raid), 2)}
      </span>
    </li>
  );
}
