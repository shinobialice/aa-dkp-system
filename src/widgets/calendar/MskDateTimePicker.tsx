"use client";

import { DateTimePicker } from "@/shared/ui";

type Props = {
  value: Date | null;
  onChange: (value: Date | null) => void;
};

export default function MskDateTimePicker({ value, onChange }: Props) {
  return (
    <DateTimePicker
      timezone="Europe/Moscow"
      value={value ?? undefined}
      onChange={(date: Date | undefined) => onChange(date ?? null)}
      timePicker={{ hour: true, minute: true, second: false }}
      className="w-full"
    />
  );
}
