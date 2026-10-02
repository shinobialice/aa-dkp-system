"use client";

import { useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  Clock,
  Gift,
  MoreHorizontal,
  Pencil,
  Trash2,
  X,
} from "lucide-react";
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Skeleton,
} from "@/shared/ui";
import { cn } from "@/shared/lib/tw-merge";
import { LootIcon } from "../LootBuy/icons/LootIconComponent";
import {
  formatDate,
  formatGold,
  formatShortDate,
  plural,
  type StockGroup,
  type StockLot,
} from "./treasuryModel";

const ADMIN_COLUMNS =
  "grid-cols-[minmax(0,2.6fr)_minmax(0,1fr)_56px_96px_104px_132px_136px]";
const COLUMNS = "grid-cols-[minmax(0,2.6fr)_minmax(0,1fr)_56px_96px_104px_132px]";

type Actions = {
  onSell: (group: StockGroup) => void;
  onGive: (group: StockGroup) => void;
  onEditPrice: (group: StockGroup) => void;
  onDeleteLot: (group: StockGroup, lot: StockLot) => void;
};

function lotsLabel(count: number) {
  return `${count} ${plural(count, "дроп", "дропа", "дропов")}`;
}

function UnitPrice({
  group,
  isAdmin,
  onEditPrice,
}: {
  group: StockGroup;
  isAdmin: boolean;
  onEditPrice: (group: StockGroup) => void;
}) {
  if (group.unitPrice !== null) return <>{formatGold(group.unitPrice)}</>;
  if (group.isBundled) {
    return <span className="text-muted-foreground">в комплекте</span>;
  }
  if (isAdmin) {
    return (
      <button
        type="button"
        onClick={() => onEditPrice(group)}
        className="cursor-pointer font-medium text-green-700 hover:underline dark:text-green-400"
      >
        Задать цену
      </button>
    );
  }
  return <span className="text-muted-foreground">—</span>;
}

function AgeLabel({ group }: { group: StockGroup }) {
  if (group.ageDays === null || !group.oldestAt) {
    return <span className="text-muted-foreground">—</span>;
  }
  return (
    <span
      className="inline-flex items-center gap-1.5 text-sm whitespace-nowrap tabular-nums"
      title={`Самый старый дроп получен ${formatDate(group.oldestAt)}`}
    >
      {group.isStale && (
        <Clock className="size-3.5 text-amber-600 dark:text-amber-400" aria-hidden />
      )}
      <span
        className={cn(group.isStale && "font-semibold text-amber-700 dark:text-amber-400")}
      >
        {group.ageDays} дн.
      </span>
      <span className="text-muted-foreground">с {formatShortDate(group.oldestAt)}</span>
    </span>
  );
}

