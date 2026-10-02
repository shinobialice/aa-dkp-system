"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Card } from "@/shared/ui";
import { cn } from "@/shared/lib/tw-merge";
import {
  useUpcomingEvents,
  bossImages,
  type UpcomingEvent,
} from "@/hooks/useUpcomingEvents";
import { bosses as respawnBosses } from "@/shared/config/bossRespawn";
import { getMoscowTime } from "@/shared/config/fixedSchedule";
import { formatDuration } from "./mainPageTime";
import SoundNotificationToggle from "./SoundNotificationToggle";

const LIST_SIZE = 10;
const RELATIVE_LIMIT_MIN = 6 * 60;

function dayKey(date: Date) {
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
}

function dayLabel(date: Date, today: Date) {
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  if (dayKey(date) === dayKey(today)) return "Сегодня";
  if (dayKey(date) === dayKey(tomorrow)) return "Завтра";
  const label = date.toLocaleDateString("ru-RU", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
  return label.charAt(0).toUpperCase() + label.slice(1);
}

function isRespawn(event: UpcomingEvent) {
  return (respawnBosses as string[]).includes(event.boss);
}

function relative(event: UpcomingEvent) {
  if (event.isNow) return `ещё ${formatDuration(event.endsInMin ?? 0)}`;
  const minutes = event.startsInMin ?? 0;
  return minutes < RELATIVE_LIMIT_MIN ? `через ${formatDuration(minutes)}` : "";
}

function BossThumb({ boss, size }: { boss: string; size: number }) {
  const src = bossImages[boss];
  if (!src) {
    return (
      <span
        className="shrink-0 rounded-md bg-muted"
        style={{ width: size, height: size }}
      />
    );
  }
  return (
    <Image
      src={src}
      alt=""
      width={size}
      height={size}
      className="shrink-0 rounded-md object-cover"
      style={{ width: size, height: size }}
    />
  );
}

function NextEvent({ event }: { event: UpcomingEvent }) {
  return (
    <div
      className={cn(
        "mx-4 mb-3 flex items-center gap-3 rounded-xl border p-3",
        "border-green-200 bg-green-50 dark:border-green-500/30 dark:bg-green-500/10",
      )}
    >
      <BossThumb boss={event.boss} size={56} />
      <div className="min-w-0 flex-1">
        <p className="text-xs font-semibold text-green-700 dark:text-green-400">
          {event.isNow ? "Идёт сейчас" : "Следующее"}
        </p>
        <p className="truncate text-xl leading-tight font-bold">{event.boss}</p>
        <p className="text-sm text-foreground/80">
          <span className="font-semibold tabular-nums">{event.time}</span>
          {" · "}
          {event.isNow
            ? `до конца ${formatDuration(event.endsInMin ?? 0)}`
            : `через ${formatDuration(event.startsInMin ?? 0)}`}
        </p>
      </div>
    </div>
  );
}

export default function UpcomingEvents({ className }: { className?: string }) {
  const events = useUpcomingEvents();
  const [next, ...rest] = events;
  const today = getMoscowTime();

  const groups: { label: string; events: UpcomingEvent[] }[] = [];
  for (const event of rest.slice(0, LIST_SIZE)) {
    const label = dayLabel(event.date, today);
    const group = groups[groups.length - 1];
    if (group && group.label === label) group.events.push(event);
    else groups.push({ label, events: [event] });
  }

  return (
    <Card className={cn("min-w-0 gap-0 py-0", className)}>
      <div className="flex items-center justify-between gap-2 px-4 py-3.5">
        <h2 className="font-semibold">Ближайшие события</h2>
        <SoundNotificationToggle />
      </div>

      {next ? (
        <NextEvent event={next} />
      ) : (
        <p className="px-4 pb-4 text-sm text-muted-foreground">
          Событий на неделю вперёд нет
        </p>
      )}

      {groups.map((group) => (
        <div key={group.label} className="pb-1">
          <p className="px-4 pt-1 pb-1.5 text-xs font-semibold text-muted-foreground">
            {group.label}
          </p>
          {group.events.map((event) => (
            <div
              key={event.key}
              className="grid min-h-10 grid-cols-[auto_28px_minmax(0,1fr)_auto] items-center gap-2.5 px-4 py-1"
            >
              <span className="min-w-11 font-semibold tabular-nums">{event.time}</span>
              <BossThumb boss={event.boss} size={28} />
              <span className="min-w-0 truncate">
                {event.boss}
                {isRespawn(event) && (
                  <span className="ml-1.5 rounded-full bg-muted px-1.5 py-px text-[11px] text-muted-foreground">
                    респаун
                  </span>
                )}
              </span>
              <span className="text-xs whitespace-nowrap text-muted-foreground">
                {relative(event)}
              </span>
            </div>
          ))}
        </div>
      ))}

      <div className="mt-1 border-t px-4 py-3">
        <Link
          href="/schedule"
          className="inline-flex items-center gap-1 text-sm font-medium text-green-700 hover:underline dark:text-green-400"
        >
          Расписание на неделю
          <ChevronRight className="size-4" />
        </Link>
      </div>
    </Card>
  );
}
