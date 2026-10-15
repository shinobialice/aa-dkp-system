import type { WarPeriodSnapshot } from "@/actions/warPeriodSnapshot";
import { plural } from "@/shared/lib/format";
import ScoreTile from "../ScoreTile";
import WarAttendanceCard from "../WarAttendanceCard";
import WarBuyersCard from "../WarBuyersCard";
import WarDropsCard from "../WarDropsCard";
import WarIncomeSourcesCard from "../WarIncomeSourcesCard";
import WarMembershipCard from "../WarMembershipCard";
import { perDayHint } from "../warModel";
import WarTopSalesCard from "../WarTopSalesCard";
import DashboardColumns from "./DashboardColumns";

type Props = {
  startedAt: string | null;
  endMs: number;
  snapshot: WarPeriodSnapshot;
};

export default function FreeshardDashboard({
  startedAt,
  endMs,
  snapshot,
}: Props) {
  const { attendance, membership, economy } = snapshot;
  const raids = attendance.totalRaidsInPeriod;
  const earned = economy?.finance.totalEarned ?? 0;
  const drops = economy?.drops ?? [];
  const dropped = drops.reduce((sum, drop) => sum + drop.quantity, 0);
  const dropKinds = drops.length
    ? `${drops.length} ${plural(drops.length, "вид", "вида", "видов")}`
    : null;

  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-2 gap-2.5 lg:grid-cols-4">
        <ScoreTile
          label="Заработано"
          value={earned}
          hint={perDayHint(earned, startedAt, endMs)}
          delayS={0.45}
        />
        <ScoreTile
          label="Продано предметов"
          value={economy?.finance.itemsSoldCount ?? 0}
          hint="без эссенций и расходников"
          delayS={0.52}
        />
        <ScoreTile
          label="Рейдов"
          value={raids}
          hint={perDayHint(raids, startedAt, endMs)}
          delayS={0.59}
        />
        <ScoreTile
          label="Выпало предметов"
          value={dropped}
          hint={dropKinds}
          delayS={0.66}
        />
      </div>
      <DashboardColumns
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
