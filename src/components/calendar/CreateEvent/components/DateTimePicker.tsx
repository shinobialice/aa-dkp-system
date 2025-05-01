"use client";
import { DateTimePicker as BaseDateTimePicker } from "@/components/ui/date-time-picker";
import React from "react";

type Props = {
  value: Date | null;
  onChange: (value: Date | null) => void;
};

const DatetimePicker: React.FC<Props> = ({ value, onChange }) => {
  return (
    <BaseDateTimePicker
      value={value ?? undefined} // 👈 внутренний компонент ждёт undefined
      onChange={(date: Date | undefined) => onChange(date ?? null)} // 👈 мы возвращаем null
      defaultPopupValue={new Date()}
      granularity="minute"
      className="w-[270px]"
    />
  );
};

export default DatetimePicker;
