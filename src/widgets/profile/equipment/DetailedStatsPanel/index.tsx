"use client";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/shared/ui";
import type { UserEquipment } from "@/actions/getUserEquipment";
import type { UserSeal } from "@/actions/getUserSeals";
import type { RoleSkillBuild } from "@/actions/getUserSkillBuild";
import {
  computeCharacterBonuses,
  computeDerivedStats,
  type DerivedStats,
} from "../characterStats";
import type { SelectedBuffs } from "../characterBuffs";
import type { ProfileStats } from "../statComparison";
import GroupedRows from "./GroupedRows";
import { buildOffenseGroups } from "./offenseGroups";
import { buildDefenseGroups } from "./defenseGroups";
import { buildHealGroups, GEAR_GROUPS } from "./healGroups";
import type { RowGroup } from "./statRows";

type Props = {
  equipment: UserEquipment[];
  seals: UserSeal[];
  level: number;
  buffs: SelectedBuffs;
  skillBuild: RoleSkillBuild;
  viewer: ProfileStats | null;
};

type StatsTab = {
  value: string;
  label: string;
  groups: RowGroup[];
  withHeaders: boolean;
};

export function DetailedStatsPanel({
  equipment,
  seals,
  level,
  buffs,
  skillBuild,
  viewer,
}: Props) {
  const { totals: bonus, flat } = computeCharacterBonuses(
    equipment,
    seals,
    buffs,
    skillBuild,
  );
  const stats = computeDerivedStats(bonus, level);
  const tabs = buildStatsTabs(stats);
  const viewerTabs = viewer && buildStatsTabs(viewer.stats);

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
          {tabs.map((tab, index) => (
            <TabsContent key={tab.value} value={tab.value}>
              <GroupedRows
                groups={tab.groups}
                withHeaders={tab.withHeaders}
                bonuses={flat}
                viewerGroups={viewerTabs?.[index].groups ?? null}
                viewerBonuses={viewer?.flat ?? null}
              />
            </TabsContent>
          ))}
        </div>
      </Tabs>
    </div>
  );
}

function buildStatsTabs(stats: DerivedStats): StatsTab[] {
  return [
    {
      value: "offense",
      label: "Атака",
      groups: buildOffenseGroups(stats),
      withHeaders: false,
    },
    {
      value: "defense",
      label: "Защита",
      groups: buildDefenseGroups(stats),
      withHeaders: false,
    },
    {
      value: "heal",
      label: "Исцеление",
      groups: buildHealGroups(stats),
      withHeaders: true,
    },
    { value: "gear", label: "Прочее", groups: GEAR_GROUPS, withHeaders: true },
  ];
}
