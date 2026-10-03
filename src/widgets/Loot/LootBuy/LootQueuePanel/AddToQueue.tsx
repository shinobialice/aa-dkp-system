import { useState } from "react";
import { Loader2, Plus } from "lucide-react";
import { Input } from "@/shared/ui";
import type { QueueEntry } from "../lootBuyModel";

export type QueuePlayer = { id: number; username: string };

const MAX_MATCHES = 6;

type Props = {
  players: QueuePlayer[];
  queue: QueueEntry[];
  onAdd: (username: string) => Promise<void>;
};

export default function AddToQueue({ players, queue, onAdd }: Props) {
  const [search, setSearch] = useState("");
  const [adding, setAdding] = useState<string | null>(null);
  const term = search.trim().toLowerCase();
  const inQueue = new Set(queue.map((entry) => entry.userId));
  const matches = term
    ? players
        .filter((player) => player.username.toLowerCase().includes(term))
        .slice(0, MAX_MATCHES)
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
