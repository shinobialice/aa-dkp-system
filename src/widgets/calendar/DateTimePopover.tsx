"use client";

import { useState, type PointerEvent, type ReactNode } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/ui";
import MskDateTimePicker from "@/widgets/calendar/MskDateTimePicker";

type Props = {
  value: Date | null;
  onChange: (value: Date | null) => void;
  onConfirm?: () => void;
  children: ReactNode;
};

export default function DateTimePopover({
  value,
  onChange,
  onConfirm,
  children,
}: Props) {
  const [open, setOpen] = useState(false);

  const handleConfirm = (event: PointerEvent) => {
    event.preventDefault();
    setOpen(false);
    onConfirm?.();
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent align="center">
        <MskDateTimePicker value={value} onChange={onChange} />
        <div className="mt-2 flex justify-end">
          <button
            type="button"
            className="rounded bg-primary px-3 py-1 text-white hover:bg-primary/90"
            onPointerDown={handleConfirm}
          >
            OK
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
