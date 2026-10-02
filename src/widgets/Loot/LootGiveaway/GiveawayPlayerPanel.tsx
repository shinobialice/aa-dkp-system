"use client";

import { useState } from "react";
import { Heart, X } from "lucide-react";
import { cn } from "@/shared/lib/tw-merge";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  Input,
} from "@/shared/ui";
import type { MiscLootGrant } from "@/actions/miscLootGrants";
import type { WishlistItem } from "@/actions/lootWishlist";
import { LootIcon } from "../LootBuy/icons/LootIconComponent";
import { GiveawayStatusIcon, STATUS_STYLES } from "./GiveawayStatusIcon";
import {
  avatarSrc,
  formatDate,
  formatWishlistItem,
  STATUS_OPTIONS,
  todayIso,
  type GiveawayStatus,
  type Player,
  type TrackedItem,
} from "./giveawayModel";

export type PlayerPanelActions = {
  onStatusChange: (itemName: string, status: GiveawayStatus) => void;
  onDateChange: (itemName: string, date: string) => void;
  onAddMiscGrant: (grant: {
    comment: string;
    amount: number | null;
    date: string;
  }) => Promise<void>;
  onRemoveMiscGrant: (id: number) => void;
  onAddWishlistItem: (item: {
    itemName: string;
    comment: string;
  }) => Promise<void>;
  onRemoveWishlistItem: (id: number) => void;
};

const SEGMENT_ACTIVE: Record<GiveawayStatus, string> = {
  "": "bg-muted",
  Хочет: STATUS_STYLES["Хочет"].badge,
  "В наличии": STATUS_STYLES["В наличии"].badge,
  Выдано: STATUS_STYLES["Выдано"].badge,
};

function StatusSegments({
  value,
  onChange,
}: {
  value: GiveawayStatus;
  onChange: (status: GiveawayStatus) => void;
}) {
  const options: [GiveawayStatus, string][] = [
    ["", "–"],
    ...STATUS_OPTIONS.map((s): [GiveawayStatus, string] => [s, s]),
  ];
  return (
    <span className="inline-flex overflow-hidden rounded-lg border">
      {options.map(([status, label]) => (
        <button
          key={label}
          type="button"
          aria-pressed={value === status}
          onClick={() => value !== status && onChange(status)}
          className={cn(
            "cursor-pointer border-l px-2 py-1 text-[11.5px] first:border-l-0 hover:bg-muted",
            value === status && cn("font-semibold", SEGMENT_ACTIVE[status]),
          )}
        >
          {label}
        </button>
      ))}
    </span>
  );
}

function StatusBadge({
  status,
  date,
}: {
  status: GiveawayStatus;
  date: string;
}) {
  if (!status) {
    return <span className="text-xs text-muted-foreground">не выдано</span>;
  }
  const shown = status === "Выдано" ? formatDate(date) : "";
  return (
    <span
      className={cn(
        "rounded-full px-2 py-0.5 text-[11.5px] font-semibold whitespace-nowrap",
        STATUS_STYLES[status].badge,
      )}
    >
      {status}
      {shown && ` · ${shown}`}
    </span>
  );
}

function AddMiscGrantForm({
  onAdd,
}: {
  onAdd: PlayerPanelActions["onAddMiscGrant"];
}) {
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const [comment, setComment] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(todayIso);

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="cursor-pointer rounded-lg border border-dashed p-1.5 text-[12.5px] text-muted-foreground hover:bg-muted"
      >
        + Добавить выдачу
      </button>
    );
  }

  const submit = async () => {
    if (!comment.trim()) return;
    setPending(true);
    try {
      await onAdd({
        comment: comment.trim(),
        amount: amount ? Number(amount) : null,
        date,
      });
      setComment("");
      setAmount("");
      setOpen(false);
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="flex flex-col gap-1.5 rounded-lg border p-2">
      <Input
        placeholder="Что выдали"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        className="h-8 text-xs"
        autoFocus
      />
      <div className="flex items-center gap-1.5">
        <Input
          type="number"
          placeholder="Сумма"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="h-8 w-24 text-xs"
        />
        <input
          type="date"
          aria-label="Дата"
          className="h-8 flex-1 rounded-md border bg-background px-2 text-xs"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>
      <div className="flex items-center gap-1">
        <Button
          type="button"
          size="sm"
          className="h-7 cursor-pointer px-2 text-xs"
          disabled={!comment.trim() || pending}
          onClick={submit}
        >
          Добавить
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-7 cursor-pointer px-2 text-xs"
          onClick={() => setOpen(false)}
        >
          Отмена
        </Button>
      </div>
    </div>
  );
}

function AddWishlistForm({
  onAdd,
}: {
  onAdd: PlayerPanelActions["onAddWishlistItem"];
}) {
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const [itemName, setItemName] = useState("");
  const [comment, setComment] = useState("");

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="cursor-pointer rounded-lg border border-dashed p-1.5 text-[12.5px] text-muted-foreground hover:bg-muted"
      >
        + Добавить в хотелки
      </button>
    );
  }

  const submit = async () => {
    if (!itemName.trim()) return;
    setPending(true);
    try {
      await onAdd({ itemName: itemName.trim(), comment: comment.trim() });
      setItemName("");
      setComment("");
      setOpen(false);
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="flex flex-col gap-1.5 rounded-lg border p-2">
      <Input
        placeholder="Название предмета"
        value={itemName}
        onChange={(e) => setItemName(e.target.value)}
        className="h-8 text-xs"
        autoFocus
      />
      <Input
        placeholder="Комментарий (необязательно)"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        className="h-8 text-xs"
      />
      <div className="flex items-center gap-1">
        <Button
          type="button"
          size="sm"
          className="h-7 cursor-pointer px-2 text-xs"
          disabled={!itemName.trim() || pending}
          onClick={submit}
        >
          Добавить
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-7 cursor-pointer px-2 text-xs"
          onClick={() => setOpen(false)}
        >
          Отмена
        </Button>
      </div>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col gap-2">
      <h3 className="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
        {title}
      </h3>
      <div className="flex flex-col gap-1.5">{children}</div>
    </section>
  );
}

