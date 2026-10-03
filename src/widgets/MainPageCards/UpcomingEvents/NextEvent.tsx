import type { UpcomingEvent } from "@/shared/lib/upcomingEvents";
import { formatDuration } from "../mainPageTime";
import BossThumb from "./BossThumb";

type Props = {
  event: UpcomingEvent;
};

export default function NextEvent({ event }: Props) {
  const timing = event.isNow
    ? `до конца ${formatDuration(event.endsInMin ?? 0)}`
    : `через ${formatDuration(event.startsInMin ?? 0)}`;

  return (
    <div className="mx-4 mb-3 flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 p-3 dark:border-green-500/30 dark:bg-green-500/10">
      <BossThumb boss={event.boss} size={56} />
      <div className="min-w-0 flex-1">
        <p className="text-xs font-semibold text-green-700 dark:text-green-400">
          {event.isNow ? "Идёт сейчас" : "Следующее"}
        </p>
        <p className="truncate text-xl leading-tight font-bold">{event.boss}</p>
        <p className="text-sm text-foreground/80">
          <span className="font-semibold tabular-nums">{event.time}</span>
          {" · "}
          {timing}
        </p>
      </div>
    </div>
  );
}
