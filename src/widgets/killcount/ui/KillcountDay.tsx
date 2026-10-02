"use client";

import { cloneElement, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Pencil, Plus, Search } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/shared/lib/tw-merge";
import { Avatar, AvatarFallback, AvatarImage, Button } from "@/shared/ui";
import { classColors, classIcons } from "@/widgets/MembersTable/classStyles";
import type { KillCount } from "../types";
import { updateKillCountById } from "../api/history";
import { addKillCountRowToday } from "../api/current";
import { KillCountEditModal } from "./killcount-edit-modal";
import { StatSuffix, StatTile } from "./KillcountHeader";
import {
  avatarSrc,
  formatNumber,
  honor,
  kills,
  sortRows,
  type KillRow,
  type SortKey,
} from "./killcountModel";

const PODIUM = [
  {
    medal: "bg-amber-400 text-amber-950",
    card: "border-amber-300 bg-gradient-to-b from-amber-50 to-card pt-6 dark:border-amber-500/40 dark:from-amber-500/10",
    avatar: "size-16 sm:size-[72px]",
  },
  {
    medal: "bg-zinc-300 text-zinc-800",
    card: "",
    avatar: "size-12 sm:size-14",
  },
  {
    medal: "bg-orange-300 text-orange-950",
    card: "",
    avatar: "size-12 sm:size-14",
  },
];

function PlayerAvatar({
  row,
  className,
}: {
  row: KillRow;
  className?: string;
}) {
  return (
    <Avatar className={cn("size-7 shrink-0", className)}>
      <AvatarImage src={avatarSrc(row.userName, row.avatarUrl)} alt="" />
      <AvatarFallback className="text-[10px]">
        {row.userName.slice(0, 2)}
      </AvatarFallback>
    </Avatar>
  );
}

function ClassBadge({ row }: { row: KillRow }) {
  const role = row.role ?? "";
  const color = classColors[role];
  if (!color) {
    return (
      <span className="text-xs text-muted-foreground">{row.playerClass}</span>
    );
  }
  const icon = classIcons[role];
  return (
    <span
      className="inline-flex items-center gap-1 rounded-full px-2 py-px text-[11px] font-semibold whitespace-nowrap text-background"
      style={{ backgroundColor: color }}
    >
      {icon && cloneElement(icon, { className: "size-3" })}
      {row.playerClass || role}
    </span>
  );
}

function PlayerName({ row }: { row: KillRow }) {
  return row.userId ? (
    <Link
      href={`/profile/${row.userId}`}
      className="truncate font-semibold hover:underline"
    >
      {row.userName}
    </Link>
  ) : (
    <span className="truncate font-semibold">{row.userName}</span>
  );
}

function Podium({ rows }: { rows: KillRow[] }) {
  // На пьедестале 2-е место слева, 1-е по центру, 3-е справа.
  const order = [1, 0, 2].filter((place) => rows[place]);
  return (
    <section
      aria-label="Топ-3"
      className={cn(
        "grid items-end gap-2.5 pt-3",
        order.length === 3 ? "grid-cols-3" : "grid-cols-2 sm:grid-cols-3",
      )}
    >
      {order.map((place) => {
        const row = rows[place];
        const style = PODIUM[place];
        return (
          <div
            key={row.id}
            className={cn(
              "relative flex min-w-0 flex-col items-center gap-1.5 rounded-2xl border bg-card px-2 py-3.5 text-center",
              style.card,
            )}
          >
            <span
              className={cn(
                "absolute -top-3 grid size-6 place-items-center rounded-full border-2 border-card text-xs font-extrabold",
                style.medal,
              )}
            >
              {place + 1}
            </span>
            <PlayerAvatar row={row} className={style.avatar} />
            <span className="flex max-w-full min-w-0 text-[13px] sm:text-[15px]">
              <PlayerName row={row} />
            </span>
            <ClassBadge row={row} />
            <span className="text-[22px] leading-none font-extrabold text-red-600 tabular-nums sm:text-[26px] dark:text-red-400">
              {kills(row)}{" "}
              <span className="text-xs font-semibold text-muted-foreground">
                килов
              </span>
            </span>
            <span className="text-xs text-muted-foreground tabular-nums">
              {formatNumber(honor(row))} хонора
            </span>
          </div>
        );
      })}
    </section>
  );
}

function KillBar({ value, max }: { value: number; max: number }) {
  return (
    <span className="block h-2 overflow-hidden rounded bg-muted">
      <span
        className="block h-full rounded bg-red-500"
        style={{ width: `${max > 0 ? (Math.max(0, value) / max) * 100 : 0}%` }}
      />
    </span>
  );
}

function Range({ from, to }: { from: number; to: number }) {
  return (
    <span className="block font-mono text-[10.5px] text-muted-foreground">
      {formatNumber(from)} → {formatNumber(to)}
    </span>
  );
}

