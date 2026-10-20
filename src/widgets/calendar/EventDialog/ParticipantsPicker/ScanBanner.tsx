import type { RaidScan } from "../raidScanModel";
import { scanSummary } from "./participantsModel";

type Props = {
  scan: RaidScan | null;
};

export default function ScanBanner({ scan }: Props) {
  if (!scan) return null;

  const { title, unmatched } = scanSummary(scan);

  return (
    <p className="rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-sm text-blue-900 dark:border-blue-500/30 dark:bg-blue-500/10 dark:text-blue-200">
      <b>{title}</b>
      {unmatched && ` · нет на сайте: ${unmatched}`}
    </p>
  );
}