function RowActions({
  group,
  large,
  onExpand,
  onSell,
  onGive,
  onEditPrice,
  onDeleteLot,
}: Actions & { group: StockGroup; large?: boolean; onExpand: () => void }) {
  const single = group.lots.length === 1;
  return (
    <div className="flex items-center justify-end gap-1.5">
      <Button
        variant="outline"
        size="sm"
        className={cn(large && "h-11 px-4")}
        onClick={() => onSell(group)}
      >
        Продать
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon-sm"
            className={cn("text-muted-foreground", large && "size-11")}
            aria-label={`Ещё действия: ${group.name}`}
          >
            <MoreHorizontal />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuItem className="cursor-pointer" onSelect={() => onGive(group)}>
            <Gift />
            Выдать бесплатно
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer"
            onSelect={() => onEditPrice(group)}
          >
            <Pencil />
            Изменить цену за шт.
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            variant="destructive"
            className="cursor-pointer"
            onSelect={() => (single ? onDeleteLot(group, group.lots[0]) : onExpand())}
          >
            <Trash2 />
            {single ? "Удалить…" : "Удалить дроп…"}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

function LotChips({
  group,
  isAdmin,
  onDeleteLot,
}: {
  group: StockGroup;
  isAdmin: boolean;
  onDeleteLot: (group: StockGroup, lot: StockLot) => void;
}) {
  return (
    <div className="space-y-2">
      <p className="text-xs text-muted-foreground">
        Дропы на складе, сначала старые — при продаже спишутся по порядку
      </p>
      <ul className="flex flex-wrap gap-1.5">
        {group.lots.map((lot) => {
          const date = lot.acquiredAt ? formatDate(lot.acquiredAt) : "дата не указана";
          return (
            <li
              key={lot.id}
              title={`${lot.source ?? "Источник не указан"}, ${date}`}
              className={cn(
                "inline-flex h-7 items-center gap-1 rounded-md border bg-background text-xs tabular-nums",
                isAdmin ? "pr-0.5 pl-2" : "px-2",
              )}
            >
              {lot.acquiredAt ? formatShortDate(lot.acquiredAt) : "—"}
              {lot.quantity > 1 && (
                <span className="text-muted-foreground">×{lot.quantity}</span>
              )}
              {isAdmin && (
                <button
                  type="button"
                  aria-label={`Удалить дроп от ${date}`}
                  onClick={() => onDeleteLot(group, lot)}
                  className="ml-0.5 flex size-6 cursor-pointer items-center justify-center rounded text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                >
                  <X className="size-3.5" />
                </button>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function StockSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 5 }, (_, index) => (
        <Skeleton key={index} className="h-16 w-full rounded-xl" />
      ))}
    </div>
  );
}

export function StockTab({
  groups,
  summary,
  isAdmin,
  loading,
  searching,
  ...actions
}: Actions & {
  groups: StockGroup[];
  summary: { positions: number; quantity: number; value: number };
  isAdmin: boolean;
  loading: boolean;
  searching: boolean;
}) {
  const [expanded, setExpanded] = useState<number | null>(null);
  const toggle = (id: number) => setExpanded((current) => (current === id ? null : id));

  if (loading) return <StockSkeleton />;

  if (groups.length === 0) {
    return (
      <div className="rounded-xl border border-dashed px-4 py-12 text-center text-sm text-muted-foreground">
        {searching ? "Ничего не нашлось" : "На складе пусто — всё продано или выдано"}
      </div>
    );
  }

  const today = new Date().toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
  });
  const columns = isAdmin ? ADMIN_COLUMNS : COLUMNS;
  const summaryText = `Склад на ${today} · ${summary.positions} ${plural(summary.positions, "позиция", "позиции", "позиций")} · ${summary.quantity} шт.`;

  return (
    <>
      <div className="hidden rounded-xl border bg-card xl:block">
        <div
          className={cn(
            "grid items-center gap-4 rounded-t-xl border-b bg-muted/40 px-4 py-2.5 text-xs font-medium text-muted-foreground",
            columns,
          )}
        >
          <div className="pl-[74px]">Предмет</div>
          <div>Босс</div>
          <div className="text-right">Кол-во</div>
          <div className="text-right">Цена за шт.</div>
          <div className="text-right">Стоимость</div>
          <div>Лежит</div>
          {isAdmin && <div />}
        </div>

        {groups.map((group) => {
          const open = expanded === group.itemTypeId;
          const sources = group.sources.join(", ");
          return (
            <div key={group.itemTypeId} className="border-b">
              <div className={cn("grid min-h-15 items-center gap-4 px-4 py-2", columns)}>
                <div className="flex min-w-0 items-center gap-2.5">
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    className="size-7 text-muted-foreground"
                    aria-expanded={open}
                    aria-label={open ? "Скрыть дропы" : "Показать дропы"}
                    onClick={() => toggle(group.itemTypeId)}
                  >
                    <ChevronRight className={cn("transition-transform", open && "rotate-90")} />
                  </Button>
                  <LootIcon
                    itemName={group.name}
                    iconUrl={group.iconUrl}
                    grade={group.grade}
                    size={36}
                  />
                  <div className="min-w-0">
                    <p className="leading-snug font-medium">{group.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {lotsLabel(group.lots.length)}
                    </p>
                  </div>
                </div>
                <div className="truncate text-sm text-muted-foreground" title={sources}>
                  {sources || "—"}
                </div>
                <div className="text-right tabular-nums">{group.quantity}</div>
                <div className="text-right text-sm tabular-nums">
                  <UnitPrice
                    group={group}
                    isAdmin={isAdmin}
                    onEditPrice={actions.onEditPrice}
                  />
                </div>
                <div className="text-right font-semibold tabular-nums">
                  {group.value === null ? "—" : formatGold(group.value)}
                </div>
                <AgeLabel group={group} />
                {isAdmin && (
                  <RowActions
                    group={group}
                    onExpand={() => setExpanded(group.itemTypeId)}
                    {...actions}
                  />
                )}
              </div>
              {open && (
                <div className="px-4 pb-4 pl-[90px]">
                  <LotChips
                    group={group}
                    isAdmin={isAdmin}
                    onDeleteLot={actions.onDeleteLot}
                  />
                </div>
              )}
            </div>
          );
        })}

        <div className="flex flex-wrap items-center justify-between gap-2 rounded-b-xl bg-muted/40 px-4 py-3 text-sm">
          <span className="text-muted-foreground">{summaryText}</span>
          <span className="flex items-baseline gap-2">
            <span className="text-muted-foreground">Стоимость</span>
            <span className="text-base font-bold tabular-nums">
              {formatGold(summary.value)}
            </span>
          </span>
        </div>
      </div>

      <div className="space-y-3 xl:hidden">
        <div className="grid gap-3 md:grid-cols-2">
          {groups.map((group) => {
            const open = expanded === group.itemTypeId;
            const meta = [
              group.sources.join(", "),
              `${group.quantity} шт.${group.unitPrice !== null ? ` × ${formatGold(group.unitPrice)}` : ""}`,
            ]
              .filter(Boolean)
              .join(" · ");
            return (
              <article
                key={group.itemTypeId}
                className="flex flex-col gap-3 rounded-xl border bg-card p-3"
              >
                <div className="flex items-start gap-3">
                  <LootIcon
                    itemName={group.name}
                    iconUrl={group.iconUrl}
                    grade={group.grade}
                    size={44}
                  />
                  <div className="min-w-0 flex-1 space-y-0.5">
                    <p className="leading-snug font-semibold">{group.name}</p>
                    <p className="text-sm text-muted-foreground">{meta}</p>
                    <AgeLabel group={group} />
                  </div>
                  <p className="font-bold whitespace-nowrap tabular-nums">
                    {group.value === null ? (
                      <UnitPrice
                        group={group}
                        isAdmin={isAdmin}
                        onEditPrice={actions.onEditPrice}
                      />
                    ) : (
                      formatGold(group.value)
                    )}
                  </p>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className={cn("-ml-2 text-muted-foreground", isAdmin && "h-11")}
                    aria-expanded={open}
                    onClick={() => toggle(group.itemTypeId)}
                  >
                    {lotsLabel(group.lots.length)}
                    <ChevronDown className={cn("transition-transform", open && "rotate-180")} />
                  </Button>
                  {isAdmin && (
                    <RowActions
                      group={group}
                      large
                      onExpand={() => setExpanded(group.itemTypeId)}
                      {...actions}
                    />
                  )}
                </div>
                {open && (
                  <LotChips
                    group={group}
                    isAdmin={isAdmin}
                    onDeleteLot={actions.onDeleteLot}
                  />
                )}
              </article>
            );
          })}
        </div>
        <div className="flex flex-wrap items-baseline justify-between gap-2 px-1 text-sm">
          <span className="text-muted-foreground">{summaryText}</span>
          <span className="font-bold tabular-nums">{formatGold(summary.value)}</span>
        </div>
      </div>
    </>
  );
}
