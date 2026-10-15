import type { RaidMark } from "@/actions/warAttendance";
import { cn } from "@/shared/lib/tw-merge";
import { formatDecimal } from "../warModel";
import MyStatGrid from "./MyStatGrid";
import {
  currentStreak,
  isStripTrimmed,
  lateCount,
  stripMarks,
  type AttendanceSummary,
} from "./myWarModel";

const RING_RADIUS = 52;
const RING_LENGTH = 2 * Math.PI * RING_RADIUS;
const CELL_DELAY_S = 0.025;

const MARK_CLASS: Record<RaidMark, string> = {
  attended: "bg-green-500",
  late: "bg-amber-500",
  missed: "ring-1 ring-muted-foreground ring-inset",
};

type Props = {
  summary: AttendanceSummary;
  marks: RaidMark[] | undefined;
};

export default function MyAttendanceView({ summary, marks }: Props) {
  const stats = [
    {
      label: "Рейдов",
      value: `${formatDecimal(summary.raids)}/${summary.total}`,
    },
    { label: "Опозданий", value: marks ? String(lateCount(marks)) : "—" },
    {
      label: "Подряд сейчас",
      value: marks ? String(currentStreak(marks)) : "—",
    },
    {
      label: "Место по явке",
      value: summary.place ? String(summary.place) : "—",
    },
  ];

  return (
    <>
      <div className="relative mx-auto size-39">
        <svg viewBox="0 0 120 120" aria-hidden className="size-full -rotate-90">
          <circle
            cx="60"
            cy="60"
            r={RING_RADIUS}
            className="fill-none stroke-muted"
            strokeWidth="10"
          />
          <circle
            cx="60"
            cy="60"
            r={RING_RADIUS}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={RING_LENGTH}
            strokeDashoffset={RING_LENGTH * (1 - summary.share)}
            className="arena-ring-fill fill-none stroke-green-500 drop-shadow-[0_0_6px_rgb(34_197_94/0.55)]"
          />
        </svg>
        <div className="absolute inset-0 grid place-content-center text-center">
          <span className="font-display text-4xl leading-none">
            {Math.round(summary.share * 100)}%
          </span>
          <span className="mt-1 text-xs text-muted-foreground">
            {formatDecimal(summary.raids)} из {summary.total}
          </span>
        </div>
      </div>
      <div className="-mt-1 text-center">
        <p className="font-display text-[22px] tracking-wide uppercase">
          {summary.bucket.label}
        </p>
        <p className="text-sm text-muted-foreground">{placeText(summary)}</p>
      </div>
      {marks && marks.length > 0 && <RaidStrip marks={marks} />}
      <MyStatGrid stats={stats} />
    </>
  );
}

function RaidStrip({ marks }: { marks: RaidMark[] }) {
  const shown = stripMarks(marks);
  return (
    <div className="flex flex-col gap-2">
      <p className="flex flex-wrap justify-between gap-x-3 gap-y-1 text-xs text-muted-foreground">
        {stripTitle(marks, shown.length)}
        <span className="flex items-center gap-2.5">
          <Legend mark="attended" label="был" />
          <Legend mark="late" label="опоздал" />
          <Legend mark="missed" label="пропустил" />
        </span>
      </p>
      <div
        aria-hidden
        className="grid h-5.5 gap-[3px]"
        style={{
          gridTemplateColumns: `repeat(${shown.length}, minmax(0, 1fr))`,
        }}
      >
        {shown.map((mark, index) => (
          <span
            key={index}
            className={cn("arena-cell -skew-x-[14deg]", MARK_CLASS[mark])}
            style={{ animationDelay: `${0.5 + index * CELL_DELAY_S}s` }}
          />
        ))}
      </div>
    </div>
  );
}

function Legend({ mark, label }: { mark: RaidMark; label: string }) {
  return (
    <span className="flex items-center gap-1">
      <span className={cn("size-2 -skew-x-[14deg]", MARK_CLASS[mark])} />
      {label}
    </span>
  );
}

function stripTitle(marks: RaidMark[], shownCount: number) {
  if (isStripTrimmed(marks)) return `Последние ${shownCount} рейдов`;
  return "Рейды вара по порядку";
}

function placeText(summary: AttendanceSummary) {
  if (summary.place === null) return "Вы ещё не были на ПВП-рейдах этого вара";
  return `${summary.place}-е место по явке из ${summary.participants}`;
}
