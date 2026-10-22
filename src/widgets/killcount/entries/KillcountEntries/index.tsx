import Link from "next/link";
import type {
  AglItem,
  KillcountEntry,
  PendingRecord,
  PrimeDay,
} from "@/server/killcountEntries/types";
import { KillcountDay } from "../../ui/KillcountDay";
import { KillcountHeader } from "../../ui/KillcountHeader";
import AglList from "./AglList";
import EntryHeader from "./EntryHeader";
import EntrySummary from "./EntrySummary";
import KindSwitch from "./KindSwitch";
import PendingRecordCard from "./PendingRecordCard";
import PrimeDayList from "./PrimeDayList";
import {
  aglTiles,
  entryHref,
  primeTiles,
  type EntryKind,
} from "./killcountEntriesModel";

type Props = {
  kind: EntryKind;
  selected: KillcountEntry | null;
  primeDays: PrimeDay[];
  aglItems: AglItem[];
  pending: PendingRecord[];
  canEdit: boolean;
};

const SUBTITLE: Record<EntryKind, string> = {
  prime: "Киллкаунты праймов — идут в звания, рамки и статистику вара",
  agl: "Киллкаунты АГЛ — для интереса, ни на что не влияют",
};

export default function KillcountEntries({
  kind,
  selected,
  primeDays,
  aglItems,
  pending,
  canEdit,
}: Props) {
  const keys =
    kind === "prime"
      ? primeDays.map((day) => day.day)
      : aglItems.filter((item) => item.record).map((item) => item.key);
  const index = selected ? keys.indexOf(selected.key) : -1;
  const counts = {
    prime: primeDays.length,
    agl: aglItems.filter((item) => item.record).length,
  };

  return (
    <>
      <KillcountHeader subtitle={SUBTITLE[kind]}>
        <div className="flex flex-wrap items-center gap-3">
          <KindSwitch kind={kind} counts={counts} />
          {canEdit && (
            <Link
              href="/kill-counter/scanner"
              className="text-muted-foreground underline-offset-2 hover:text-foreground hover:underline"
            >
              Сканер →
            </Link>
          )}
        </div>
      </KillcountHeader>
      {pending.map((record) => (
        <PendingRecordCard key={record.id} record={record} />
      ))}
      <EntrySummary
        tiles={kind === "prime" ? primeTiles(primeDays) : aglTiles(aglItems)}
      />
      <div className="grid items-start gap-4 lg:grid-cols-[320px_minmax(0,1fr)]">
        {kind === "prime" ? (
          <PrimeDayList days={primeDays} selectedDay={selected?.key ?? null} />
        ) : (
          <AglList items={aglItems} selectedKey={selected?.key ?? null} />
        )}
        <SelectedEntry
          entry={selected}
          kind={kind}
          canEdit={canEdit}
          prevHref={index >= 0 ? hrefAt(kind, keys, index + 1) : null}
          nextHref={index > 0 ? hrefAt(kind, keys, index - 1) : null}
        />
      </div>
    </>
  );
}

function SelectedEntry({
  entry,
  kind,
  canEdit,
  prevHref,
  nextHref,
}: {
  entry: KillcountEntry | null;
  kind: EntryKind;
  canEdit: boolean;
  prevHref: string | null;
  nextHref: string | null;
}) {
  if (!entry) {
    return (
      <div className="rounded-xl border bg-card py-12 text-center text-muted-foreground">
        {kind === "prime"
          ? "Киллкаунтов праймов пока нет"
          : "Киллкаунт АГЛ появится, когда на АГЛ сходит кто-то со сканером"}
      </div>
    );
  }
  return (
    <div className="flex min-w-0 flex-col gap-3">
      <EntryHeader entry={entry} prevHref={prevHref} nextHref={nextHref} />
      <KillcountDay
        data={entry.fighters}
        mode="saved"
        isCanEdit={canEdit && entry.canEditRows}
      />
    </div>
  );
}

function hrefAt(kind: EntryKind, keys: string[], index: number) {
  const key = keys[index];
  return key === undefined ? null : entryHref(kind, key);
}
