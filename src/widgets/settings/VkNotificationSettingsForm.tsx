"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button, Checkbox, Input, Label, Switch } from "@/shared/ui";
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
  const h = String(Math.min(23, Math.max(0, Number(hour) || 0))).padStart(2, "0");
  const m = String(Math.min(59, Math.max(0, Number(minute) || 0))).padStart(2, "0");
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

function EventRow({
  name,
  settings,
  onToggle,
  onMinutesChange,
}: {
  name: string;
  settings: VkNotificationSettings;
  onToggle: (checked: boolean) => void;
  onMinutesChange: (minutes: number) => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <Checkbox
        id={`vk-event-${name}`}
        className="cursor-pointer"
        checked={settings.enabledBosses.includes(name)}
        onCheckedChange={(checked) => onToggle(checked === true)}
      />
      <Label
        htmlFor={`vk-event-${name}`}
        className="font-normal flex-1 cursor-pointer"
      >
        {name}
      </Label>
      <Input
        type="number"
        min={0}
        className="w-16"
        value={resolveNotifyMinutes(settings, name)}
        onChange={(e) => onMinutesChange(Number(e.target.value))}
      />
      <span className="text-xs text-muted-foreground">мин</span>
    </div>
  );
}

export function VkNotificationSettingsForm() {
  const [settings, setSettings] = useState<VkNotificationSettings | null>(
    null,
  );
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getVkNotificationSettings().then(setSettings);
  }, []);

  if (!settings) {
    return <p className="text-sm text-muted-foreground">Загрузка...</p>;
  }

  async function handleSave() {
    if (!settings) return;
    setSaving(true);
    try {
      await updateVkNotificationSettings(settings);
      toast.success("Настройки уведомлений ВК сохранены");
    } catch {
      toast.error("Не удалось сохранить настройки уведомлений ВК");
    } finally {
      setSaving(false);
    }
  }

  function toggleEvent(name: string, checked: boolean) {
    if (!settings) return;
    setSettings({
      ...settings,
      enabledBosses: checked
        ? [...settings.enabledBosses, name]
        : settings.enabledBosses.filter((b) => b !== name),
    });
  }

  function setEventMinutes(name: string, minutes: number) {
    if (!settings) return;
    setSettings({
      ...settings,
      notifyMinutesByEvent: { ...settings.notifyMinutesByEvent, [name]: minutes },
    });
  }

  function togglePrimeDay(day: number, checked: boolean) {
    if (!settings) return;
    setSettings({
      ...settings,
      primeDays: checked
        ? [...settings.primeDays, day].sort((a, b) => a - b)
        : settings.primeDays.filter((d) => d !== day),
    });
  }

  return (
    <div className="space-y-6 max-w-xl">
      <div>
        <h2 className="text-xl font-bold">Уведомления ВК</h2>
        <p className="text-sm text-muted-foreground">
          Сообщения ВК-бота о скором начале боссов и рейдов — отдельно от
          звуковых оповещений в браузере.
        </p>
      </div>

      <div className="space-y-2">
        <Label>Плавающие боссы (без фиксированного времени)</Label>
        <div className="space-y-2 border rounded-lg p-3">
          {bosses.map((boss) => (
            <EventRow
              key={boss}
              name={boss}
              settings={settings}
              onToggle={(checked) => toggleEvent(boss, checked)}
              onMinutesChange={(minutes) => setEventMinutes(boss, minutes)}
            />
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label>Прайм</Label>
        <div className="space-y-2 border rounded-lg p-3">
          <EventRow
            name={PRIME_EVENT_NAME}
            settings={settings}
            onToggle={(checked) => toggleEvent(PRIME_EVENT_NAME, checked)}
            onMinutesChange={(minutes) =>
              setEventMinutes(PRIME_EVENT_NAME, minutes)
            }
          />
          <div className="flex items-center gap-2">
            <Label htmlFor="vk-prime-hour" className="flex-1 font-normal">
              Время (МСК, 24ч)
            </Label>
            <Input
              id="vk-prime-hour"
              type="number"
              min={0}
              max={23}
              placeholder="ЧЧ"
              className="w-16"
              value={splitPrimeTime(settings.primeTime)[0]}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  primeTime: joinPrimeTime(
                    e.target.value,
                    splitPrimeTime(settings.primeTime)[1],
                  ),
                })
              }
            />
            <span className="text-muted-foreground">:</span>
            <Input
              type="number"
              min={0}
              max={59}
              placeholder="ММ"
              className="w-16"
              value={splitPrimeTime(settings.primeTime)[1]}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  primeTime: joinPrimeTime(
                    splitPrimeTime(settings.primeTime)[0],
                    e.target.value,
                  ),
                })
              }
            />
          </div>
          <div className="flex items-center gap-2">
            <Label className="font-normal">Дни недели</Label>
            <div className="flex flex-1 justify-between">
              {weekDays.map(({ label, value }) => (
                <div key={value} className="flex flex-col items-center gap-1">
                  <Checkbox
                    id={`vk-prime-day-${value}`}
                    className="cursor-pointer"
                    checked={settings.primeDays.includes(value)}
                    onCheckedChange={(checked) =>
                      togglePrimeDay(value, checked === true)
                    }
                  />
                  <Label
                    htmlFor={`vk-prime-day-${value}`}
                    className="font-normal text-xs cursor-pointer"
                  >
                    {label}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Расписание</Label>
        <div className="space-y-2 border rounded-lg p-3">
          {fixedScheduleEvents.map((name) => (
            <EventRow
              key={name}
              name={name}
              settings={settings}
              onToggle={(checked) => toggleEvent(name, checked)}
              onMinutesChange={(minutes) => setEventMinutes(name, minutes)}
            />
          ))}
        </div>
      </div>

      <div className="space-y-3 border rounded-lg p-3">
        <div className="flex items-center justify-between gap-4">
          <Label>Тихие часы (бот тегает @online вместо @all)</Label>
          <Switch
            checked={settings.quietHoursEnabled}
            onCheckedChange={(v) =>
              setSettings({ ...settings, quietHoursEnabled: v })
            }
          />
        </div>

        <div className="flex items-center gap-2">
          <Label className="flex-1 font-normal text-muted-foreground">
            С
          </Label>
          <Input
            type="number"
            min={0}
            max={23}
            className="w-20"
            disabled={!settings.quietHoursEnabled}
            value={settings.quietHoursStart}
            onChange={(e) =>
              setSettings({
                ...settings,
                quietHoursStart: Number(e.target.value),
              })
            }
          />
          <Label className="flex-1 text-right font-normal text-muted-foreground">
            до
          </Label>
          <Input
            type="number"
            min={0}
            max={23}
            className="w-20"
            disabled={!settings.quietHoursEnabled}
            value={settings.quietHoursEnd}
            onChange={(e) =>
              setSettings({
                ...settings,
                quietHoursEnd: Number(e.target.value),
              })
            }
          />
          <span className="text-sm text-muted-foreground">ч (МСК)</span>
        </div>
      </div>

      <Button onClick={handleSave} disabled={saving} className="cursor-pointer">
        {saving ? "Сохранение..." : "Сохранить"}
      </Button>
    </div>
  );
}
