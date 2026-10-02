"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronRight, Search } from "lucide-react";
import { cn } from "@/shared/lib/tw-merge";
import type { SalaryEligibilitySettings } from "@/actions/salaryEligibilitySettings";
import type { VkNotificationSettings } from "@/shared/config/vkNotificationDefaults";
import { AccessSettings } from "./AccessSettings";
import { UserSelfEditSettingsForm } from "./UserSelfEditSettingsForm";
import {
  SalaryEligibilitySettingsForm,
  SALARY_DRAFT_ID,
} from "./SalaryEligibilitySettingsForm";
import { BossPointsSettingsForm } from "./BossPointsSettingsForm";
import { AttendanceBonusSettingsForm } from "./AttendanceBonusSettingsForm";
import { MaintenanceWindowsForm } from "./MaintenanceWindowsForm";
import {
  VkNotificationSettingsForm,
  VK_DRAFT_ID,
} from "./VkNotificationSettingsForm";
import {
  EventSettingsForm,
  EVENT_DRAFT_ID,
  isEventActive,
  type EventDraft,
} from "./EventSettingsForm";
import { InventoryStockSettingsForm } from "./InventoryStockSettingsForm";
import {
  GuildLocationSettingsForm,
  GUILD_DRAFT_ID,
  MODE_LABEL,
  type GuildDraft,
} from "./GuildLocationSettingsForm";
import { SettingsOverview } from "./SettingsOverview";
import {
  SettingsDraftProvider,
  SettingsSaveBar,
  useDirtySections,
  useSavedSetting,
} from "./settingsDraft";
import {
  isSectionId,
  SEARCH_INDEX,
  SECTION_GROUPS,
  sectionById,
  type SectionId,
} from "./settingsSections";

const STATIC_HINTS: Partial<Record<SectionId, string>> = {
  overview: "что сейчас настроено",
  access: "ссылки для входа, новые игроки",
  self: "ник, ГС, VK, инвентарь…",
  points: "очки боссов, бонусы",
  inventory: "какие предметы считать",
};

