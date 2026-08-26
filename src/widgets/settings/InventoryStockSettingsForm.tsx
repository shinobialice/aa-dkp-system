"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button, Checkbox, Label } from "@/shared/ui";
import {
  getInventoryStockSettings,
  updateInventoryStockSettings,
  type InventoryStockSettings,
} from "@/actions/inventoryStockSettings";
import {
  getInventoryStockItems,
  type InventoryStockItem,
} from "@/actions/guildStats";

export function InventoryStockSettingsForm() {
  const [items, setItems] = useState<InventoryStockItem[] | null>(null);
  const [settings, setSettings] = useState<InventoryStockSettings | null>(
    null,
  );
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    Promise.all([getInventoryStockItems(), getInventoryStockSettings()]).then(
      ([loadedItems, loadedSettings]) => {
        setItems(loadedItems);
        setSettings(loadedSettings);
      },
    );
  }, []);

  if (!items || !settings) {
    return <p className="text-sm text-muted-foreground">Загрузка...</p>;
  }

  async function handleSave() {
    if (!settings) return;
    setSaving(true);
    try {
      await updateInventoryStockSettings(settings);
      toast.success("Настройки сохранены");
    } catch {
      toast.error("Не удалось сохранить настройки");
    } finally {
      setSaving(false);
    }
  }

  function toggle(label: string, checked: boolean) {
    if (!settings) return;
    setSettings({
      ...settings,
      hiddenLabels: checked
        ? settings.hiddenLabels.filter((l) => l !== label)
        : [...settings.hiddenLabels, label],
    });
  }

  const groups = Array.from(new Set(items.map((i) => i.group)));

  return (
    <div className="space-y-4 max-w-xl">
      <div>
        <h2 className="text-xl font-bold">Имеющиеся предметы</h2>
        <p className="text-sm text-muted-foreground">
          Какие предметы игроков показывать на странице статистики во
          вкладке «Имеющиеся предметы».
        </p>
      </div>

      {groups.map((group) => (
        <div key={group} className="space-y-2">
          <Label className="text-muted-foreground">{group}</Label>
          <div className="space-y-2 border rounded-lg p-3">
            {items
              .filter((i) => i.group === group)
              .map((item) => (
                <div key={item.label} className="flex items-center gap-2">
                  <Checkbox
                    id={`inv-stock-${item.label}`}
                    className="cursor-pointer"
                    checked={!settings.hiddenLabels.includes(item.label)}
                    onCheckedChange={(checked) =>
                      toggle(item.label, checked === true)
                    }
                  />
                  <Label
                    htmlFor={`inv-stock-${item.label}`}
                    className="font-normal cursor-pointer"
                  >
                    {item.label}
                  </Label>
                </div>
              ))}
          </div>
        </div>
      ))}

      <Button onClick={handleSave} disabled={saving} className="cursor-pointer">
        {saving ? "Сохранение..." : "Сохранить"}
      </Button>
    </div>
  );
}
