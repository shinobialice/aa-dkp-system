"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/shared/ui";
import { X, Clock } from "lucide-react";
import useCurrentUser from "@/hooks/useCurrentUser";
import {
  getTodayRecurringMaintenanceWindow,
  getNextRecurringMaintenanceWindow,
} from "@/shared/config/bossRespawn";
import {
  getMaintenanceWindows,
  addMaintenanceWindow,
  extendMaintenanceWindow,
  deleteMaintenanceWindow,
  type MaintenanceWindowRow,
} from "@/actions/maintenanceWindows";
import { DateTimePopover } from "@/widgets/MainPageCards/DateTimePopover";
import { SettingRow, SettingsCard } from "./settingsUi";

function formatMoscowDateTime(iso: string): string {
  return new Date(iso).toLocaleString("ru-RU", {
    hour12: false,
    timeZone: "Europe/Moscow",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatMoscowTime(date: Date): string {
  return date.toLocaleString("ru-RU", {
    hour12: false,
    timeZone: "Europe/Moscow",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatMoscowWeekdayDate(date: Date): string {
  return date.toLocaleString("ru-RU", {
    timeZone: "Europe/Moscow",
    weekday: "long",
    day: "2-digit",
    month: "2-digit",
  });
}

function ExtendButton({ onPick }: { onPick: (date: Date) => void }) {
  return (
    <DateTimePopover value={null} onChange={(date) => date && onPick(date)}>
      <Button
        variant="outline"
        size="sm"
        className="cursor-pointer"
        title="Продлить до выбранного времени"
      >
        <Clock className="size-4" />
        Продлить
      </Button>
    </DateTimePopover>
  );
}

export function MaintenanceWindowsForm() {
  const user = useCurrentUser();
  const [windows, setWindows] = useState<MaintenanceWindowRow[] | null>(null);
  const [start, setStart] = useState<Date | null>(null);
  const [end, setEnd] = useState<Date | null>(null);
  const [saving, setSaving] = useState(false);

  const regularWindow = getTodayRecurringMaintenanceWindow();
  const nextRegularWindow = getNextRecurringMaintenanceWindow();

  function reload() {
    getMaintenanceWindows()
      .then(setWindows)
      .catch(() => toast.error("Не удалось загрузить окна проф. работ"));
  }

  useEffect(() => {
    reload();
  }, []);

  async function handleAdd() {
    if (!user || !start || !end) return;
    setSaving(true);
    try {
      await addMaintenanceWindow(
        start.toISOString(),
        end.toISOString(),
        user.id,
      );
      toast.success("Окно профилактики добавлено");
      setStart(null);
      setEnd(null);
      reload();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Не удалось добавить окно");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: number) {
    try {
      await deleteMaintenanceWindow(id);
      reload();
    } catch {
      toast.error("Не удалось удалить окно");
    }
  }

  async function handleExtend(id: number, newEnd: Date) {
    try {
      await extendMaintenanceWindow(id, newEnd.toISOString());
      toast.success("Окно продлено");
      reload();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Не удалось продлить окно");
    }
  }

  async function handleExtendRegular(newEnd: Date) {
    if (!user || !nextRegularWindow) return;
    try {
      await addMaintenanceWindow(
        nextRegularWindow.end.toISOString(),
        newEnd.toISOString(),
        user.id,
      );
      toast.success("Плановые работы продлены");
      reload();
    } catch (e) {
      toast.error(
        e instanceof Error ? e.message : "Не удалось продлить работы",
      );
    }
  }

  return (
    <SettingsCard
      title="Проф. работы"
      hint="пока идут, у боссов статус «Проф. работы» и уведомления не отправляются"
    >
      {nextRegularWindow && (
        <SettingRow
          title={
            regularWindow
              ? "Плановые работы сегодня"
              : "Ближайшие плановые работы"
          }
          hint={
            <>
              {!regularWindow &&
                `${formatMoscowWeekdayDate(nextRegularWindow.start)}, `}
              {formatMoscowTime(nextRegularWindow.start)}–
              {formatMoscowTime(nextRegularWindow.end)} МСК · каждый четверг
            </>
          }
        >
          <ExtendButton onPick={handleExtendRegular} />
        </SettingRow>
      )}

      <div className="px-4 py-3">
        <p className="mb-1.5 font-medium">Внеплановые окна</p>
        {windows === null && (
          <p className="text-sm text-muted-foreground">Загрузка…</p>
        )}
        {windows?.length === 0 && (
          <p className="text-sm text-muted-foreground">
            Активных или будущих окон нет
          </p>
        )}
        <div className="flex flex-col gap-1.5">
          {windows?.map((w) => (
            <div
              key={w.id}
              className="flex items-center justify-between gap-2 rounded-lg border px-3 py-1.5 text-sm tabular-nums"
            >
              <span>
                {formatMoscowDateTime(w.startAt)} —{" "}
                {formatMoscowDateTime(w.endAt)}
              </span>
              <div className="flex items-center gap-1">
                <ExtendButton onPick={(date) => handleExtend(w.id, date)} />
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => handleDelete(w.id)}
                  className="cursor-pointer text-muted-foreground"
                  aria-label="Удалить окно"
                  title="Удалить"
                >
                  <X className="size-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <SettingRow
        title="Новое окно"
        hint="Добавляется сразу, отдельно от общей кнопки «Сохранить»"
      >
        <span className="text-[12.5px] text-muted-foreground">с</span>
        <DateTimePopover value={start} onChange={setStart}>
          <Button variant="outline" size="sm" className="cursor-pointer">
            {start ? formatMoscowDateTime(start.toISOString()) : "Выбрать"}
          </Button>
        </DateTimePopover>
        <span className="text-[12.5px] text-muted-foreground">до</span>
        <DateTimePopover value={end} onChange={setEnd}>
          <Button variant="outline" size="sm" className="cursor-pointer">
            {end ? formatMoscowDateTime(end.toISOString()) : "Выбрать"}
          </Button>
        </DateTimePopover>
        <Button
          size="sm"
          onClick={handleAdd}
          disabled={saving || !start || !end}
          className="cursor-pointer"
        >
          {saving ? "Добавление…" : "Добавить окно"}
        </Button>
      </SettingRow>
    </SettingsCard>
  );
}
