"use client";

import * as React from "react";
import { ru } from "date-fns/locale";
import { DateTimePicker } from "@/components/ui/datetime-picker";
import { cn } from "@/lib/utils";

type DatePickerProps = {
  value?: Date;
  onChange?: (date: Date | undefined) => void;
  disabled?: boolean;
  className?: string;
}

export function TaskDatePicker({
  value,
  onChange,
  disabled,
  className,
}: DatePickerProps) {
  return (
    <DateTimePicker
      classNames={{ trigger: "w-[245px]" }}
      hideTime
      value={value}
      onChange={onChange ?? (() => {})}
      disabled={disabled}
      locale={ru}
      className={cn("w-[250px]", className)}
    />
  );
}
