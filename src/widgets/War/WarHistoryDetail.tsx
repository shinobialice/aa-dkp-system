"use client";

import { ArrowLeft, Loader2 } from "lucide-react";
import type { WarPeriodHistoryRow } from "@/actions/warPeriodHistory";
import { getWarPeriodSnapshot } from "@/actions/warPeriodSnapshot";
import { useAsyncData } from "@/hooks/useAsyncData";
import { Button } from "@/shared/ui";
import { periodOpponents } from "./opponentsModel";
import WarDashboard from "./WarDashboard";
import WarHeader from "./WarHeader";
import WarOpponentsCard from "./WarOpponentsCard";

type Props = {
  period: WarPeriodHistoryRow;
  onBack: () => void;
};

export default function WarHistoryDetail({ period, onBack }: Props) {
  const { mode, startedAt, endedAt } = period;
  const { data: snapshot } = useAsyncData(`period-${period.id}`, () =>
    getWarPeriodSnapshot(startedAt, endedAt, mode),
  );

  return (
    <div className="flex flex-col gap-4">
      <Button
        variant="ghost"
        size="sm"
        onClick={onBack}
        className="-ml-2 cursor-pointer self-start"
      >
        <ArrowLeft />
        История
      </Button>

      <div className="rounded-xl border bg-muted/30 p-4">
        <WarHeader
          compact
          mode={mode}
          server={period.server}
          faction={period.faction}
          startedAt={startedAt}
          endedAt={endedAt}
        />
      </div>

      {mode === "pvp" && (
        <WarOpponentsCard
          opponents={periodOpponents(period)}
          emptyText="Противник не был указан"
        />
      )}

      {snapshot && (
        <WarDashboard
          mode={mode}
          startedAt={startedAt}
          asOf={endedAt}
          snapshot={snapshot}
        />
      )}
      {!snapshot && (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="size-8 animate-spin text-muted-foreground" />
        </div>
      )}
    </div>
  );
}
