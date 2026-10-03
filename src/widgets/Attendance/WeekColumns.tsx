import type { RangeRaid } from "@/actions/getRaidsInRange";
import { cn } from "@/shared/lib/tw-merge";
import { formatDay, raidsCount, WEEK_DAYS } from "./attendanceModel";
import RaidCard from "./RaidCard";

type Props = {
  days: string[];
  byDay: Map<string, RangeRaid[]>;
  todayKey: string;
  onRaidOpen: (id: number) => void;
};

export default function WeekColumns({
  days,
  byDay,
  todayKey,
  onRaidOpen,
}: Props) {
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
              <span className="truncate text-sm font-bold">
                {WEEK_DAYS[index]}
              </span>
              <span className="text-2xs font-medium opacity-80">
                {formatDay(day, { day: "numeric", month: "short" })}
                {raids.length > 0 && ` · ${raidsCount(raids.length)}`}
              </span>
            </div>
            <div className="flex flex-col gap-1 p-[5px]">
              {raids.length === 0 && (
                <span className="px-1 py-3.5 text-center text-xs text-muted-foreground">
                  {day > todayKey ? "Ещё впереди" : "Нет рейдов"}
                </span>
              )}
              {raids.map((raid) => (
                <RaidCard key={raid.id} raid={raid} onOpen={onRaidOpen} />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
