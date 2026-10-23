import type { KillcountEntry } from "@/server/killcountEntries/types";
import { windowText } from "./killcountEntriesModel";
import RaidChips from "./RaidChips";

type Props = {
  entry: KillcountEntry;
};

export default function PrimeScanInfo({ entry }: Props) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-xs text-muted-foreground">
        {entry.window
          ? windowText(entry.window)
          : "добавлен вручную, время не записано"}
      </p>
      <RaidChips raids={entry.raids} kind="prime" />
    </div>
  );
}
