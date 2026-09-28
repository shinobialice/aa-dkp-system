import {
  getKillCountHistory,
  getKillCountWars,
} from "@/widgets/killcount/api/history";
import { KillCountHistoryTable } from "@/widgets/killcount/ui/history-table/history-table";

export default async function HistoryKillCounterPage() {
  const [data, wars] = await Promise.all([
    getKillCountHistory(),
    getKillCountWars(),
  ]);

  return (
    <div className="flex min-h-screen flex-col bg-background text-onBackground p-8">
      <h1 className="text-3xl font-bold mb-6 text-primary">История убийств</h1>
      <KillCountHistoryTable history={data} wars={wars} />
    </div>
  );
}
