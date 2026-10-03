"use client";

import { cn } from "@/shared/lib/tw-merge";
import { eventStyle, type ScheduleEvent } from "./scheduleModel";
import { KIND_TEXT } from "./scheduleStyles";

export type DayState = {
  isToday: boolean;
  currentMinutes: number | null;
};

export function EventName({
  event,
  className,
}: {
  event: ScheduleEvent;
  className?: string;
}) {
  return (
    <span
      style={eventStyle(event.name)}
      className={cn(KIND_TEXT[event.kind], className)}
    >
      {event.name}
    </span>
  );
}
