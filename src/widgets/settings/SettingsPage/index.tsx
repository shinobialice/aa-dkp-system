"use client";

import { useEffect, useRef, useState } from "react";
import { Search } from "lucide-react";
import { AccessSettings } from "../AccessSettings";
import { UserSelfEditSettingsForm } from "../UserSelfEditSettingsForm";
import { SalaryEligibilitySettingsForm } from "../SalaryEligibilitySettingsForm";
import { BossPointsSettingsForm } from "../BossPointsSettingsForm";
import { AttendanceBonusSettingsForm } from "../AttendanceBonusSettingsForm";
import { MaintenanceWindowsForm } from "../MaintenanceWindowsForm";
import { VkNotificationSettingsForm } from "../VkNotificationSettingsForm";
import { EventSettingsForm } from "../EventSettingsForm";
import { InventoryStockSettingsForm } from "../InventoryStockSettingsForm";
import { GuildLocationSettingsForm } from "../GuildLocationSettingsForm";
import { SettingsOverview } from "../SettingsOverview";
import { SettingsDraftProvider, SettingsSaveBar } from "../settingsDraft";
import { isSectionId, type SectionId } from "../settingsSections";
import SettingsNav from "./SettingsNav";
import SearchResults from "./SearchResults";
import Section from "./SettingsSection";

function SettingsPage() {
  const [active, setActive] = useState<SectionId>("overview");
  const [query, setQuery] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);

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
      ) {
        return;
      }
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
          <h1 className="text-2xl font-bold tracking-tight">Настройки</h1>
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
          <kbd className="pointer-events-none absolute right-2.5 hidden rounded border px-1.5 font-mono text-2xs text-muted-foreground sm:block">
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
