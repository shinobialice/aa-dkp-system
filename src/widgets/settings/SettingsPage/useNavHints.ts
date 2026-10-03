import type { SalaryEligibilitySettings } from "@/actions/salaryEligibilitySettings";
import type { VkNotificationSettings } from "@/shared/config/vkNotificationDefaults";
import { SALARY_DRAFT_ID } from "../SalaryEligibilitySettingsForm";
import { VK_DRAFT_ID } from "../VkNotificationSettingsForm";
import {
  EVENT_DRAFT_ID,
  isEventActive,
  type EventDraft,
} from "../EventSettingsForm";
import {
  GUILD_DRAFT_ID,
  MODE_LABEL,
  type GuildDraft,
} from "../GuildLocationSettingsForm";
import { useSavedSetting } from "../settingsDraft";
import { type SectionId } from "../settingsSections";

const STATIC_HINTS: Partial<Record<SectionId, string>> = {
  overview: "что сейчас настроено",
  access: "ссылки для входа, новые игроки",
  self: "ник, ГС, VK, инвентарь…",
  points: "очки боссов, бонусы",
  inventory: "какие предметы считать",
};

export function useNavHints(): Partial<Record<SectionId, string>> {
  const guild = useSavedSetting<GuildDraft>(GUILD_DRAFT_ID);
  const event = useSavedSetting<EventDraft>(EVENT_DRAFT_ID);
  const vk = useSavedSetting<VkNotificationSettings>(VK_DRAFT_ID);
  const salary = useSavedSetting<SalaryEligibilitySettings>(SALARY_DRAFT_ID);
  return {
    ...STATIC_HINTS,
    guild: guild ? `${guild.server} · ${MODE_LABEL[guild.mode]}` : undefined,
    event: event ? eventHint(event) : undefined,
    vk: vk ? vkHint(vk) : undefined,
    salary: salary
      ? [
          salary.primeEnabled && `праймы > ${salary.primeThresholdPercent}%`,
          salary.pointsEnabled && `баллы > ${salary.pointsThresholdPercent}%`,
        ]
          .filter(Boolean)
          .join(", ") || "без порогов"
      : undefined,
  };
}

function eventHint(event: EventDraft) {
  return isEventActive(event)
    ? `ивент идёт: ${event.title}`
    : "ивента сейчас нет";
}

function vkHint(vk: VkNotificationSettings) {
  if (!vk.quietHoursEnabled) return "без тихих часов";
  return `тихие часы ${vk.quietHoursStart}–${vk.quietHoursEnd}`;
}
