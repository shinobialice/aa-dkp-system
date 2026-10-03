import { CalendarCheck } from "lucide-react";
import type { PeriodAttendanceResult } from "@/actions/warAttendance";
import { plural } from "@/shared/lib/format";
import { cn } from "@/shared/lib/tw-merge";
import { buildTurnout, formatDecimal, type TurnoutBucket } from "./warModel";
import WarSection from "./WarSection";

const BUCKET_COLOR: Record<TurnoutBucket["key"], string> = {
  steady: "bg-green-600",
  partial: "bg-amber-500",
  rare: "bg-red-500",
};

type Props = {
  attendance: PeriodAttendanceResult;
};

export default function WarTurnoutCard({ attendance }: Props) {
  const total = attendance.totalRaidsInPeriod;
  const people = attendance.participantsCount;
  const { buckets, average, averagePercent } = buildTurnout(attendance);
  const description = people
    ? `${people} ${plural(people, "игрок был", "игрока были", "игроков были")} хотя бы на одном рейде`
    : undefined;

  return (
    <WarSection
      title="Явка на ПВП-рейды"
      icon={CalendarCheck}
      description={description}
      empty={total === 0 || people === 0 ? "ПВП-рейдов пока не было" : null}
    >
      <div className="flex flex-col gap-3.5 px-4 pb-4">
        <div className="flex flex-wrap items-baseline gap-x-2">
          <span className="text-3xl leading-none font-bold tracking-tight tabular-nums">
            {averagePercent}%
          </span>
          <span className="text-sm text-muted-foreground">
            в среднем {formatDecimal(average)} из {total}{" "}
            {plural(total, "рейда", "рейдов", "рейдов")}
          </span>
        </div>
        <div className="flex h-3 gap-0.75 overflow-hidden rounded" aria-hidden>
          {buckets
            .filter((bucket) => bucket.count > 0)
            .map((bucket) => (
              <span
                key={bucket.key}
                className={BUCKET_COLOR[bucket.key]}
                style={{ flexGrow: bucket.count }}
              />
            ))}
        </div>
        <ul className="flex flex-col gap-2 text-sm">
          {buckets.map((bucket) => (
            <li
              key={bucket.key}
              className="grid grid-cols-[10px_minmax(0,1fr)_auto] items-center gap-2.5"
            >
              <span
                className={cn("size-2.5 rounded-sm", BUCKET_COLOR[bucket.key])}
              />
              <span className="min-w-0">
                <span className="font-semibold">{bucket.label}</span>
                <span className="text-muted-foreground"> · {bucket.range}</span>
              </span>
              <span className="font-semibold tabular-nums">{bucket.count}</span>
            </li>
          ))}
        </ul>
      </div>
    </WarSection>
  );
}
