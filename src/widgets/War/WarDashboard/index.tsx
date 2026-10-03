import type { WarPeriodSnapshot } from "@/actions/warPeriodSnapshot";
import type { GuildMode } from "@/shared/config/guildStatus";
import FreeshardDashboard from "./FreeshardDashboard";
import PvpDashboard from "./PvpDashboard";

type Props = {
  mode: GuildMode;
  startedAt: string | null;
  asOf: string;
  snapshot: WarPeriodSnapshot;
};

export default function WarDashboard({
  mode,
  startedAt,
  asOf,
  snapshot,
}: Props) {
  const endMs = new Date(asOf).getTime();
  if (mode === "pvp") {
    return (
      <PvpDashboard startedAt={startedAt} endMs={endMs} snapshot={snapshot} />
    );
  }
  return (
    <FreeshardDashboard
      startedAt={startedAt}
      endMs={endMs}
      snapshot={snapshot}
    />
  );
}
