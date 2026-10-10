import { useState } from "react";
import { Check, ChevronDown, ChevronRight } from "lucide-react";
import type { UserEpheSeals } from "@/actions/getUserEpheSeals";
import { Badge } from "@/shared/ui";
import { cn } from "@/shared/lib/tw-merge";
import { EPHE_SLOT_TRACK, EPHE_TRACK_MAX_LEVEL } from "./epheSealsData";
import { EPHE_SIDEBAR_GROUPS, EPHE_SLOT_SHORT_LABELS } from "./epheSlotGroups";
import { epheCoverageHint, type EpheSlotCoverage } from "./epheSlotUsage";

const CHECK_COLOR = "#4ade80";
const PARTIAL_CHECK_COLOR = "#fbbf24";

type Props = {
  levels: UserEpheSeals;
  coverage: Record<string, EpheSlotCoverage>;
  activeSlot: string;
  onSelect: (slot: string) => void;
};

export default function EpheSidebar({
  levels,
  coverage,
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
                    level={levels[slotKey] ?? 0}
                    coverage={coverage[slotKey]}
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
  level,
  coverage,
  active,
  onSelect,
}: {
  slotKey: string;
  level: number;
  coverage: EpheSlotCoverage;
  active: boolean;
  onSelect: (slot: string) => void;
}) {
  const max = EPHE_TRACK_MAX_LEVEL[EPHE_SLOT_TRACK[slotKey]];
  const isUsed = coverage.active > 0;
  const checkColor =
    coverage.active === coverage.total ? CHECK_COLOR : PARTIAL_CHECK_COLOR;
  return (
    <button
      type="button"
      title={epheCoverageHint(coverage)}
      onClick={() => onSelect(slotKey)}
      className={cn(
        "flex cursor-pointer items-center justify-between gap-2 rounded-md border px-3 py-2 text-left text-sm",
        active ? "border-primary bg-accent" : "hover:bg-accent/50",
      )}
    >
      <span className="flex min-w-0 items-center gap-2">
        <Check
          className="size-3.5 shrink-0"
          style={{ color: isUsed ? checkColor : "var(--muted-foreground)" }}
          strokeWidth={isUsed ? 3 : 1.5}
        />
        <span className="truncate">{EPHE_SLOT_SHORT_LABELS[slotKey]}</span>
      </span>
      <Badge variant={level > 0 ? "default" : "outline"}>
        {level}/{max}
      </Badge>
    </button>
  );
}
