import { formatNumber } from "@/shared/lib/format";
import type { JournalEntry } from "../journalModel";
import { isIncome } from "./journalMeta";

type Props = {
  entry: JournalEntry;
};

export default function EntryAmount({ entry }: Props) {
  if (isIncome(entry.kind)) {
    return (
      <span className="font-semibold text-green-700 tabular-nums dark:text-green-400">
        +{formatNumber(entry.amount)}
      </span>
    );
  }
  if (entry.kind === "gift") {
    return <span className="text-sm text-muted-foreground">бесплатно</span>;
  }
  return null;
}
