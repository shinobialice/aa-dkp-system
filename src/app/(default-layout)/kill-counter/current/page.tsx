import { getKillCountCurrent } from "@/widgets/killcount/api/current";
import { cookies } from "next/headers";
import { hasTag } from "@/actions/hasTag";
import { AddKillCount } from "@/widgets/killcount/add-kill-count";
import { KillCountTable } from "@/widgets/killcount/ui/killcount-table";

export default async function KillCounterPage() {
  const sessionToken = (await cookies()).get("session_token")?.value ?? "";

  const isAdmin = await hasTag(sessionToken, ["Администратор"]);

  const currentKillCount = await getKillCountCurrent();

  return (
    <div className="flex min-h-screen flex-col bg-background text-onBackground p-8">
      <h1 className="text-3xl font-bold mb-6 text-primary">
        Актуальный киллкаунт
      </h1>
      {!currentKillCount?.length && <AddKillCount isCanEdit={isAdmin} />}
      {!!currentKillCount?.length && (
        <KillCountTable isCanEdit={isAdmin} data={currentKillCount} />
      )}
    </div>
  );
}
