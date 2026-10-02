"use client";

import type { DragEvent, KeyboardEvent } from "react";
import {
  Check,
  Clock,
  Dices,
  GripVertical,
  MoreHorizontal,
  Pause,
  Trash2,
} from "lucide-react";
import { cn } from "@/shared/lib/tw-merge";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/ui";
import { classColors, classIcons } from "@/widgets/MembersTable/classStyles";
import {
  avatarSrc,
  formatAmount,
  formatQueueDate,
  STATUS_BADGES,
  type QueueEntry,
  type QueueKind,
  type QueueStatusToggle,
} from "./lootBuyModel";

export type QueueEntryHandlers = {
  onSold: (entry: QueueEntry) => void;
  onRemove: (entry: QueueEntry) => void;
  onToggleStatus: (entry: QueueEntry, status: QueueStatusToggle) => void;
  onUpdate: (
    entry: QueueEntry,
    patch: {
      roll?: number | null;
      required?: number;
      delivered?: number;
      synth_target?: string;
    },
  ) => void;
};

function CommitInput({
  label,
  value,
  type = "number",
  placeholder,
  className,
  onCommit,
}: {
  label: string;
  value: string;
  type?: "number" | "text";
  placeholder?: string;
  className?: string;
  onCommit: (value: string) => void;
}) {
  const commit = (next: string) => {
    if (next !== value) onCommit(next);
  };
  return (
    <input
      key={value}
      type={type}
      aria-label={label}
      defaultValue={value}
      placeholder={placeholder}
      onBlur={(event) => commit(event.currentTarget.value)}
      onKeyDown={(event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") event.currentTarget.blur();
      }}
      className={cn(
        "h-8 min-w-0 rounded-md border bg-background px-2 text-sm tabular-nums outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40",
        className,
      )}
    />
  );
}

function IconAction({
  label,
  onClick,
  disabled,
  className,
  children,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "flex size-8 cursor-pointer items-center justify-center rounded-md transition-colors disabled:cursor-not-allowed disabled:opacity-40 [&_svg]:size-4",
        className,
      )}
    >
      {children}
    </button>
  );
}

