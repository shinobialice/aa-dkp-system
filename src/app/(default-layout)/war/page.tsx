import { cookies } from "next/headers";
import { getGuildStatus } from "@/actions/guildStatusSettings";
import { hasTag } from "@/actions/hasTag";
import { getCurrentWarOpponents } from "@/actions/warOpponents";
import { getWarPeriodSnapshot } from "@/actions/warPeriodSnapshot";
import WarPageClient from "@/widgets/War/WarPageClient";

export default async function WarPage() {
  const sessionToken = (await cookies()).get("session_token")?.value ?? "";
  const isAdmin = await hasTag(sessionToken, ["Администратор"]);
  const status = await getGuildStatus();
  const periodStart = status.startedAt ?? new Date(0).toISOString();

  const [snapshot, warOpponents] = await Promise.all([
    getWarPeriodSnapshot(periodStart, null, status.mode),
    getCurrentWarOpponents(),
  ]);

  return (
    <WarPageClient
      isAdmin={isAdmin}
      asOf={new Date().toISOString()}
      initialStatus={status}
      initialWarOpponents={warOpponents}
      snapshot={snapshot}
    />
  );
}
