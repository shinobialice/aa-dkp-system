import { formatNumber } from "@/shared/lib/format";
import { formatDate } from "../treasuryModel";
import type { JournalEntry } from "../journalModel";
import type { RecordActions } from "./journalMeta";
import RecordMenu from "./RecordMenu";

type Props = RecordActions & {
  entry: JournalEntry;
};

export default function RecordList({ entry, ...actions }: Props) {
  return (
    <ul className="mt-2 divide-y rounded-lg border bg-muted/30">
      {entry.records.map((record) => {
        const date =
          entry.kind === "drop" ? record.acquired_at : record.sold_at;
        const showStatus =
          entry.kind === "drop" && record.status !== "В наличии";
        return (
          <li
            key={record.id}
            className="flex items-center gap-3 px-3 py-1.5 text-xs"
          >
            <span className="text-muted-foreground tabular-nums">
              {date ? formatDate(new Date(date)) : "—"}
            </span>
            <span className="min-w-0 flex-1 truncate">
              {record.itemType.name}
              {record.quantity > 1 && ` ×${formatNumber(record.quantity)}`}
              {showStatus && (
                <span className="text-muted-foreground">
                  {" "}
                  · {record.status?.toLowerCase()}
                </span>
              )}
            </span>
            {entry.kind === "sale" && (
              <span className="tabular-nums">
                {formatNumber(record.price ?? 0)}
              </span>
            )}
            <RecordMenu record={record} kind={entry.kind} {...actions} />
          </li>
        );
      })}
    </ul>
  );
}
