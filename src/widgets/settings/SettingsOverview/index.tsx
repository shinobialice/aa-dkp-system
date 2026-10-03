"use client";

import Image from "next/image";
import { KeyRound, Plus } from "lucide-react";
import { Button } from "@/shared/ui";
import type { SalaryEligibilitySettings } from "@/actions/salaryEligibilitySettings";
import type { UserSelfEditSettings } from "@/actions/userSelfEditSettings";
import type { VkNotificationSettings } from "@/shared/config/vkNotificationDefaults";
import { useSavedSetting } from "../settingsDraft";
import type { SectionId } from "../settingsSections";
import {
  FACTION_ICON,
  FACTION_LABEL,
  GUILD_DRAFT_ID,
  MODE_LABEL,
  type GuildDraft,
} from "../GuildLocationSettingsForm";
import { EVENT_DRAFT_ID, type EventDraft } from "../EventSettingsForm";
import { SALARY_DRAFT_ID } from "../SalaryEligibilitySettingsForm";
import { SELF_EDIT_DRAFT_ID } from "../UserSelfEditSettingsForm";
import { VK_DRAFT_ID } from "../VkNotificationSettingsForm";
import Tile from "./Tile";
import {
  eventPill,
  maintenanceHint,
  salaryHint,
  salaryValue,
  selfEditHint,
  selfEditValue,
  vkPill,
  vkValue,
} from "./tileSummaries";

type Props = {
  onOpen: (id: SectionId) => void;
};

export function SettingsOverview({ onOpen }: Props) {
  const guild = useSavedSetting<GuildDraft>(GUILD_DRAFT_ID);
  const event = useSavedSetting<EventDraft>(EVENT_DRAFT_ID);
  const vk = useSavedSetting<VkNotificationSettings>(VK_DRAFT_ID);
  const salary = useSavedSetting<SalaryEligibilitySettings>(SALARY_DRAFT_ID);
  const selfEdit = useSavedSetting<UserSelfEditSettings>(SELF_EDIT_DRAFT_ID);

  return (
    <div className="flex flex-col gap-4">
      <QuickActions onOpen={onOpen} />

      <div className="grid grid-cols-[repeat(auto-fill,minmax(15rem,1fr))] gap-2.5">
        <Tile
          section="guild"
          onOpen={onOpen}
          value={guild && <GuildLocation guild={guild} />}
          pill={
            guild
              ? {
                  tone: guild.mode === "pvp" ? "red" : "muted",
                  text: MODE_LABEL[guild.mode],
                }
              : undefined
          }
        />
        <Tile
          section="event"
          onOpen={onOpen}
          value={event && (event.title || "Ивента нет")}
          pill={event ? eventPill(event) : undefined}
          hint={maintenanceHint()}
        />
        <Tile
          section="vk"
          onOpen={onOpen}
          value={vk && vkValue(vk)}
          pill={vk ? vkPill(vk) : undefined}
          hint={
            vk ? `Напоминаний включено: ${vk.enabledBosses.length}` : undefined
          }
        />
        <Tile
          section="salary"
          onOpen={onOpen}
          value={salary && salaryValue(salary)}
          hint={salary ? salaryHint(salary) : undefined}
        />
        <Tile
          section="self"
          onOpen={onOpen}
          value={selfEdit && selfEditValue(selfEdit)}
          hint={selfEdit ? selfEditHint(selfEdit) : undefined}
        />
      </div>
    </div>
  );
}

function GuildLocation({ guild }: { guild: GuildDraft }) {
  return (
    <span className="flex items-center gap-1.5">
      <Image src={FACTION_ICON[guild.faction]} alt="" width={18} height={18} />
      {guild.server} · {FACTION_LABEL[guild.faction].split(" ")[0]}
    </span>
  );
}

function QuickActions({ onOpen }: Props) {
  return (
    <div className="flex flex-wrap gap-2">
      <Button className="cursor-pointer" onClick={() => onOpen("access")}>
        <KeyRound /> Ссылка для входа
      </Button>
      <Button
        variant="outline"
        className="cursor-pointer"
        onClick={() => onOpen("access")}
      >
        <Plus /> Новый игрок
      </Button>
      <Button
        variant="outline"
        className="cursor-pointer"
        onClick={() => onOpen("guild")}
      >
        Переключить ПВП / Фришка
      </Button>
      <Button
        variant="outline"
        className="cursor-pointer"
        onClick={() => onOpen("event")}
      >
        <Plus /> Окно проф. работ
      </Button>
    </div>
  );
}
