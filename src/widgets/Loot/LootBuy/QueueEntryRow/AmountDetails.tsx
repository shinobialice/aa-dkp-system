import { formatNumber } from "@/shared/lib/format";
import type { QueueEntry } from "../lootBuyModel";
import CommitInput from "./CommitInput";
import type { QueueEntryHandlers } from "./types";

type Props = {
  entry: QueueEntry;
  editing: boolean;
  handlers: QueueEntryHandlers;
};

export default function AmountDetails({ entry, editing, handlers }: Props) {
  if (editing) return <AmountEditor entry={entry} handlers={handlers} />;

  const remaining = Math.max(0, entry.required - entry.delivered);
  const progress =
    entry.required > 0
      ? Math.min(100, Math.round((entry.delivered / entry.required) * 100))
      : 0;

  return (
    <div className="flex flex-col gap-1 pl-17">
      <span className="flex justify-between gap-2 text-xs tabular-nums">
        <span>
          отдано {formatNumber(entry.delivered, 0)} из{" "}
          {formatNumber(entry.required, 0)}
        </span>
        <span className="text-muted-foreground">
          осталось {formatNumber(remaining, 0)}
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
  );
}

function AmountEditor({
  entry,
  handlers,
}: {
  entry: QueueEntry;
  handlers: QueueEntryHandlers;
}) {
  const commitCount = (field: "required" | "delivered") => (value: string) => {
    const count = parseInt(value, 10);
    if (!Number.isNaN(count)) handlers.onUpdate(entry, { [field]: count });
  };

  return (
    <div className="grid grid-cols-2 gap-1.5 pl-17 text-2xs text-muted-foreground">
      <label className="flex flex-col gap-0.5">
        Запрошено
        <CommitInput
          label="Запрошено"
          value={String(entry.required)}
          className="text-foreground"
          onCommit={commitCount("required")}
        />
      </label>
      <label className="flex flex-col gap-0.5">
        Отдано
        <CommitInput
          label="Отдано"
          value={String(entry.delivered)}
          className="text-foreground"
          onCommit={commitCount("delivered")}
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
  );
}
