"use client";

import { useState } from "react";
import { Flag } from "lucide-react";
import { toast } from "sonner";
import {
  getMissingActivitiesForMonth,
  type MissingSlot,
} from "@/actions/getMissingActivities";
import {
  addManualMissingSlot,
  dismissMissingSlot,
  removeManualMissingSlot,
} from "@/actions/missingActivityOverrides";
import { useAsyncData } from "@/hooks/useAsyncData";
import { shiftYearMonth } from "@/shared/config/months";
import { cn } from "@/shared/lib/tw-merge";
import AddMissingSlotForm from "./AddMissingSlotForm";
import MissingMonthSwitcher from "./MissingMonthSwitcher";
import MissingSlotList from "./MissingSlotList";
import { currentMoscowMonth } from "./missingModel";
import { errorMessage } from "@/shared/lib/errorMessage";

type Props = {
  canEdit?: boolean;
};

export default function MissingActivitiesBanner({ canEdit = false }: Props) {
  const current = currentMoscowMonth();
  const [selected, setSelected] = useState(current);
  const [showAddForm, setShowAddForm] = useState(false);
  const { data, reload } = useAsyncData(
    `${selected.year}-${selected.month}`,
    () => getMissingActivitiesForMonth(selected.year, selected.month),
  );

  const isCurrentMonth =
    selected.year === current.year && selected.month === current.month;
  const hasDeficit = !!data?.hasDeficit;

  const handleRemove = async (slot: MissingSlot) => {
    try {
      if (slot.isManual && slot.overrideId != null) {
        await removeManualMissingSlot(slot.overrideId);
      } else {
        await dismissMissingSlot(slot.rawDate, slot.time, slot.bossName);
      }
      await reload();
    } catch (error) {
      toast.error(errorMessage(error, "Не удалось убрать пункт"));
    }
  };

  const handleAdd = async (date: string, time: string, bossName: string) => {
    try {
      await addManualMissingSlot(date, time, bossName);
      await reload();
      return true;
    } catch (error) {
      toast.error(errorMessage(error, "Не удалось добавить пункт"));
      return false;
    }
  };

  return (
    <section
      aria-label="Не заполнены"
      className={cn(
        "flex flex-col gap-2 rounded-xl border px-3.5 py-3",
        hasDeficit
          ? "border-amber-300 bg-amber-50 dark:border-amber-500/40 dark:bg-amber-500/10"
          : "bg-card",
      )}
    >
      <div className="flex flex-wrap items-center gap-2">
        <Flag
          className={cn(
            "size-4 shrink-0",
            hasDeficit
              ? "text-amber-700 dark:text-amber-400"
              : "text-muted-foreground",
          )}
        />
        <span
          className={cn(
            "font-bold whitespace-nowrap",
            hasDeficit && "text-amber-800 dark:text-amber-300",
          )}
        >
          Не заполнены
        </span>
        {hasDeficit && (
          <span className="rounded-full bg-amber-500 px-1.5 text-xs font-bold text-white">
            {data.missingSlots.length}
          </span>
        )}
        <MissingMonthSwitcher
          month={selected}
          canGoNext={!isCurrentMonth}
          canAdd={canEdit}
          onShift={(delta) => setSelected(shiftYearMonth(selected, delta))}
          onAddToggle={() => setShowAddForm((value) => !value)}
        />
      </div>

      {canEdit && showAddForm && <AddMissingSlotForm onAdd={handleAdd} />}

      <MissingSlotList data={data} canEdit={canEdit} onRemove={handleRemove} />
    </section>
  );
}
