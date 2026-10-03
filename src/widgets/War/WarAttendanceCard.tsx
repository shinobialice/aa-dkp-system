import { CalendarCheck } from "lucide-react";
import type { PeriodAttendanceResult } from "@/actions/warAttendance";
import { plural } from "@/shared/lib/format";
import { cn } from "@/shared/lib/tw-merge";
import MeterBar from "./MeterBar";
import PlaceNumber from "./PlaceNumber";
import { formatDecimal, SCROLL_LIST } from "./warModel";
import WarSection from "./WarSection";
import WarUserLink from "./WarUserLink";

type Props = {
  attendance: PeriodAttendanceResult;
};

export default function WarAttendanceCard({ attendance }: Props) {
  const total = attendance.totalRaidsInPeriod;
  const people = attendance.participantsCount;
  const sum = attendance.top.reduce(
    (acc, entry) => acc + entry.raidsAttended,
    0,
  );
  const average = people ? sum / people : 0;
  const description =
    people && total
      ? `${people} ${plural(people, "игрок", "игрока", "игроков")} · в среднем ${formatDecimal(average)} из ${total} (${Math.round((average / total) * 100)}%)`
      : undefined;

  return (
    <WarSection
      title="Посещаемость рейдов"
      icon={CalendarCheck}
      description={description}
      empty={people === 0 || total === 0 ? "Рейдов пока не было" : null}
    >
      <ol className={cn(SCROLL_LIST, "max-h-90 px-4 pb-3")}>
        {attendance.top.map((entry, index) => {
          const percent = total ? (entry.raidsAttended / total) * 100 : 0;
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
    </WarSection>
  );
}
