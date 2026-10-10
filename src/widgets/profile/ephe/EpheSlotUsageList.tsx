import { Check, X } from "lucide-react";
import EpheBonusNote from "./EpheBonusNote";
import type { EpheSlotUsage } from "./epheSlotUsage";

type Props = {
  usage: EpheSlotUsage[];
};

const INACTIVE_REASONS = {
  "two-handed": "двуручное оружие занимает обе руки, печать не учитывается",
  empty: "слот пуст, печать не учитывается",
};

export default function EpheSlotUsageList({ usage }: Props) {
  return (
    <ul className="mb-3 flex flex-col gap-1 rounded-md border px-3 py-2 text-sm">
      {usage.map((entry) => (
        <li key={entry.role.roleSlot} className="flex items-start gap-2">
          <UsageEntry entry={entry} />
        </li>
      ))}
    </ul>
  );
}

function UsageEntry({ entry }: { entry: EpheSlotUsage }) {
  if (entry.status === "active") {
    return (
      <>
        <Check
          className="mt-0.5 size-3.5 shrink-0 text-green-400"
          strokeWidth={3}
        />
        <span>
          <span className="font-medium">{entry.role.label}:</span>{" "}
          {entry.item.item_name}
          <EpheBonusNote eq={entry.item} />
        </span>
      </>
    );
  }
  return (
    <>
      <X className="mt-0.5 size-3.5 shrink-0 text-muted-foreground" />
      <span className="text-muted-foreground">
        <span className="font-medium">{entry.role.label}:</span>{" "}
        {INACTIVE_REASONS[entry.status]}
      </span>
    </>
  );
}
