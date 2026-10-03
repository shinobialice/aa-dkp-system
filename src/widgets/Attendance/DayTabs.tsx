import { cn } from "@/shared/lib/tw-merge";
import { SHORT_DAYS, WEEK_DAYS } from "./attendanceModel";

type Props = {
  days: string[];
  selectedDay: string;
  todayKey: string;
  onDayPick: (day: string) => void;
};

export default function DayTabs({
  days,
  selectedDay,
  todayKey,
  onDayPick,
}: Props) {
  return (
    <div
      role="tablist"
      aria-label="День недели"
      className="grid grid-cols-7 gap-1"
    >
      {days.map((day, index) => (
        <button
          key={day}
          type="button"
          role="tab"
          aria-selected={day === selectedDay}
          aria-label={WEEK_DAYS[index]}
          onClick={() => onDayPick(day)}
          className={cn(
            "flex h-12.5 cursor-pointer flex-col items-center justify-center rounded-lg border leading-tight transition-colors",
            dayTabTone(day, selectedDay, todayKey),
          )}
        >
          <span className="text-xs font-semibold">{SHORT_DAYS[index]}</span>
          <span className="text-base font-bold">{Number(day.slice(8))}</span>
        </button>
      ))}
    </div>
  );
}

function dayTabTone(day: string, selectedDay: string, todayKey: string) {
  if (day === selectedDay) {
    return "border-foreground bg-foreground text-background";
  }
  if (day === todayKey) {
    return "border-green-300 bg-green-100 text-green-800 dark:border-green-500/40 dark:bg-green-500/15 dark:text-green-300";
  }
  if (day > todayKey) return "bg-background text-muted-foreground";
  return "bg-background hover:bg-muted";
}
