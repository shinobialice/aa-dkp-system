import { ChevronDown } from "lucide-react";
import { formatNumber, plural } from "@/shared/lib/format";
import { cn } from "@/shared/lib/tw-merge";
import type { JournalEntry } from "../journalModel";
import EntryAmount from "./EntryAmount";
import EntryRecipient from "./EntryRecipient";
import type { RecordActions } from "./journalMeta";
import KindChip from "./KindChip";
import RecordList from "./RecordList";
import RecordMenu from "./RecordMenu";

type Props = RecordActions & {
  entry: JournalEntry;
  isAdmin: boolean;
  expanded: boolean;
  onToggle: () => void;
};

export default function EntryRow({
  entry,
  isAdmin,
  expanded,
  onToggle,
  ...actions
}: Props) {
  const multi = entry.records.length > 1;
  const canExpand = isAdmin && multi;

  return (
    <div className="border-b px-4 py-3 last:border-b-0">
      <div className="flex items-start gap-3">
        <KindChip
          kind={entry.kind}
          className="mt-px hidden w-26 shrink-0 sm:inline-flex"
        />
        <div className="min-w-0 flex-1">
          <div className="mb-1.5 flex items-center justify-between gap-2 sm:hidden">
            <KindChip kind={entry.kind} />
            <EntryAmount entry={entry} />
          </div>
          <div className="flex flex-col gap-1 md:flex-row md:items-start md:gap-4">
            <div className="min-w-0 md:flex-[1.6]">
              <p className="leading-snug">
                <span className="font-medium">{entry.title}</span>
                {entry.showQuantity && (
                  <span className="ml-1.5 text-muted-foreground tabular-nums">
                    ×{formatNumber(entry.quantity)}
                  </span>
                )}
              </p>
              {entry.source && (
                <p className="text-xs text-muted-foreground">{entry.source}</p>
              )}
            </div>
            <div className="min-w-0 text-sm md:flex-1 md:pt-px">
              <EntryRecipient entry={entry} />
            </div>
          </div>
          {entry.comment && (
            <p className="mt-1.5 text-xs text-muted-foreground">
              «{entry.comment}»
            </p>
          )}
          {canExpand && (
            <button
              type="button"
              onClick={onToggle}
              aria-expanded={expanded}
              className="mt-1.5 inline-flex cursor-pointer items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground"
            >
              {entry.records.length}{" "}
              {plural(entry.records.length, "запись", "записи", "записей")}
              <ChevronDown
                className={cn(
                  "size-3.5 transition-transform",
                  expanded && "rotate-180",
                )}
              />
            </button>
          )}
          {canExpand && expanded && <RecordList entry={entry} {...actions} />}
        </div>
        <div className="hidden w-24 shrink-0 pt-px text-right whitespace-nowrap sm:block">
          <EntryAmount entry={entry} />
        </div>
        {canExpand && <span className="size-8 shrink-0" />}
        {isAdmin && !multi && (
          <RecordMenu
            record={entry.records[0]}
            kind={entry.kind}
            {...actions}
          />
        )}
      </div>
    </div>
  );
}
