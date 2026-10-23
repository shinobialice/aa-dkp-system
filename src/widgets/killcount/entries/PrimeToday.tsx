import type { KillcountEntry } from "@/server/killcountEntries/types";
import { AddKillCount } from "../add-kill-count";
import { KillcountDay } from "../ui/KillcountDay";
import PrimeScanInfo from "./PrimeScanInfo";

type Props = {
  entry: KillcountEntry;
  canEdit: boolean;
};

export default function PrimeToday({ entry, canEdit }: Props) {
  if (entry.fighters.length === 0) return <AddKillCount isCanEdit={canEdit} />;
  return (
    <>
      <PrimeScanInfo entry={entry} />
      <KillcountDay
        data={entry.fighters}
        mode="saved"
        canAddToday
        isCanEdit={canEdit}
      />
    </>
  );
}
