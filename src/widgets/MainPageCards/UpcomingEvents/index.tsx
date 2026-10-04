"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { useUpcomingEvents } from "@/hooks/useUpcomingEvents";
import { getMoscowTime } from "@/shared/config/fixedSchedule";
import { cn } from "@/shared/lib/tw-merge";
import { Card } from "@/shared/ui";
import SoundNotificationToggle from "../SoundNotificationToggle";
import NextEvent from "./NextEvent";
import UpcomingEventRow from "./UpcomingEventRow";
import { groupEventsByDay, splitNextEvents } from "./upcomingModel";

const LIST_SIZE = 10;

type Props = {
  className?: string;
};

export default function UpcomingEvents({ className }: Props) {
  const { next, rest } = splitNextEvents(useUpcomingEvents());
  const groups = groupEventsByDay(rest.slice(0, LIST_SIZE), getMoscowTime());

  return (
    <Card className={cn("min-w-0 gap-0 py-0", className)}>
      <div className="flex items-center justify-between gap-2 px-4 py-3.5">
        <h2 className="font-semibold">Ближайшие события</h2>
        <SoundNotificationToggle />
      </div>

      {next.map((event) => (
        <NextEvent key={event.key} event={event} />
      ))}
      {next.length === 0 && (
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
            <UpcomingEventRow key={event.key} event={event} />
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
