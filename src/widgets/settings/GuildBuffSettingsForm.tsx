"use client";

import Image from "next/image";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui";
import {
  getGuildBuffSettings,
  updateGuildBuffSettings,
} from "@/actions/guildBuffSettings";
import {
  buffIconUrl,
  findOption,
  GUILD_BUFFS,
  type SelectedBuffs,
} from "@/widgets/profile/equipment/characterBuffs";
import { useSettingsDraft } from "./settingsDraft";
import { Loading, SettingRow, SettingsCard } from "./settingsUi";

const BUFF_OFF = "off";

export function GuildBuffSettingsForm() {
  const draft = useSettingsDraft<SelectedBuffs>({
    id: "guildBuffs",
    section: "guildBuffs",
    label: "Гильдейские баффы",
    load: getGuildBuffSettings,
    save: updateGuildBuffSettings,
  });

  const value = draft.value;
  if (!value) return <Loading />;

  const handleChange = (buffId: number, option: string) => {
    draft.setValue((current) => {
      const next = { ...current };
      if (option === BUFF_OFF) delete next[buffId];
      else next[buffId] = option;
      return next;
    });
  };

  return (
    <SettingsCard
      title="Гильдейские баффы"
      hint="действуют у всех игроков в калькуляторе экипировки"
    >
      {GUILD_BUFFS.map((buff) => {
        const selected = value[buff.id] ?? BUFF_OFF;
        const option = findOption(buff, selected);
        return (
          <SettingRow
            key={buff.id}
            title={
              <span className="flex items-center gap-2">
                <Image
                  src={buffIconUrl(buff, option)}
                  alt=""
                  width={24}
                  height={24}
                  className="size-6 rounded"
                />
                {buff.name}
              </span>
            }
            hint={option?.text}
            changed={draft.changed((v) => v[buff.id])}
          >
            <Select
              value={selected}
              onValueChange={(next) => handleChange(buff.id, next)}
            >
              <SelectTrigger
                className="w-36 cursor-pointer"
                aria-label={buff.name}
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem className="cursor-pointer" value={BUFF_OFF}>
                  Выключен
                </SelectItem>
                {buff.options.map((item) => (
                  <SelectItem
                    className="cursor-pointer"
                    key={item.value}
                    value={item.value}
                  >
                    Уровень {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </SettingRow>
        );
      })}
    </SettingsCard>
  );
}
