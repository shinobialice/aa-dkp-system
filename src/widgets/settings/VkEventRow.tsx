import { Input, Switch } from "@/shared/ui";
import {
  resolveNotifyMinutes,
  type VkNotificationSettings,
} from "@/shared/config/vkNotificationDefaults";
import { type useSettingsDraft } from "./settingsDraft";
import { SettingRow, Unit } from "./settingsUi";

type Vk = ReturnType<typeof useSettingsDraft<VkNotificationSettings>>;

export default function EventRow({
  name,
  vk,
  settings,
}: {
  name: string;
  vk: Vk;
  settings: VkNotificationSettings;
}) {
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
