"use client";

import { useState } from "react";
import type { GuildStatus } from "@/actions/guildStatusSettings";
import type { WarOpponentsState } from "@/actions/warOpponents";
import type { WarPeriodSnapshot } from "@/actions/warPeriodSnapshot";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui";
import { activeOpponentNames } from "./opponentsModel";
import WarDashboard from "./WarDashboard";
import WarHeader from "./WarHeader";
import WarHistoryTab from "./WarHistoryTab";
import WarOpponentsLive from "./WarOpponentsLive";

type Props = {
  isAdmin: boolean;
  asOf: string;
  initialStatus: GuildStatus;
  initialWarOpponents: WarOpponentsState;
  snapshot: WarPeriodSnapshot;
};

export default function WarPageClient({
  isAdmin,
  asOf,
  initialStatus,
  initialWarOpponents,
  snapshot,
}: Props) {
  const [tab, setTab] = useState("now");
  const { mode, server, faction, startedAt } = initialStatus;

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
          snapshot={snapshot}
        />
      </TabsContent>

      <TabsContent value="history">
        <WarHistoryTab
          current={initialStatus}
          currentOpponents={activeOpponentNames(initialWarOpponents)}
          onOpenCurrent={() => setTab("now")}
        />
      </TabsContent>
    </Tabs>
  );
}
