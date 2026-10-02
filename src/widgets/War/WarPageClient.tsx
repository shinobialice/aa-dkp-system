"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui";
import type {
  GuildPvpStats,
  GuildStatus,
  WarOpponentsState,
} from "@/actions/guildStatusSettings";
import type {
  PeriodAttendanceResult,
  PeriodMembershipChanges,
  WarEconomySnapshot,
} from "@/actions/warActions";
import WarHeader from "./WarHeader";
import WarDashboard from "./WarDashboard";
import WarHistoryTab from "./WarHistoryTab";
import { WarOpponentsLive } from "./WarOpponentsCard";

export default function WarPageClient({
  isAdmin,
  asOf,
  initialStatus,
  initialWarOpponents,
  initialAttendance,
  initialMembership,
  initialEconomy,
  guildPvpStats,
}: {
  isAdmin: boolean;
  asOf: string;
  initialStatus: GuildStatus;
  initialWarOpponents: WarOpponentsState;
  initialAttendance: PeriodAttendanceResult;
  initialMembership: PeriodMembershipChanges;
  initialEconomy: WarEconomySnapshot | null;
  guildPvpStats: GuildPvpStats | null;
}) {
  const [tab, setTab] = useState("now");
  const { mode, server, faction, startedAt } = initialStatus;
  const currentOpponents = [
    initialWarOpponents.primary.endedAt
      ? null
      : initialWarOpponents.primary.name,
    ...initialWarOpponents.opponents
      .filter((opponent) => !opponent.endedAt)
      .map((opponent) => opponent.name),
  ].filter((name): name is string => !!name);

  return (
    <Tabs
      value={tab}
      onValueChange={setTab}
      className="mx-auto w-full max-w-6xl min-w-0 gap-5"
    >
      <WarHeader
        mode={mode}
        server={server}
        faction={faction}
        startedAt={startedAt}
        aside={
          <TabsList className="h-10 w-full sm:w-auto">
            <TabsTrigger value="now" className="cursor-pointer px-4">
              Сейчас
            </TabsTrigger>
            <TabsTrigger value="history" className="cursor-pointer px-4">
              История
            </TabsTrigger>
          </TabsList>
        }
      />

      <TabsContent value="now" className="flex flex-col gap-4">
        {mode === "pvp" && (
          <WarOpponentsLive
            initialState={initialWarOpponents}
            warStartedAt={startedAt}
            isAdmin={isAdmin}
          />
        )}
        <WarDashboard
          mode={mode}
          startedAt={startedAt}
          asOf={asOf}
          attendance={initialAttendance}
          membership={initialMembership}
          pvpStats={guildPvpStats}
          economy={initialEconomy}
        />
      </TabsContent>

      <TabsContent value="history">
        <WarHistoryTab
          current={initialStatus}
          currentOpponents={currentOpponents}
          onOpenCurrent={() => setTab("now")}
        />
      </TabsContent>
    </Tabs>
  );
}
