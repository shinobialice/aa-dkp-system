"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import type {
  MissingActivities,
  MissingSlot,
} from "@/actions/getMissingActivities";
import { cn } from "@/shared/lib/tw-merge";
import MissingSlotChip from "./MissingSlotChip";
import { groupSlotsByDate, slotKey } from "./missingModel";

type Props = {
  data: MissingActivities | undefined;
  canEdit: boolean;
  onRemove: (slot: MissingSlot) => Promise<void>;
};

export default function MissingSlotList({ data, canEdit, onRemove }: Props) {
  const [expanded, setExpanded] = useState(false);
  const [pendingKey, setPendingKey] = useState<string | null>(null);

  if (!data) {
    return <p className="text-xs text-muted-foreground">Загрузка…</p>;
  }
  if (!data.hasDeficit) {
    return (
      <p className="text-xs text-muted-foreground">Всё заполнено за месяц</p>
    );
  }

  const byDate = groupSlotsByDate(data.missingSlots);
  const summary = byDate
    .map(([date, slots]) => `${date} — ${slots.length}`)
    .join(", ");

  const handleRemove = async (slot: MissingSlot) => {
    setPendingKey(slotKey(slot));
    await onRemove(slot);
    setPendingKey(null);
  };

  return (
    <>
      <button
        type="button"
        aria-expanded={expanded}
        onClick={() => setExpanded((value) => !value)}
        className="flex cursor-pointer items-center justify-between gap-2 text-left text-xs text-amber-900 dark:text-amber-200"
      >
        <span className="min-w-0">
          {expanded ? "По расписанию были, но посещение не добавлено" : summary}
        </span>
        <span className="flex shrink-0 items-center gap-0.5 font-semibold">
          {expanded ? "Свернуть" : "Показать"}
          <ChevronDown
            className={cn(
              "size-3.5 transition-transform",
              expanded && "rotate-180",
            )}
          />
        </span>
      </button>
      {expanded && (
        <div className="flex max-h-56 flex-col gap-1.5 overflow-y-auto">
          {byDate.map(([date, slots]) => (
            <div key={date} className="flex flex-wrap items-center gap-1">
              <span className="w-11 shrink-0 text-xs font-bold text-amber-800 dark:text-amber-300">
                {date}
              </span>
              {slots.map((slot) => (
                <MissingSlotChip
                  key={slotKey(slot)}
                  slot={slot}
                  canEdit={canEdit}
                  pending={pendingKey === slotKey(slot)}
                  onRemove={() => handleRemove(slot)}
                />
              ))}
            </div>
          ))}
        </div>
      )}
    </>
  );
}
