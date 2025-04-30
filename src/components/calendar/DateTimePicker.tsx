"use client";
import { DateTimePicker } from "@/components/ui/date-time-picker";
import React, { useState } from "react";

const DatetimePicker = () => {
  const [date, setDate] = useState<Date | undefined>(undefined);
  return (
    <DateTimePicker
      value={date}
      onChange={setDate}
      defaultPopupValue={new Date()}
      granularity="minute"
      className="w-[180px]"
    />
  );
};

export default DatetimePicker;
