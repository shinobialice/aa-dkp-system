"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button, Label } from "@/shared/ui";
import { X, Clock } from "lucide-react";
import useCurrentUser from "@/hooks/useCurrentUser";
import { getTodayRecurringMaintenanceWindow } from "@/shared/config/bossRespawn";
import {
  getMaintenanceWindows,
  addMaintenanceWindow,
  extendMaintenanceWindow,
  deleteMaintenanceWindow,
  type MaintenanceWindowRow,
} from "@/actions/maintenanceWindows";
import { DateTimePopover } from "@/widgets/MainPageCards/DateTimePopover";

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

function ExtendButton({
  onPick,
}: {
  onPick: (date: Date) => void;
}) {
  return (
    <DateTimePopover value={null} onChange={(date) => date && onPick(date)}>
      <button
        className="cursor-pointer text-muted-foreground hover:text-foreground"
        aria-label="Продлить"
        title="Продлить"
      >
        <Clock className="size-4" />
      </button>
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

  function reload() {
    getMaintenanceWindows().then(setWindows);
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
    if (!user || !regularWindow) return;
    try {
      await addMaintenanceWindow(
        regularWindow.end.toISOString(),
        newEnd.toISOString(),
        user.id,
      );
      toast.success("Плановые работы продлены");
      reload();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Не удалось продлить работы");
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-bold">Проф. работы</h2>
        <p className="text-sm text-muted-foreground">
          Пока идут проф. работы (регулярные &laquo;четверг 05:00-11:00
          МСК&raquo; или внеплановые ниже) статус всех боссов —
          &laquo;Проф. работы&raquo;, уведомления ВК и сайта не отправляются.
        </p>
      </div>

      {regularWindow && (
        <div className="flex items-center justify-between gap-2 border rounded-lg p-3 text-sm">
          <span>
            Плановые работы сегодня: {formatMoscowTime(regularWindow.start)}–
            {formatMoscowTime(regularWindow.end)} (МСК)
          </span>
          <ExtendButton onPick={handleExtendRegular} />
        </div>
      )}

      <div className="space-y-2 border rounded-lg p-3">
        <Label className="text-muted-foreground">Внеплановые окна</Label>
        {windows === null && (
          <p className="text-sm text-muted-foreground">Загрузка...</p>
        )}
        {windows?.length === 0 && (
          <p className="text-sm text-muted-foreground">
            Активных или будущих окон нет
          </p>
        )}
        {windows?.map((w) => (
          <div
            key={w.id}
            className="flex items-center justify-between gap-2 text-sm"
          >
            <span>
              {formatMoscowDateTime(w.startAt)} — {formatMoscowDateTime(w.endAt)}
            </span>
            <div className="flex items-center gap-2">
              <ExtendButton onPick={(date) => handleExtend(w.id, date)} />
              <button
                onClick={() => handleDelete(w.id)}
                className="cursor-pointer text-muted-foreground hover:text-foreground"
                aria-label="Удалить"
                title="Удалить"
              >
                <X className="size-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-2 border rounded-lg p-3">
        <div className="flex items-center gap-2">
          <Label className="w-10 font-normal text-muted-foreground">С</Label>
          <DateTimePopover value={start} onChange={setStart}>
            <Button variant="outline" className="cursor-pointer">
              {start ? formatMoscowDateTime(start.toISOString()) : "Выбрать"}
            </Button>
          </DateTimePopover>
        </div>
        <div className="flex items-center gap-2">
          <Label className="w-10 font-normal text-muted-foreground">До</Label>
          <DateTimePopover value={end} onChange={setEnd}>
            <Button variant="outline" className="cursor-pointer">
              {end ? formatMoscowDateTime(end.toISOString()) : "Выбрать"}
            </Button>
          </DateTimePopover>
        </div>
        <Button
          onClick={handleAdd}
          disabled={saving || !start || !end}
          className="cursor-pointer w-fit"
        >
          {saving ? "Сохранение..." : "Добавить окно"}
        </Button>
      </div>
    </div>
  );
}
