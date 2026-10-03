"use client";

import type { DragEvent } from "react";
import { Dices, GripVertical } from "lucide-react";
import { cn } from "@/shared/lib/tw-merge";
import {
  formatQueueDate,
  type QueueEntry,
  type QueueKind,
} from "../lootBuyModel";
import AmountDetails from "./AmountDetails";
import CommitInput from "./CommitInput";
import EntryActions from "./EntryActions";
import EntryIdentity from "./EntryIdentity";
import type { QueueEntryHandlers } from "./types";

export type { QueueEntryHandlers };

const TOP_PLACES = 3;

type Props = {
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
};

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
}: Props) {
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
            "w-5 shrink-0 text-right text-xs font-semibold tabular-nums",
            place > TOP_PLACES && "text-muted-foreground",
          )}
        >
          {place}
        </span>
        <EntryIdentity entry={entry} isMe={isMe} />
        {kind === "roll" && (
          <RollCell entry={entry} editing={editing} handlers={handlers} />
        )}
        {!editing && (
          <span className="shrink-0 text-xs text-muted-foreground tabular-nums">
            {formatQueueDate(entry.createdAt)}
          </span>
        )}
        {editing && (
          <EntryActions
            entry={entry}
            soldBlocked={soldBlocked}
            handlers={handlers}
          />
        )}
      </div>

      {kind === "amount" && (
        <AmountDetails entry={entry} editing={editing} handlers={handlers} />
      )}
    </li>
  );
}

function RollCell({
  entry,
  editing,
  handlers,
}: {
  entry: QueueEntry;
  editing: boolean;
  handlers: QueueEntryHandlers;
}) {
  if (!editing) {
    return (
      <span className="inline-flex items-center gap-1 rounded-md bg-muted px-1.5 py-px text-xs font-bold tabular-nums">
        <Dices className="size-3" />
        {entry.roll ?? "—"}
      </span>
    );
  }

  return (
    <CommitInput
      label={`Ролл ${entry.username}`}
      value={entry.roll === null ? "" : String(entry.roll)}
      className="w-12 text-center font-bold"
      onCommit={(value) =>
        handlers.onUpdate(entry, { roll: value === "" ? null : Number(value) })
      }
    />
  );
}
