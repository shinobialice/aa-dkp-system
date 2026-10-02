"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/shared/lib/tw-merge";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  Input,
} from "@/shared/ui";
import { deleteUserTag } from "@/actions/userTagsActions";
import { updateUser } from "@/actions/updateUser";
import { ClassPill, Salary } from "@/widgets/MembersTable/MemberViews";
import type { Member } from "@/widgets/MembersTable/membersModel";

export type AfkMember = {
  id: number;
  username: string;
  avatar_url: string | null;
  vk_name: string | null;
  class: string | null;
  class_gear_score: number | null;
  daysInGuild: number;
  inactiveSince: string | null;
  tagSince: string | null;
  afkTagId: number | null;
  isInactive: boolean;
  isAfkTagged: boolean;
  salary: number | null;
  salaryReason: string | null;
};

type Filter = "all" | "tag" | "left" | "long";

const LONG_DAYS = 30;
const WARN_DAYS = 14;
const DAY_MS = 86_400_000;

// Сетка строки: игрок, класс, GS, сколько не играет, зарплата, действия.
const ROW_GRID =
  "lg:grid-cols-[minmax(11rem,1.3fr)_6.5rem_4rem_minmax(10rem,1.2fr)_7.5rem_14rem]";

function plural(n: number, one: string, few: string, many: string) {
  const tens = n % 100;
  const last = n % 10;
  if (tens >= 11 && tens <= 14) return many;
  if (last === 1) return one;
  if (last >= 2 && last <= 4) return few;
  return many;
}

const daysLabel = (n: number) => `${n} ${plural(n, "день", "дня", "дней")}`;

/** С какого момента игрок отсутствует: раньшее из «ушёл» и «тег АФК». */
function awaySince(member: AfkMember) {
  const dates = [
    member.isInactive ? member.inactiveSince : null,
    member.isAfkTagged ? member.tagSince : null,
  ]
    .filter((d): d is string => Boolean(d))
    .map((d) => new Date(d).getTime());
  return dates.length ? Math.min(...dates) : null;
}

function awayDays(member: AfkMember, now: number) {
  const since = awaySince(member);
  return since === null
    ? null
    : Math.max(0, Math.floor((now - since) / DAY_MS));
}

function tone(days: number | null) {
  if (days === null)
    return { text: "text-muted-foreground", bar: "bg-muted-foreground/40" };
  if (days >= LONG_DAYS)
    return { text: "text-red-600 dark:text-red-400", bar: "bg-red-500" };
  if (days >= WARN_DAYS)
    return { text: "text-amber-600 dark:text-amber-400", bar: "bg-amber-500" };
  return { text: "text-muted-foreground", bar: "bg-muted-foreground/60" };
}

function Tile({
  label,
  value,
  hint,
  swatch,
}: {
  label: string;
  value: number;
  hint?: string;
  swatch?: string;
}) {
  return (
    <div className="flex min-w-0 flex-col gap-1 rounded-xl border bg-card px-3.5 py-3">
      <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
        {swatch && <span className={cn("size-2.5 rounded-[3px]", swatch)} />}
        {label}
      </span>
      <span className="text-2xl font-bold tabular-nums">{value}</span>
      {hint && <span className="text-xs text-muted-foreground">{hint}</span>}
    </div>
  );
}

