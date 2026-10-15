"use client";

import type { WarPeriodSnapshot } from "@/actions/warPeriodSnapshot";
import useCurrentUser from "@/hooks/useCurrentUser";
import MyWarCard from "../MyWarCard";
import ScoreTile from "../ScoreTile";
import WarFightersCard from "../WarFightersCard";
import WarMembershipCard from "../WarMembershipCard";
import { buildFighters, perDayHint } from "../warModel";
import WarTurnoutCard from "../WarTurnoutCard";

const NO_KILLCOUNT = "нет данных киллкаунта";
const EPOCH_ISO = new Date(0).toISOString();

type Props = {
  startedAt: string | null;
  endMs: number;
  snapshot: WarPeriodSnapshot;
};

export default function PvpDashboard({ startedAt, endMs, snapshot }: Props) {
  const user = useCurrentUser();
  const { attendance, membership, pvpStats } = snapshot;
  const raids = attendance.totalRaidsInPeriod;
  const hasKillcount = (pvpStats?.players.length ?? 0) > 0;
  const kills = pvpStats?.totalKills ?? 0;
  const honor = pvpStats?.totalHonor ?? 0;
  const fighters = buildFighters(attendance, pvpStats);
  const killcountHint = (value: number) =>
    hasKillcount ? perDayHint(value, startedAt, endMs) : NO_KILLCOUNT;

  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-2 gap-2.5 lg:grid-cols-4">
        <ScoreTile
          label="ПВП-рейдов"
          value={raids}
          hint={perDayHint(raids, startedAt, endMs)}
          delayS={0.45}
        />
        <ScoreTile
          label="Киллы гильдии"
          value={hasKillcount ? kills : null}
          hint={killcountHint(kills)}
          delayS={0.52}
        />
        <ScoreTile
          label="Хонор гильдии"
          value={hasKillcount ? honor : null}
          hint={killcountHint(honor)}
          delayS={0.59}
        />
        <ScoreTile
          label="Игроков в рейдах"
          value={attendance.participantsCount}
          hint="хотя бы один ПВП-рейд"
          delayS={0.66}
        />
      </div>
      <div className="grid gap-5 lg:grid-cols-[320px_minmax(0,1fr)]">
        <MyWarCard
          user={user}
          fighters={fighters}
          attendance={attendance}
          periodStart={startedAt ?? EPOCH_ISO}
          periodEnd={new Date(endMs).toISOString()}
        />
        <WarFightersCard
          fighters={fighters}
          totalRaids={raids}
          hasKillcount={hasKillcount}
          myUserId={user?.id ?? null}
          className="lg:h-full"
        />
      </div>
      <div className="grid items-start gap-5 lg:grid-cols-2">
        <WarTurnoutCard attendance={attendance} />
        <WarMembershipCard changes={membership} />
      </div>
    </div>
  );
}
