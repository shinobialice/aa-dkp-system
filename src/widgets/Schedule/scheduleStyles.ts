import { type ScheduleEvent } from "./scheduleModel";

export const KIND_TEXT: Record<ScheduleEvent["kind"], string> = {
  prime:
    "font-bold text-[var(--event-color)] dark:text-[var(--event-color-dark)]",
  event:
    "font-semibold text-[var(--event-color)] dark:text-[var(--event-color-dark)]",
  agl: "font-medium text-muted-foreground",
};

export const KIND_BG: Record<ScheduleEvent["kind"], string> = {
  prime:
    "bg-[color-mix(in_srgb,var(--event-color)_10%,transparent)] dark:bg-[color-mix(in_srgb,var(--event-color-dark)_14%,transparent)]",
  event:
    "bg-[color-mix(in_srgb,var(--event-color)_7%,transparent)] dark:bg-[color-mix(in_srgb,var(--event-color-dark)_10%,transparent)]",
  agl: "",
};
