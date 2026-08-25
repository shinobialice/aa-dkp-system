"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, TriangleAlert } from "lucide-react";
import { Button } from "@/shared/ui";
import { cn } from "@/shared/lib";
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

// Постоянная карточка статуса в боковой панели — раньше это был
// раскрывающийся на всю ширину алерт, который при открытии сдвигал
// календарь вниз. Теперь она всегда видна и не двигает соседей.
export default function MissingActivitiesBanner() {
  const { year: currentYear, month: currentMonth } = getMoscowNow();
  const [selected, setSelected] = useState({
    year: currentYear,
    month: currentMonth,
  });
  const [data, setData] = useState<MissingActivities | null>(null);

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

  const byDate = new Map<string, { time: string; bossName: string }[]>();
  for (const slot of data?.missingSlots ?? []) {
    if (!byDate.has(slot.date)) byDate.set(slot.date, []);
    byDate.get(slot.date)!.push(slot);
  }

  const hasDeficit = !!data?.hasDeficit;

  return (
    <div className="rounded-lg border bg-card p-3">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <TriangleAlert
            className={cn(
              "size-3.5",
              hasDeficit ? "text-destructive" : "text-muted-foreground",
            )}
          />
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Обязательные посещения
          </p>
        </div>
        {hasDeficit && (
          <span className="rounded-full bg-destructive px-1.5 text-xs font-semibold text-white">
            {data?.missingSlots.length}
          </span>
        )}
      </div>

      <div className="mt-2 flex items-center justify-center gap-1">
        <Button
          variant="outline"
          size="icon-sm"
          className="cursor-pointer"
          onClick={goPrev}
        >
          <ChevronLeft className="size-3.5" />
        </Button>
        <span className="flex-1 text-center text-sm font-medium tabular-nums">
          {MONTH_NAMES[selected.month - 1]} {selected.year}
        </span>
        <Button
          variant="outline"
          size="icon-sm"
          className="cursor-pointer"
          onClick={goNext}
          disabled={isAtCurrentMonth}
        >
          <ChevronRight className="size-3.5" />
        </Button>
      </div>

      <div className="mt-2 text-sm">
        {!data ? (
          <p className="text-muted-foreground">Загрузка…</p>
        ) : !hasDeficit ? (
          <p className="text-muted-foreground">
            Все обязательные посещения за месяц проведены.
          </p>
        ) : (
          <div className="max-h-40 space-y-1 overflow-y-auto pr-1">
            {Array.from(byDate.entries()).map(([date, slots]) => (
              <p key={date} className="leading-snug">
                <span className="font-medium">{date}:</span>{" "}
                <span className="text-muted-foreground">
                  {slots.map((s) => `${s.time} ${s.bossName}`).join(", ")}
                </span>
              </p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
