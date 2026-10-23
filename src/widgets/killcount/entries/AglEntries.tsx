import type { AglItem, KillcountEntry } from "@/server/killcountEntries/types";
import { KillcountDay } from "../ui/KillcountDay";
import AglList from "./AglList";
import EntryHeader from "./EntryHeader";
import { aglHref, type KillcountPage } from "./killcountEntriesModel";

type Props = {
  page: KillcountPage;
  items: AglItem[];
  selected: KillcountEntry | null;
};

export default function AglEntries({ page, items, selected }: Props) {
  const keys = items.filter((item) => item.record).map((item) => item.key);
  const index = selected ? keys.indexOf(selected.key) : -1;
  const hrefAt = (at: number) => {
    const key = keys[at];
    return index < 0 || key === undefined ? null : aglHref(page, key);
  };

  return (
    <div className="grid items-start gap-4 lg:grid-cols-[320px_minmax(0,1fr)]">
      <AglList page={page} items={items} selectedKey={selected?.key ?? null} />
      <SelectedAgl
        entry={selected}
        prevHref={hrefAt(index + 1)}
        nextHref={hrefAt(index - 1)}
      />
    </div>
  );
}

type SelectedAglProps = {
  entry: KillcountEntry | null;
  prevHref: string | null;
  nextHref: string | null;
};

function SelectedAgl({ entry, prevHref, nextHref }: SelectedAglProps) {
  if (!entry) {
    return (
      <div className="rounded-xl border bg-card py-12 text-center text-muted-foreground">
        Киллкаунт АГЛ появится, когда на АГЛ сходит кто-то со сканером
      </div>
    );
  }
  return (
    <div className="flex min-w-0 flex-col gap-3">
      <EntryHeader entry={entry} prevHref={prevHref} nextHref={nextHref} />
      <KillcountDay data={entry.fighters} mode="saved" isCanEdit={false} />
    </div>
  );
}
