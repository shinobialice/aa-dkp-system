import type { HealcountRecord } from "@/server/healcount";
import type { KillcountEntry } from "@/server/killcountEntries/types";
import EntryHeader from "@/widgets/killcount/entries/EntryHeader";
import EntrySummary from "@/widgets/killcount/entries/EntrySummary";
import Podium from "@/widgets/killcount/ui/KillcountDay/Podium";
import HealList from "./HealList";
import HonorList from "./HonorList";
import { byHonor, healcountHref, honorTiles } from "./healcountModel";

type Props = {
  records: HealcountRecord[];
  selected: KillcountEntry | null;
};

export default function Healcount({ records, selected }: Props) {
  const index = records.findIndex(
    (record) => String(record.id) === selected?.key,
  );
  const hrefAt = (at: number) => {
    const record = records[at];
    return index < 0 || !record ? null : healcountHref(record.id);
  };

  return (
    <div className="grid items-start gap-4 lg:grid-cols-[320px_minmax(0,1fr)]">
      <HealList records={records} selectedId={records[index]?.id ?? null} />
      <SelectedRecord
        entry={selected}
        prevHref={hrefAt(index + 1)}
        nextHref={hrefAt(index - 1)}
      />
    </div>
  );
}

type SelectedRecordProps = {
  entry: KillcountEntry | null;
  prevHref: string | null;
  nextHref: string | null;
};

function SelectedRecord({ entry, prevHref, nextHref }: SelectedRecordProps) {
  if (!entry) {
    return (
      <div className="rounded-xl border bg-card py-12 text-center text-muted-foreground">
        Хилы появятся, когда придёт запись со сканера
      </div>
    );
  }
  return (
    <div className="flex min-w-0 flex-col gap-3">
      <EntryHeader entry={entry} prevHref={prevHref} nextHref={nextHref} />
      <EntrySummary tiles={honorTiles(entry.fighters)} />
      {entry.fighters.length > 0 && (
        <Podium rows={byHonor(entry.fighters).slice(0, 3)} isHonorOnly />
      )}
      <HonorList fighters={entry.fighters} />
    </div>
  );
}
