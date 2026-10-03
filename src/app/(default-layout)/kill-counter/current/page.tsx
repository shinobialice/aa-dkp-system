import { getKillCountCurrent } from "@/widgets/killcount/api/current";
import { cookies } from "next/headers";
import { hasTag } from "@/actions/hasTag";
import { KILLCOUNT_EDITOR_TAGS } from "@/server/killcountEditors";
import { AddKillCount } from "@/widgets/killcount/add-kill-count";
import { KillcountHeader } from "@/widgets/killcount/ui/KillcountHeader";
import { KillcountDay } from "@/widgets/killcount/ui/KillcountDay";
import { longDate } from "@/widgets/killcount/ui/killcountModel";

function moscowToday() {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Moscow" }).format(
    new Date(),
  );
}

export default async function KillCounterPage() {
  const sessionToken = (await cookies()).get("session_token")?.value ?? "";

  const [canEditKillcount, currentKillCount] = await Promise.all([
    hasTag(sessionToken, KILLCOUNT_EDITOR_TAGS),
    getKillCountCurrent(),
  ]);

  return (
    <div className="mx-auto flex w-full max-w-6xl min-w-0 flex-col gap-4 text-sm">
      <KillcountHeader
        subtitle={`Сегодня, ${longDate(moscowToday())} · кто сколько набил за прайм`}
      />
      {currentKillCount?.length ? (
        <KillcountDay
          data={currentKillCount}
          mode="saved"
          canAddToday
          isCanEdit={canEditKillcount}
        />
      ) : (
        <AddKillCount isCanEdit={canEditKillcount} />
      )}
    </div>
  );
}
