"use client";

import { toast } from "sonner";
import { Button, Input } from "@/shared/ui";
import { cn } from "@/shared/lib/tw-merge";
import {
  getEventSettings,
  updateEventSettings,
  endEventNow,
} from "@/actions/eventSettings";
import { useSettingsDraft } from "./settingsDraft";
import { Loading, SettingRow, SettingsCard } from "./settingsUi";
import { errorMessage } from "@/shared/lib/errorMessage";
import EventBannerField from "./EventBannerField";
import EventDateButton from "./EventDateButton";

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
  const value = event.value;
  if (!value) return <Loading />;
  const set = (patch: Partial<EventDraft>) =>
    event.setValue((v) => ({ ...v, ...patch }));
  const active = isEventActive(event.saved);

  async function handleEndNow() {
    try {
      await endEventNow();
      toast.success("Ивент завершён");
      event.reload();
    } catch (e) {
      toast.error(errorMessage(e, "Не удалось завершить ивент"));
    }
  }

  return (
    <SettingsCard
      title="Ивент"
      hint="пока он идёт, на главной сверху баннер и увеличенные карточки"
      action={
        <span className="flex items-center gap-2 text-sm">
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
        <span className="text-xs text-muted-foreground">с</span>
        <EventDateButton
          value={value.startsAt}
          label="Начало"
          onChange={(startsAt) => set({ startsAt })}
        />
        <span className="text-xs text-muted-foreground">до</span>
        <EventDateButton
          value={value.endsAt}
          label="Конец"
          onChange={(endsAt) => set({ endsAt })}
        />
      </SettingRow>
      <EventBannerField />
    </SettingsCard>
  );
}
