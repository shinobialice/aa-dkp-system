"use client";

import React from "react";
import { DateTimePicker } from "@/shared/ui";

type Props = {
  value: Date | null;
  onChange: (value: Date | null) => void;
};

const DatetimePicker: React.FC<Props> = ({ value, onChange }) => (
  <DateTimePicker
    timezone="Europe/Moscow" // ✅ вот ключ
    value={value ?? undefined}
    onChange={(date: Date | undefined) => onChange(date ?? null)}
    timePicker={{ hour: true, minute: true, second: false }}
    className="w-[270px]"
  />
);

export default DatetimePicker;
