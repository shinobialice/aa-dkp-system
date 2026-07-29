"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button, Input, Label, Switch } from "@/shared/ui";
import {
  getSalaryEligibilitySettings,
  updateSalaryEligibilitySettings,
  type SalaryEligibilitySettings,
} from "@/actions/salaryEligibilitySettings";

export function SalaryEligibilitySettingsForm() {
  const [settings, setSettings] = useState<SalaryEligibilitySettings | null>(
    null,
  );
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getSalaryEligibilitySettings().then(setSettings);
  }, []);

  if (!settings) {
    return <p className="text-sm text-muted-foreground">Загрузка...</p>;
  }

  async function handleSave() {
    if (!settings) return;
    setSaving(true);
    try {
      await updateSalaryEligibilitySettings(settings);
      toast.success("Критерии допуска сохранены");
    } catch {
      toast.error("Не удалось сохранить критерии");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Критерии выдачи зарплаты</h2>

      <div className="flex items-center justify-between gap-4 border rounded-lg p-3">
        <div className="flex items-center gap-2">
          <Label>По посещаемости праймов &gt;</Label>
          <Input
            type="number"
            className="w-20"
            value={settings.primeThresholdPercent}
            onChange={(e) =>
              setSettings({
                ...settings,
                primeThresholdPercent: Number(e.target.value),
              })
            }
          />
          <span>%</span>
        </div>
        <Switch
          checked={settings.primeEnabled}
          onCheckedChange={(v) => setSettings({ ...settings, primeEnabled: v })}
        />
      </div>

      <div className="flex items-center justify-between gap-4 border rounded-lg p-3">
        <div className="flex items-center gap-2">
          <Label>По учёту баллов &gt;</Label>
          <Input
            type="number"
            className="w-20"
            value={settings.pointsThresholdPercent}
            onChange={(e) =>
              setSettings({
                ...settings,
                pointsThresholdPercent: Number(e.target.value),
              })
            }
          />
          <span>%</span>
        </div>
        <Switch
          checked={settings.pointsEnabled}
          onCheckedChange={(v) =>
            setSettings({ ...settings, pointsEnabled: v })
          }
        />
      </div>

      <div className="flex items-center justify-between gap-4 border rounded-lg p-3">
        <Label>ДВ — тег обходит пороги выше</Label>
        <Switch
          checked={settings.dvBypassEnabled}
          onCheckedChange={(v) =>
            setSettings({ ...settings, dvBypassEnabled: v })
          }
        />
      </div>

      <div className="flex items-center justify-between gap-4 border rounded-lg p-3">
        <Label>
          Гс — проходной порог по формуле гильдии (тег ДВ не обходит)
        </Label>
        <Switch
          checked={settings.gsEnabled}
          onCheckedChange={(v) => setSettings({ ...settings, gsEnabled: v })}
        />
      </div>

      <Button
        onClick={handleSave}
        disabled={saving}
        className="cursor-pointer"
      >
        {saving ? "Сохранение..." : "Сохранить"}
      </Button>
    </div>
  );
}