/**
 * День киллкаунта: итоги, топ-3 и таблица.
 * mode="saved" — данные из базы, правка строки сохраняется сразу;
 * mode="draft" — ручное добавление: всё правится локально, сохраняет родитель.
 */
export function KillcountDay({
  data,
  mode,
  isCanEdit,
  onDraftChange,
  canAddToday = false,
}: {
  data: KillRow[];
  mode: "saved" | "draft";
  isCanEdit: boolean;
  onDraftChange?: (rows: KillCount[]) => void;
  /** Сегодняшний сохранённый день: «Добавить» сразу пишет игрока в базу. */
  canAddToday?: boolean;
}) {
  const router = useRouter();
  const [rows, setRows] = useState<KillRow[]>(data);
  const [sortKey, setSortKey] = useState<SortKey>("kills");
  const [search, setSearch] = useState("");
  const [rowToEdit, setRowToEdit] = useState<KillRow>();
  const [dialogOpen, setDialogOpen] = useState(false);

  // Новые данные сверху (вставили JSON, обновилась страница) — сбрасываем строки.
  const [syncedData, setSyncedData] = useState(data);
  if (data !== syncedData) {
    setSyncedData(data);
    setRows(data);
  }

  const sorted = useMemo(() => sortRows(rows, sortKey), [rows, sortKey]);
  const byKills = useMemo(() => sortRows(rows, "kills"), [rows]);
  const term = search.trim().toLowerCase();
  const shown = term
    ? sorted.filter((row) => row.userName.toLowerCase().includes(term))
    : sorted;
  const maxKills = Math.max(0, ...rows.map(kills));
  const totalKills = rows.reduce((sum, row) => sum + kills(row), 0);
  const totalHonor = rows.reduce((sum, row) => sum + honor(row), 0);
  const placeOf = (row: KillRow) => sorted.indexOf(row) + 1;

  const replaceRows = (next: KillRow[]) => {
    setRows(next);
    if (mode === "draft") onDraftChange?.(next as KillCount[]);
  };

  const handleSubmit = async (value: KillCount) => {
    if (mode === "draft") {
      replaceRows(
        rowToEdit
          ? rows.map((row) =>
              row.id === rowToEdit.id ? { ...row, ...value } : row,
            )
          : [...rows, value],
      );
      return;
    }
    if (!rowToEdit) {
      try {
        await addKillCountRowToday(value);
        toast.success(`${value.userName} добавлен`);
        router.refresh();
      } catch {
        toast.error("Не удалось добавить", {
          description: "Проверьте, что ник совпадает с ником на сайте",
        });
      }
      return;
    }
    try {
      await updateKillCountById(value);
      setRows((previous) =>
        previous.map((row) =>
          row.id === value.id ? { ...row, ...value } : row,
        ),
      );
      toast.success("Сохранено");
    } catch {
      toast.error("Не удалось сохранить строку");
    }
  };

  const openEdit = (row?: KillRow) => {
    setRowToEdit(row);
    setDialogOpen(true);
  };

  const editButton = (row: KillRow) =>
    isCanEdit && (
      <Button
        variant="ghost"
        size="icon-sm"
        aria-label={`Изменить: ${row.userName}`}
        className="cursor-pointer text-muted-foreground"
        onClick={(event) => {
          event.stopPropagation();
          openEdit(row);
        }}
      >
        <Pencil className="size-3.5" />
      </Button>
    );

  return (
    <div className="flex flex-col gap-4">
      <section
        aria-label="Итоги дня"
        className="grid grid-cols-2 gap-2.5 lg:grid-cols-4"
      >
        <StatTile label="Всего килов" accent>
          {formatNumber(totalKills)}
        </StatTile>
        <StatTile label="Хонора">{formatNumber(totalHonor)}</StatTile>
        <StatTile label="Игроков">{rows.length}</StatTile>
        <StatTile label="В среднем на игрока">
          {rows.length ? Math.round(totalKills / rows.length) : 0}
          <StatSuffix>килов</StatSuffix>
        </StatTile>
      </section>

      {byKills.length > 0 && <Podium rows={byKills.slice(0, 3)} />}

      <section className="@container/kills flex min-w-0 flex-col overflow-hidden rounded-xl border bg-card">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b p-3">
          <label className="relative flex min-w-48 flex-1 items-center sm:max-w-64">
            <Search className="pointer-events-none absolute left-2.5 size-4 text-muted-foreground" />
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Поиск по нику"
              aria-label="Поиск по нику"
              className="h-9 w-full rounded-lg border bg-background pr-3 pl-8 text-sm outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40"
            />
          </label>
          <div className="flex flex-wrap items-center gap-2">
            <div
              role="group"
              aria-label="Сортировка"
              className="inline-flex gap-0.5 rounded-lg bg-muted p-[3px]"
            >
              {(
                [
                  ["kills", "По килам"],
                  ["honor", "По хоноре"],
                ] as const
              ).map(([key, label]) => (
                <button
                  key={key}
                  type="button"
                  aria-pressed={sortKey === key}
                  onClick={() => setSortKey(key)}
                  className={cn(
                    "cursor-pointer rounded-md px-3 py-1 text-[12.5px] font-medium text-muted-foreground hover:text-foreground",
                    sortKey === key &&
                      "bg-background text-foreground shadow-sm",
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
            {(mode === "draft" || canAddToday) && isCanEdit && (
              <Button
                size="sm"
                className="cursor-pointer"
                onClick={() => openEdit()}
              >
                <Plus /> Добавить
              </Button>
            )}
          </div>
        </div>

        {shown.length === 0 ? (
          <p className="py-10 text-center text-muted-foreground">
            {rows.length === 0 ? "Пока никого нет" : "Никого не найдено"}
          </p>
        ) : (
          <div className="max-h-[min(30rem,calc(100dvh-14rem))] overflow-auto overscroll-contain">
            <table className="hidden w-full border-collapse tabular-nums @[44rem]/kills:table">
              <thead className="sticky top-0 z-10 bg-muted text-[11px] font-semibold tracking-wide text-muted-foreground uppercase shadow-[0_1px_0_var(--color-border)]">
                <tr>
                  <th className="w-12 px-3 py-2 text-center">#</th>
                  <th className="px-3 py-2 text-left">Игрок</th>
                  <th className="px-3 py-2 text-left">Класс</th>
                  <th className="px-3 py-2 text-left">Килы</th>
                  <th className="px-3 py-2 text-right">Хонор</th>
                  {isCanEdit && <th className="w-10" />}
                </tr>
              </thead>
              <tbody>
                {shown.map((row) => (
                  <tr
                    key={row.id}
                    className="border-b last:border-b-0 hover:bg-muted/50"
                  >
                    <td className="px-3 py-2 text-center font-semibold text-muted-foreground">
                      {placeOf(row)}
                    </td>
                    <td className="max-w-64 px-3 py-2">
                      <span className="flex min-w-0 items-center gap-2">
                        <PlayerAvatar row={row} />
                        <PlayerName row={row} />
                        {row.comment && (
                          <span className="shrink-0 rounded-full border px-1.5 text-[11px] text-muted-foreground">
                            {row.comment}
                          </span>
                        )}
                      </span>
                    </td>
                    <td className="px-3 py-2">
                      <ClassBadge row={row} />
                    </td>
                    <td className="min-w-48 px-3 py-2">
                      <span className="flex items-center gap-2.5">
                        <span className="flex-1">
                          <KillBar value={kills(row)} max={maxKills} />
                        </span>
                        <span className="min-w-7 text-right text-[15px] font-bold">
                          {kills(row)}
                        </span>
                      </span>
                      <Range from={row.startKills} to={row.endKills} />
                    </td>
                    <td className="px-3 py-2 text-right whitespace-nowrap">
                      <span className="font-bold">
                        {formatNumber(honor(row))}
                      </span>
                      <Range from={row.startHonor} to={row.endHonor} />
                    </td>
                    {isCanEdit && <td className="px-1">{editButton(row)}</td>}
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="flex flex-col @[44rem]/kills:hidden">
              {shown.map((row) => (
                <div
                  key={row.id}
                  className="grid grid-cols-[1.75rem_minmax(0,1fr)_auto] items-center gap-x-2.5 gap-y-1.5 border-b px-3 py-2.5 last:border-b-0"
                >
                  <span className="text-center font-semibold text-muted-foreground">
                    {placeOf(row)}
                  </span>
                  <span className="flex min-w-0 items-center gap-2">
                    <PlayerAvatar row={row} />
                    <span className="flex min-w-0 flex-col items-start gap-0.5">
                      <span className="flex max-w-full min-w-0 items-center gap-1.5">
                        <PlayerName row={row} />
                        {row.comment && (
                          <span className="shrink-0 rounded-full border px-1.5 text-[10.5px] text-muted-foreground">
                            {row.comment}
                          </span>
                        )}
                      </span>
                      <ClassBadge row={row} />
                    </span>
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="text-right leading-tight tabular-nums">
                      <span className="block text-[17px] font-bold text-red-600 dark:text-red-400">
                        {kills(row)}
                      </span>
                      <span className="text-[11px] text-muted-foreground">
                        {formatNumber(honor(row))} хон.
                      </span>
                    </span>
                    {editButton(row)}
                  </span>
                  <span className="col-start-2 col-end-4">
                    <KillBar value={kills(row)} max={maxKills} />
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-wrap justify-between gap-2 border-t bg-muted px-3.5 py-2.5 font-semibold tabular-nums">
          <span>Итого</span>
          <span>
            {formatNumber(totalKills)} килов · {formatNumber(totalHonor)} хонора
          </span>
        </div>
      </section>

      <KillCountEditModal
        isVisible={dialogOpen}
        setIsVisible={setDialogOpen}
        resetEditValue={() => setRowToEdit(undefined)}
        onSubmit={handleSubmit}
        rowToEdit={rowToEdit}
      />
    </div>
  );
}
