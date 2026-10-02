"use client";

import { useEffect, useState, type FormEvent } from "react";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Flag,
  Plus,
  X,
} from "lucide-react";
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
  const [expanded, setExpanded] = useState(false);

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
  const count = data?.missingSlots.length ?? 0;
  const summary = Array.from(byDate.entries())
    .map(([date, slots]) => `${date} — ${slots.length}`)
    .join(", ");

  return (
    <section
      aria-label="Не заполнены"
      className={cn(
        "flex flex-col gap-2 rounded-xl border px-3.5 py-3",
        hasDeficit
          ? "border-amber-300 bg-amber-50 dark:border-amber-500/40 dark:bg-amber-500/10"
          : "bg-card",
      )}
    >
      <div className="flex flex-wrap items-center gap-2">
        <Flag
          className={cn(
            "size-4 shrink-0",
            hasDeficit
              ? "text-amber-700 dark:text-amber-400"
              : "text-muted-foreground",
          )}
        />
        <span
          className={cn(
            "font-bold whitespace-nowrap",
            hasDeficit && "text-amber-800 dark:text-amber-300",
          )}
        >
          Не заполнены
        </span>
        {hasDeficit && (
          <span className="rounded-full bg-amber-500 px-1.5 text-xs font-bold text-white">
            {count}
          </span>
        )}
        <div className="ml-auto flex items-center gap-0.5">
          <button
            type="button"
            onClick={goPrev}
            aria-label="Предыдущий месяц"
            className="flex size-7 cursor-pointer items-center justify-center rounded-md text-muted-foreground hover:bg-background/70 hover:text-foreground"
          >
            <ChevronLeft className="size-3.5" />
          </button>
          <span className="min-w-[88px] text-center text-[12.5px] font-medium tabular-nums">
            {MONTH_NAMES[selected.month - 1]} {selected.year}
          </span>
          <button
            type="button"
            onClick={goNext}
            disabled={isAtCurrentMonth}
            aria-label="Следующий месяц"
            className="flex size-7 cursor-pointer items-center justify-center rounded-md text-muted-foreground hover:bg-background/70 hover:text-foreground disabled:cursor-default disabled:opacity-40 disabled:hover:bg-transparent"
          >
            <ChevronRight className="size-3.5" />
          </button>
          {canEdit && (
            <button
              type="button"
              onClick={() => setShowAddForm((value) => !value)}
              aria-label="Добавить пункт"
              title="Добавить пункт"
              className="flex size-7 cursor-pointer items-center justify-center rounded-md text-muted-foreground hover:bg-background/70 hover:text-foreground"
            >
              <Plus className="size-4" />
            </button>
          )}
        </div>
      </div>

      {canEdit && showAddForm && (
        <form
          onSubmit={handleAdd}
          className="flex flex-wrap items-center gap-1.5 rounded-lg border bg-background p-2"
        >
          <Input
            type="date"
            value={newDate}
            onChange={(e) => setNewDate(e.target.value)}
            className="h-8 w-36 text-xs"
            required
          />
          <Input
            type="time"
            value={newTime}
            onChange={(e) => setNewTime(e.target.value)}
            className="h-8 w-24 text-xs"
            required
          />
          <Input
            list="missing-activity-boss-names"
            placeholder="Босс"
            value={newBoss}
            onChange={(e) => setNewBoss(e.target.value)}
            className="h-8 min-w-24 flex-1 text-xs"
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
            className="h-8 cursor-pointer text-xs"
            disabled={adding}
          >
            Добавить
          </Button>
        </form>
      )}

      {!data ? (
        <p className="text-[12.5px] text-muted-foreground">Загрузка…</p>
      ) : !hasDeficit ? (
        <p className="text-[12.5px] text-muted-foreground">
          Всё заполнено за месяц
        </p>
      ) : (
        <>
          <button
            type="button"
            aria-expanded={expanded}
            onClick={() => setExpanded((value) => !value)}
            className="flex cursor-pointer items-center justify-between gap-2 text-left text-[12.5px] text-amber-900 dark:text-amber-200"
          >
            <span className="min-w-0">
              {expanded
                ? "По расписанию были, но посещение не добавлено"
                : summary}
            </span>
            <span className="flex shrink-0 items-center gap-0.5 font-semibold">
              {expanded ? "Свернуть" : "Показать"}
              <ChevronDown
                className={cn(
                  "size-3.5 transition-transform",
                  expanded && "rotate-180",
                )}
              />
            </span>
          </button>
          {expanded && (
            <div className="flex max-h-56 flex-col gap-1.5 overflow-y-auto">
              {Array.from(byDate.entries()).map(([date, slots]) => (
                <div key={date} className="flex flex-wrap items-center gap-1">
                  <span className="w-11 shrink-0 text-xs font-bold text-amber-800 dark:text-amber-300">
                    {date}
                  </span>
                  {slots.map((s) => {
                    const key = `${s.rawDate}|${s.time}|${s.bossName}`;
                    return (
                      <span
                        key={key}
                        className="inline-flex h-[26px] items-center gap-0.5 rounded-full bg-background pr-1 pl-2.5 text-xs text-foreground/80"
                      >
                        {s.time} {s.bossName}
                        {s.isManual && (
                          <span className="text-muted-foreground">
                            {" "}
                            (вручную)
                          </span>
                        )}
                        {canEdit ? (
                          <button
                            type="button"
                            onClick={() => handleRemove(s)}
                            disabled={pendingKey === key}
                            aria-label="Убрать из списка"
                            title="Убрать из списка"
                            className="flex size-5 cursor-pointer items-center justify-center rounded-full text-muted-foreground hover:text-destructive disabled:opacity-50"
                          >
                            <X className="size-3" />
                          </button>
                        ) : (
                          <span className="w-1.5" />
                        )}
                      </span>
                    );
                  })}
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </section>
  );
}
