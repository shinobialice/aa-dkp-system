import type { RangeRaid } from "@/actions/getRaidsInRange";
import { cn } from "@/shared/lib/tw-merge";
import { dayTone, SHORT_DAYS, type DayTone } from "./attendanceModel";
import { raidKind } from "./raidKinds";

const TONE_TEXT: Record<DayTone, string> = {
  full: "text-green-700 dark:text-green-400",
  part: "text-amber-700 dark:text-amber-400",
  none: "text-red-700 dark:text-red-400",
};

const TONE_DOT: Record<DayTone, string> = {
  full: "bg-green-600",
  part: "bg-amber-500",
  none: "bg-red-500",
};

type Props = {
  days: string[];
  byDay: Map<string, RangeRaid[]>;
  anchorKey: string;
  todayKey: string;
  onDayPick: (day: string) => void;
};

export default function MonthGrid({
  days,
  byDay,
  anchorKey,
  todayKey,
  onDayPick,
}: Props) {
  return (
    <div className="grid grid-cols-7 overflow-hidden rounded-xl border bg-card">
      {SHORT_DAYS.map((day) => (
        <span
          key={day}
          className="border-b bg-muted/50 px-1.5 py-1.5 text-xs font-semibold text-muted-foreground sm:px-2.5"
        >
          {day}
        </span>
      ))}
      {days.map((day) => (
        <MonthDayCell
          key={day}
          day={day}
          raids={byDay.get(day) ?? []}
          inMonth={day.slice(0, 7) === anchorKey.slice(0, 7)}
          isToday={day === todayKey}
          onPick={() => onDayPick(day)}
        />
      ))}
    </div>
  );
}

type MonthDayCellProps = {
  day: string;
  raids: RangeRaid[];
  inMonth: boolean;
  isToday: boolean;
  onPick: () => void;
};

function MonthDayCell({
  day,
  raids,
  inMonth,
  isToday,
  onPick,
}: MonthDayCellProps) {
  const held = raids.filter((raid) => raid.people > 0);
  const primes = held.filter((raid) => raidKind(raid) === "prime");
  const others = held.filter((raid) => raidKind(raid) !== "prime");
  const primeAttended = primes.filter((raid) => raid.attended).length;
  const otherAttended = others.filter((raid) => raid.attended).length;
  const tone = inMonth ? dayTone(primeAttended, primes.length) : null;

  return (
    <button
      type="button"
      onClick={onPick}
      disabled={!inMonth}
      className={cn(
        "flex min-h-16 cursor-pointer flex-col items-start gap-0.5 border-r border-b px-1.5 py-1.5 text-left transition-colors last:border-r-0 hover:bg-muted/50 disabled:cursor-default disabled:bg-muted/30 disabled:hover:bg-muted/30 sm:min-h-21 sm:px-2.5 [&:nth-child(7n)]:border-r-0",
        isToday && "bg-green-50 dark:bg-green-500/10",
      )}
    >
      <span
        className={cn(
          "flex items-center gap-1.5 text-sm font-semibold",
          !inMonth && "text-muted-foreground/50",
        )}
      >
        {Number(day.slice(8))}
        {tone && (
          <span className={cn("size-[7px] rounded-full", TONE_DOT[tone])} />
        )}
      </span>
      {tone && (
        <span
          className={cn("text-2xs font-semibold sm:text-xs", TONE_TEXT[tone])}
        >
          <span className="hidden sm:inline">Праймы </span>
          {primeAttended}/{primes.length}
        </span>
      )}
      {inMonth && others.length > 0 && (
        <span className="hidden text-xs text-muted-foreground sm:inline">
          АГЛ {otherAttended}/{others.length}
        </span>
      )}
    </button>
  );
}
