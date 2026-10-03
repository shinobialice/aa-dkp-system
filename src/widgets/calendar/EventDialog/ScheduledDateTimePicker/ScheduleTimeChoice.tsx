import type { ReactNode } from "react";
import {
  Button,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui";
import {
  availableTimes,
  type BossSchedule,
  type ScheduleMode,
} from "./scheduleModel";

type Props = {
  mode: Exclude<ScheduleMode, "free">;
  bossName: string | null;
  isLoading: boolean;
  hasError: boolean;
  schedule: BossSchedule;
  selectedTime: string | null;
  onSelect: (time: string) => void;
};

export default function ScheduleTimeChoice({
  mode,
  bossName,
  isLoading,
  hasError,
  schedule,
  selectedTime,
  onSelect,
}: Props) {
  if (isLoading) {
    return (
      <p className="text-sm text-muted-foreground">Загрузка расписания...</p>
    );
  }
  if (hasError) {
    return (
      <ScheduleWarning>
        Не удалось загрузить расписание — попробуйте выбрать дату ещё раз
      </ScheduleWarning>
    );
  }

  const times = availableTimes(mode, schedule);

  if (mode === "locked-single") {
    if (times.length === 0) {
      return (
        <ScheduleWarning>
          {bossName} не рейдится в этот день недели — выберите другую дату
        </ScheduleWarning>
      );
    }
    return (
      <p className="text-sm text-muted-foreground">
        Время зафиксировано: <strong>{times[0]}</strong> (по расписанию)
      </p>
    );
  }

  if (mode === "agl-slots") {
    if (times.length === 0) {
      return (
        <ScheduleWarning>Все слоты АГЛ на эту дату уже заняты</ScheduleWarning>
      );
    }
    return (
      <Select value={selectedTime ?? undefined} onValueChange={onSelect}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Выберите время" />
        </SelectTrigger>
        <SelectContent>
          {times.map((time) => (
            <SelectItem key={time} value={time}>
              {time}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  }

  if (times.length === 0) {
    return (
      <ScheduleWarning>
        Кошка не рейдится в этот день недели — выберите другую дату
      </ScheduleWarning>
    );
  }
  return (
    <div className="flex gap-2">
      {times.map((time, index) => (
        <Button
          key={time}
          type="button"
          variant={selectedTime === time ? "default" : "outline"}
          className="cursor-pointer"
          onClick={() => onSelect(time)}
        >
          {index === 0 ? "Утро" : "Вечер"} ({time})
        </Button>
      ))}
    </div>
  );
}

function ScheduleWarning({ children }: { children: ReactNode }) {
  return <p className="text-sm text-red-500">{children}</p>;
}
