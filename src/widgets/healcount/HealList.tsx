import Link from "next/link";
import type { HealcountRecord } from "@/server/healcount";
import { formatNumber } from "@/shared/lib/format";
import { cn } from "@/shared/lib/tw-merge";
import {
  KIND_LABEL,
  playersText,
  timeOf,
  totalHonor,
} from "@/widgets/killcount/entries/killcountEntriesModel";
import { longDate, weekday } from "@/widgets/killcount/ui/killcountModel";
import { healcountHref, recordDays } from "./healcountModel";

type Props = {
  records: HealcountRecord[];
  selectedId: number | null;
};

export default function HealList({ records, selectedId }: Props) {
  return (
    <section
      aria-label="Записи сканера"
      className="min-w-0 overflow-hidden rounded-xl border bg-card"
    >
      <div className="flex items-baseline justify-between gap-2 border-b px-3.5 py-2.5">
        <h2 className="font-semibold">Записи сканера</h2>
        <span className="text-xs text-muted-foreground">за полтора месяца</span>
      </div>
      <div className="max-h-[min(40rem,calc(100dvh-14rem))] overflow-auto overscroll-contain">
        {recordDays(records).map((day) => (
          <section key={day} aria-label={longDate(day)}>
            <h3 className="sticky top-0 z-10 bg-muted px-3.5 py-1.5 text-2xs font-semibold tracking-wide text-muted-foreground uppercase">
              {longDate(day)} · {weekday(day)}
            </h3>
            <ol>
              {records
                .filter((record) => record.day === day)
                .map((record) => (
                  <li key={record.id} className="border-b last:border-b-0">
                    <HealRow
                      record={record}
                      isSelected={record.id === selectedId}
                    />
                  </li>
                ))}
            </ol>
          </section>
        ))}
        {records.length === 0 && (
          <p className="px-3.5 py-8 text-center text-muted-foreground">
            Записей сканера за последние полтора месяца нет
          </p>
        )}
      </div>
    </section>
  );
}

function HealRow({
  record,
  isSelected,
}: {
  record: HealcountRecord;
  isSelected: boolean;
}) {
  return (
    <Link
      prefetch={false}
      href={healcountHref(record.id)}
      aria-current={isSelected ? "page" : undefined}
      className={cn(
        "grid grid-cols-[3.25rem_minmax(0,1fr)_auto] items-center gap-x-3 px-3.5 py-2 hover:bg-muted/50",
        isSelected &&
          "bg-muted/70 shadow-[inset_3px_0_0_var(--color-emerald-500)]",
      )}
    >
      <span className="text-sm font-semibold tabular-nums">
        {timeOf(record.window.startedAt)}
      </span>
      <span className="min-w-0 leading-tight">
        <span className="block truncate font-semibold">
          {KIND_LABEL[record.kind]}
        </span>
        <span className="text-2xs text-muted-foreground">
          {playersText(record.fighters.length)} · {record.window.scannedBy}
        </span>
      </span>
      <span className="text-right text-base font-bold tabular-nums">
        {formatNumber(totalHonor(record.fighters))}
      </span>
    </Link>
  );
}
