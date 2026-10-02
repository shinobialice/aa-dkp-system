import { cookies } from "next/headers";
import { hasTag } from "@/actions/hasTag";
import {
  getCurrentWarOpponents,
  getGuildStatus,
  getStatsForPeriod,
} from "@/actions/guildStatusSettings";
import {
  getPeriodAttendanceTop,
  getPeriodFinanceSummary,
  getPeriodTopSales,
  getPeriodTopBuyers,
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
  const isWar = status.mode === "pvp";

  const [initialAttendance, initialMembership, initialWarOpponents, pvpStats] =
    await Promise.all([
      getPeriodAttendanceTop(periodStart, null, status.mode),
      getPeriodMembershipChanges(periodStart, null),
      getCurrentWarOpponents(),
      isWar ? getStatsForPeriod(periodStart) : Promise.resolve(null),
    ]);

  // Экономика (доход, продажи, источники дохода, дроп) имеет смысл только
  // на фришке — на варе этого либо нет, либо ещё не считается (килы/хонор).
  // Состав гильдии (пришли/ушли) — не зависит от режима, считается всегда.
  const initialEconomy = isWar
    ? null
    : await (async () => {
        const [finance, topSales, topBuyers, incomeSources, drops] =
          await Promise.all([
            getPeriodFinanceSummary(periodStart, null),
            getPeriodTopSales(periodStart, null),
            getPeriodTopBuyers(periodStart, null),
            getPeriodTopIncomeSources(periodStart, null),
            getPeriodTopDrops(periodStart, null),
          ]);
        return { finance, topSales, topBuyers, incomeSources, drops };
      })();

  return (
    <WarPageClient
      isAdmin={isAdmin}
      asOf={new Date().toISOString()}
      initialStatus={status}
      initialWarOpponents={initialWarOpponents}
      initialAttendance={initialAttendance}
      initialMembership={initialMembership}
      initialEconomy={initialEconomy}
      guildPvpStats={pvpStats}
    />
  );
}
