import type { RaidRow, ScannerRecordRow, UserRow } from "@/shared/lib/dbTypes";
import type { RecordKind } from "@/server/scanner/record";
import type { KillCount, KillCountExclusion } from "@/widgets/killcount/types";

export type ArenaFighter = KillCount & { startAt: string | null };

export type ArenaWindow = {
  startedAt: string;
  endedAt: string;
  scannedBy: string;
};

export type ArenaRaid = {
  id: number;
  time: string;
  boss: string;
  people: number;
  isLinked: boolean;
};

export type ArenaKillcount = {
  kind: RecordKind;
  key: string;
  day: string;
  window: ArenaWindow | null;
  fighters: ArenaFighter[];
  raids: ArenaRaid[];
  canEditRows: boolean;
};

export type PrimeDay = {
  day: string;
  totalKills: number;
  fighters: number;
  topUserName: string | null;
  topKills: number | null;
  window: ArenaWindow | null;
};

export type AglRecordSummary = {
  id: number;
  totalKills: number;
  fighters: number;
  window: ArenaWindow;
};

export type AglItem = {
  key: string;
  day: string;
  time: string;
  boss: string;
  people: number;
  record: AglRecordSummary | null;
};

export type PendingRecord = {
  id: number;
  kind: RecordKind;
  day: string;
  window: ArenaWindow;
  inRaid: number;
  fighters: ArenaFighter[];
  excluded: KillCountExclusion[];
  warnings: string[];
  blockedReason: string | null;
};

export type RaidQueryRow = Pick<RaidRow, "id"> & {
  startDate: string;
  time: string;
  boss: string;
  people: number;
};

export type RecordQueryRow = Pick<
  ScannerRecordRow,
  "id" | "kind" | "started_at" | "ended_at" | "raid" | "killcount"
> &
  Pick<UserRow, "username">;
