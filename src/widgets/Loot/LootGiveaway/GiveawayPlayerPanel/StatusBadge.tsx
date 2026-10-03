import { cn } from "@/shared/lib/tw-merge";
import { STATUS_STYLES } from "../GiveawayStatusIcon";
import { formatDate, type GiveawayStatus } from "../giveawayModel";

export default function StatusBadge({
  status,
  date,
}: {
  status: GiveawayStatus;
  date: string;
}) {
  if (!status) {
    return <span className="text-xs text-muted-foreground">не выдано</span>;
  }
  const shown = status === "Выдано" ? formatDate(date) : "";
  return (
    <span
      className={cn(
        "rounded-full px-2 py-0.5 text-2xs font-semibold whitespace-nowrap",
        STATUS_STYLES[status].badge,
      )}
    >
      {status}
      {shown && ` · ${shown}`}
    </span>
  );
}
