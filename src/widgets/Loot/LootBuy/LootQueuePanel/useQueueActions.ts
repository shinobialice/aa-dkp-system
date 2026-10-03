import { useState } from "react";
import { addToLootQueue } from "@/actions/addToLootQueue";
import { getLootQueueByItemName } from "@/actions/getLootQueueByItemName";
import { markQueueLootAsSold } from "@/actions/markQueueLootAsSold";
import { removeFromLootQueue } from "@/actions/removeFromLootQueue";
import { reorderLootQueue } from "@/actions/reorderLootQueue";
import { updateLootQueueEntry } from "@/actions/updateLootQueueEntry";
import type { QueueEntryHandlers } from "../QueueEntryRow/types";
import type { QueueEntry } from "../lootBuyModel";

const MAX_ROLL = 100;
const WAITING_STATUS = "ожидание";

export function useQueueActions(
  itemName: string,
  queue: QueueEntry[],
  onQueueChange: (itemName: string, queue: QueueEntry[]) => void,
) {
  const [busy, setBusy] = useState(false);

  const run = async (action: () => Promise<unknown>) => {
    setBusy(true);
    try {
      await action();
      onQueueChange(itemName, await getLootQueueByItemName(itemName));
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
          status: entry.status === status ? WAITING_STATUS : status,
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
      itemName,
      next.map((entry, index) => ({ ...entry, position: index })),
    );
    reorderLootQueue(next.map((entry) => entry.id));
  };

  const rollAll = () =>
    run(async () => {
      const rolls = shuffledRolls();
      await Promise.all(
        queue.map((entry, index) =>
          updateLootQueueEntry({ id: entry.id, roll: rolls[index] }),
        ),
      );
    });

  const addPlayer = (username: string) =>
    run(() => addToLootQueue(username, itemName));

  return { busy, handlers, reorder, rollAll, addPlayer };
}

function shuffledRolls() {
  const pool = Array.from({ length: MAX_ROLL + 1 }, (_, index) => index);
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool;
}
