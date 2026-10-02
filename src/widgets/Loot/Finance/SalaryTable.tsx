"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowDown, ArrowUp, ChevronDown, Info, Search } from "lucide-react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Checkbox,
  Input,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/shared/ui";
import { cn } from "@/shared/lib/tw-merge";
import { classColors } from "@/widgets/MembersTable/classStyles";
import {
  DESC_FIRST,
  MONTHS_GENITIVE,
  attendanceTone,
  formatGold,
  groupSalariesByClass,
  sortSalaries,
  type SalaryGroup,
  type SalaryRow,
  type SalarySort,
  type SalarySortKey,
} from "./financeModel";

const GOLD_ICON = "https://archeagecodex.com/items/gold.png";
const COLUMNS =
  "grid-cols-[minmax(0,1.3fr)_140px_minmax(0,1.2fr)_64px_92px_164px_80px]";

const HEADERS: { key: SalarySortKey | null; label: string; align?: "right" }[] =
  [
    { key: "class", label: "Игрок" },
    { key: "attendance", label: "Посещаемость" },
    { key: null, label: "Надбавки" },
    { key: "weight", label: "Вес", align: "right" },
    { key: "total", label: "Зарплата", align: "right" },
    { key: null, label: "Аванс" },
    { key: "rest", label: "Остаток", align: "right" },
  ];

type AdvanceHandlers = {
  isAdmin: boolean;
  onAdvanceChange: (
    salaryId: number,
    sentAmount: number,
    sent: boolean,
  ) => void;
  onEditStart: (salaryId: number) => void;
  onEditEnd: () => void;
};

function PlayerAvatar({ row }: { row: SalaryRow }) {
  return (
    <Avatar className="size-8 shrink-0">
      <AvatarImage
        src={
          row.avatarUrl ??
          `https://api.dicebear.com/6.x/initials/svg?seed=${row.username}`
        }
        alt=""
      />
      <AvatarFallback className="text-[11px] font-semibold">
        {row.username.slice(0, 2)}
      </AvatarFallback>
    </Avatar>
  );
}

function Modifiers({ row }: { row: SalaryRow }) {
  const mods = [
    row.tenurePercent
      ? {
          text: `стаж +${Math.round(row.tenurePercent)}%`,
          className: "bg-muted text-foreground/80",
        }
      : null,
    row.customBonusPercent
      ? {
          text: `бонус +${Math.round(row.customBonusPercent)}%`,
          className:
            "bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-400",
        }
      : null,
    row.penaltyPercent
      ? {
          text: `штраф −${Math.round(row.penaltyPercent)}%`,
          className:
            "bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400",
        }
      : null,
  ].filter(Boolean) as { text: string; className: string }[];

  if (mods.length === 0) {
    return <span className="text-xs text-muted-foreground">—</span>;
  }
  return (
    <span className="flex flex-wrap gap-1">
      {mods.map((mod) => (
        <span
          key={mod.text}
          className={cn(
            "rounded-full px-1.5 py-px text-xs font-medium whitespace-nowrap",
            mod.className,
          )}
        >
          {mod.text}
        </span>
      ))}
    </span>
  );
}

function AdvanceControls({
  row,
  handlers,
}: {
  row: SalaryRow;
  handlers: AdvanceHandlers;
}) {
  if (!handlers.isAdmin) {
    return row.sentAmount > 0 || row.sent ? (
      <span className="rounded-full bg-green-50 px-2 py-0.5 text-xs font-medium text-green-700 dark:bg-green-500/10 dark:text-green-400">
        {row.sent ? "выслано" : "аванс"}{" "}
        {row.sentAmount > 0 ? formatGold(row.sentAmount) : ""}
      </span>
    ) : (
      <span className="text-xs text-muted-foreground">—</span>
    );
  }
  return (
    <span className="flex items-center gap-2">
      <Checkbox
        checked={row.sent}
        aria-label={`Выслано: ${row.username}`}
        onCheckedChange={(checked) =>
          handlers.onAdvanceChange(row.id, row.sentAmount, checked === true)
        }
      />
      <Input
        type="number"
        value={row.sentAmount}
        aria-label={`Сумма аванса: ${row.username}`}
        onFocus={() => handlers.onEditStart(row.id)}
        onBlur={handlers.onEditEnd}
        onChange={(event) =>
          handlers.onAdvanceChange(row.id, +event.target.value, row.sent)
        }
        className="h-8 w-[104px] tabular-nums"
      />
    </span>
  );
}

