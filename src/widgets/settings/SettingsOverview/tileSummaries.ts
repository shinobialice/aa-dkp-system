import type { SalaryEligibilitySettings } from "@/actions/salaryEligibilitySettings";
import type { UserSelfEditSettings } from "@/actions/userSelfEditSettings";
import {
  PRIME_EVENT_NAME,
  resolveNotifyMinutes,
  type VkNotificationSettings,
} from "@/shared/config/vkNotificationDefaults";
import { getNextRecurringMaintenanceWindow } from "@/shared/config/bossRespawn";
import { isEventActive, type EventDraft } from "../EventSettingsForm";
import { SELF_EDIT_FIELDS } from "../UserSelfEditSettingsForm";
import { shortDate, type Pill } from "./Tile";

const MOSCOW = "Europe/Moscow";

export function eventPill(event: EventDraft): Pill {
  if (isEventActive(event) && event.endsAt) {
    return { tone: "ok", text: `идёт · до ${shortDate(event.endsAt)}` };
  }
  if (event.title && event.startsAt && new Date(event.startsAt) > new Date()) {
    return { tone: "warn", text: `начнётся ${shortDate(event.startsAt)}` };
  }
  return { tone: "muted", text: "не идёт" };
}

export function maintenanceHint() {
  const window = getNextRecurringMaintenanceWindow();
  if (!window) return undefined;
  const start = window.start.toLocaleString("ru-RU", {
    timeZone: MOSCOW,
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
  const end = window.end.toLocaleString("ru-RU", {
    timeZone: MOSCOW,
    hour: "2-digit",
    minute: "2-digit",
  });
  return `Проф. работы: ${start}–${end}`;
}

export function vkValue(vk: VkNotificationSettings) {
  if (!vk.enabledBosses.includes(PRIME_EVENT_NAME)) {
    return "Прайм не напоминаем";
  }
  const time = vk.primeTime ? ` · ${vk.primeTime}` : "";
  return `Прайм за ${resolveNotifyMinutes(vk, PRIME_EVENT_NAME)} мин${time}`;
}

export function vkPill(vk: VkNotificationSettings): Pill {
  if (!vk.quietHoursEnabled) return { tone: "muted", text: "без тихих часов" };
  const hour = (value: number) => String(value).padStart(2, "0");
  return {
    tone: "warn",
    text: `тихие часы ${hour(vk.quietHoursStart)}–${hour(vk.quietHoursEnd)}`,
  };
}

export function salaryValue(salary: SalaryEligibilitySettings) {
  const rules = [
    salary.primeEnabled && `праймы > ${salary.primeThresholdPercent}%`,
    salary.pointsEnabled && `баллы > ${salary.pointsThresholdPercent}%`,
    salary.gsEnabled && "порог ГС",
  ].filter(Boolean);
  return rules.length ? rules.join(" · ") : "Без порогов";
}

export function salaryHint(salary: SalaryEligibilitySettings) {
  return salary.dvBypassEnabled
    ? "Тег ДВ обходит пороги"
    : "Тег ДВ пороги не обходит";
}

export function selfEditValue(selfEdit: UserSelfEditSettings) {
  const enabled = SELF_EDIT_FIELDS.filter((field) => selfEdit[field.key]);
  return `${enabled.length} из ${SELF_EDIT_FIELDS.length} полей`;
}

export function selfEditHint(selfEdit: UserSelfEditSettings) {
  const disabled = SELF_EDIT_FIELDS.filter((field) => !selfEdit[field.key]);
  if (disabled.length === 0) return undefined;
  return `Выключено: ${disabled.map((field) => field.title.toLowerCase()).join(", ")}`;
}
