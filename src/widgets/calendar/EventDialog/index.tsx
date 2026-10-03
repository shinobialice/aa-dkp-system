"use client";

import type { RaidDetails } from "@/actions/getRaidById";
import { Dialog, DialogContent } from "@/shared/ui";
import EventForm from "./EventForm";
import type { EventFormMode } from "./eventFormModel";

type Props = {
  open: boolean;
  mode: EventFormMode;
  event: RaidDetails | null;
  onOpenChange: (open: boolean) => void;
  onComplete?: () => void;
};

export default function EventDialog({
  open,
  mode,
  event,
  onOpenChange,
  onComplete,
}: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex h-[100dvh] max-h-[100dvh] w-full max-w-none flex-col gap-0 overflow-hidden rounded-none p-0 sm:h-[min(860px,92dvh)] sm:max-w-6xl sm:rounded-2xl">
        <EventForm
          key={event?.id ?? "new"}
          mode={mode}
          event={event}
          onClose={() => onOpenChange(false)}
          onComplete={onComplete}
        />
      </DialogContent>
    </Dialog>
  );
}
