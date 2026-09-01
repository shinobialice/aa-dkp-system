import { cookies } from "next/headers";
import { hasTag } from "@/actions/hasTag";
import { getGuildStatus } from "@/actions/guildStatusSettings";
import {
  getPeriodAttendanceTop,
  getPeriodFinanceSummary,
  getPeriodTopSales,
  getPeriodTopIncomeSources,
  getPeriodTopDrops,
  getPeriodMembershipChanges,
} from "@/actions/warActions";
import WarPageClient from "@/widgets/War/WarPageClient";

export default async function WarPage() {
  const sessionToken = (await cookies()).get("session_token")?.value ?? "";
  const isAdmin = await hasTag(sessionToken, ["Администратор"]);
  const status = await getGuildStatus();
  const periodStart = status.startedAt ?? new Date(0).toISOString();

  const [initialAttendance, initialMembership] = await Promise.all([
    getPeriodAttendanceTop(periodStart, null),
    getPeriodMembershipChanges(periodStart, null),
  ]);

  // Экономика (доход, продажи, источники дохода, дроп) имеет смысл только
  // на фришке — на варе этого либо нет, либо ещё не считается (килы/хонор).
  // Состав гильдии (пришли/ушли) — не зависит от режима, считается всегда.
  const initialEconomy =
    status.mode === "freeshard"
      ? await (async () => {
          const [finance, topSales, incomeSources, drops] = await Promise.all([
            getPeriodFinanceSummary(periodStart, null),
            getPeriodTopSales(periodStart, null, 10),
            getPeriodTopIncomeSources(periodStart, null),
            getPeriodTopDrops(periodStart, null),
          ]);
          return { finance, topSales, incomeSources, drops };
        })()
      : null;

  return (
    <WarPageClient
      isAdmin={isAdmin}
      initialStatus={status}
      initialAttendance={initialAttendance}
      initialMembership={initialMembership}
      initialEconomy={initialEconomy}
    />
  );
}
