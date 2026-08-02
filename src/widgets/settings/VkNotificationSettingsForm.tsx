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
  type VkNotificationSettings,
} from "@/shared/config/vkNotificationDefaults";
import { bosses } from "@/shared/config/bossRespawn";
import { fixedScheduleEvents } from "@/shared/config/fixedSchedule";

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
