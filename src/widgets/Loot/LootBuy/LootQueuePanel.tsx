"use client";

import { useState, type ReactNode } from "react";
import Image from "next/image";
import { Check, Dices, Loader2, Pencil, Plus, X } from "lucide-react";
import { cn } from "@/shared/lib/tw-merge";
import { Button, Input } from "@/shared/ui";
import { addToLootQueue } from "@/actions/addToLootQueue";
import { getLootQueueByItemName } from "@/actions/getLootQueueByItemName";
import { markQueueLootAsSold } from "@/actions/markQueueLootAsSold";
import { removeFromLootQueue } from "@/actions/removeFromLootQueue";
import { reorderLootQueue } from "@/actions/reorderLootQueue";
import { updateItemTypePrice } from "@/actions/updateItemTypePrice";
import { updateLootQueueEntry } from "@/actions/updateLootQueueEntry";
import { LootIcon } from "./icons/LootIconComponent";
import { GOLD_ICON } from "./LootItemList";
import QueueEntryRow, { type QueueEntryHandlers } from "./QueueEntryRow";
import {
  formatQueueDate,
  playersCount,
  priceLabel,
  queueKind,
  type BuyItem,
  type QueueEntry,
} from "./lootBuyModel";

export type QueuePlayer = { id: number; username: string };

function Stat({
  label,
  action,
  children,
  className,
}: {
  label: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex min-w-0 flex-col gap-0.5 px-2.5 py-2", className)}>
      <span className="flex items-center justify-between gap-1 text-xs text-muted-foreground">
        {label}
        {action}
      </span>
      {children}
    </div>
  );
}

function PriceEditor({
  item,
  onSave,
  onCancel,
}: {
  item: BuyItem;
  onSave: (price: number | null) => Promise<void>;
  onCancel: () => void;
}) {
  const [value, setValue] = useState(
    item.price === null ? "" : String(item.price),
  );
  const [saving, setSaving] = useState(false);
  const save = async () => {
    const parsed = value.trim() === "" ? null : Number(value.replace(",", "."));
    if (parsed !== null && Number.isNaN(parsed)) return;
    setSaving(true);
    try {
      await onSave(parsed);
    } finally {
      setSaving(false);
    }
  };
  return (
    <span className="flex gap-1">
      <input
        type="number"
        step="any"
        min={0}
        autoFocus
        aria-label="Цена"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter") save();
          if (event.key === "Escape") onCancel();
        }}
        className="h-7 w-full min-w-0 rounded-md border bg-background px-1.5 text-sm font-semibold tabular-nums outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
      />
      <button
        type="button"
        aria-label="Сохранить цену"
        onClick={save}
        disabled={saving}
        className="flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-md bg-green-600 text-white hover:bg-green-700 disabled:opacity-60"
      >
        {saving ? (
          <Loader2 className="size-3.5 animate-spin" />
        ) : (
          <Check className="size-3.5" />
        )}
      </button>
    </span>
  );
}

