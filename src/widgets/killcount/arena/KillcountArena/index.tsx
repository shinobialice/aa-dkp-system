import type {
  AglItem,
  ArenaKillcount,
  PendingRecord,
  PrimeDay,
} from "@/server/killcountArena/types";
import AglList from "./AglList";
import ArenaBanner from "./ArenaBanner";
import FightersPanel from "./FightersPanel";
import PendingRecordCard from "./PendingRecordCard";
import PrimeDayList from "./PrimeDayList";
import ScoreTiles from "./ScoreTiles";
import {
  aglScores,
  arenaHref,
  primeScores,
  type ArenaKind,
} from "./killcountArenaModel";

type Props = {
  kind: ArenaKind;
  selected: ArenaKillcount | null;
  primeDays: PrimeDay[];
  aglItems: AglItem[];
  pending: PendingRecord[];
  canEdit: boolean;
};

export default function KillcountArena({
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
    <div className="flex flex-col gap-4">
      {pending.map((record) => (
        <PendingRecordCard key={record.id} record={record} />
      ))}
      {selected ? (
        <ArenaBanner
          killcount={selected}
          prevHref={index >= 0 ? hrefAt(kind, keys, index + 1) : null}
          nextHref={index > 0 ? hrefAt(kind, keys, index - 1) : null}
          counts={counts}
        />
      ) : (
        <EmptyBanner kind={kind} />
      )}
      <ScoreTiles
        tiles={kind === "prime" ? primeScores(primeDays) : aglScores(aglItems)}
      />
      <div className="grid items-start gap-4 lg:grid-cols-[340px_minmax(0,1fr)]">
        {kind === "prime" ? (
          <PrimeDayList days={primeDays} selectedDay={selected?.key ?? null} />
        ) : (
          <AglList items={aglItems} selectedKey={selected?.key ?? null} />
        )}
        {selected && <FightersPanel killcount={selected} canEdit={canEdit} />}
      </div>
    </div>
  );
}

function hrefAt(kind: ArenaKind, keys: string[], index: number) {
  const key = keys[index];
  return key === undefined ? null : arenaHref(kind, key);
}

function EmptyBanner({ kind }: { kind: ArenaKind }) {
  const text =
    kind === "prime"
      ? "Киллкаунтов праймов пока нет"
      : "Киллкаунт АГЛ появится, когда на АГЛ сходит кто-то со сканером";
  return (
    <section className="arena-banner arena-poster px-6 py-10 md:px-9">
      <p className="font-display text-2xl uppercase">{text}</p>
    </section>
  );
}
