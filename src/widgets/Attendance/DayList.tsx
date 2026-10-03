import { Check } from "lucide-react";
import type { RangeRaid } from "@/actions/getRaidsInRange";
import { cn } from "@/shared/lib/tw-merge";
import { raidState } from "./attendanceModel";
import {
  RAID_BG,
  RAID_TEXT,
  raidColorStyle,
  raidKind,
  raidTitle,
} from "./raidKinds";

type Props = {
  raids: RangeRaid[];
  future: boolean;
  onRaidOpen: (id: number) => void;
};

export default function DayList({ raids, future, onRaidOpen }: Props) {
  if (raids.length === 0) {
    return (
      <p className="rounded-xl border border-dashed px-4 py-6 text-center text-muted-foreground">
        {future ? "Ещё впереди" : "В этот день рейдов нет"}
      </p>
    );
  }

  return (
    <div className="flex flex-col overflow-hidden rounded-xl border bg-card">
      {raids.map((raid) => (
        <DayRaidRow key={raid.id} raid={raid} onOpen={onRaidOpen} />
      ))}
    </div>
  );
}

function DayRaidRow({
  raid,
  onOpen,
}: {
  raid: RangeRaid;
  onOpen: (id: number) => void;
}) {
  const state = raidState(raid);

  return (
    <button
      type="button"
      onClick={() => onOpen(raid.id)}
      style={raidColorStyle(raid)}
      className={cn(
        "flex min-h-13 cursor-pointer items-center gap-3 border-b px-3 py-1.5 text-left last:border-b-0",
        state === "attended" && "bg-green-50 dark:bg-green-500/10",
        state === "empty" && "bg-amber-50 dark:bg-amber-500/10",
      )}
    >
      <span className="w-11 shrink-0 text-base font-semibold tabular-nums">
        {raid.start.slice(11, 16)}
      </span>
      <span className={cn("w-1 self-stretch rounded-full", RAID_BG)} />
      <span className="flex min-w-0 flex-1 flex-col leading-tight">
        <span
          className={cn(
            RAID_TEXT,
            raidKind(raid) === "prime" ? "font-bold" : "font-semibold",
          )}
        >
          {raidTitle(raid)}
        </span>
        {state === "empty" && (
          <span className="text-xs font-semibold text-amber-700 dark:text-amber-400">
            участники не добавлены
          </span>
        )}
        {state !== "empty" && (
          <span className="text-xs text-muted-foreground">
            {raid.people} участников
          </span>
        )}
      </span>
      {state === "attended" && (
        <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-800 dark:bg-green-500/15 dark:text-green-300">
          <Check className="size-3" />
          был
        </span>
      )}
      {state === "missed" && (
        <span className="text-xs text-muted-foreground">не был</span>
      )}
    </button>
  );
}