/** Кнопка с подтверждением прямо на месте: «Снять АФК» → «Снять? / Нет». */
function ConfirmAction({
  label,
  question,
  onConfirm,
}: {
  label: string;
  question: string;
  onConfirm: () => Promise<void>;
}) {
  const [asking, setAsking] = useState(false);
  const [busy, setBusy] = useState(false);

  if (!asking) {
    return (
      <Button
        variant="outline"
        size="sm"
        className="cursor-pointer"
        onClick={() => setAsking(true)}
      >
        {label}
      </Button>
    );
  }
  return (
    <span className="inline-flex gap-1.5">
      <Button
        size="sm"
        className="cursor-pointer"
        disabled={busy}
        onClick={async () => {
          setBusy(true);
          try {
            await onConfirm();
          } finally {
            setBusy(false);
            setAsking(false);
          }
        }}
      >
        {busy ? "…" : question}
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className="cursor-pointer"
        disabled={busy}
        onClick={() => setAsking(false)}
      >
        Нет
      </Button>
    </span>
  );
}

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

  const counts = {
    all: members.length,
    tag: members.filter((m) => m.isAfkTagged).length,
    left: members.filter((m) => m.isInactive).length,
    long: withDays.filter((x) => (x.days ?? 0) >= LONG_DAYS).length,
  };

  const term = search.trim().toLowerCase();
  const visible = withDays.filter(({ member, days }) => {
    if (
      term &&
      !member.username.toLowerCase().includes(term) &&
      !member.vk_name?.toLowerCase().includes(term)
    )
      return false;
    if (filter === "tag") return member.isAfkTagged;
    if (filter === "left") return member.isInactive;
    if (filter === "long") return (days ?? 0) >= LONG_DAYS;
    return true;
  });
  const maxDays = Math.max(1, ...withDays.map((x) => x.days ?? 0));

  // Игрок, у которого не осталось ни тега, ни статуса «ушёл», уходит из списка.
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

  const filters: { key: Filter; label: string }[] = [
    { key: "all", label: "Все" },
    { key: "tag", label: "Тег АФК" },
    { key: "left", label: "Ушли" },
    { key: "long", label: `Дольше ${LONG_DAYS} дней` },
  ];

  return (
    <div className="mx-auto flex w-full max-w-6xl min-w-0 flex-col gap-4 text-sm">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-[26px]">
            АФК
          </h1>
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
        <Tile label="Всего" value={counts.all} />
        <Tile
          label="С тегом «АФК»"
          value={counts.tag}
          hint="ещё в гильдии"
          swatch="bg-zinc-500"
        />
        <Tile
          label="Ушли из гильдии"
          value={counts.left}
          hint="неактивны"
          swatch="bg-red-500"
        />
        <Tile
          label={`Дольше ${LONG_DAYS} дней`}
          value={counts.long}
          hint="пора решать"
          swatch="bg-amber-500"
        />
      </section>

      <div role="group" aria-label="Фильтр" className="flex flex-wrap gap-1.5">
        {filters.map(({ key, label }) => (
          <button
            key={key}
            type="button"
            aria-pressed={filter === key}
            onClick={() => setFilter(key)}
            className={cn(
              "inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-full border px-3 text-[13px] font-medium transition-colors",
              filter === key
                ? "border-foreground bg-foreground text-background"
                : "bg-background hover:bg-muted",
            )}
          >
            {label}
            <span className="text-xs opacity-60">{counts[key]}</span>
          </button>
        ))}
      </div>

      <section className="min-w-0 overflow-hidden rounded-xl border bg-card">
        <div className="max-h-[min(36rem,calc(100dvh-12rem))] overflow-auto overscroll-contain">
          <div
            className={cn(
              "sticky top-0 z-10 hidden gap-3.5 bg-muted px-4 py-2 text-[11px] font-semibold tracking-wide text-muted-foreground uppercase shadow-[0_1px_0_var(--color-border)] lg:grid",
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
            visible.map(({ member, days }) => {
              const since = awaySince(member);
              const color = tone(days);
              return (
                <div
                  key={member.id}
                  className={cn(
                    "grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3.5 gap-y-2 border-b px-4 py-3 last:border-b-0 hover:bg-muted/40",
                    ROW_GRID,
                  )}
                >
                  <div className="flex min-w-0 items-center gap-2.5">
                    <Avatar className="size-8 shrink-0">
                      <AvatarImage
                        src={
                          member.avatar_url ??
                          `https://api.dicebear.com/6.x/initials/svg?seed=${member.username}`
                        }
                        alt=""
                      />
                      <AvatarFallback className="text-[10px]">
                        {member.username.slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <Link
                        href={`/profile/${member.id}`}
                        className="block truncate font-semibold hover:underline"
                      >
                        {member.username}
                      </Link>
                      <p className="truncate text-[11.5px] text-muted-foreground">
                        {member.vk_name && `${member.vk_name} · `}в гильдии{" "}
                        {daysLabel(member.daysInGuild)}
                      </p>
                      <div className="mt-1 flex flex-wrap gap-1">
                        {member.isInactive && (
                          <span className="rounded-full bg-red-100 px-2 py-px text-[11px] font-semibold text-red-700 dark:bg-red-500/15 dark:text-red-300">
                            Ушёл из гильдии
                          </span>
                        )}
                        {member.isAfkTagged && (
                          <span className="rounded-full bg-zinc-100 px-2 py-px text-[11px] font-semibold text-zinc-600 dark:bg-white/10 dark:text-zinc-300">
                            Тег АФК
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <span className="hidden lg:block">
                    <ClassPill cls={member.class} />
                  </span>
                  <span className="hidden text-right tabular-nums lg:block">
                    {member.class_gear_score?.toLocaleString("ru-RU") ?? "—"}
                  </span>

                  <div className="col-span-2 row-start-2 lg:col-span-1 lg:row-start-auto">
                    <span
                      className={cn("font-semibold tabular-nums", color.text)}
                    >
                      {days === null
                        ? "неизвестно"
                        : days === 0
                          ? "меньше дня"
                          : daysLabel(days)}
                    </span>
                    {since !== null && (
                      <span className="ml-1.5 text-[11px] text-muted-foreground">
                        с {new Date(since).toLocaleDateString("ru-RU")}
                      </span>
                    )}
                    <span className="mt-1 block h-1.5 overflow-hidden rounded-full bg-muted">
                      <span
                        className={cn("block h-full rounded-full", color.bar)}
                        style={{ width: `${((days ?? 0) / maxDays) * 100}%` }}
                      />
                    </span>
                  </div>

                  <div className="col-start-2 row-start-1 flex justify-end lg:col-start-auto lg:row-start-auto">
                    <Salary member={member as unknown as Member} />
                  </div>

                  <div className="col-span-2 flex flex-wrap gap-1.5 lg:col-span-1 lg:justify-end">
                    {member.isAfkTagged && member.afkTagId != null && (
                      <ConfirmAction
                        label="Снять АФК"
                        question="Снять?"
                        onConfirm={() => untag(member)}
                      />
                    )}
                    {member.isInactive && (
                      <ConfirmAction
                        label="Вернуть в гильдию"
                        question="Вернуть?"
                        onConfirm={() => bringBack(member)}
                      />
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>
    </div>
  );
}
