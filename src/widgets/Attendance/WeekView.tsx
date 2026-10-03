import type { RangeRaid } from "@/actions/getRaidsInRange";
import { formatDay, selectedDayOf, WEEK_DAYS } from "./attendanceModel";
import DayList from "./DayList";
import DayTabs from "./DayTabs";
import WeekColumns from "./WeekColumns";

type Props = {
  days: string[];
  byDay: Map<string, RangeRaid[]>;
  todayKey: string;
  pickedDay: string | null;
  onDayPick: (day: string) => void;
  onRaidOpen: (id: number) => void;
};

export default function WeekView({
  days,
  byDay,
  todayKey,
  pickedDay,
  onDayPick,
  onRaidOpen,
}: Props) {
  const selectedDay = selectedDayOf(days, pickedDay, todayKey);

  return (
    <>
      <div className="hidden flex-col gap-2 @[60rem]/att:flex">
        <WeekColumns
          days={days}
          byDay={byDay}
          todayKey={todayKey}
          onRaidOpen={onRaidOpen}
        />
        <WeekLegend />
      </div>
      <div className="flex flex-col gap-3 @[60rem]/att:hidden">
        <DayTabs
          days={days}
          selectedDay={selectedDay}
          todayKey={todayKey}
          onDayPick={onDayPick}
        />
        <h2 className="px-0.5 text-base font-bold">
          {WEEK_DAYS[days.indexOf(selectedDay)]},{" "}
          {formatDay(selectedDay, { day: "numeric", month: "long" })}
        </h2>
        <DayList
          raids={byDay.get(selectedDay) ?? []}
          future={selectedDay > todayKey}
          onRaidOpen={onRaidOpen}
        />
      </div>
    </>
  );
}

function WeekLegend() {
  return (
    <div className="flex flex-wrap gap-3.5 text-xs text-muted-foreground">
      <span className="inline-flex items-center gap-1.5">
        <span className="size-3 rounded-sm border border-green-200 bg-green-50 dark:border-green-500/30 dark:bg-green-500/10" />
        Вы были
      </span>
      <span className="inline-flex items-center gap-1.5">
        <span className="size-3 rounded-sm border bg-card" />
        Не были
      </span>
      <span className="inline-flex items-center gap-1.5">
        <span className="size-3 rounded-sm border border-amber-300 bg-amber-50 dark:border-amber-500/40 dark:bg-amber-500/10" />
        Рейд создан, участники ещё не добавлены
      </span>
    </div>
  );
}
