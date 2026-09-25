"use client";

import { useEffect, useState, type FormEvent } from "react";
import { ChevronLeft, ChevronRight, Plus, TriangleAlert, X } from "lucide-react";
import { toast } from "sonner";
import { Button, Input } from "@/shared/ui";
import { cn } from "@/shared/lib";
import {
  getMissingActivitiesForMonth,
  type MissingActivities,
  type MissingSlot,
} from "@/actions/getMissingActivities";
import {
  addManualMissingSlot,
  dismissMissingSlot,
  removeManualMissingSlot,
} from "@/actions/missingActivityOverrides";

// Боссы, которые встречаются в еженедельном расписании — подсказки в поле
// "Босс" формы добавления, само поле остаётся свободным текстом.
const KNOWN_BOSS_NAMES = [
  "Кракен",
  "Ксанатос",
  "Левиафан",
  "Калидис",
  "Анталлон",
  "Корвус",
  "АГЛ",
  "Кошка",
  "Морф",
  "Марли Прок",
];

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
export default function MissingActivitiesBanner({
  canEdit = false,
}: {
  canEdit?: boolean;
}) {
  const { year: currentYear, month: currentMonth } = getMoscowNow();
  const [selected, setSelected] = useState({
    year: currentYear,
    month: currentMonth,
  });
  const [data, setData] = useState<MissingActivities | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");
  const [newBoss, setNewBoss] = useState("");
  const [pendingKey, setPendingKey] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);

  const isAtCurrentMonth =
    selected.year === currentYear && selected.month === currentMonth;

  const reload = () =>
    getMissingActivitiesForMonth(selected.year, selected.month)
      .then(setData)
      .catch(console.error);

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

  const handleRemove = async (slot: MissingSlot) => {
    const key = `${slot.rawDate}|${slot.time}|${slot.bossName}`;
    setPendingKey(key);
    try {
      if (slot.isManual && slot.overrideId != null) {
        await removeManualMissingSlot(slot.overrideId);
      } else {
        await dismissMissingSlot(slot.rawDate, slot.time, slot.bossName);
      }
      await reload();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Не удалось убрать пункт",
      );
    } finally {
      setPendingKey(null);
    }
  };

  const handleAdd = async (e: FormEvent) => {
    e.preventDefault();
    if (!newDate || !newTime || !newBoss.trim()) return;
    setAdding(true);
    try {
      await addManualMissingSlot(newDate, newTime, newBoss.trim());
      setNewBoss("");
      await reload();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Не удалось добавить пункт",
      );
    } finally {
      setAdding(false);
    }
  };

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

  const byDate = new Map<string, MissingSlot[]>();
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
            Не заполнены
          </p>
        </div>
        <div className="flex items-center gap-1.5">
          {hasDeficit && (
            <span className="rounded-full bg-destructive px-1.5 text-xs font-semibold text-white">
              {data?.missingSlots.length}
            </span>
          )}
          {canEdit && (
            <Button
              variant="outline"
              size="icon-sm"
              className="cursor-pointer"
              onClick={() => setShowAddForm((s) => !s)}
              title="Добавить пункт"
            >
              <Plus className="size-3.5" />
            </Button>
          )}
        </div>
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

      {canEdit && showAddForm && (
        <form
          onSubmit={handleAdd}
          className="mt-2 flex flex-col gap-1.5 rounded-md border p-2"
        >
          <div className="flex gap-1.5">
            <Input
              type="date"
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
              className="h-7 text-xs"
              required
            />
            <Input
              type="time"
              value={newTime}
              onChange={(e) => setNewTime(e.target.value)}
              className="h-7 w-24 text-xs"
              required
            />
          </div>
          <Input
            list="missing-activity-boss-names"
            placeholder="Босс"
            value={newBoss}
            onChange={(e) => setNewBoss(e.target.value)}
            className="h-7 text-xs"
            required
          />
          <datalist id="missing-activity-boss-names">
            {KNOWN_BOSS_NAMES.map((name) => (
              <option key={name} value={name} />
            ))}
          </datalist>
          <Button
            type="submit"
            size="sm"
            className="h-7 cursor-pointer text-xs"
            disabled={adding}
          >
            Добавить
          </Button>
        </form>
      )}

      <div className="mt-2 text-sm">
        {!data ? (
          <p className="text-muted-foreground">Загрузка…</p>
        ) : !hasDeficit ? (
          <p className="text-muted-foreground">
            Всё заполнено за месяц.
          </p>
        ) : (
          <div className="max-h-40 space-y-1.5 overflow-y-auto pr-1">
            {Array.from(byDate.entries()).map(([date, slots]) => (
              <div key={date} className="leading-snug">
                <span className="font-medium">{date}:</span>
                <div className="mt-0.5 flex flex-col gap-0.5">
                  {slots.map((s) => {
                    const key = `${s.rawDate}|${s.time}|${s.bossName}`;
                    return (
                      <div
                        key={key}
                        className="flex items-center justify-between gap-1 text-muted-foreground"
                      >
                        <span>
                          {s.time} {s.bossName}
                          {s.isManual && (
                            <span className="text-xs"> (вручную)</span>
                          )}
                        </span>
                        {canEdit && (
                          <button
                            type="button"
                            onClick={() => handleRemove(s)}
                            disabled={pendingKey === key}
                            className="cursor-pointer text-muted-foreground hover:text-destructive disabled:opacity-50"
                            title="Убрать из списка"
                          >
                            <X className="size-3" />
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
