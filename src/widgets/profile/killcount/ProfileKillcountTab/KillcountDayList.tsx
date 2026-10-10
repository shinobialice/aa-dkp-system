import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { formatNumber } from "@/shared/lib/format";
import { cn } from "@/shared/lib/tw-merge";
import { longDate, weekday } from "@/widgets/killcount/ui/killcountModel";
import { maxKills, placeTone, type PlayedDay } from "./profileKillcountModel";

type Props = {
  played: PlayedDay[];
};

const GRID =
  "grid-cols-[minmax(0,1fr)_auto] @[40rem]/days:grid-cols-[minmax(9rem,13rem)_minmax(8rem,1fr)_6rem_6rem_1rem]";
const RESET_POSITION =
  "@[40rem]/days:col-start-auto @[40rem]/days:row-start-auto";

export default function KillcountDayList({ played }: Props) {
  const max = maxKills(played);

  return (
    <div className="@container/days max-h-105 overflow-y-auto rounded-lg border [scrollbar-width:thin]">
      <div
        className={cn(
          "sticky top-0 z-10 hidden gap-3 bg-muted px-3.5 py-2 text-xs font-medium text-muted-foreground @[40rem]/days:grid",
          GRID,
        )}
      >
        <span>Дата</span>
        <span>Киллы</span>
        <span className="text-right">Хонор</span>
        <span className="text-right">Место за день</span>
        <span />
      </div>
      <ul>
        {played.map((day) => (
          <DayRow key={day.date} day={day} max={max} />
        ))}
      </ul>
    </div>
  );
}

function DayRow({ day, max }: { day: PlayedDay; max: number }) {
  const { mine } = day;

  return (
    <li className="border-b last:border-b-0">
      <Link
        prefetch={false}
        href={`/kill-counter/history/${day.date}`}
        className={cn(
          "grid items-center gap-x-3 gap-y-1.5 px-3.5 py-2.5 hover:bg-muted/50",
          GRID,
        )}
      >
        <span className="min-w-0 leading-tight">
          <span className="block font-semibold">{longDate(day.date)}</span>
          <span className="flex flex-wrap items-center gap-1.5 text-2xs text-muted-foreground">
            {weekday(day.date)}
            {mine.playerClass && <span>· {mine.playerClass}</span>}
            {mine.comment && (
              <span className="rounded-full border px-1.5">{mine.comment}</span>
            )}
          </span>
        </span>
        <span
          className={cn(
            "col-start-1 row-start-2 flex items-center gap-2.5",
            RESET_POSITION,
          )}
        >
          <span className="block h-2 flex-1 overflow-hidden rounded bg-muted">
            <span
              className="block h-full rounded bg-red-500"
              style={{ width: `${max > 0 ? (mine.kills / max) * 100 : 0}%` }}
            />
          </span>
          <span className="min-w-9 text-right text-base font-bold tabular-nums">
            {formatNumber(mine.kills)}
          </span>
        </span>
        <span
          className={cn(
            "col-start-2 row-start-2 text-right text-xs text-muted-foreground tabular-nums @[40rem]/days:text-sm @[40rem]/days:text-foreground",
            RESET_POSITION,
          )}
        >
          {formatNumber(mine.honor)}
          <span className="@[40rem]/days:hidden"> хонора</span>
        </span>
        <span
          className={cn(
            "col-start-2 row-start-1 text-right text-xs font-semibold tabular-nums @[40rem]/days:text-sm",
            placeTone(mine.place),
            RESET_POSITION,
          )}
        >
          {mine.place}-е
          <span className="font-normal text-muted-foreground">
            {" "}
            из {day.players}
          </span>
        </span>
        <ChevronRight className="hidden size-4 text-muted-foreground @[40rem]/days:block" />
      </Link>
    </li>
  );
}
