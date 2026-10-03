import type { UpcomingEvent } from "@/shared/lib/upcomingEvents";
import BossThumb from "./BossThumb";
import { isRespawnEvent, relativeTime } from "./upcomingModel";

type Props = {
  event: UpcomingEvent;
};

export default function UpcomingEventRow({ event }: Props) {
  return (
    <div className="grid min-h-10 grid-cols-[auto_28px_minmax(0,1fr)_auto] items-center gap-2.5 px-4 py-1">
      <span className="min-w-11 font-semibold tabular-nums">{event.time}</span>
      <BossThumb boss={event.boss} size={28} />
      <span className="min-w-0 truncate">
        {event.boss}
        {isRespawnEvent(event) && (
          <span className="ml-1.5 rounded-full bg-muted px-1.5 py-px text-2xs text-muted-foreground">
            респаун
          </span>
        )}
      </span>
      <span className="text-xs whitespace-nowrap text-muted-foreground">
        {relativeTime(event)}
      </span>
    </div>
  );
}
