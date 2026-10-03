"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/shared/lib/tw-merge";
import { Input, FilterChip, StatTile } from "@/shared/ui";
import { deleteUserTag } from "@/actions/userTagsActions";
import { updateUser } from "@/actions/updateUser";
import { plural } from "@/shared/lib/format";
import {
  type AfkMember,
  type Filter,
  LONG_DAYS,
  ROW_GRID,
  awayDays,
} from "./afkModel";
import AfkRow from "./AfkRow";
import { FILTERS, countByFilter, matchesAfkFilter } from "./afkModel";

export default function AfkMembersTable({ data }: { data: AfkMember[] }) {
  const [members, setMembers] = useState(data);
  const [filter, setFilter] = useState<Filter>("all");
  const [search, setSearch] = useState("");
  const [now] = useState(() => Date.now());

  const withDays = useMemo(
    () =>
      members
        .map((member) => ({ member, days: awayDays(member, now) }))
        .sort((a, b) => (b.days ?? Infinity) - (a.days ?? Infinity)),
    [members, now],
  );

  const counts = countByFilter(withDays);

  const term = search.trim().toLowerCase();
  const visible = withDays.filter((row) => matchesAfkFilter(row, filter, term));
  const maxDays = Math.max(1, ...withDays.map((x) => x.days ?? 0));

  const patch = (id: number, change: Partial<AfkMember>) =>
    setMembers((previous) =>
      previous
        .map((m) => (m.id === id ? { ...m, ...change } : m))
        .filter((m) => m.isAfkTagged || m.isInactive),
    );

  const untag = async (member: AfkMember) => {
    if (member.afkTagId == null) return;
    try {
      await deleteUserTag(member.afkTagId);
      patch(member.id, { isAfkTagged: false, afkTagId: null });
      toast.success(`${member.username}: тег АФК снят`);
    } catch {
      toast.error("Не удалось снять тег");
    }
  };

  const bringBack = async (member: AfkMember) => {
    try {
      await updateUser(member.id, { active: true });
      patch(member.id, { isInactive: false, inactiveSince: null });
      toast.success(`${member.username} снова в гильдии`);
    } catch {
      toast.error("Не удалось вернуть игрока");
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-6xl min-w-0 flex-col gap-4 text-sm">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">АФК</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {members.length}{" "}
            {plural(members.length, "игрок", "игрока", "игроков")} с тегом «АФК»
            или ушли из гильдии · дольше всех — сверху
          </p>
        </div>
        <div className="relative w-full sm:w-64">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            aria-label="Найти игрока"
            placeholder="Ник или имя ВК"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <section
        aria-label="Итоги"
        className="grid grid-cols-2 gap-2.5 lg:grid-cols-4"
      >
        <StatTile label="Всего">{counts.all}</StatTile>
        <StatTile
          label="С тегом «АФК»"
          hint="ещё в гильдии"
          swatch="var(--color-zinc-500)"
        >
          {counts.tag}
        </StatTile>
        <StatTile
          label="Ушли из гильдии"
          hint="неактивны"
          swatch="var(--color-red-500)"
        >
          {counts.left}
        </StatTile>
        <StatTile
          label={`Дольше ${LONG_DAYS} дней`}
          hint="пора решать"
          swatch="var(--color-amber-500)"
        >
          {counts.long}
        </StatTile>
      </section>

      <div role="group" aria-label="Фильтр" className="flex flex-wrap gap-1.5">
        {FILTERS.map(({ key, label }) => (
          <FilterChip
            key={key}
            active={filter === key}
            onClick={() => setFilter(key)}
          >
            {label}
            <span className="text-xs opacity-60">{counts[key]}</span>
          </FilterChip>
        ))}
      </div>

      <section className="min-w-0 overflow-hidden rounded-xl border bg-card">
        <div className="max-h-[min(36rem,calc(100dvh-12rem))] overflow-auto overscroll-contain">
          <div
            className={cn(
              "sticky top-0 z-10 hidden gap-3.5 bg-muted px-4 py-2 text-2xs font-semibold tracking-wide text-muted-foreground uppercase shadow-[0_1px_0_var(--color-border)] lg:grid",
              ROW_GRID,
            )}
          >
            <span>Игрок</span>
            <span>Класс</span>
            <span className="text-right">GS</span>
            <span>Сколько не играет</span>
            <span className="text-right">Зарплата</span>
            <span />
          </div>

          {visible.length === 0 ? (
            <p className="px-4 py-12 text-center text-muted-foreground">
              {members.length === 0
                ? "Никого — все играют"
                : "Никого не найдено"}
            </p>
          ) : (
            visible.map(({ member, days }) => (
              <AfkRow
                key={member.id}
                member={member}
                days={days}
                maxDays={maxDays}
                onUntag={untag}
                onBringBack={bringBack}
              />
            ))
          )}
        </div>
      </section>
    </div>
  );
}
