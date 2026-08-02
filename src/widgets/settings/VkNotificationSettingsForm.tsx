"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button, Checkbox, Input, Label, Switch } from "@/shared/ui";
import {
  getVkNotificationSettings,
  updateVkNotificationSettings,
  type VkNotificationSettings,
} from "@/actions/vkNotificationSettings";
import { bosses, type BossName } from "@/shared/config/bossRespawn";

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

  function toggleBoss(boss: BossName, checked: boolean) {
    if (!settings) return;
    setSettings({
      ...settings,
      enabledBosses: checked
        ? [...settings.enabledBosses, boss]
        : settings.enabledBosses.filter((b) => b !== boss),
    });
  }

  return (
    <div className="space-y-6 max-w-xl">
      <div>
        <h2 className="text-xl font-bold">Уведомления ВК</h2>
        <p className="text-sm text-muted-foreground">
          Сообщения ВК-бота о скором респауне боссов — отдельно от звуковых
          оповещений в браузере.
        </p>
      </div>

      <div className="space-y-2">
        <Label>На каких боссов присылать</Label>
        <div className="space-y-2 border rounded-lg p-3">
          {bosses.map((boss) => (
            <div key={boss} className="flex items-center gap-2">
              <Checkbox
                id={`vk-boss-${boss}`}
                checked={settings.enabledBosses.includes(boss)}
                onCheckedChange={(checked) => toggleBoss(boss, checked === true)}
              />
              <Label htmlFor={`vk-boss-${boss}`} className="font-normal">
                {boss}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2 border rounded-lg p-3">
        <Label className="flex-1">За сколько минут до респауна слать</Label>
        <Input
          type="number"
          min={0}
          className="w-20"
          value={settings.notifyBeforeMinutes}
          onChange={(e) =>
            setSettings({
              ...settings,
              notifyBeforeMinutes: Number(e.target.value),
            })
          }
        />
        <span className="text-sm text-muted-foreground">мин</span>
      </div>

      <div className="space-y-3 border rounded-lg p-3">
        <div className="flex items-center justify-between gap-4">
          <Label>Тихие часы (уведомления не приходят)</Label>
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
