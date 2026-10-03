"use client";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/shared/ui";
import type { UserEquipment } from "@/actions/getUserEquipment";
import { computeEngravingBonuses } from "../engravingBonuses";
import { computeEquippedBonuses, computeDerivedStats } from "../characterStats";
import GroupedRows from "./GroupedRows";
import { buildOffenseGroups } from "./offenseGroups";
import { buildDefenseGroups } from "./defenseGroups";
import { buildHealGroups, GEAR_GROUPS } from "./healGroups";
import type { RowGroup } from "./statRows";

type Props = {
  equipment: UserEquipment[];
  level: number;
};

type StatsTab = {
  value: string;
  label: string;
  groups: RowGroup[];
  withHeaders: boolean;
};

export function DetailedStatsPanel({ equipment, level }: Props) {
  const engravingBonuses = computeEngravingBonuses(equipment);
  const bonus = computeEquippedBonuses(equipment);
  const stats = computeDerivedStats(bonus, level);

  const tabs: StatsTab[] = [
    {
      value: "offense",
      label: "Атака",
      groups: buildOffenseGroups(stats, bonus),
      withHeaders: false,
    },
    {
      value: "defense",
      label: "Защита",
      groups: buildDefenseGroups(stats, bonus),
      withHeaders: false,
    },
    {
      value: "heal",
      label: "Исцеление",
      groups: buildHealGroups(stats, bonus),
      withHeaders: true,
    },
    { value: "gear", label: "Прочее", groups: GEAR_GROUPS, withHeaders: true },
  ];

  return (
    <div className="w-full shrink-0 rounded-xl border bg-muted/40 p-3">
      <Tabs defaultValue="offense">
        <TabsList className="mb-3 grid w-full grid-cols-4">
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="min-w-0 cursor-pointer px-0.5 text-2xs"
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <div className="h-160 overflow-y-auto pr-1">
          {tabs.map((tab) => (
            <TabsContent key={tab.value} value={tab.value}>
              <GroupedRows
                groups={tab.groups}
                withHeaders={tab.withHeaders}
                engravingBonuses={engravingBonuses}
              />
            </TabsContent>
          ))}
        </div>
      </Tabs>
    </div>
  );
}