function useNavHints(): Partial<Record<SectionId, string>> {
  const guild = useSavedSetting<GuildDraft>(GUILD_DRAFT_ID);
  const event = useSavedSetting<EventDraft>(EVENT_DRAFT_ID);
  const vk = useSavedSetting<VkNotificationSettings>(VK_DRAFT_ID);
  const salary = useSavedSetting<SalaryEligibilitySettings>(SALARY_DRAFT_ID);
  return {
    ...STATIC_HINTS,
    guild: guild ? `${guild.server} · ${MODE_LABEL[guild.mode]}` : undefined,
    event: event
      ? isEventActive(event)
        ? `ивент идёт: ${event.title}`
        : "ивента сейчас нет"
      : undefined,
    vk: vk
      ? vk.quietHoursEnabled
        ? `тихие часы ${vk.quietHoursStart}–${vk.quietHoursEnd}`
        : "без тихих часов"
      : undefined,
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

function SettingsNav({
  active,
  onOpen,
}: {
  active: SectionId | null;
  onOpen: (id: SectionId) => void;
}) {
  const dirty = useDirtySections();
  const hints = useNavHints();

  return (
    <nav
      aria-label="Разделы настроек"
      className="-mx-4 flex gap-1.5 overflow-x-auto px-4 [scrollbar-width:none] md:sticky md:top-6 md:mx-0 md:flex-col md:gap-3.5 md:overflow-visible md:px-0"
    >
      {SECTION_GROUPS.map((group) => (
        <div key={group.title || "top"} className="contents md:block">
          {group.title && (
            <h3 className="mb-1 hidden px-2.5 text-[11px] font-semibold tracking-wider text-muted-foreground uppercase md:block">
              {group.title}
            </h3>
          )}
          {group.sections.map((section) => {
            const current = active === section.id;
            return (
              <button
                key={section.id}
                type="button"
                aria-current={current ? "page" : undefined}
                onClick={() => onOpen(section.id)}
                className={cn(
                  "flex shrink-0 cursor-pointer items-center gap-2 rounded-full border px-3 py-1.5 text-left text-[13px] whitespace-nowrap transition-colors hover:bg-muted md:grid md:w-full md:grid-cols-[1rem_minmax(0,1fr)_auto] md:gap-x-2.5 md:gap-y-0 md:rounded-lg md:border-0 md:px-2.5 md:py-1.5",
                  current && "bg-muted font-semibold",
                )}
              >
                <section.icon className="size-4 text-muted-foreground" />
                <span className="truncate md:text-[13.5px]">
                  {section.label}
                </span>
                {dirty[section.id] ? (
                  <span
                    className="size-2 rounded-full bg-amber-500"
                    title="Есть несохранённые изменения"
                  />
                ) : (
                  <span />
                )}
                {hints[section.id] && (
                  <span className="col-start-2 col-end-4 hidden truncate text-[11.5px] font-normal text-muted-foreground md:block">
                    {hints[section.id]}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      ))}
    </nav>
  );
}

function SearchResults({
  query,
  onOpen,
}: {
  query: string;
  onOpen: (id: SectionId) => void;
}) {
  const term = query.trim().toLowerCase();
  const hits = SEARCH_INDEX.filter(
    (item) =>
      item.label.toLowerCase().includes(term) ||
      item.keywords?.includes(term) ||
      sectionById(item.section).label.toLowerCase().includes(term),
  );
  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="text-xl font-semibold">Поиск</h2>
        <p className="text-sm text-muted-foreground">«{query.trim()}»</p>
      </div>
      <div className="divide-y overflow-hidden rounded-xl border bg-card">
        {hits.length === 0 ? (
          <p className="px-4 py-6 text-sm text-muted-foreground">
            Ничего не найдено
          </p>
        ) : (
          hits.map((hit) => (
            <button
              key={`${hit.section}-${hit.label}`}
              type="button"
              onClick={() => onOpen(hit.section)}
              className="flex w-full cursor-pointer items-center justify-between gap-3 px-4 py-2.5 text-left hover:bg-muted/50"
            >
              <span>
                <span className="block font-medium">{hit.label}</span>
                <span className="text-xs text-muted-foreground">
                  {sectionById(hit.section).label}
                </span>
              </span>
              <ChevronRight className="size-4 text-muted-foreground" />
            </button>
          ))
        )}
      </div>
    </div>
  );
}

function Section({
  id,
  active,
  children,
}: {
  id: SectionId;
  active: boolean;
  children: React.ReactNode;
}) {
  const meta = sectionById(id);
  // Все разделы остаются смонтированными: так несохранённые правки не
  // теряются при переходе между разделами, а сводка видит текущие значения.
  return (
    <section hidden={!active} aria-labelledby={`settings-${id}`}>
      <div className="flex flex-col gap-4">
        <div>
          <h2 id={`settings-${id}`} className="text-xl font-semibold">
            {meta.label}
          </h2>
          <p className="mt-0.5 text-sm text-muted-foreground">
            {meta.description}
          </p>
        </div>
        {children}
      </div>
    </section>
  );
}

function SettingsPage() {
  const [active, setActive] = useState<SectionId>("overview");
  const [query, setQuery] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);

  // Раздел в адресе (/settings#vk) — можно отправить ссылку другому админу.
  useEffect(() => {
    const fromHash = () => {
      const hash = window.location.hash.slice(1);
      if (isSectionId(hash)) setActive(hash);
    };
    fromHash();
    window.addEventListener("hashchange", fromHash);
    return () => window.removeEventListener("hashchange", fromHash);
  }, []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement;
      if (
        event.key !== "/" ||
        target.closest("input, textarea, [contenteditable]")
      )
        return;
      event.preventDefault();
      searchRef.current?.focus();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const open = (id: SectionId) => {
    setActive(id);
    setQuery("");
    window.history.replaceState(
      null,
      "",
      id === "overview" ? window.location.pathname : `#${id}`,
    );
    window.scrollTo({ top: 0 });
  };

  const searching = query.trim().length > 0;

  return (
    <div className="mx-auto flex w-full max-w-6xl min-w-0 flex-col gap-5 pb-24 text-sm">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-[26px]">
            Настройки
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Управление гильдией и сайтом. Видят только администраторы.
          </p>
        </div>
        <label className="relative flex w-full items-center sm:w-72">
          <Search className="pointer-events-none absolute left-3 size-4 text-muted-foreground" />
          <input
            ref={searchRef}
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Найти настройку…"
            aria-label="Найти настройку"
            className="h-10 w-full rounded-lg border bg-background pr-9 pl-9 text-sm outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40"
          />
          <kbd className="pointer-events-none absolute right-2.5 hidden rounded border px-1.5 font-mono text-[11px] text-muted-foreground sm:block">
            /
          </kbd>
        </label>
      </div>

      <div className="grid items-start gap-5 md:grid-cols-[15rem_minmax(0,1fr)]">
        <SettingsNav active={searching ? null : active} onOpen={open} />

        <div className="min-w-0">
          {searching && <SearchResults query={query} onOpen={open} />}
          <div hidden={searching}>
            <Section id="overview" active={active === "overview"}>
              <SettingsOverview onOpen={open} />
            </Section>
            <Section id="access" active={active === "access"}>
              <AccessSettings />
            </Section>
            <Section id="self" active={active === "self"}>
              <UserSelfEditSettingsForm />
            </Section>
            <Section id="guild" active={active === "guild"}>
              <GuildLocationSettingsForm />
            </Section>
            <Section id="event" active={active === "event"}>
              <EventSettingsForm />
              <MaintenanceWindowsForm />
            </Section>
            <Section id="points" active={active === "points"}>
              <BossPointsSettingsForm />
              <AttendanceBonusSettingsForm />
            </Section>
            <Section id="salary" active={active === "salary"}>
              <SalaryEligibilitySettingsForm />
            </Section>
            <Section id="vk" active={active === "vk"}>
              <VkNotificationSettingsForm />
            </Section>
            <Section id="inventory" active={active === "inventory"}>
              <InventoryStockSettingsForm />
            </Section>
          </div>
        </div>
      </div>

      <SettingsSaveBar />
    </div>
  );
}

export function SettingsPageContainer() {
  return (
    <SettingsDraftProvider>
      <SettingsPage />
    </SettingsDraftProvider>
  );
}
