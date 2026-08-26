"use client";

import { Card, Tabs, TabsList, TabsTrigger, TabsContent } from "@/shared/ui";
import RosterCompositionTable from "./RosterCompositionTable";
import SealGradeStatsTable from "./SealGradeStatsTable";
import AvailableItemsTable from "./AvailableItemsTable";
import type {
  RosterClassStat,
  SealGradeStat,
  InventoryStockStat,
} from "@/actions/guildStats";

export default function GuildInfoTabsCard({
  rosterComposition,
  sealGradeStats,
  inventoryStock,
  className,
}: {
  rosterComposition: RosterClassStat[];
  sealGradeStats: SealGradeStat[];
  inventoryStock: InventoryStockStat[];
  className?: string;
}) {
  return (
    <Card className={`py-4 gap-3 ${className ?? ""}`}>
      <Tabs defaultValue="roster">
        <div className="px-6">
          <TabsList>
            <TabsTrigger className="cursor-pointer" value="roster">
              Общая информация по составу
            </TabsTrigger>
            <TabsTrigger className="cursor-pointer" value="seals">
              Печати по редкости
            </TabsTrigger>
            <TabsTrigger className="cursor-pointer" value="items">
              Имеющиеся предметы
            </TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="roster">
          <RosterCompositionTable bare data={rosterComposition} />
        </TabsContent>
        <TabsContent value="seals">
          <SealGradeStatsTable bare data={sealGradeStats} />
        </TabsContent>
        <TabsContent value="items">
          <AvailableItemsTable bare data={inventoryStock} />
        </TabsContent>
      </Tabs>
    </Card>
  );
}
