import { Check, Users } from "lucide-react";
import type { RangeRaid } from "@/actions/getRaidsInRange";
import { cn } from "@/shared/lib/tw-merge";
import { raidState } from "./attendanceModel";
import { RAID_TEXT, raidColorStyle, raidKind, raidTitle } from "./raidKinds";

type Props = {
  raid: RangeRaid;
  onOpen: (id: number) => void;
};

export default function RaidCard({ raid, onOpen }: Props) {
  const state = raidState(raid);
  const prime = raidKind(raid) === "prime";

  return (
    <button
      type="button"
      onClick={() => onOpen(raid.id)}
      style={raidColorStyle(raid)}
      className={cn(
        "flex w-full cursor-pointer flex-col gap-px rounded-lg border px-[7px] py-[5px] text-left transition-colors hover:border-foreground/30",
        state === "attended" &&
          "border-green-200 bg-green-50 dark:border-green-500/30 dark:bg-green-500/10",
        state === "empty" &&
          "border-amber-300 bg-amber-50 dark:border-amber-500/40 dark:bg-amber-500/10",
        state === "missed" && "bg-card",
      )}
    >
      <span className="flex items-center justify-between gap-1 text-2xs text-muted-foreground tabular-nums">
        {raid.start.slice(11, 16)}
        <RaidPeople raid={raid} />
      </span>
      <span className="flex items-center justify-between gap-1">
        <span
          className={cn(
            "min-w-0 text-xs leading-tight",
            RAID_TEXT,
            prime ? "font-bold" : "font-semibold",
          )}
        >
          {raidTitle(raid)}
        </span>
        {state === "attended" && (
          <Check
            aria-label="Вы были"
            className="size-3.5 shrink-0 text-green-600 dark:text-green-400"
          />
        )}
      </span>
    </button>
  );
}

function RaidPeople({ raid }: { raid: RangeRaid }) {
  if (raid.people === 0) {
    return (
      <span className="font-bold text-amber-700 dark:text-amber-400">
        пусто
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-0.5">
      <Users className="size-[11px]" />
      {raid.people}
    </span>
  );
}
