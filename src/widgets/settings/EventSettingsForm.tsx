"use client";

import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Button, Input, Label } from "@/shared/ui";
import {
  getEventSettings,
  updateEventSettings,
  uploadEventBanner,
  endEventNow,
  type EventSettings,
} from "@/actions/eventSettings";
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

export function EventSettingsForm() {
  const [settings, setSettings] = useState<EventSettings | null>(null);
  const [title, setTitle] = useState("");
  const [startsAt, setStartsAt] = useState<Date | null>(null);
  const [endsAt, setEndsAt] = useState<Date | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function reload() {
    getEventSettings().then((s) => {
      setSettings(s);
      setTitle(s.title ?? "");
      setStartsAt(s.startsAt ? new Date(s.startsAt) : null);
      setEndsAt(s.endsAt ? new Date(s.endsAt) : null);
    });
  }

  useEffect(() => {
    reload();
  }, []);

  const isActive =
    !!settings?.title &&
    !!settings?.startsAt &&
    !!settings?.endsAt &&
    new Date(settings.startsAt) <= new Date() &&
    new Date(settings.endsAt) > new Date();

  async function handleSave() {
    if (!title.trim() || !startsAt || !endsAt) return;
    setSaving(true);
    try {
      await updateEventSettings({
        title: title.trim(),
        startsAt: startsAt.toISOString(),
        endsAt: endsAt.toISOString(),
      });
      toast.success("Ивент сохранён");
      reload();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Не удалось сохранить ивент");
    } finally {
      setSaving(false);
    }
  }

  async function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    setUploading(true);
    try {
      const payload = new FormData();
      payload.append("file", file);
      await uploadEventBanner(payload);
      toast.success("Картинка загружена");
      reload();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Не удалось загрузить картинку",
      );
    } finally {
      setUploading(false);
    }
  }

  async function handleEndNow() {
    try {
      await endEventNow();
      toast.success("Ивент завершён");
      reload();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Не удалось завершить ивент");
    }
  }

  if (!settings) {
    return <p className="text-sm text-muted-foreground">Загрузка...</p>;
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-bold">Ивент</h2>
        <p className="text-sm text-muted-foreground">
          Пока ивент активен (задано название и текущее время между «с» и
          «до»), на главной странице сверху появляется баннер с картинкой и
          увеличенными карточками. Без активного ивента главная выглядит как
          обычно.
        </p>
      </div>

      <div className="flex items-center gap-2 text-sm">
        <span
          className={
            "size-2 rounded-full " + (isActive ? "bg-green-500" : "bg-muted-foreground")
          }
        />
        {isActive ? "Ивент активен" : "Ивента сейчас нет"}
        {isActive && (
          <Button
            size="sm"
            variant="outline"
            className="ml-auto cursor-pointer"
            onClick={handleEndNow}
          >
            Завершить сейчас
          </Button>
        )}
      </div>

      <div className="space-y-2 border rounded-lg p-3">
        <Label className="text-muted-foreground">Ивент</Label>
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Например: Игра стоит свеч"
        />
      </div>

      <div className="flex flex-col gap-2 border rounded-lg p-3">
        <div className="flex items-center gap-2">
          <Label className="w-10 font-normal text-muted-foreground">С</Label>
          <DateTimePopover value={startsAt} onChange={setStartsAt}>
            <Button variant="outline" className="cursor-pointer">
              {startsAt ? formatMoscowDateTime(startsAt.toISOString()) : "Выбрать"}
            </Button>
          </DateTimePopover>
        </div>
        <div className="flex items-center gap-2">
          <Label className="w-10 font-normal text-muted-foreground">До</Label>
          <DateTimePopover value={endsAt} onChange={setEndsAt}>
            <Button variant="outline" className="cursor-pointer">
              {endsAt ? formatMoscowDateTime(endsAt.toISOString()) : "Выбрать"}
            </Button>
          </DateTimePopover>
        </div>
      </div>

      <div className="space-y-2 border rounded-lg p-3">
        <Label className="text-muted-foreground">Картинка баннера</Label>
        <p className="text-xs text-muted-foreground">
          Широкое изображение (примерно 1568×120 или похожих пропорций) ляжет
          лучше всего — баннер тянется на всю ширину и обрезается по высоте.
        </p>
        {settings.imageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={settings.imageUrl}
            alt="Текущий баннер"
            className="h-20 w-full rounded-md object-cover"
          />
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/gif"
          className="hidden"
          onChange={handleImageChange}
        />
        <Button
          variant="outline"
          disabled={uploading}
          onClick={() => fileInputRef.current?.click()}
          className="cursor-pointer"
        >
          {uploading ? "Загрузка..." : settings.imageUrl ? "Заменить картинку" : "Загрузить картинку"}
        </Button>
      </div>

      <Button
        onClick={handleSave}
        disabled={saving || !title.trim() || !startsAt || !endsAt}
        className="cursor-pointer w-fit"
      >
        {saving ? "Сохранение..." : "Сохранить"}
      </Button>
    </div>
  );
}