function AttendanceCell({ row }: { row: SalaryRow }) {
  const tone = attendanceTone(row.totalPercent);
  return (
    <span className="flex flex-col gap-1">
      <span className="flex items-baseline justify-between gap-2 text-[13px]">
        <span className={cn("font-semibold tabular-nums", tone.text)}>
          {Math.round(row.totalPercent)}%
        </span>
        <span className="text-[11.5px] text-muted-foreground tabular-nums">
          П {Math.round(row.primePercent)} · А {Math.round(row.aglPercent)}
        </span>
      </span>
      <span className="relative block h-1 overflow-hidden rounded-full bg-muted">
        <span
          className={cn("absolute inset-y-0 left-0 rounded-full", tone.bar)}
          style={{ width: `${Math.min(100, row.totalPercent)}%` }}
        />
      </span>
    </span>
  );
}

function SalaryValue({
  value,
  className,
}: {
  value: number;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center justify-end gap-1.5 font-bold tabular-nums",
        className,
      )}
    >
      <Image src={GOLD_ICON} alt="" width={14} height={14} />
      {formatGold(value)}
    </span>
  );
}

function NameBlock({ row, isMe }: { row: SalaryRow; isMe: boolean }) {
  return (
    <span className="min-w-0">
      <span className="flex min-w-0 items-center gap-1.5">
        <Link
          href={`/profile/${row.userId}`}
          className="truncate font-semibold transition-colors hover:text-primary"
        >
          {row.username}
        </Link>
        {isMe && (
          <span className="shrink-0 rounded-full bg-green-100 px-1.5 text-[11px] font-semibold text-green-700 dark:bg-green-500/15 dark:text-green-400">
            вы
          </span>
        )}
      </span>
      {row.class && (
        <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <span
            className="size-[7px] rounded-full"
            style={{ backgroundColor: classColors[row.class] }}
          />
          {row.class}
        </span>
      )}
    </span>
  );
}

function GroupTitle({
  group,
  desktop,
}: {
  group: SalaryGroup;
  desktop?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 text-sm font-semibold",
        desktop ? "border-b bg-muted/30 px-4 py-2 text-[13px]" : "px-1 pt-2",
      )}
    >
      {group.className && (
        <span
          className="size-2 rounded-full"
          style={{ backgroundColor: classColors[group.className] }}
        />
      )}
      {group.title}
      <span className="font-medium text-muted-foreground">
        {group.rows.length}
      </span>
    </div>
  );
}

