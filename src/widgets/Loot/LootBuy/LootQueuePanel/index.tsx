"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/shared/lib/tw-merge";
import { updateItemTypePrice } from "@/actions/updateItemTypePrice";
import type {
  MyLootQueueRequest,
  MyLootQueueRequests,
} from "@/actions/lootQueueRequests";
import { LootIcon } from "../icons/LootIconComponent";
import QueueEntryRow from "../QueueEntryRow";
import {
  formatQueueDate,
  playersCount,
  queueKind,
  type BuyItem,
  type QueueEntry,
  type QueueKind,
} from "../lootBuyModel";
import AddToQueue, { type QueuePlayer } from "./AddToQueue";
import QueueStats from "./QueueStats";
import AdminToolbar from "./AdminToolbar";
import QueueRequest from "./QueueRequest";
import { useQueueActions } from "./useQueueActions";

export type { QueuePlayer };

type Props = {
  item: BuyItem;
  queue: QueueEntry[];
  request: MyLootQueueRequest | null;
  currentUserId: number | null;
  isAdmin: boolean;
  players: QueuePlayer[];
  scrollQueue: boolean;
  onQueueChange: (itemName: string, queue: QueueEntry[]) => void;
  onPriceChange: (itemName: string, price: number | null) => void;
  onRequestsChange: (requests: MyLootQueueRequests) => void;
};

const KIND_HINTS: Partial<Record<QueueKind, string>> = {
  roll: "Очередь по роллу: первым идёт тот, у кого ролл выше.",
  amount: "Покупка на количество: сколько запрошено и сколько уже отдано.",
};

export default function LootQueuePanel({
  item,
  queue,
  request,
  currentUserId,
  isAdmin,
  players,
  scrollQueue,
  onQueueChange,
  onPriceChange,
  onRequestsChange,
}: Props) {
  const [editing, setEditing] = useState(false);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const actions = useQueueActions(item.name, queue, onQueueChange);
  const kind = queueKind(item.name);
  const myIndex = queue.findIndex((entry) => entry.userId === currentUserId);
  const canDrag = editing && kind !== "roll";

  const savePrice = async (price: number | null) => {
    await updateItemTypePrice(item.name, price);
    onPriceChange(item.name, price);
  };

  const dropAt = (index: number) => {
    if (dragIndex !== null && dragIndex !== index) {
      actions.reorder(dragIndex, index);
    }
    setDragIndex(null);
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
          <h2 className="text-lg leading-tight font-bold">{item.name}</h2>
          <span className="text-xs text-muted-foreground">{item.source}</span>
        </div>
      </div>

      <QueueStats
        item={item}
        queueLength={queue.length}
        isAdmin={isAdmin}
        onPriceSave={savePrice}
      />

      {myIndex >= 0 && (
        <MyPlace place={myIndex} createdAt={queue[myIndex].createdAt} />
      )}
      {myIndex < 0 && currentUserId !== null && (
        <QueueRequest
          itemName={item.name}
          request={request}
          onRequestsChange={onRequestsChange}
        />
      )}
      {KIND_HINTS[kind] && (
        <p className="mx-4 mt-2.5 text-xs text-muted-foreground">
          {KIND_HINTS[kind]}
        </p>
      )}

      <div className="flex items-center justify-between gap-2 px-4 pt-3.5 pb-2">
        <h3 className="flex items-center gap-2 text-sm font-bold">
          Очередь
          {actions.busy && (
            <Loader2 className="size-3.5 animate-spin text-muted-foreground" />
          )}
        </h3>
        {isAdmin && (
          <AdminToolbar
            editing={editing}
            canRoll={editing && kind === "roll" && queue.length > 0}
            busy={actions.busy}
            onRoll={actions.rollAll}
            onToggleEditing={() => setEditing((value) => !value)}
          />
        )}
      </div>

      {queue.length === 0 && (
        <p className="mx-4 mb-4 rounded-lg border border-dashed px-3 py-5 text-center text-sm text-muted-foreground">
          Очередь пустая
        </p>
      )}
      {queue.length > 0 && (
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
              handlers={actions.handlers}
              onDragStart={() => setDragIndex(index)}
              onDragOver={(event) => {
                if (canDrag) event.preventDefault();
              }}
              onDrop={(event) => {
                if (!canDrag || dragIndex === null) return;
                event.preventDefault();
                dropAt(index);
              }}
              onDragEnd={() => setDragIndex(null)}
            />
          ))}
        </ol>
      )}

      {editing && (
        <AddToQueue players={players} queue={queue} onAdd={actions.addPlayer} />
      )}
    </div>
  );
}

function MyPlace({ place, createdAt }: { place: number; createdAt: string }) {
  return (
    <div className="mx-4 mt-2.5 flex flex-col rounded-lg bg-green-50 px-3 py-2 text-green-800 dark:bg-green-500/10 dark:text-green-300">
      <span className="text-sm font-semibold">
        Вы {place + 1}-е в очереди · встали {formatQueueDate(createdAt)}
      </span>
      <span className="text-xs">
        {place === 0
          ? "перед вами никого"
          : `перед вами ${playersCount(place)}`}
      </span>
    </div>
  );
}
