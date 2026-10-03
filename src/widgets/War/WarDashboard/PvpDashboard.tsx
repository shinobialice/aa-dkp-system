import { Award, Flag, Target, Users } from "lucide-react";
import type { WarPeriodSnapshot } from "@/actions/warPeriodSnapshot";
import { formatNumber } from "@/shared/lib/format";
import { StatTile } from "@/shared/ui";
import WarFightersCard from "../WarFightersCard";
import WarMembershipCard from "../WarMembershipCard";
import { buildFighters, perDayHint } from "../warModel";
import WarTurnoutCard from "../WarTurnoutCard";
import DashboardColumns from "./DashboardColumns";

const NO_KILLCOUNT = "нет данных киллкаунта";

type Props = {
  startedAt: string | null;
  endMs: number;
  snapshot: WarPeriodSnapshot;
};

export default function PvpDashboard({ startedAt, endMs, snapshot }: Props) {
  const { attendance, membership, pvpStats } = snapshot;
  const raids = attendance.totalRaidsInPeriod;
  const hasKillcount = (pvpStats?.players.length ?? 0) > 0;
  const kills = pvpStats?.totalKills ?? 0;
  const honor = pvpStats?.totalHonor ?? 0;

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-4">
        <StatTile
          icon={Flag}
          label="ПВП-рейдов"
          hint={perDayHint(raids, startedAt, endMs)}
        >
          {formatNumber(raids)}
        </StatTile>
        <StatTile
          icon={Target}
          label="Киллы гильдии"
          hint={
            hasKillcount ? perDayHint(kills, startedAt, endMs) : NO_KILLCOUNT
          }
        >
          {hasKillcount ? formatNumber(kills) : "—"}
        </StatTile>
        <StatTile
          icon={Award}
          label="Хонор гильдии"
          hint={
            hasKillcount ? perDayHint(honor, startedAt, endMs) : NO_KILLCOUNT
          }
        >
          {hasKillcount ? formatNumber(honor) : "—"}
        </StatTile>
        <StatTile
          icon={Users}
          label="Игроков в рейдах"
          hint="хотя бы один ПВП-рейд"
        >
          {formatNumber(attendance.participantsCount)}
        </StatTile>
      </div>
      <DashboardColumns
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
