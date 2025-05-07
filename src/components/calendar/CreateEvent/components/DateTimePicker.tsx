"use client";

import React from "react";
import { DateTimePicker } from "@/components/ui/datetime-picker";

type Props = {
  value: Date | null;
  onChange: (value: Date | null) => void;
};

const DatetimePicker: React.FC<Props> = ({ value, onChange }) => (
    <DateTimePicker
      value={value ?? undefined}
      onChange={(date: Date | undefined) => onChange(date ?? null)}
      timePicker={{ hour: true, minute: true, second: false }}
      className="w-[270px]"
    />
  );

export default DatetimePicker;
