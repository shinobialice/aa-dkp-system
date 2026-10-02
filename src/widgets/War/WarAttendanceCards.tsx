"use client";

import { CalendarCheck } from "lucide-react";
import { cn } from "@/shared/lib/tw-merge";
import type { PeriodAttendanceResult } from "@/actions/warActions";
import WarUserLink from "./WarUserLink";
import {
  MeterBar,
  PlaceNumber,
  SCROLL_LIST,
  SectionEmpty,
  WarSection,
} from "./WarParts";
import {
  buildTurnout,
  formatDecimal,
  plural,
  type TurnoutBucket,
} from "./warModel";

const BUCKET_COLOR: Record<TurnoutBucket["key"], string> = {
  steady: "bg-green-600",
  partial: "bg-amber-500",
  rare: "bg-red-500",
};

export function WarTurnoutCard({
  attendance,
}: {
  attendance: PeriodAttendanceResult;
}) {
  const total = attendance.totalRaidsInPeriod;
  const people = attendance.participantsCount;
  const { buckets, average, averagePercent } = buildTurnout(attendance);
  const filled = buckets.filter((bucket) => bucket.count > 0);

  return (
    <WarSection
      title="Явка на ПВП-рейды"
      icon={CalendarCheck}
      description={
        people
          ? `${people} ${plural(people, "игрок был", "игрока были", "игроков были")} хотя бы на одном рейде`
          : undefined
      }
    >
      {total === 0 || people === 0 ? (
        <SectionEmpty>ПВП-рейдов пока не было</SectionEmpty>
      ) : (
        <div className="flex flex-col gap-3.5 px-4 pb-4">
          <div className="flex flex-wrap items-baseline gap-x-2">
            <span className="text-[28px] leading-none font-bold tracking-tight tabular-nums">
              {averagePercent}%
            </span>
            <span className="text-sm text-muted-foreground">
              в среднем {formatDecimal(average)} из {total}{" "}
              {plural(total, "рейда", "рейдов", "рейдов")}
            </span>
          </div>
          <div
            className="flex h-3 gap-[3px] overflow-hidden rounded"
            aria-hidden
          >
            {filled.map((bucket) => (
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
                  className={cn(
                    "size-2.5 rounded-[3px]",
                    BUCKET_COLOR[bucket.key],
                  )}
                />
                <span className="min-w-0">
                  <span className="font-semibold">{bucket.label}</span>
                  <span className="text-muted-foreground">
                    {" "}
                    · {bucket.range}
                  </span>
                </span>
                <span className="font-semibold tabular-nums">
                  {bucket.count}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </WarSection>
  );
}

export function WarAttendanceCard({
  attendance,
}: {
  attendance: PeriodAttendanceResult;
}) {
  const total = attendance.totalRaidsInPeriod;
  const people = attendance.participantsCount;
  const sum = attendance.top.reduce(
    (acc, entry) => acc + entry.raidsAttended,
    0,
  );
  const average = people ? sum / people : 0;

  return (
    <WarSection
      title="Посещаемость рейдов"
      icon={CalendarCheck}
      description={
        people && total
          ? `${people} ${plural(people, "игрок", "игрока", "игроков")} · в среднем ${formatDecimal(average)} из ${total} (${Math.round((average / total) * 100)}%)`
          : undefined
      }
    >
      {people === 0 || total === 0 ? (
        <SectionEmpty>Рейдов пока не было</SectionEmpty>
      ) : (
        <ol className={cn(SCROLL_LIST, "max-h-[360px] px-4 pb-3")}>
          {attendance.top.map((entry, index) => {
            const percent = (entry.raidsAttended / total) * 100;
            return (
              <li
                key={entry.userId}
                className="grid grid-cols-[22px_minmax(0,1fr)_auto] items-center gap-x-2.5 gap-y-1 py-1.5"
              >
                <PlaceNumber place={index + 1} />
                <WarUserLink
                  userId={entry.userId}
                  name={entry.username}
                  className="font-medium"
                />
                <span className="text-sm tabular-nums">
                  <span className="font-semibold">{Math.round(percent)}%</span>{" "}
                  <span className="text-xs text-muted-foreground">
                    {formatDecimal(entry.raidsAttended)} из {total}
                  </span>
                </span>
                <MeterBar
                  percent={percent}
                  className="col-span-2 col-start-2"
                  barClassName="bg-muted-foreground/50"
                />
              </li>
            );
          })}
        </ol>
      )}
    </WarSection>
  );
}
