"use client";

import Image from "next/image";
import { KeyRound, Plus } from "lucide-react";
import { cn } from "@/shared/lib/tw-merge";
import { Button } from "@/shared/ui";
import type { SalaryEligibilitySettings } from "@/actions/salaryEligibilitySettings";
import type { UserSelfEditSettings } from "@/actions/userSelfEditSettings";
import {
  PRIME_EVENT_NAME,
  resolveNotifyMinutes,
  type VkNotificationSettings,
} from "@/shared/config/vkNotificationDefaults";
import { getNextRecurringMaintenanceWindow } from "@/shared/config/bossRespawn";
import { useSavedSetting } from "./settingsDraft";
import { sectionById, type SectionId } from "./settingsSections";
import {
  FACTION_ICON,
  FACTION_LABEL,
  GUILD_DRAFT_ID,
  MODE_LABEL,
  type GuildDraft,
} from "./GuildLocationSettingsForm";
import {
  EVENT_DRAFT_ID,
  formatMoscowDateTime,
  isEventActive,
  type EventDraft,
} from "./EventSettingsForm";
import { SALARY_DRAFT_ID } from "./SalaryEligibilitySettingsForm";
import {
  SELF_EDIT_DRAFT_ID,
  SELF_EDIT_FIELDS,
} from "./UserSelfEditSettingsForm";
import { VK_DRAFT_ID } from "./VkNotificationSettingsForm";

type Tone = "ok" | "warn" | "red" | "muted";

const TONE: Record<Tone, string> = {
  ok: "bg-green-100 text-green-800 dark:bg-green-500/15 dark:text-green-300",
  warn: "bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-300",
  red: "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-300",
  muted: "bg-muted text-muted-foreground",
};

function Tile({
  section,
  value,
  pill,
  hint,
  onOpen,
}: {
  section: SectionId;
  value: React.ReactNode;
  pill?: { tone: Tone; text: string } | undefined;
  hint?: string;
  onOpen: (id: SectionId) => void;
}) {
  const meta = sectionById(section);
  return (
    <button
      type="button"
      onClick={() => onOpen(section)}
      className="flex min-w-0 cursor-pointer flex-col items-start gap-1.5 rounded-xl border bg-card px-3.5 py-3 text-left transition-colors hover:border-foreground/25"
    >
      <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <meta.icon className="size-3.5" />
        {meta.label}
      </span>
      <span className="text-[15px] leading-snug font-semibold">
        {value ?? <span className="text-muted-foreground">…</span>}
      </span>
      {pill && (
        <span
          className={cn(
            "rounded-full px-2 py-px text-[11.5px] font-semibold",
            TONE[pill.tone],
          )}
        >
          {pill.text}
        </span>
      )}
      {hint && <span className="text-xs text-muted-foreground">{hint}</span>}
    </button>
  );
}

function shortDate(iso: string) {
  return formatMoscowDateTime(iso).slice(0, 5);
}

export function SettingsOverview({
  onOpen,
}: {
  onOpen: (id: SectionId) => void;
}) {
  const guild = useSavedSetting<GuildDraft>(GUILD_DRAFT_ID);
  const event = useSavedSetting<EventDraft>(EVENT_DRAFT_ID);
  const vk = useSavedSetting<VkNotificationSettings>(VK_DRAFT_ID);
  const salary = useSavedSetting<SalaryEligibilitySettings>(SALARY_DRAFT_ID);
  const selfEdit = useSavedSetting<UserSelfEditSettings>(SELF_EDIT_DRAFT_ID);
  const maintenance = getNextRecurringMaintenanceWindow();

  const eventActive = isEventActive(event);
  const eventUpcoming =
    !!event?.title && !!event.startsAt && new Date(event.startsAt) > new Date();
  const enabledSelf = selfEdit
    ? SELF_EDIT_FIELDS.filter((f) => selfEdit[f.key])
    : [];
  const disabledSelf = selfEdit
    ? SELF_EDIT_FIELDS.filter((f) => !selfEdit[f.key])
    : [];
  const salaryRules = salary
    ? [
        salary.primeEnabled && `праймы > ${salary.primeThresholdPercent}%`,
        salary.pointsEnabled && `баллы > ${salary.pointsThresholdPercent}%`,
        salary.gsEnabled && "порог ГС",
      ].filter(Boolean)
    : [];

  return (
    <div className="flex flex-col gap-4">
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

      <div className="grid grid-cols-[repeat(auto-fill,minmax(15rem,1fr))] gap-2.5">
        <Tile
          section="guild"
          onOpen={onOpen}
          value={
            guild && (
              <span className="flex items-center gap-1.5">
                <Image
                  src={FACTION_ICON[guild.faction]}
                  alt=""
                  width={18}
                  height={18}
                />
                {guild.server} · {FACTION_LABEL[guild.faction].split(" ")[0]}
              </span>
            )
          }
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
          value={event ? event.title || "Ивента нет" : null}
          pill={
            event
              ? eventActive
                ? { tone: "ok", text: `идёт · до ${shortDate(event.endsAt!)}` }
                : eventUpcoming
                  ? {
                      tone: "warn",
                      text: `начнётся ${shortDate(event.startsAt!)}`,
                    }
                  : { tone: "muted", text: "не идёт" }
              : undefined
          }
          hint={
            maintenance
              ? `Проф. работы: ${maintenance.start.toLocaleString("ru-RU", {
                  timeZone: "Europe/Moscow",
                  weekday: "short",
                  hour: "2-digit",
                  minute: "2-digit",
                })}–${maintenance.end.toLocaleString("ru-RU", {
                  timeZone: "Europe/Moscow",
                  hour: "2-digit",
                  minute: "2-digit",
                })}`
              : undefined
          }
        />
        <Tile
          section="vk"
          onOpen={onOpen}
          value={
            vk &&
            (vk.enabledBosses.includes(PRIME_EVENT_NAME)
              ? `Прайм за ${resolveNotifyMinutes(vk, PRIME_EVENT_NAME)} мин${vk.primeTime ? ` · ${vk.primeTime}` : ""}`
              : "Прайм не напоминаем")
          }
          pill={
            vk
              ? vk.quietHoursEnabled
                ? {
                    tone: "warn",
                    text: `тихие часы ${String(vk.quietHoursStart).padStart(2, "0")}–${String(vk.quietHoursEnd).padStart(2, "0")}`,
                  }
                : { tone: "muted", text: "без тихих часов" }
              : undefined
          }
          hint={
            vk ? `Напоминаний включено: ${vk.enabledBosses.length}` : undefined
          }
        />
        <Tile
          section="salary"
          onOpen={onOpen}
          value={
            salary &&
            (salaryRules.length ? salaryRules.join(" · ") : "Без порогов")
          }
          hint={
            salary
              ? salary.dvBypassEnabled
                ? "Тег ДВ обходит пороги"
                : "Тег ДВ пороги не обходит"
              : undefined
          }
        />
        <Tile
          section="self"
          onOpen={onOpen}
          value={
            selfEdit &&
            `${enabledSelf.length} из ${SELF_EDIT_FIELDS.length} полей`
          }
          hint={
            selfEdit && disabledSelf.length
              ? `Выключено: ${disabledSelf.map((f) => f.title.toLowerCase()).join(", ")}`
              : undefined
          }
        />
      </div>
    </div>
  );
}