function AddToQueue({
  players,
  queue,
  onAdd,
}: {
  players: QueuePlayer[];
  queue: QueueEntry[];
  onAdd: (username: string) => Promise<void>;
}) {
  const [search, setSearch] = useState("");
  const [adding, setAdding] = useState<string | null>(null);
  const term = search.trim().toLowerCase();
  const inQueue = new Set(queue.map((entry) => entry.userId));
  const matches = term
    ? players
        .filter((player) => player.username.toLowerCase().includes(term))
        .slice(0, 6)
    : [];

  const add = async (username: string) => {
    setAdding(username);
    try {
      await onAdd(username);
      setSearch("");
    } finally {
      setAdding(null);
    }
  };

  return (
    <div className="flex flex-col gap-1.5 border-t px-4 pt-3 pb-4">
      <Input
        type="search"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        placeholder="Добавить игрока…"
        aria-label="Игрок для очереди"
      />
      {term && matches.length === 0 && (
        <span className="px-1 text-xs text-muted-foreground">
          Никого не нашлось
        </span>
      )}
      {matches.length > 0 && (
        <ul className="flex flex-col overflow-hidden rounded-md border">
          {matches.map((player) => (
            <li key={player.id}>
              <button
                type="button"
                onClick={() => add(player.username)}
                disabled={adding !== null}
                className="flex w-full cursor-pointer items-center justify-between gap-2 px-2.5 py-1.5 text-left text-sm hover:bg-muted disabled:opacity-60"
              >
                <span className="truncate">{player.username}</span>
                <span className="flex shrink-0 items-center gap-1 text-xs text-muted-foreground">
                  {inQueue.has(player.id) && "уже в очереди"}
                  {adding === player.username ? (
                    <Loader2 className="size-3.5 animate-spin" />
                  ) : (
                    <Plus className="size-3.5" />
                  )}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function LootQueuePanel({
  item,
  queue,
  currentUserId,
  isAdmin,
  players,
  scrollQueue,
  onQueueChange,
  onPriceChange,
}: {
  item: BuyItem;
  queue: QueueEntry[];
  currentUserId: number | null;
  isAdmin: boolean;
  players: QueuePlayer[];
  scrollQueue: boolean;
  onQueueChange: (itemName: string, queue: QueueEntry[]) => void;
  onPriceChange: (itemName: string, price: number | null) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [editingPrice, setEditingPrice] = useState(false);
  const [busy, setBusy] = useState(false);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const kind = queueKind(item.name);
  const myIndex = queue.findIndex((entry) => entry.userId === currentUserId);
  const me = myIndex >= 0 ? queue[myIndex] : null;
  const canDrag = editing && kind !== "roll";

  const run = async (action: () => Promise<unknown>) => {
    setBusy(true);
    try {
      await action();
      onQueueChange(item.name, await getLootQueueByItemName(item.name));
    } finally {
      setBusy(false);
    }
  };

  const handlers: QueueEntryHandlers = {
    onSold: (entry) => run(() => markQueueLootAsSold(entry.id)),
    onRemove: (entry) => run(() => removeFromLootQueue(entry.id)),
    onToggleStatus: (entry, status) =>
      run(() =>
        updateLootQueueEntry({
          id: entry.id,
          status: entry.status === status ? "ожидание" : status,
        }),
      ),
    onUpdate: (entry, patch) =>
      run(() => updateLootQueueEntry({ id: entry.id, ...patch })),
  };

  const reorder = (from: number, to: number) => {
    const next = [...queue];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    onQueueChange(
      item.name,
      next.map((entry, index) => ({ ...entry, position: index })),
    );
    reorderLootQueue(next.map((entry) => entry.id));
  };

  const rollAll = () =>
    run(async () => {
      const pool = Array.from({ length: 101 }, (_, index) => index);
      for (let i = pool.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [pool[i], pool[j]] = [pool[j], pool[i]];
      }
      await Promise.all(
        queue.map((entry, index) =>
          updateLootQueueEntry({ id: entry.id, roll: pool[index] }),
        ),
      );
    });

  const savePrice = async (price: number | null) => {
    await updateItemTypePrice(item.name, price);
    onPriceChange(item.name, price);
    setEditingPrice(false);
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col text-sm">
      <div className="flex gap-3 px-4 pt-4 pb-3">
        <LootIcon
          itemName={item.name}
          iconUrl={item.icon}
          grade={item.grade}
          size={52}
        />
        <div className="flex min-w-0 flex-col gap-0.5 pr-8">
          <h2 className="text-[17px] leading-tight font-bold">{item.name}</h2>
          <span className="text-[12.5px] text-muted-foreground">
            {item.source}
          </span>
        </div>
      </div>

      <div className="mx-4 grid grid-cols-3 divide-x rounded-lg border">
        <Stat
          label="Цена"
          action={
            isAdmin && (
              <button
                type="button"
                aria-label={editingPrice ? "Отменить" : "Изменить цену"}
                onClick={() => setEditingPrice((value) => !value)}
                className="flex cursor-pointer rounded p-0.5 text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                {editingPrice ? (
                  <X className="size-3.5" />
                ) : (
                  <Pencil className="size-3.5" />
                )}
              </button>
            )
          }
        >
          {editingPrice ? (
            <PriceEditor
              item={item}
              onSave={savePrice}
              onCancel={() => setEditingPrice(false)}
            />
          ) : item.price === null ? (
            <span className="text-sm font-medium text-muted-foreground">
              {priceLabel(item)}
            </span>
          ) : (
            <span className="flex items-center gap-1 text-[15px] font-bold tabular-nums">
              <Image src={GOLD_ICON} alt="" width={14} height={14} />
              {priceLabel(item)}
            </span>
          )}
        </Stat>
        <Stat label="На складе">
          <span
            className={cn(
              "text-[15px] font-bold",
              item.stock > 0
                ? "text-green-700 dark:text-green-400"
                : "text-muted-foreground",
            )}
          >
            {item.stock > 0 ? `${item.stock} шт.` : "нет"}
          </span>
        </Stat>
        <Stat label="В очереди">
          <span className="text-[15px] font-bold">
            {queue.length ? playersCount(queue.length) : "пусто"}
          </span>
        </Stat>
      </div>

      {me && (
        <div className="mx-4 mt-2.5 flex flex-col rounded-lg bg-green-50 px-3 py-2 text-green-800 dark:bg-green-500/10 dark:text-green-300">
          <span className="text-[13.5px] font-semibold">
            Вы {myIndex + 1}-е в очереди · встали{" "}
            {formatQueueDate(me.createdAt)}
          </span>
          <span className="text-[12.5px]">
            {myIndex === 0
              ? "перед вами никого"
              : `перед вами ${playersCount(myIndex)}`}
          </span>
        </div>
      )}
      {kind === "roll" && (
        <p className="mx-4 mt-2.5 text-[12.5px] text-muted-foreground">
          Очередь по роллу: первым идёт тот, у кого ролл выше.
        </p>
      )}
      {kind === "amount" && (
        <p className="mx-4 mt-2.5 text-[12.5px] text-muted-foreground">
          Покупка на количество: сколько запрошено и сколько уже отдано.
        </p>
      )}

      <div className="flex items-center justify-between gap-2 px-4 pt-3.5 pb-2">
        <h3 className="flex items-center gap-2 text-sm font-bold">
          Очередь
          {busy && (
            <Loader2 className="size-3.5 animate-spin text-muted-foreground" />
          )}
        </h3>
        {isAdmin && (
          <div className="flex gap-1.5">
            {editing && kind === "roll" && queue.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={rollAll}
                disabled={busy}
                className="cursor-pointer"
              >
                <Dices /> Ролл
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setEditing((value) => !value)}
              className="cursor-pointer"
            >
              {editing ? <Check /> : <Pencil />}
              {editing ? "Готово" : "Редактировать"}
            </Button>
          </div>
        )}
      </div>

      {queue.length === 0 ? (
        <p className="mx-4 mb-4 rounded-lg border border-dashed px-3 py-5 text-center text-[13px] text-muted-foreground">
          Очередь пустая
        </p>
      ) : (
        <ol
          className={cn(
            "flex flex-col px-2 pb-2",
            scrollQueue &&
              "min-h-0 flex-1 overflow-y-auto [scrollbar-width:thin]",
          )}
        >
          {queue.map((entry, index) => (
            <QueueEntryRow
              key={entry.id}
              entry={entry}
              place={index + 1}
              kind={kind}
              isMe={entry.userId === currentUserId}
              editing={editing}
              draggable={canDrag}
              dragging={dragIndex === index}
              handlers={handlers}
              onDragStart={() => setDragIndex(index)}
              onDragOver={(event) => {
                if (canDrag) event.preventDefault();
              }}
              onDrop={(event) => {
                if (!canDrag || dragIndex === null) return;
                event.preventDefault();
                if (dragIndex !== index) reorder(dragIndex, index);
                setDragIndex(null);
              }}
              onDragEnd={() => setDragIndex(null)}
            />
          ))}
        </ol>
      )}

      {editing && (
        <AddToQueue
          players={players}
          queue={queue}
          onAdd={(username) => run(() => addToLootQueue(username, item.name))}
        />
      )}
    </div>
  );
}
