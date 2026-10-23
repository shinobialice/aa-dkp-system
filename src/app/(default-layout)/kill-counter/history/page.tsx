import { getAglHistory, getSelectedAglRecord } from "@/server/killcountEntries";
import {
  getKillCountHistory,
  getKillCountWars,
} from "@/widgets/killcount/api/history";
import AglEntries from "@/widgets/killcount/entries/AglEntries";
import EntrySummary from "@/widgets/killcount/entries/EntrySummary";
import { aglTiles } from "@/widgets/killcount/entries/killcountEntriesModel";
import KindSwitch from "@/widgets/killcount/entries/KindSwitch";
import { KillcountHeader } from "@/widgets/killcount/ui/KillcountHeader";
import { KillcountHistory } from "@/widgets/killcount/ui/KillcountHistory";

type Props = {
  searchParams: Promise<{ kind?: string; record?: string }>;
};

const SUBTITLE = {
  prime: "История праймов по дням, сгруппированная по варам",
  agl: "АГЛ за последние полтора месяца — для интереса, ни на что не влияют",
};

export default async function HistoryKillCounterPage({ searchParams }: Props) {
  const params = await searchParams;
  const kind = params.kind === "agl" ? "agl" : "prime";

  const [history, wars, aglItems] = await Promise.all([
    kind === "prime" ? getKillCountHistory() : [],
    kind === "prime" ? getKillCountWars() : [],
    kind === "agl" ? getAglHistory() : [],
  ]);
  const selectedAgl = await getSelectedAglRecord(aglItems, params.record);

  return (
    <div className="mx-auto flex w-full max-w-6xl min-w-0 flex-col gap-4 text-sm">
      <KillcountHeader subtitle={SUBTITLE[kind]}>
        <KindSwitch page="/kill-counter/history" kind={kind} />
      </KillcountHeader>
      {kind === "prime" && <KillcountHistory history={history} wars={wars} />}
      {kind === "agl" && (
        <>
          <EntrySummary tiles={aglTiles(aglItems)} />
          <AglEntries
            page="/kill-counter/history"
            items={aglItems}
            selected={selectedAgl}
          />
        </>
      )}
    </div>
  );
}
