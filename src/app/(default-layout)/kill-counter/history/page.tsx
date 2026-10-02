import {
  getKillCountHistory,
  getKillCountWars,
} from "@/widgets/killcount/api/history";
import { KillcountHeader } from "@/widgets/killcount/ui/KillcountHeader";
import { KillcountHistory } from "@/widgets/killcount/ui/KillcountHistory";

export default async function HistoryKillCounterPage() {
  const [data, wars] = await Promise.all([
    getKillCountHistory(),
    getKillCountWars(),
  ]);

  return (
    <div className="mx-auto flex w-full max-w-6xl min-w-0 flex-col gap-4 text-sm">
      <KillcountHeader subtitle="История по дням, сгруппированная по варам" />
      <KillcountHistory history={data ?? []} wars={wars} />
    </div>
  );
}
