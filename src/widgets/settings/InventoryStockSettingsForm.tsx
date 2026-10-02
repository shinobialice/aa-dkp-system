"use client";

import { Checkbox, Label } from "@/shared/ui";
import { cn } from "@/shared/lib/tw-merge";
import {
  getInventoryStockSettings,
  updateInventoryStockSettings,
  type InventoryStockSettings,
} from "@/actions/inventoryStockSettings";
import {
  getInventoryStockItems,
  type InventoryStockItem,
} from "@/actions/guildStats";
import { useSettingsDraft } from "./settingsDraft";
import { Loading, SettingsCard } from "./settingsUi";

type InventoryDraft = {
  items: InventoryStockItem[];
  settings: InventoryStockSettings;
};

export function InventoryStockSettingsForm() {
  const inventory = useSettingsDraft<InventoryDraft>({
    id: "inventory",
    section: "inventory",
    label: "Статистика инвентаря",
    load: async () => {
      const [items, settings] = await Promise.all([
        getInventoryStockItems(),
        getInventoryStockSettings(),
      ]);
      return { items, settings };
    },
    save: (value) => updateInventoryStockSettings(value.settings),
  });

  const value = inventory.value;
  if (!value) return <Loading />;
  const { items, settings } = value;

  function toggle(label: string, checked: boolean) {
    inventory.setValue((v) => ({
      ...v,
      settings: {
        ...v.settings,
        hiddenLabels: checked
          ? v.settings.hiddenLabels.filter((l) => l !== label)
          : [...v.settings.hiddenLabels, label],
      },
    }));
  }

  const groups = Array.from(new Set(items.map((i) => i.group)));

  return (
    <>
      {groups.map((group) => (
        <SettingsCard key={group} title={group}>
          <div className="grid gap-x-4 gap-y-1 px-4 py-3 sm:grid-cols-2">
            {items
              .filter((i) => i.group === group)
              .map((item) => {
                const changed = inventory.changed((v) =>
                  v.settings.hiddenLabels.includes(item.label),
                );
                return (
                  <div
                    key={item.label}
                    className={cn(
                      "-mx-2 flex items-center gap-2 rounded-md px-2 py-1",
                      changed && "bg-amber-50 dark:bg-amber-500/10",
                    )}
                  >
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
                      className="cursor-pointer font-normal"
                    >
                      {item.label}
                    </Label>
                  </div>
                );
              })}
          </div>
        </SettingsCard>
      ))}
    </>
  );
}