export default function QueueEntryRow({
  entry,
  place,
  kind,
  isMe,
  editing,
  draggable,
  dragging,
  handlers,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnd,
}: {
  entry: QueueEntry;
  place: number;
  kind: QueueKind;
  isMe: boolean;
  editing: boolean;
  draggable: boolean;
  dragging: boolean;
  handlers: QueueEntryHandlers;
  onDragStart: () => void;
  onDragOver: (event: DragEvent<HTMLLIElement>) => void;
  onDrop: (event: DragEvent<HTMLLIElement>) => void;
  onDragEnd: () => void;
}) {
  const badge = STATUS_BADGES[entry.status];
  const remaining = Math.max(0, entry.required - entry.delivered);
  const progress =
    entry.required > 0
      ? Math.min(100, Math.round((entry.delivered / entry.required) * 100))
      : 0;
  const soldBlocked = kind === "amount" && entry.delivered < entry.required;

  return (
    <li
      draggable={draggable}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDrop={onDrop}
      onDragEnd={onDragEnd}
      className={cn(
        "flex flex-col gap-1.5 rounded-lg px-2 py-1.5",
        isMe && "bg-green-50 dark:bg-green-500/10",
        dragging && "opacity-40",
      )}
    >
      <div className="flex items-center gap-2.5">
        {draggable && (
          <GripVertical className="size-4 shrink-0 cursor-grab text-muted-foreground active:cursor-grabbing" />
        )}
        <span
          className={cn(
            "w-5 shrink-0 text-right text-[12.5px] font-semibold tabular-nums",
            place > 3 && "text-muted-foreground",
          )}
        >
          {place}
        </span>
        <Avatar className="size-7 shrink-0">
          <AvatarImage src={avatarSrc(entry)} alt="" />
          <AvatarFallback className="text-[10px] font-semibold">
            {entry.username.slice(0, 2)}
          </AvatarFallback>
        </Avatar>
        <span className="flex min-w-0 flex-1 flex-col leading-tight">
          <span className="flex min-w-0 items-center gap-1.5">
            <span className="truncate font-medium">{entry.username}</span>
            {isMe && (
              <span className="shrink-0 rounded-full bg-green-600 px-1.5 text-[11px] font-semibold text-white">
                вы
              </span>
            )}
            {badge && (
              <span
                className={cn(
                  "shrink-0 rounded-full px-1.5 text-[11px] font-semibold",
                  badge.className,
                )}
              >
                {badge.label}
              </span>
            )}
          </span>
          <span className="flex items-center gap-1 text-[11.5px] text-muted-foreground">
            {entry.userClass && (
              <span
                className="inline-flex [&_svg]:size-3"
                style={{ color: classColors[entry.userClass] }}
              >
                {classIcons[entry.userClass]}
              </span>
            )}
            {entry.userClass}
          </span>
        </span>

        {kind === "roll" &&
          (editing ? (
            <CommitInput
              label={`Ролл ${entry.username}`}
              value={entry.roll === null ? "" : String(entry.roll)}
              className="w-12 text-center font-bold"
              onCommit={(value) =>
                handlers.onUpdate(entry, {
                  roll: value === "" ? null : Number(value),
                })
              }
            />
          ) : (
            <span className="inline-flex items-center gap-1 rounded-md bg-muted px-1.5 py-px text-[12.5px] font-bold tabular-nums">
              <Dices className="size-3" />
              {entry.roll ?? "—"}
            </span>
          ))}

        {!editing && (
          <span className="shrink-0 text-xs text-muted-foreground tabular-nums">
            {formatQueueDate(entry.createdAt)}
          </span>
        )}

        {editing && (
          <span className="flex shrink-0 items-center gap-0.5">
            <IconAction
              label={soldBlocked ? "Продано — когда отдано всё" : "Продано"}
              onClick={() => handlers.onSold(entry)}
              disabled={soldBlocked}
              className="bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-500/15 dark:text-green-300"
            >
              <Check />
            </IconAction>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  aria-label={`Действия: ${entry.username}`}
                  className="flex size-8 cursor-pointer items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  <MoreHorizontal className="size-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  className="cursor-pointer"
                  onSelect={() => handlers.onToggleStatus(entry, "позже")}
                >
                  <Clock />
                  {entry.status === "позже" ? "Убрать «Позже»" : "Позже"}
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer"
                  onSelect={() => handlers.onToggleStatus(entry, "пропуск")}
                >
                  <Pause />
                  {entry.status === "пропуск" ? "Убрать «Пропуск»" : "Пропуск"}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  variant="destructive"
                  className="cursor-pointer"
                  onSelect={() => handlers.onRemove(entry)}
                >
                  <Trash2 />
                  Удалить из очереди
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </span>
        )}
      </div>

      {kind === "amount" &&
        (editing ? (
          <div className="grid grid-cols-2 gap-1.5 pl-[68px] text-[11.5px] text-muted-foreground">
            <label className="flex flex-col gap-0.5">
              Запрошено
              <CommitInput
                label="Запрошено"
                value={String(entry.required)}
                className="text-foreground"
                onCommit={(value) => {
                  const required = parseInt(value, 10);
                  if (!Number.isNaN(required)) {
                    handlers.onUpdate(entry, { required });
                  }
                }}
              />
            </label>
            <label className="flex flex-col gap-0.5">
              Отдано
              <CommitInput
                label="Отдано"
                value={String(entry.delivered)}
                className="text-foreground"
                onCommit={(value) => {
                  const delivered = parseInt(value, 10);
                  if (!Number.isNaN(delivered)) {
                    handlers.onUpdate(entry, { delivered });
                  }
                }}
              />
            </label>
            <label className="col-span-2 flex flex-col gap-0.5">
              На что синтез
              <CommitInput
                label="На что синтез"
                type="text"
                value={entry.synthTarget}
                placeholder="например, сет Анталлона"
                className="text-foreground"
                onCommit={(value) =>
                  handlers.onUpdate(entry, { synth_target: value })
                }
              />
            </label>
          </div>
        ) : (
          <div className="flex flex-col gap-1 pl-[68px]">
            <span className="flex justify-between gap-2 text-xs tabular-nums">
              <span>
                отдано {formatAmount(entry.delivered)} из{" "}
                {formatAmount(entry.required)}
              </span>
              <span className="text-muted-foreground">
                осталось {formatAmount(remaining)}
              </span>
            </span>
            <span className="block h-1.5 overflow-hidden rounded-full bg-muted">
              <span
                className="block h-full rounded-full bg-green-600"
                style={{ width: `${progress}%` }}
              />
            </span>
            {entry.synthTarget && (
              <span className="text-xs text-muted-foreground">
                на {entry.synthTarget}
              </span>
            )}
          </div>
        ))}
    </li>
  );
}
