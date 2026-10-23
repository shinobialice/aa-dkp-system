import type { LinkedRaid } from "@/server/killcountEntries/types";
import { cn } from "@/shared/lib/tw-merge";
import type { EntryKind } from "./killcountEntriesModel";

type Props = {
  raids: LinkedRaid[];
  kind: EntryKind;
};

export default function RaidChips({ raids, kind }: Props) {
  return (
    <div className="flex flex-wrap items-center gap-1.5 text-xs">
      <span className="text-muted-foreground">
        {kind === "prime" ? "Рейды прайма:" : "Рейд:"}
      </span>
      {raids.length === 0 && (
        <span className="rounded-full border border-dashed px-2.5 py-0.5 text-muted-foreground">
          посещение ещё не заполнено
        </span>
      )}
      {raids.map((raid) => (
        <span
          key={raid.id}
          className={cn(
            "rounded-full border px-2.5 py-0.5",
            raid.isLinked ? "bg-muted" : "text-muted-foreground",
          )}
        >
          <span className="font-semibold tabular-nums">{raid.time}</span>{" "}
          {raid.boss}
          <span className="text-muted-foreground"> · {raid.people} чел.</span>
        </span>
      ))}
    </div>
  );
}
