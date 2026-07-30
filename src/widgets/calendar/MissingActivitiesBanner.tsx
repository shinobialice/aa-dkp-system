"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, TriangleAlert, X } from "lucide-react";
import { Alert, AlertTitle, AlertDescription, Button } from "@/shared/ui";
import {
  getMissingActivitiesForMonth,
  type MissingActivities,
} from "@/actions/getMissingActivities";

const MONTH_NAMES = [
  "Январь",
  "Февраль",
  "Март",
  "Апрель",
  "Май",
  "Июнь",
  "Июль",
  "Август",
  "Сентябрь",
  "Октябрь",
  "Ноябрь",
  "Декабрь",
];

// Раиды хранятся в МСК без таймзоны, поэтому "текущий месяц" по умолчанию
// тоже считаем в МСК, а не в таймзоне браузера.
function getMoscowNow() {
  const now = new Date();
  const utc = now.getTime() + now.getTimezoneOffset() * 60000;
  const msk = new Date(utc + 3 * 60 * 60 * 1000);
  return { year: msk.getFullYear(), month: msk.getMonth() + 1 };
}

export default function MissingActivitiesBanner() {
  const { year: currentYear, month: currentMonth } = getMoscowNow();
  const [selected, setSelected] = useState({
    year: currentYear,
    month: currentMonth,
  });
  const [data, setData] = useState<MissingActivities | null>(null);
  const [open, setOpen] = useState(false);

  const isAtCurrentMonth =
    selected.year === currentYear && selected.month === currentMonth;

  useEffect(() => {
    let cancelled = false;
    getMissingActivitiesForMonth(selected.year, selected.month)
      .then((result) => {
        if (!cancelled) setData(result);
      })
      .catch(console.error);
    return () => {
      cancelled = true;
    };
  }, [selected.year, selected.month]);

  const goPrev = () => {
    setSelected(({ year, month }) =>
      month === 1 ? { year: year - 1, month: 12 } : { year, month: month - 1 },
    );
  };

  const goNext = () => {
    if (isAtCurrentMonth) return;
    setSelected(({ year, month }) =>
      month === 12 ? { year: year + 1, month: 1 } : { year, month: month + 1 },
    );
  };

  if (!open) {
    const currentMonthDeficit = isAtCurrentMonth ? data?.hasDeficit : undefined;
    return (
      <div className="mx-6 mb-4">
        <Button
          variant="outline"
          className="cursor-pointer gap-2"
          onClick={() => setOpen(true)}
        >
          {currentMonthDeficit && (
            <TriangleAlert className="size-4 text-destructive" />
          )}
          Активности по расписанию
          {currentMonthDeficit && (
            <span className="rounded-full bg-destructive px-1.5 text-xs text-white">
              {data?.missingSlots.length}
            </span>
          )}
        </Button>
      </div>
    );
  }

  const byDate = new Map<string, { time: string; bossName: string }[]>();
  for (const slot of data?.missingSlots ?? []) {
    if (!byDate.has(slot.date)) byDate.set(slot.date, []);
    byDate.get(slot.date)!.push(slot);
  }

  return (
    <Alert
      variant={data?.hasDeficit ? "destructive" : "default"}
      className="mx-6 mb-4 w-auto"
    >
      <TriangleAlert />
      <AlertTitle className="flex w-full items-center justify-between gap-2">
        <span>Обязательные активности по расписанию</span>
        <span className="flex items-center gap-1">
          <Button
            variant="outline"
            size="icon-sm"
            className="cursor-pointer"
            onClick={goPrev}
          >
            <ChevronLeft className="size-4" />
          </Button>
          <span className="text-nowrap text-sm font-normal">
            {MONTH_NAMES[selected.month - 1]} {selected.year}
          </span>
          <Button
            variant="outline"
            size="icon-sm"
            className="cursor-pointer"
            onClick={goNext}
            disabled={isAtCurrentMonth}
          >
            <ChevronRight className="size-4" />
          </Button>
          <Button
            variant="outline"
            size="icon-sm"
            className="cursor-pointer ml-2"
            onClick={() => setOpen(false)}
          >
            <X className="size-4" />
          </Button>
        </span>
      </AlertTitle>
      <AlertDescription>
        {!data ? (
          <p>Загрузка…</p>
        ) : !data.hasDeficit ? (
          <p>Все обязательные активности за месяц проведены.</p>
        ) : (
          <div className="max-h-64 w-full overflow-y-auto">
            {Array.from(byDate.entries()).map(([date, slots]) => (
              <p key={date}>
                <span className="font-medium">{date}:</span>{" "}
                {slots.map((s) => `${s.time} ${s.bossName}`).join(", ")}
              </p>
            ))}
          </div>
        )}
      </AlertDescription>
    </Alert>
  );
}
