"use client";

import { Input, Switch } from "@/shared/ui";
import { cn } from "@/shared/lib/tw-merge";
import {
  getVkNotificationSettings,
  updateVkNotificationSettings,
} from "@/actions/vkNotificationSettings";
import {
  resolveNotifyMinutes,
  PRIME_EVENT_NAME,
  type VkNotificationSettings,
} from "@/shared/config/vkNotificationDefaults";
import { bosses } from "@/shared/config/bossRespawn";
import { fixedScheduleEvents } from "@/shared/config/fixedSchedule";
import { useSettingsDraft } from "./settingsDraft";
import { Loading, SettingRow, SettingsCard, Unit } from "./settingsUi";

export const VK_DRAFT_ID = "vk";

// Разбираем "HH:MM" на часы/минуты для двух отдельных числовых полей —
// это (в отличие от <input type="time">) даёт гарантированно 24-часовой
// формат независимо от локали браузера/ОС пользователя.
function splitPrimeTime(value: string | null): [string, string] {
  if (!value) return ["", ""];
  const [h, m] = value.split(":");
  return [h ?? "", m ?? ""];
}

function joinPrimeTime(hour: string, minute: string): string | null {
  if (hour === "" && minute === "") return null;
  const h = String(Math.min(23, Math.max(0, Number(hour) || 0))).padStart(
    2,
    "0",
  );
  const m = String(Math.min(59, Math.max(0, Number(minute) || 0))).padStart(
    2,
    "0",
  );
  return `${h}:${m}`;
}

const weekDays: { label: string; value: number }[] = [
  { label: "Пн", value: 1 },
  { label: "Вт", value: 2 },
  { label: "Ср", value: 3 },
  { label: "Чт", value: 4 },
  { label: "Пт", value: 5 },
  { label: "Сб", value: 6 },
  { label: "Вс", value: 0 },
];

type Vk = ReturnType<typeof useSettingsDraft<VkNotificationSettings>>;

/** Строка события: включено ли напоминание и за сколько минут. */
function EventRow({ name, vk }: { name: string; vk: Vk }) {
  const settings = vk.value!;
  const enabled = settings.enabledBosses.includes(name);
  return (
    <SettingRow
      title={name}
      changed={vk.changed((v) => [
        v.enabledBosses.includes(name),
        resolveNotifyMinutes(v, name),
      ])}
    >
      <Input
        type="number"
        min={0}
        aria-label={`За сколько минут: ${name}`}
        className="h-8 w-16 text-right"
        disabled={!enabled}
        value={resolveNotifyMinutes(settings, name)}
        onChange={(e) =>
          vk.setValue((v) => ({
            ...v,
            notifyMinutesByEvent: {
              ...v.notifyMinutesByEvent,
              [name]: Number(e.target.value),
            },
          }))
        }
      />
      <Unit>мин</Unit>
      <Switch
        aria-label={`Напоминать: ${name}`}
        checked={enabled}
        onCheckedChange={(checked) =>
          vk.setValue((v) => ({
            ...v,
            enabledBosses: checked
              ? [...v.enabledBosses, name]
              : v.enabledBosses.filter((b) => b !== name),
          }))
        }
      />
    </SettingRow>
  );
}

export function VkNotificationSettingsForm() {
  const vk = useSettingsDraft<VkNotificationSettings>({
    id: VK_DRAFT_ID,
    section: "vk",
    label: "Уведомления ВК",
    load: getVkNotificationSettings,
    save: updateVkNotificationSettings,
  });

  const settings = vk.value;
  if (!settings) return <Loading />;
  const set = (patch: Partial<VkNotificationSettings>) =>
    vk.setValue((v) => ({ ...v, ...patch }));
  const [hour, minute] = splitPrimeTime(settings.primeTime);

  return (
    <>
      <SettingsCard title="Прайм">
        <EventRow name={PRIME_EVENT_NAME} vk={vk} />
        <SettingRow
          title="Время прайма"
          hint="МСК, 24 часа"
          htmlFor="vk-prime-hour"
          changed={vk.changed((v) => v.primeTime)}
        >
          <Input
            id="vk-prime-hour"
            type="number"
            min={0}
            max={23}
            placeholder="ЧЧ"
            aria-label="Часы"
            className="h-8 w-16 text-right"
            value={hour}
            onChange={(e) =>
              set({ primeTime: joinPrimeTime(e.target.value, minute) })
            }
          />
          <span className="text-muted-foreground">:</span>
          <Input
            type="number"
            min={0}
            max={59}
            placeholder="ММ"
            aria-label="Минуты"
            className="h-8 w-16 text-right"
            value={minute}
            onChange={(e) =>
              set({ primeTime: joinPrimeTime(hour, e.target.value) })
            }
          />
        </SettingRow>
        <SettingRow title="Дни недели" changed={vk.changed((v) => v.primeDays)}>
          <div role="group" aria-label="Дни прайма" className="flex gap-1">
            {weekDays.map(({ label, value }) => {
              const on = settings.primeDays.includes(value);
              return (
                <button
                  key={value}
                  type="button"
                  aria-pressed={on}
                  onClick={() =>
                    set({
                      primeDays: on
                        ? settings.primeDays.filter((d) => d !== value)
                        : [...settings.primeDays, value].sort((a, b) => a - b),
                    })
                  }
                  className={cn(
                    "h-8 w-9 cursor-pointer rounded-md border text-xs font-medium transition-colors",
                    on
                      ? "border-foreground bg-foreground text-background"
                      : "bg-background text-muted-foreground hover:bg-muted",
                  )}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </SettingRow>
      </SettingsCard>

      <SettingsCard
        title="Плавающие боссы"
        hint="без фиксированного времени · за сколько минут напомнить"
      >
        {bosses.map((boss) => (
          <EventRow key={boss} name={boss} vk={vk} />
        ))}
      </SettingsCard>

      <SettingsCard title="Расписание" hint="за сколько минут напомнить">
        {fixedScheduleEvents.map((name) => (
          <EventRow key={name} name={name} vk={vk} />
        ))}
      </SettingsCard>

      <SettingsCard title="Тихие часы">
        <SettingRow
          title="Ночью тегать @online вместо @all"
          hint="Чтобы не будить всю гильдию"
          changed={vk.changed((v) => v.quietHoursEnabled)}
        >
          <Switch
            aria-label="Тихие часы"
            checked={settings.quietHoursEnabled}
            onCheckedChange={(v) => set({ quietHoursEnabled: v })}
          />
        </SettingRow>
        <SettingRow
          title="Время"
          hint="МСК"
          changed={vk.changed((v) => [v.quietHoursStart, v.quietHoursEnd])}
        >
          <Unit>с</Unit>
          <Input
            type="number"
            min={0}
            max={23}
            aria-label="Тихие часы с"
            className="h-8 w-16 text-right"
            disabled={!settings.quietHoursEnabled}
            value={settings.quietHoursStart}
            onChange={(e) => set({ quietHoursStart: Number(e.target.value) })}
          />
          <Unit>до</Unit>
          <Input
            type="number"
            min={0}
            max={23}
            aria-label="Тихие часы до"
            className="h-8 w-16 text-right"
            disabled={!settings.quietHoursEnabled}
            value={settings.quietHoursEnd}
            onChange={(e) => set({ quietHoursEnd: Number(e.target.value) })}
          />
          <Unit>ч</Unit>
        </SettingRow>
      </SettingsCard>
    </>
  );
}
