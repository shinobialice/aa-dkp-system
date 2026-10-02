"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/shared/ui";
import {
  getStatsForPeriod,
  type GuildPvpStats,
  type WarPeriodHistoryRow,
} from "@/actions/guildStatusSettings";
import {
  getPeriodAttendanceTop,
  getPeriodFinanceSummary,
  getPeriodMembershipChanges,
  getPeriodTopBuyers,
  getPeriodTopDrops,
  getPeriodTopIncomeSources,
  getPeriodTopSales,
  type PeriodAttendanceResult,
  type PeriodMembershipChanges,
  type WarEconomySnapshot,
} from "@/actions/warActions";
import WarHeader from "./WarHeader";
import WarDashboard from "./WarDashboard";
import { WarOpponentsCard, type OpponentView } from "./WarOpponentsCard";

type DetailData = {
  attendance: PeriodAttendanceResult;
  membership: PeriodMembershipChanges;
  economy: WarEconomySnapshot | null;
  pvpStats: GuildPvpStats | null;
};

async function loadEconomy(
  start: string,
  end: string,
): Promise<WarEconomySnapshot> {
  const [finance, topSales, topBuyers, incomeSources, drops] =
    await Promise.all([
      getPeriodFinanceSummary(start, end),
      getPeriodTopSales(start, end),
      getPeriodTopBuyers(start, end),
      getPeriodTopIncomeSources(start, end),
      getPeriodTopDrops(start, end),
    ]);
  return { finance, topSales, topBuyers, incomeSources, drops };
}

function periodOpponents(period: WarPeriodHistoryRow): OpponentView[] {
  return [
    ...(period.opponentGuild
      ? [
          {
            key: "primary",
            name: period.opponentGuild,
            startedAt: period.startedAt,
            endedAt: period.opponentEndedAt ?? period.endedAt,
            status: period.opponentEndedAt
              ? ("ended" as const)
              : ("periodEnd" as const),
          },
        ]
      : []),
    ...period.extraOpponents.map((opponent, index) => ({
      key: `extra-${index}`,
      name: opponent.name,
      startedAt: opponent.startedAt,
      endedAt: opponent.endedAt ?? period.endedAt,
      status: opponent.endedAt ? ("ended" as const) : ("periodEnd" as const),
    })),
  ];
}

export default function WarHistoryDetail({
  period,
  onBack,
}: {
  period: WarPeriodHistoryRow;
  onBack: () => void;
}) {
  const [data, setData] = useState<DetailData | null>(null);
  const { mode, startedAt, endedAt } = period;

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      getPeriodAttendanceTop(startedAt, endedAt, mode),
      getPeriodMembershipChanges(startedAt, endedAt),
      mode === "freeshard"
        ? loadEconomy(startedAt, endedAt)
        : Promise.resolve(null),
      mode === "pvp"
        ? getStatsForPeriod(startedAt, endedAt)
        : Promise.resolve(null),
    ]).then(([attendance, membership, economy, pvpStats]) => {
      if (!cancelled) setData({ attendance, membership, economy, pvpStats });
    });
    return () => {
      cancelled = true;
    };
  }, [mode, startedAt, endedAt]);

  return (
    <div className="flex flex-col gap-4">
      <Button
        variant="ghost"
        size="sm"
        onClick={onBack}
        className="-ml-2 cursor-pointer self-start"
      >
        <ArrowLeft />
        История
      </Button>

      <div className="rounded-xl border bg-muted/30 p-4">
        <WarHeader
          compact
          mode={mode}
          server={period.server}
          faction={period.faction}
          startedAt={startedAt}
          endedAt={endedAt}
        />
      </div>

      {mode === "pvp" && (
        <WarOpponentsCard
          opponents={periodOpponents(period)}
          emptyText="Противник не был указан"
        />
      )}

      {data ? (
        <WarDashboard
          mode={mode}
          startedAt={startedAt}
          asOf={endedAt}
          attendance={data.attendance}
          membership={data.membership}
          pvpStats={data.pvpStats}
          economy={data.economy}
        />
      ) : (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="size-8 animate-spin text-muted-foreground" />
        </div>
      )}
    </div>
  );
}
