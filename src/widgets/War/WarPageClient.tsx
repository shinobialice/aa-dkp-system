"use client";

import { useState } from "react";
import { Pencil } from "lucide-react";
import type { GuildStatus } from "@/actions/guildStatusSettings";
import {
  saveWarOpponents,
  type WarOpponentDraft,
  type WarOpponentsState,
} from "@/actions/warOpponents";
import type { WarPeriodSnapshot } from "@/actions/warPeriodSnapshot";
import SkewTabs from "@/widgets/arena/SkewTabs";
import { activeOpponentNames, liveOpponents } from "./opponentsModel";
import WarBanner from "./WarBanner";
import WarDashboard from "./WarDashboard";
import WarHistoryTab from "./WarHistoryTab";
import WarOpponentsDialog from "./WarOpponentsDialog";

type WarTab = "now" | "history";

const TAB_OPTIONS: { value: WarTab; label: string }[] = [
  { value: "now", label: "Сейчас" },
  { value: "history", label: "История" },
];

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
  const [tab, setTab] = useState<WarTab>("now");
  const [opponentsState, setOpponentsState] = useState(initialWarOpponents);
  const { mode, server, faction, startedAt } = initialStatus;
  const isPvp = mode === "pvp";

  const handleSaveOpponents = async (
    primary: { name: string | null; ended: boolean },
    drafts: WarOpponentDraft[],
  ) => {
    setOpponentsState(await saveWarOpponents(primary, drafts));
  };

  const editOpponents = isAdmin && isPvp && (
    <WarOpponentsDialog
      state={opponentsState}
      warStartedAt={startedAt}
      onSave={handleSaveOpponents}
      trigger={
        <button
          type="button"
          className="arena-skew inline-flex h-7 cursor-pointer items-center gap-1.5 bg-white/10 px-3 text-xs font-semibold text-white/85 transition-colors hover:bg-white/20"
        >
          <Pencil className="size-3.5" />
          Противники
        </button>
      }
    />
  );

  return (
    <div className="mx-auto flex w-full max-w-6xl min-w-0 flex-col gap-5">
      <WarBanner
        mode={mode}
        server={server}
        faction={faction}
        startedAt={startedAt}
        endedAt={null}
        opponents={isPvp ? liveOpponents(opponentsState, startedAt) : []}
        action={editOpponents}
        tabs={
          <SkewTabs
            tone="banner"
            options={TAB_OPTIONS}
            value={tab}
            onChange={setTab}
            label="Раздел страницы вара"
          />
        }
      />

      {tab === "now" && (
        <WarDashboard
          mode={mode}
          startedAt={startedAt}
          asOf={asOf}
          snapshot={snapshot}
        />
      )}
      {tab === "history" && (
        <WarHistoryTab
          current={initialStatus}
          currentOpponents={activeOpponentNames(opponentsState)}
          onOpenCurrent={() => setTab("now")}
        />
      )}
    </div>
  );
}
