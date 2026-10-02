"use client";

import type { ReactNode } from "react";
import { Award, Coins, Flag, Package, Tag, Target, Users } from "lucide-react";
import type { GuildMode, GuildPvpStats } from "@/actions/guildStatusSettings";
import type {
  PeriodAttendanceResult,
  PeriodMembershipChanges,
  WarEconomySnapshot,
} from "@/actions/warActions";
import { KpiTile } from "./WarParts";
import WarFightersCard from "./WarFightersCard";
import WarMembershipCard from "./WarMembershipCard";
import { WarAttendanceCard, WarTurnoutCard } from "./WarAttendanceCards";
import {
  WarBuyersCard,
  WarDropsCard,
  WarIncomeSourcesCard,
  WarTopSalesCard,
} from "./WarEconomyCards";
import { buildFighters, formatNum, perDayHint, plural } from "./warModel";

function Columns({ main, side }: { main: ReactNode; side: ReactNode }) {
  return (
    <div className="grid items-start gap-4 xl:grid-cols-[minmax(0,1.75fr)_minmax(0,1fr)]">
      <div className="flex min-w-0 flex-col gap-4">{main}</div>
      <div className="grid min-w-0 items-start gap-4 md:grid-cols-2 xl:grid-cols-1">
        {side}
      </div>
    </div>
  );
}

export default function WarDashboard({
  mode,
  startedAt,
  asOf,
  attendance,
  membership,
  pvpStats,
  economy,
}: {
  mode: GuildMode;
  startedAt: string | null;
  asOf: string;
  attendance: PeriodAttendanceResult;
  membership: PeriodMembershipChanges;
  pvpStats: GuildPvpStats | null;
  economy: WarEconomySnapshot | null;
}) {
  const endMs = new Date(asOf).getTime();
  const raids = attendance.totalRaidsInPeriod;

  if (mode === "pvp") {
    const hasKillcount = (pvpStats?.players.length ?? 0) > 0;
    const kills = pvpStats?.totalKills ?? 0;
    const honor = pvpStats?.totalHonor ?? 0;
    return (
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-4">
          <KpiTile
            icon={Flag}
            label="ПВП-рейдов"
            value={formatNum(raids)}
            hint={perDayHint(raids, startedAt, endMs)}
          />
          <KpiTile
            icon={Target}
            label="Киллы гильдии"
            value={hasKillcount ? formatNum(kills) : "—"}
            hint={
              hasKillcount
                ? perDayHint(kills, startedAt, endMs)
                : "нет данных киллкаунта"
            }
          />
          <KpiTile
            icon={Award}
            label="Хонор гильдии"
            value={hasKillcount ? formatNum(honor) : "—"}
            hint={
              hasKillcount
                ? perDayHint(honor, startedAt, endMs)
                : "нет данных киллкаунта"
            }
          />
          <KpiTile
            icon={Users}
            label="Игроков в рейдах"
            value={formatNum(attendance.participantsCount)}
            hint="хотя бы один ПВП-рейд"
          />
        </div>
        <Columns
          main={
            <WarFightersCard
              fighters={buildFighters(attendance, pvpStats)}
              totalRaids={raids}
              hasKillcount={hasKillcount}
            />
          }
          side={
            <>
              <WarTurnoutCard attendance={attendance} />
              <WarMembershipCard changes={membership} />
            </>
          }
        />
      </div>
    );
  }

  const earned = economy?.finance.totalEarned ?? 0;
  const drops = economy?.drops ?? [];
  const dropped = drops.reduce((sum, drop) => sum + drop.quantity, 0);

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-4">
        <KpiTile
          icon={Coins}
          label="Заработано"
          value={formatNum(earned)}
          hint={perDayHint(earned, startedAt, endMs)}
        />
        <KpiTile
          icon={Tag}
          label="Продано предметов"
          value={formatNum(economy?.finance.itemsSoldCount ?? 0)}
          hint="без эссенций и расходников"
        />
        <KpiTile
          icon={Flag}
          label="Рейдов"
          value={formatNum(raids)}
          hint={perDayHint(raids, startedAt, endMs)}
        />
        <KpiTile
          icon={Package}
          label="Выпало предметов"
          value={formatNum(dropped)}
          hint={
            drops.length
              ? `${drops.length} ${plural(drops.length, "вид", "вида", "видов")}`
              : null
          }
        />
      </div>
      <Columns
        main={
          <>
            <WarIncomeSourcesCard
              sources={economy?.incomeSources ?? []}
              totalEarned={earned}
            />
            <WarTopSalesCard sales={economy?.topSales ?? []} />
            <WarDropsCard drops={drops} />
          </>
        }
        side={
          <>
            <WarBuyersCard buyers={economy?.topBuyers ?? []} />
            <WarAttendanceCard attendance={attendance} />
            <WarMembershipCard changes={membership} />
          </>
        }
      />
    </div>
  );
}
