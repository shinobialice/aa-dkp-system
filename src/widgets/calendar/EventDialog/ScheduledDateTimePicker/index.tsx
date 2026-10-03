"use client";

import { useState } from "react";
import { DateTimePicker } from "@/shared/ui";
import MskDateTimePicker from "@/widgets/calendar/MskDateTimePicker";
import { combineDateAndTime, scheduleMode } from "./scheduleModel";
import ScheduleTimeChoice from "./ScheduleTimeChoice";
import { useBossSchedule } from "./useBossSchedule";

type Props = {
  category: string | null;
  selectedBoss: string | null;
  value: Date | null;
  onChange: (date: Date | null) => void;
};

type PickedTime = { key: string | null; time: string };

// Для боссов с жёстким расписанием (week_schedule_event) даёт выбрать только
// дату, а время подставляет само: по расписанию дня (Кракен/Калидис/Анталлон/
// Левиафан/Ксанатос), из свободных слотов (АГЛ) или переключателем утро/вечер
// (Кошка). В режиме редактирования не используется: расписание могло
// измениться, и мы не хотим тихо переписывать время исторического рейда.
export default function ScheduledDateTimePicker({
  category,
  selectedBoss,
  value,
  onChange,
}: Props) {
  const mode = scheduleMode(category, selectedBoss);
  const [dateOnly, setDateOnly] = useState<Date | null>(value);
  const [picked, setPicked] = useState<PickedTime | null>(null);
  const { key, isLoading, hasError, schedule } = useBossSchedule(
    mode,
    selectedBoss,
    dateOnly,
    onChange,
  );

  if (mode === "free") {
    return <MskDateTimePicker value={value} onChange={onChange} />;
  }

  const selectedTime = picked?.key === key ? picked.time : null;

  const handleDateChange = (date: Date | undefined) => {
    setDateOnly(date ?? null);
    onChange(null);
  };

  const handleTimeSelect = (time: string) => {
    if (!dateOnly) return;
    setPicked({ key, time });
    onChange(combineDateAndTime(dateOnly, time));
  };

  return (
    <div className="flex flex-col gap-2">
      <DateTimePicker
        hideTime
        timezone="Europe/Moscow"
        value={dateOnly ?? undefined}
        onChange={handleDateChange}
        classNames={{ trigger: "w-full" }}
      />
      {dateOnly && (
        <ScheduleTimeChoice
          mode={mode}
          bossName={selectedBoss}
          isLoading={isLoading}
          hasError={hasError}
          schedule={schedule}
          selectedTime={selectedTime}
          onSelect={handleTimeSelect}
        />
      )}
    </div>
  );
}
