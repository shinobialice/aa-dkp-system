"use client";

import { Card, Tabs, TabsList, TabsTrigger, TabsContent } from "@/shared/ui";
import RosterCompositionTable from "./RosterCompositionTable";
import SealGradeStatsTable from "./SealGradeStatsTable";
import AvailableItemsTable from "./AvailableItemsTable";
import ClassArchetypeStatsTable from "./ClassArchetypeStatsTable";
import type {
  RosterClassStat,
  SealGradeStat,
  InventoryStockStat,
  ClassArchetypeStat,
} from "@/actions/guildStats";

export default function GuildInfoTabsCard({
  rosterComposition,
  sealGradeStats,
  inventoryStock,
  classArchetypeStats,
  className,
}: {
  rosterComposition: RosterClassStat[];
  sealGradeStats: SealGradeStat[];
  inventoryStock: InventoryStockStat[];
  classArchetypeStats: ClassArchetypeStat[];
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
            <TabsTrigger className="cursor-pointer" value="classes">
              Статистика по классам
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
        <TabsContent value="classes">
          <ClassArchetypeStatsTable bare data={classArchetypeStats} />
        </TabsContent>
      </Tabs>
    </Card>
  );
}
