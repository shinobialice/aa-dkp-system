"use client";

import Image from "next/image";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Segmented,
} from "@/shared/ui";
import {
  getGuildStatus,
  updateGuildLocation,
  updateGuildStatus,
} from "@/actions/guildStatusSettings";
import type { GuildFaction, GuildMode } from "@/shared/config/guildStatus";
import { GUILD_SERVERS, type GuildServer } from "@/utils/guildServers";
import { useSettingsDraft } from "./settingsDraft";
import { Loading, SettingRow, SettingsCard } from "./settingsUi";

export const FACTION_LABEL: Record<GuildFaction, string> = {
  nuian: "Запад (Нуиан)",
  hariharan: "Восток (Харихаран)",
};

export const FACTION_ICON: Record<GuildFaction, string> = {
  nuian: "/images/server/west.png",
  hariharan: "/images/server/east.png",
};

export const MODE_LABEL: Record<GuildMode, string> = {
  freeshard: "Фришка",
  pvp: "ПВП",
};

export type GuildDraft = {
  server: GuildServer;
  faction: GuildFaction;
  mode: GuildMode;
};

export const GUILD_DRAFT_ID = "guild";

export function GuildLocationSettingsForm() {
  const guild = useSettingsDraft<GuildDraft>({
    id: GUILD_DRAFT_ID,
    section: "guild",
    label: "Статус гильдии",
    load: async () => {
      const s = await getGuildStatus();
      return { server: s.server, faction: s.faction, mode: s.mode };
    },
    save: async (value) => {
      await Promise.all([
        updateGuildLocation(value.server, value.faction),
        updateGuildStatus(value.mode),
      ]);
    },
  });

  const value = guild.value;
  if (!value) return <Loading />;
  const set = (patch: Partial<GuildDraft>) =>
    guild.setValue((v) => ({ ...v, ...patch }));

  return (
    <SettingsCard>
      <SettingRow title="Сервер" changed={guild.changed((v) => v.server)}>
        <Select
          value={value.server}
          onValueChange={(v) => set({ server: v as GuildServer })}
        >
          <SelectTrigger className="w-44 cursor-pointer" aria-label="Сервер">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {GUILD_SERVERS.map((s) => (
              <SelectItem className="cursor-pointer" key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </SettingRow>
      <SettingRow title="Фракция" changed={guild.changed((v) => v.faction)}>
        <Segmented
          label="Фракция"
          value={value.faction}
          onChange={(faction) => set({ faction })}
          options={(Object.keys(FACTION_LABEL) as GuildFaction[]).map((f) => ({
            value: f,
            label: (
              <>
                <Image src={FACTION_ICON[f]} alt="" width={16} height={16} />
                {FACTION_LABEL[f]}
              </>
            ),
          }))}
        />
      </SettingRow>
      <SettingRow
        title="Режим"
        hint="Смена режима закрывает текущий период в историю и начинает новый: при переключении на ПВП начинается новый вар"
        changed={guild.changed((v) => v.mode)}
      >
        <Segmented
          label="Режим"
          value={value.mode}
          onChange={(mode) => set({ mode })}
          options={(Object.keys(MODE_LABEL) as GuildMode[]).map((m) => ({
            value: m,
            label: MODE_LABEL[m],
          }))}
        />
      </SettingRow>
    </SettingsCard>
  );
}