function RemoveButton({ onClick }: { onClick: () => void }) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon-sm"
      aria-label="Удалить"
      className="ml-auto size-7 shrink-0 cursor-pointer text-muted-foreground"
      onClick={onClick}
    >
      <X />
    </Button>
  );
}

export default function GiveawayPlayerPanel({
  player,
  items,
  isAdmin,
  editMode,
  onToggleEdit,
  inSheet = false,
  actions,
}: {
  player: Player;
  items: TrackedItem[];
  isAdmin: boolean;
  editMode: boolean;
  onToggleEdit: () => void;
  /** В шторке справа сверху крестик закрытия — отодвигаем от него кнопку. */
  inSheet?: boolean;
  actions: PlayerPanelActions;
}) {
  const givenCount = player.items.filter((i) => i.status === "Выдано").length;

  const itemRow = (item: TrackedItem, index: number) => {
    const entry = player.items[index];
    return (
      <div
        key={item.name}
        className="flex flex-wrap items-center gap-x-2.5 gap-y-1.5 rounded-lg border p-2"
      >
        {entry.status ? (
          <GiveawayStatusIcon
            item={item}
            status={entry.status}
            date={entry.date}
            size={28}
            tooltip={false}
          />
        ) : (
          <LootIcon
            itemName={item.name}
            iconUrl={item.iconUrl}
            grade={item.grade}
            size={28}
          />
        )}
        <span className="min-w-28 flex-1 text-[13px] leading-tight">
          {item.name}
        </span>
        {editMode ? (
          <span className="flex flex-wrap items-center gap-1.5">
            <StatusSegments
              value={entry.status}
              onChange={(status) => actions.onStatusChange(item.name, status)}
            />
            {entry.status === "Выдано" && (
              <input
                type="date"
                aria-label={`Дата выдачи: ${item.name}`}
                className="h-7 rounded-md border bg-background px-1.5 text-xs"
                value={entry.date}
                onChange={(e) =>
                  e.target.value &&
                  actions.onDateChange(item.name, e.target.value)
                }
              />
            )}
          </span>
        ) : (
          <StatusBadge status={entry.status} date={entry.date} />
        )}
      </div>
    );
  };

  const indexed = items.map((item, index) => ({ item, index }));
  const lootRows = indexed.filter(({ item }) => item.kind === "loot");
  const gliderRows = indexed.filter(({ item }) => item.kind === "glider");

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div
        className={cn(
          "flex items-center gap-3 border-b px-4 py-3.5",
          inSheet && "pr-12",
        )}
      >
        <Avatar className="size-10 shrink-0">
          <AvatarImage src={avatarSrc(player)} alt="" />
          <AvatarFallback>{player.username.slice(0, 2)}</AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <h2 className="truncate text-base font-semibold">
            {player.username}
          </h2>
          <p className="text-xs text-muted-foreground">
            {player.active ? "Активен" : "Неактивен"} · гильдия выдала{" "}
            {givenCount} из {items.length}
          </p>
        </div>
        {isAdmin && (
          <Button
            variant={editMode ? "default" : "outline"}
            size="sm"
            className="cursor-pointer"
            onClick={onToggleEdit}
          >
            {editMode ? "Готово" : "Редактировать"}
          </Button>
        )}
      </div>

      <div className="flex flex-col gap-5 overflow-y-auto px-4 pt-3.5 pb-5">
        <Section title="Лут">
          {lootRows.map(({ item, index }) => itemRow(item, index))}
        </Section>
        <Section title="Глайдеры">
          {gliderRows.map(({ item, index }) => itemRow(item, index))}
        </Section>

        <Section title="Прочее">
          {player.miscGrants.length === 0 && !editMode && (
            <span className="text-[13px] text-muted-foreground">Ничего</span>
          )}
          {player.miscGrants.map((grant: MiscLootGrant) => (
            <div
              key={grant.id}
              className="flex min-h-10 items-center gap-2 rounded-lg border px-2.5 py-1.5 text-[13px]"
            >
              {grant.amount != null && (
                <span className="font-mono text-xs text-muted-foreground">
                  {grant.amount}
                </span>
              )}
              <span className="min-w-0 flex-1">{grant.comment}</span>
              <span className="font-mono text-xs text-muted-foreground">
                {formatDate(grant.date)}
              </span>
              {editMode && (
                <RemoveButton
                  onClick={() => actions.onRemoveMiscGrant(grant.id)}
                />
              )}
            </div>
          ))}
          {editMode && <AddMiscGrantForm onAdd={actions.onAddMiscGrant} />}
        </Section>

        <Section title="Хочет">
          {player.wishlist.length === 0 && !editMode && (
            <span className="text-[13px] text-muted-foreground">Ничего</span>
          )}
          {player.wishlist.map((wish: WishlistItem) => (
            <div
              key={wish.id}
              className="flex min-h-10 items-center gap-2 rounded-lg border px-2.5 py-1.5 text-[13px]"
            >
              <Heart className="size-3.5 shrink-0 fill-current text-pink-500" />
              <span className="min-w-0 flex-1">{formatWishlistItem(wish)}</span>
              {editMode && (
                <RemoveButton
                  onClick={() => actions.onRemoveWishlistItem(wish.id)}
                />
              )}
            </div>
          ))}
          {editMode && <AddWishlistForm onAdd={actions.onAddWishlistItem} />}
        </Section>
      </div>
    </div>
  );
}
