"use client";

import { useId, useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import {
  ArrowDownLeft,
  ArrowRight,
  ArrowUpRight,
  ChevronDown,
  Gift,
  Landmark,
  MoreHorizontal,
  Pencil,
  Plus,
  Trash2,
  type LucideIcon,
} from "lucide-react";
import { toast } from "sonner";
import {
  Button,
  Card,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Input,
  Label,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Skeleton,
} from "@/shared/ui";
import { cn } from "@/shared/lib/tw-merge";
import type { ItemType, LootItem } from "../GuildLoot/LootTypes";
import { LootIcon } from "../LootBuy/icons/LootIconComponent";
import {
  formatDate,
  formatGold,
  plural,
  type BossSales,
  type JournalDay,
  type JournalEntry,
  type JournalKind,
  type MiscTotal,
} from "./treasuryModel";

const DAYS_STEP = 7;

const KIND_META: Record<
  JournalKind,
  { label: string; icon: LucideIcon; chip: string; dot: string }
> = {
  drop: {
    label: "Получено",
    icon: ArrowDownLeft,
    chip: "bg-blue-50 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300",
    dot: "bg-blue-500",
  },
  sale: {
    label: "Продано",
    icon: ArrowUpRight,
    chip: "bg-green-50 text-green-700 dark:bg-green-500/15 dark:text-green-300",
    dot: "bg-green-600",
  },
  gift: {
    label: "Выдано",
    icon: Gift,
    chip: "bg-violet-50 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300",
    dot: "bg-violet-500",
  },
  treasury: {
    label: "В казну",
    icon: Landmark,
    chip: "bg-orange-50 text-orange-700 dark:bg-orange-500/15 dark:text-orange-300",
    dot: "bg-orange-500",
  },
};

const FILTERS: ("all" | JournalKind)[] = ["all", "drop", "sale", "gift", "treasury"];

type RecordActions = {
  onEditRecord: (record: LootItem) => void;
  onDeleteRecord: (record: LootItem, kind: JournalKind) => void;
};

function KindChip({ kind, className }: { kind: JournalKind; className?: string }) {
  const meta = KIND_META[kind];
  const Icon = meta.icon;
  return (
    <span
      className={cn(
        "inline-flex h-6 items-center gap-1.5 rounded-md px-2 text-xs font-medium whitespace-nowrap",
        meta.chip,
        className,
      )}
    >
      <Icon className="size-3.5" aria-hidden />
      {meta.label}
    </span>
  );
}

function RecordMenu({
  record,
  kind,
  onEditRecord,
  onDeleteRecord,
}: RecordActions & { record: LootItem; kind: JournalKind }) {
  const canEdit = kind !== "drop";
  const canDelete = kind !== "drop" || record.status === "В наличии";
  if (!canEdit && !canDelete) return <span className="size-8 shrink-0" />;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon-sm"
          className="-my-1 shrink-0 text-muted-foreground"
          aria-label="Действия с записью"
        >
          <MoreHorizontal />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {canEdit && (
          <DropdownMenuItem className="cursor-pointer" onSelect={() => onEditRecord(record)}>
            <Pencil />
            Изменить
          </DropdownMenuItem>
        )}
        {canEdit && canDelete && <DropdownMenuSeparator />}
        {canDelete && (
          <DropdownMenuItem
            variant="destructive"
            className="cursor-pointer"
            onSelect={() => onDeleteRecord(record, kind)}
          >
            <Trash2 />
            Удалить…
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function Recipient({ entry }: { entry: JournalEntry }) {
  if (entry.kind === "drop") {
    return <span className="text-muted-foreground">на склад</span>;
  }
  if (entry.kind === "treasury") return null;
  return (
    <span className="inline-flex max-w-full min-w-0 items-center gap-1">
      <ArrowRight className="size-3.5 shrink-0 text-muted-foreground" aria-hidden />
      {entry.recipientId ? (
        <Link
          href={`/profile/${entry.recipientId}`}
          className="truncate font-medium hover:underline"
        >
          {entry.recipient}
        </Link>
      ) : (
        <span className="truncate font-medium">{entry.recipient ?? "—"}</span>
      )}
    </span>
  );
}

function Amount({ entry }: { entry: JournalEntry }) {
  if (entry.kind === "sale" || entry.kind === "treasury") {
    return (
      <span className="font-semibold text-green-700 tabular-nums dark:text-green-400">
        +{formatGold(entry.amount)}
      </span>
    );
  }
  if (entry.kind === "gift") {
    return <span className="text-sm text-muted-foreground">бесплатно</span>;
  }
  return null;
}

function RecordList({
  entry,
  ...actions
}: RecordActions & { entry: JournalEntry }) {
  return (
    <ul className="mt-2 divide-y rounded-lg border bg-muted/30">
      {entry.records.map((record) => {
        const date = entry.kind === "drop" ? record.acquired_at : record.sold_at;
        const quantity = record.quantity ?? 0;
        return (
          <li key={record.id} className="flex items-center gap-3 px-3 py-1.5 text-xs">
            <span className="text-muted-foreground tabular-nums">
              {date ? formatDate(new Date(date)) : "—"}
            </span>
            <span className="min-w-0 flex-1 truncate">
              {record.itemType.name}
              {quantity > 1 && ` ×${formatGold(quantity)}`}
              {entry.kind === "drop" && record.status !== "В наличии" && (
                <span className="text-muted-foreground">
                  {" "}
                  · {record.status?.toLowerCase()}
                </span>
              )}
            </span>
            {entry.kind === "sale" && (
              <span className="tabular-nums">{formatGold(record.price ?? 0)}</span>
            )}
            <RecordMenu record={record} kind={entry.kind} {...actions} />
          </li>
        );
      })}
    </ul>
  );
}

function EntryRow({
  entry,
  isAdmin,
  expanded,
  onToggle,
  ...actions
}: RecordActions & {
  entry: JournalEntry;
  isAdmin: boolean;
  expanded: boolean;
  onToggle: () => void;
}) {
  const multi = entry.records.length > 1;
  return (
    <div className="border-b px-4 py-3 last:border-b-0">
      <div className="flex items-start gap-3">
        <KindChip kind={entry.kind} className="mt-px hidden w-[104px] shrink-0 sm:inline-flex" />
        <div className="min-w-0 flex-1">
          <div className="mb-1.5 flex items-center justify-between gap-2 sm:hidden">
            <KindChip kind={entry.kind} />
            <Amount entry={entry} />
          </div>
          <div className="flex flex-col gap-1 md:flex-row md:items-start md:gap-4">
            <div className="min-w-0 md:flex-[1.6]">
              <p className="leading-snug">
                <span className="font-medium">{entry.title}</span>
                {entry.showQuantity && (
                  <span className="ml-1.5 text-muted-foreground tabular-nums">
                    ×{formatGold(entry.quantity)}
                  </span>
                )}
              </p>
              {entry.source && (
                <p className="text-xs text-muted-foreground">{entry.source}</p>
              )}
            </div>
            <div className="min-w-0 text-sm md:flex-1 md:pt-px">
              <Recipient entry={entry} />
            </div>
          </div>
          {entry.comment && (
            <p className="mt-1.5 text-xs text-muted-foreground">«{entry.comment}»</p>
          )}
          {isAdmin && multi && (
            <button
              type="button"
              onClick={onToggle}
              aria-expanded={expanded}
              className="mt-1.5 inline-flex cursor-pointer items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground"
            >
              {entry.records.length}{" "}
              {plural(entry.records.length, "запись", "записи", "записей")}
              <ChevronDown
                className={cn("size-3.5 transition-transform", expanded && "rotate-180")}
              />
            </button>
          )}
          {isAdmin && multi && expanded && <RecordList entry={entry} {...actions} />}
        </div>
        <div className="hidden w-24 shrink-0 pt-px text-right whitespace-nowrap sm:block">
          <Amount entry={entry} />
        </div>
        {isAdmin &&
          (multi ? (
            <span className="size-8 shrink-0" />
          ) : (
            <RecordMenu record={entry.records[0]} kind={entry.kind} {...actions} />
          ))}
      </div>
    </div>
  );
}

function AmountPopover({
  label,
  initial,
  placeholder,
  submitLabel,
  trigger,
  onSubmit,
}: {
  label: string;
  initial?: number;
  placeholder?: string;
  submitLabel: string;
  trigger: ReactNode;
  onSubmit: (value: number) => Promise<void>;
}) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [saving, setSaving] = useState(false);
  const inputId = useId();

  const submit = async () => {
    const number = Number(value);
    if (!value.trim() || Number.isNaN(number)) return;
    setSaving(true);
    try {
      await onSubmit(number);
      setOpen(false);
    } catch (error) {
      console.error(error);
      toast.error("Не удалось сохранить сумму");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Popover
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (next) setValue(initial?.toString() ?? "");
      }}
    >
      <PopoverTrigger asChild>{trigger}</PopoverTrigger>
      <PopoverContent align="end" className="w-60 space-y-2 p-3">
        <Label htmlFor={inputId} className="text-xs">
          {label}
        </Label>
        <div className="flex gap-2">
          <Input
            id={inputId}
            autoFocus
            type="number"
            inputMode="numeric"
            value={value}
            placeholder={placeholder}
            className="h-8"
            onChange={(event) => setValue(event.target.value)}
            onKeyDown={(event) => event.key === "Enter" && submit()}
          />
          <Button size="sm" onClick={submit} disabled={saving}>
            {submitLabel}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

function MiscCard({
  misc,
  itemTypes,
  isAdmin,
  monthLabel,
  onMiscSet,
}: {
  misc: MiscTotal[];
  itemTypes: ItemType[];
  isAdmin: boolean;
  monthLabel: string;
  onMiscSet: (name: string, amount: number) => Promise<void>;
}) {
  const total = misc.reduce((sum, item) => sum + item.amount, 0);
  return (
    <Card className="gap-3 p-4">
      <div className="flex items-baseline justify-between gap-2">
        <h3 className="font-semibold">Разное</h3>
        <span className="text-xs text-muted-foreground">за {monthLabel}</span>
      </div>
      <div className="space-y-2">
        {misc.map((item) => {
          const type = itemTypes.find((itemType) => itemType.name === item.name);
          return (
            <div key={item.name} className="flex items-center gap-2.5">
              <LootIcon
                itemName={item.name}
                iconUrl={type?.icon_url}
                grade={type?.grade}
                size={32}
              />
              <span className="min-w-0 flex-1 text-sm">{item.name}</span>
              {isAdmin ? (
                <div className="flex items-center gap-1">
                  <AmountPopover
                    label={`Сумма «${item.name}»`}
                    initial={item.amount}
                    submitLabel="Сохранить"
                    onSubmit={(value) => onMiscSet(item.name, value)}
                    trigger={
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 px-2 font-semibold tabular-nums"
                      >
                        {formatGold(item.amount)}
                      </Button>
                    }
                  />
                  <AmountPopover
                    label={`Добавить к «${item.name}»`}
                    placeholder="+100"
                    submitLabel="Добавить"
                    onSubmit={(value) => onMiscSet(item.name, item.amount + value)}
                    trigger={
                      <Button
                        variant="outline"
                        size="icon-sm"
                        aria-label={`Добавить к «${item.name}»`}
                      >
                        <Plus />
                      </Button>
                    }
                  />
                </div>
              ) : (
                <span className="font-semibold tabular-nums">
                  {formatGold(item.amount)}
                </span>
              )}
            </div>
          );
        })}
      </div>
      <div className="flex items-baseline justify-between gap-2 border-t pt-3 text-sm">
        <span className="text-muted-foreground">Итого, входит в доход месяца</span>
        <span className="font-bold tabular-nums">{formatGold(total)}</span>
      </div>
    </Card>
  );
}

function BossSalesCard({ rows, monthLabel }: { rows: BossSales[]; monthLabel: string }) {
  const total = rows.reduce((sum, row) => sum + row.total, 0);
  const max = rows[0]?.total ?? 0;
  return (
    <Card className="gap-3 p-4">
      <div>
        <h3 className="font-semibold">Продажи по боссам</h3>
        <p className="text-xs text-muted-foreground">
          {rows.length
            ? `За ${monthLabel}, всего ${formatGold(total)}`
            : `За ${monthLabel} продаж не было`}
        </p>
      </div>
      {rows.length > 0 && (
        <ul className="space-y-2.5">
          {rows.map((row) => (
            <li
              key={row.name}
              className="grid grid-cols-[88px_minmax(0,1fr)_72px] items-center gap-2.5 text-sm"
            >
              <span className="truncate" title={row.name}>
                {row.name}
              </span>
              <span className="block h-3 border-l" aria-hidden>
                <span
                  className="block h-full rounded-r-[4px] bg-primary"
                  style={{ width: `max(2px, ${max ? (row.total / max) * 100 : 0}%)` }}
                />
              </span>
              <span className="text-right tabular-nums">{formatGold(row.total)}</span>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}

export function JournalTab({
  days,
  misc,
  itemTypes,
  bossSales,
  isAdmin,
  loading,
  monthLabel,
  onMiscSet,
  ...actions
}: RecordActions & {
  days: JournalDay[];
  misc: MiscTotal[];
  itemTypes: ItemType[];
  bossSales: BossSales[];
  isAdmin: boolean;
  loading: boolean;
  monthLabel: string;
  onMiscSet: (name: string, amount: number) => Promise<void>;
}) {
  const [filter, setFilter] = useState<"all" | JournalKind>("all");
  const [visibleDays, setVisibleDays] = useState(DAYS_STEP);
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = useMemo(
    () =>
      days
        .map((day) => ({
          ...day,
          entries:
            filter === "all"
              ? day.entries
              : day.entries.filter((entry) => entry.kind === filter),
        }))
        .filter((day) => day.entries.length > 0),
    [days, filter],
  );
  const shown = filtered.slice(0, visibleDays);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-2" role="group" aria-label="Фильтр по типу">
        {FILTERS.map((value) => {
          const active = filter === value;
          return (
            <button
              key={value}
              type="button"
              aria-pressed={active}
              onClick={() => {
                setFilter(value);
                setVisibleDays(DAYS_STEP);
              }}
              className={cn(
                "inline-flex h-8 cursor-pointer items-center gap-2 rounded-full border px-3 text-sm font-medium transition-colors",
                active
                  ? "border-foreground bg-foreground text-background"
                  : "bg-background hover:bg-accent",
              )}
            >
              {value !== "all" && (
                <span className={cn("size-2 rounded-full", KIND_META[value].dot)} />
              )}
              {value === "all" ? "Все" : KIND_META[value].label}
            </button>
          );
        })}
      </div>

      <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
        <Card className="min-w-0 gap-0 overflow-hidden p-0 lg:flex-[2]">
          {loading ? (
            <div className="space-y-3 p-4">
              {Array.from({ length: 6 }, (_, index) => (
                <Skeleton key={index} className="h-12 w-full" />
              ))}
            </div>
          ) : shown.length === 0 ? (
            <p className="px-4 py-12 text-center text-sm text-muted-foreground">
              {filter === "all"
                ? `За ${monthLabel} записей нет`
                : "Таких записей в этом месяце нет"}
            </p>
          ) : (
            <>
              {shown.map((day) => {
                const total = day.entries.reduce(
                  (sum, entry) =>
                    entry.kind === "sale" || entry.kind === "treasury"
                      ? sum + entry.amount
                      : sum,
                  0,
                );
                return (
                  <section key={day.key}>
                    <div className="flex h-9 items-center justify-between border-b bg-muted/40 px-4 text-sm">
                      <h3 className="font-semibold">{day.label}</h3>
                      {total > 0 && (
                        <span className="font-semibold text-green-700 tabular-nums dark:text-green-400">
                          +{formatGold(total)}
                        </span>
                      )}
                    </div>
                    {day.entries.map((entry) => (
                      <EntryRow
                        key={entry.key}
                        entry={entry}
                        isAdmin={isAdmin}
                        expanded={expanded === entry.key}
                        onToggle={() =>
                          setExpanded((current) =>
                            current === entry.key ? null : entry.key,
                          )
                        }
                        {...actions}
                      />
                    ))}
                  </section>
                );
              })}
              {filtered.length > shown.length && (
                <button
                  type="button"
                  onClick={() => setVisibleDays((count) => count + DAYS_STEP)}
                  className="h-12 w-full cursor-pointer border-t text-sm font-medium text-green-700 hover:bg-accent dark:text-green-400"
                >
                  Показать более ранние записи
                </button>
              )}
            </>
          )}
        </Card>

        <div className="flex min-w-0 flex-col gap-4 lg:max-w-sm lg:flex-1">
          <MiscCard
            misc={misc}
            itemTypes={itemTypes}
            isAdmin={isAdmin}
            monthLabel={monthLabel}
            onMiscSet={onMiscSet}
          />
          <BossSalesCard rows={bossSales} monthLabel={monthLabel} />
        </div>
      </div>
    </div>
  );
}