export default function SalaryTable({
  rows,
  month,
  currentUserId,
  unpaidReasons,
  handlers,
}: {
  rows: SalaryRow[];
  month: number;
  currentUserId: number | null;
  unpaidReasons: Record<number, string>;
  handlers: AdvanceHandlers;
}) {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SalarySort>({ key: "class", desc: false });
  const [showUnpaid, setShowUnpaid] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  const query = search.trim().toLowerCase();
  const filtered = useMemo(
    () =>
      rows.filter(
        (row) => !query || row.username.toLowerCase().includes(query),
      ),
    [rows, query],
  );
  const paid = useMemo(
    () =>
      sortSalaries(
        filtered.filter((row) => row.total > 0),
        sort,
      ),
    [filtered, sort],
  );
  const unpaid = useMemo(
    () =>
      sortSalaries(
        filtered.filter((row) => row.total <= 0),
        { key: "class", desc: false },
      ),
    [filtered],
  );
  const grouped = sort.key === "class";
  const groups: SalaryGroup[] = grouped
    ? groupSalariesByClass(paid)
    : [{ key: "all", title: "", className: null, rows: paid }];

  const toggleSort = (key: SalarySortKey) => {
    listRef.current?.scrollTo({ top: 0 });
    setSort((current) =>
      current.key === key
        ? { key, desc: !current.desc }
        : { key, desc: DESC_FIRST.includes(key) },
    );
  };

  const Arrow = sort.desc ? ArrowDown : ArrowUp;

  return (
    <section aria-label="Зарплаты" className="flex min-w-0 flex-col gap-3">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-[15px] font-semibold">
            Зарплаты за {MONTHS_GENITIVE[month - 1]}
          </h2>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Вес — посещаемость с надбавками; зарплата — доля фонда по весу
          </p>
        </div>
        <div className="relative w-full sm:w-60">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Найти игрока"
            aria-label="Найти игрока"
            className="pl-9"
          />
        </div>
      </div>

      <div
        ref={listRef}
        className="hidden max-h-[min(75vh,760px)] overflow-y-auto rounded-xl border bg-card [scrollbar-width:thin] xl:block"
      >
        <div
          className={cn(
            "sticky top-0 z-10 grid items-center gap-3 border-b bg-muted px-4 py-2 text-xs font-medium text-muted-foreground",
            COLUMNS,
          )}
        >
          {HEADERS.map((header) =>
            header.key ? (
              <button
                key={header.label}
                type="button"
                onClick={() => toggleSort(header.key!)}
                aria-label={`Сортировать: ${header.label}`}
                className={cn(
                  "inline-flex cursor-pointer items-center gap-1 hover:text-foreground",
                  header.align === "right" && "justify-end",
                  sort.key === header.key && "text-foreground",
                )}
              >
                {header.label}
                {sort.key === header.key && <Arrow className="size-3.5" />}
              </button>
            ) : (
              <span key={header.label}>{header.label}</span>
            ),
          )}
        </div>

        {paid.length === 0 && unpaid.length === 0 && (
          <p className="px-4 py-10 text-center text-sm text-muted-foreground">
            Никого не нашлось
          </p>
        )}

        {groups.map((group) => (
          <div key={group.key}>
            {grouped && <GroupTitle group={group} desktop />}
            {group.rows.map((row) => {
              const isMe = row.userId === currentUserId;
              return (
                <div
                  key={row.id}
                  className={cn(
                    "grid min-h-[54px] items-center gap-3 border-b border-border/60 px-4 py-1.5",
                    COLUMNS,
                    isMe && "bg-green-50/70 dark:bg-green-500/5",
                  )}
                >
                  <span className="flex min-w-0 items-center gap-2.5">
                    <PlayerAvatar row={row} />
                    <NameBlock row={row} isMe={isMe} />
                  </span>
                  <AttendanceCell row={row} />
                  <Modifiers row={row} />
                  <span className="text-right text-sm text-muted-foreground tabular-nums">
                    {Math.round(row.weightPercent)}%
                  </span>
                  <SalaryValue value={row.total} />
                  <AdvanceControls row={row} handlers={handlers} />
                  <span className="text-right font-semibold tabular-nums">
                    {formatGold(row.total - row.sentAmount)}
                  </span>
                </div>
              );
            })}
          </div>
        ))}

        {unpaid.length > 0 && (
          <>
            <button
              type="button"
              onClick={() => setShowUnpaid((value) => !value)}
              aria-expanded={showUnpaid}
              className="flex w-full cursor-pointer items-center gap-2 border-b bg-muted/40 px-4 py-2.5 text-left text-sm font-semibold"
            >
              <ChevronDown
                className={cn(
                  "size-4 transition-transform",
                  !showUnpaid && "-rotate-90",
                )}
              />
              Без зарплаты в этом месяце
              <span className="font-medium text-muted-foreground">
                {unpaid.length}
              </span>
            </button>
            {showUnpaid &&
              unpaid.map((row) => (
                <div
                  key={row.id}
                  className="grid min-h-12 grid-cols-[minmax(0,1.3fr)_140px_minmax(0,2fr)] items-center gap-3 border-b border-border/60 px-4 py-1.5 text-muted-foreground"
                >
                  <span className="flex min-w-0 items-center gap-2.5 opacity-80">
                    <PlayerAvatar row={row} />
                    <NameBlock row={row} isMe={row.userId === currentUserId} />
                  </span>
                  <span className="text-sm tabular-nums">
                    посещаемость {Math.round(row.totalPercent)}%
                  </span>
                  <span className="text-[13px]">
                    {unpaidReasons[row.userId] ?? "Вес за месяц — 0"}
                  </span>
                </div>
              ))}
          </>
        )}
      </div>

      <div className="flex flex-col gap-3 xl:hidden">
        {paid.length === 0 && unpaid.length === 0 && (
          <p className="rounded-xl border border-dashed px-4 py-10 text-center text-sm text-muted-foreground">
            Никого не нашлось
          </p>
        )}
        {groups.map((group) => (
          <div key={group.key} className="flex flex-col gap-2">
            {grouped && <GroupTitle group={group} />}
            <div className="grid grid-cols-[repeat(auto-fill,minmax(min(320px,100%),1fr))] gap-2">
              {group.rows.map((row) => {
                const isMe = row.userId === currentUserId;
                return (
                  <div
                    key={row.id}
                    className={cn(
                      "flex flex-col gap-2 rounded-xl border bg-card px-3.5 py-3",
                      isMe &&
                        "border-green-200 bg-green-50/70 dark:border-green-500/25 dark:bg-green-500/5",
                    )}
                  >
                    <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2.5">
                      <PlayerAvatar row={row} />
                      <NameBlock row={row} isMe={isMe} />
                      <SalaryValue value={row.total} className="text-[15px]" />
                    </div>
                    <AttendanceCell row={row} />
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <Modifiers row={row} />
                      <span className="text-xs text-muted-foreground tabular-nums">
                        вес {Math.round(row.weightPercent)}%
                      </span>
                    </div>
                    {(handlers.isAdmin || row.sentAmount > 0 || row.sent) && (
                      <div className="flex items-center justify-between gap-2 border-t border-border/60 pt-2 text-xs text-muted-foreground">
                        <AdvanceControls row={row} handlers={handlers} />
                        <span className="tabular-nums">
                          остаток{" "}
                          <b className="text-foreground">
                            {formatGold(row.total - row.sentAmount)}
                          </b>
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
        {unpaid.length > 0 && (
          <div className="rounded-xl border bg-card">
            <button
              type="button"
              onClick={() => setShowUnpaid((value) => !value)}
              aria-expanded={showUnpaid}
              className="flex min-h-11 w-full cursor-pointer items-center gap-2 px-3.5 text-left text-sm font-semibold"
            >
              <ChevronDown
                className={cn(
                  "size-4 transition-transform",
                  !showUnpaid && "-rotate-90",
                )}
              />
              Без зарплаты в этом месяце
              <span className="font-medium text-muted-foreground">
                {unpaid.length}
              </span>
            </button>
            {showUnpaid && (
              <ul className="border-t">
                {unpaid.map((row) => (
                  <li
                    key={row.id}
                    className="flex items-center gap-2.5 border-b border-border/60 px-3.5 py-2 last:border-b-0"
                  >
                    <PlayerAvatar row={row} />
                    <NameBlock row={row} isMe={row.userId === currentUserId} />
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          type="button"
                          aria-label="Почему зарплата 0"
                          className="ml-auto flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-md text-muted-foreground"
                        >
                          <Info className="size-4" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>
                        {unpaidReasons[row.userId] ?? "Вес за месяц — 0"}
                      </TooltipContent>
                    </Tooltip>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
