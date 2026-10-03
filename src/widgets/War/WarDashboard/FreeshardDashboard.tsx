import { Coins, Flag, Package, Tag } from "lucide-react";
import type { WarPeriodSnapshot } from "@/actions/warPeriodSnapshot";
import { formatNumber, plural } from "@/shared/lib/format";
import { StatTile } from "@/shared/ui";
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
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-4">
        <StatTile
          icon={Coins}
          label="Заработано"
          hint={perDayHint(earned, startedAt, endMs)}
        >
          {formatNumber(earned)}
        </StatTile>
        <StatTile
          icon={Tag}
          label="Продано предметов"
          hint="без эссенций и расходников"
        >
          {formatNumber(economy?.finance.itemsSoldCount ?? 0)}
        </StatTile>
        <StatTile
          icon={Flag}
          label="Рейдов"
          hint={perDayHint(raids, startedAt, endMs)}
        >
          {formatNumber(raids)}
        </StatTile>
        <StatTile icon={Package} label="Выпало предметов" hint={dropKinds}>
          {formatNumber(dropped)}
        </StatTile>
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
