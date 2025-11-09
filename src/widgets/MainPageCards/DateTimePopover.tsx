import React from "react";
import DatetimePicker from "../calendar/CreateEvent/components/DateTimePicker";
import { Popover, PopoverTrigger, PopoverContent } from "@/shared/ui/popover";

export function DateTimePopover({
  value,
  onChange,
  children,
}: {
  value: Date | null;
  onChange: (value: Date | null) => void;
  children: React.ReactNode;
}) {
  const [open, setOpen] = React.useState(false);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent align="center">
        <DatetimePicker value={value} onChange={onChange} />
        <div className="flex justify-end mt-2">
          <button
            className="px-3 py-1 bg-primary text-white rounded hover:bg-primary/90"
            onClick={() => setOpen(false)}
          >
            OK
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
