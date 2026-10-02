"use client";

import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Button, Input } from "@/shared/ui";
import { cn } from "@/shared/lib/tw-merge";
import {
  getEventSettings,
  updateEventSettings,
  uploadEventBanner,
  endEventNow,
} from "@/actions/eventSettings";
import { DateTimePopover } from "@/widgets/MainPageCards/DateTimePopover";
import { useSettingsDraft } from "./settingsDraft";
import { Loading, SettingRow, SettingsCard } from "./settingsUi";

export function formatMoscowDateTime(iso: string): string {
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

export type EventDraft = {
  title: string;
  link: string;
  startsAt: string | null;
  endsAt: string | null;
};

export const EVENT_DRAFT_ID = "event";

export function isEventActive(event: EventDraft | null) {
  if (!event?.title || !event.startsAt || !event.endsAt) return false;
  const now = new Date();
  return new Date(event.startsAt) <= now && new Date(event.endsAt) > now;
}

export function EventSettingsForm() {
  const event = useSettingsDraft<EventDraft>({
    id: EVENT_DRAFT_ID,
    section: "event",
    label: "Ивент",
    load: async () => {
      const s = await getEventSettings();
      return {
        title: s.title ?? "",
        link: s.link ?? "",
        startsAt: s.startsAt,
        endsAt: s.endsAt,
      };
    },
    save: async (value) => {
      if (!value.title.trim() || !value.startsAt || !value.endsAt) {
        throw new Error("У ивента нужны название и даты «с» и «до»");
      }
      await updateEventSettings({
        title: value.title.trim(),
        startsAt: value.startsAt,
        endsAt: value.endsAt,
        link: value.link.trim(),
      });
    },
  });
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadImage = () =>
    getEventSettings()
      .then((s) => setImageUrl(s.imageUrl ?? null))
      .catch(() => {});

  useEffect(() => {
    getEventSettings()
      .then((s) => setImageUrl(s.imageUrl ?? null))
      .catch(() => {});
  }, []);

  const value = event.value;
  if (!value) return <Loading />;
  const set = (patch: Partial<EventDraft>) =>
    event.setValue((v) => ({ ...v, ...patch }));
  const active = isEventActive(event.saved);

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
      await loadImage();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Не удалось загрузить картинку",
      );
    } finally {
      setUploading(false);
    }
  }

  async function handleEndNow() {
    try {
      await endEventNow();
      toast.success("Ивент завершён");
      event.reload();
    } catch (e) {
      toast.error(
        e instanceof Error ? e.message : "Не удалось завершить ивент",
      );
    }
  }

  const dateButton = (
    current: string | null,
    onPick: (iso: string | null) => void,
    label: string,
  ) => (
    <DateTimePopover
      value={current ? new Date(current) : null}
      onChange={(date) => onPick(date ? date.toISOString() : null)}
    >
      <Button
        variant="outline"
        size="sm"
        className="cursor-pointer"
        aria-label={label}
      >
        {current ? formatMoscowDateTime(current) : "Выбрать"}
      </Button>
    </DateTimePopover>
  );

  return (
    <SettingsCard
      title="Ивент"
      hint="пока он идёт, на главной сверху баннер и увеличенные карточки"
      action={
        <span className="flex items-center gap-2 text-[13px]">
          <span
            className={cn(
              "size-2 rounded-full",
              active ? "bg-green-500" : "bg-muted-foreground/50",
            )}
          />
          {active ? "Идёт сейчас" : "Ивента сейчас нет"}
          {active && (
            <Button
              size="sm"
              variant="outline"
              className="cursor-pointer"
              onClick={handleEndNow}
            >
              Завершить сейчас
            </Button>
          )}
        </span>
      }
    >
      <SettingRow
        title="Название"
        htmlFor="event-title"
        changed={event.changed((v) => v.title)}
      >
        <Input
          id="event-title"
          className="w-full sm:w-72"
          value={value.title}
          onChange={(e) => set({ title: e.target.value })}
          placeholder="Например: Игра стоит свеч"
        />
      </SettingRow>
      <SettingRow
        title="Ссылка"
        hint="Куда ведёт баннер при клике"
        htmlFor="event-link"
        changed={event.changed((v) => v.link)}
      >
        <Input
          id="event-link"
          className="w-full sm:w-72"
          value={value.link}
          onChange={(e) => set({ link: e.target.value })}
          placeholder="https://..."
        />
      </SettingRow>
      <SettingRow
        title="Когда"
        hint="МСК"
        changed={event.changed((v) => [v.startsAt, v.endsAt])}
      >
        <span className="text-[12.5px] text-muted-foreground">с</span>
        {dateButton(value.startsAt, (startsAt) => set({ startsAt }), "Начало")}
        <span className="text-[12.5px] text-muted-foreground">до</span>
        {dateButton(value.endsAt, (endsAt) => set({ endsAt }), "Конец")}
      </SettingRow>
      <SettingRow
        title="Картинка баннера"
        hint="Загружается сразу. Лучше широкая, примерно 1568×120: баннер тянется на всю ширину и обрезается по высоте"
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/gif"
          className="hidden"
          onChange={handleImageChange}
        />
        <Button
          variant="outline"
          size="sm"
          disabled={uploading}
          onClick={() => fileInputRef.current?.click()}
          className="cursor-pointer"
        >
          {uploading
            ? "Загрузка…"
            : imageUrl
              ? "Заменить картинку"
              : "Загрузить картинку"}
        </Button>
      </SettingRow>
      {imageUrl && (
        <div className="px-4 py-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageUrl}
            alt="Текущий баннер"
            className="h-20 w-full rounded-md object-cover"
          />
        </div>
      )}
    </SettingsCard>
  );
}
