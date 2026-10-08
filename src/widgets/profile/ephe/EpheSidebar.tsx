import { useState } from "react";
import { Check, ChevronDown, ChevronRight } from "lucide-react";
import type { UserEquipment } from "@/actions/getUserEquipment";
import { Badge } from "@/shared/ui";
import { cn } from "@/shared/lib/tw-merge";
import { EPHE_SLOT_TRACK, EPHE_TRACK_MAX_LEVEL } from "./epheSealsData";
import { EPHE_SIDEBAR_GROUPS, EPHE_SLOT_SHORT_LABELS } from "./epheSlotGroups";

const CHECK_COLOR = "#4ade80";

type Props = {
  equipmentBySlot: Record<string, UserEquipment | undefined>;
  activeSlot: string;
  onSelect: (slot: string) => void;
};

export default function EpheSidebar({
  equipmentBySlot,
  activeSlot,
  onSelect,
}: Props) {
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  return (
    <div className="flex w-full flex-col gap-2 lg:w-64 lg:shrink-0">
      {EPHE_SIDEBAR_GROUPS.map((group) => {
        const isCollapsed = collapsed[group.label];
        const Chevron = isCollapsed ? ChevronRight : ChevronDown;
        return (
          <div key={group.label}>
            <button
              type="button"
              onClick={() =>
                setCollapsed((current) => ({
                  ...current,
                  [group.label]: !current[group.label],
                }))
              }
              className="flex w-full cursor-pointer items-center gap-1.5 px-1 py-1 text-left text-sm font-semibold text-muted-foreground hover:text-foreground"
            >
              <Chevron className="size-4 shrink-0" />
              {group.label}
            </button>
            {!isCollapsed && (
              <div className="flex flex-col gap-1">
                {group.slots.map((slotKey) => (
                  <SlotButton
                    key={slotKey}
                    slotKey={slotKey}
                    item={equipmentBySlot[slotKey]}
                    active={activeSlot === slotKey}
                    onSelect={onSelect}
                  />
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function SlotButton({
  slotKey,
  item,
  active,
  onSelect,
}: {
  slotKey: string;
  item: UserEquipment | undefined;
  active: boolean;
  onSelect: (slot: string) => void;
}) {
  const level = item?.ephe_seal_level ?? 0;
  const max = EPHE_TRACK_MAX_LEVEL[EPHE_SLOT_TRACK[slotKey]];
  return (
    <button
      type="button"
      onClick={() => onSelect(slotKey)}
      className={cn(
        "flex cursor-pointer items-center justify-between gap-2 rounded-md border px-3 py-2 text-left text-sm",
        active ? "border-primary bg-accent" : "hover:bg-accent/50",
      )}
    >
      <span className="flex min-w-0 items-center gap-2">
        <Check
          className="size-3.5 shrink-0"
          style={{ color: item ? CHECK_COLOR : "var(--muted-foreground)" }}
          strokeWidth={item ? 3 : 1.5}
        />
        <span className="truncate">{EPHE_SLOT_SHORT_LABELS[slotKey]}</span>
      </span>
      <Badge variant={level > 0 ? "default" : "outline"}>
        {level}/{max}
      </Badge>
    </button>
  );
}
