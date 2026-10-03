import { cn } from "@/shared/lib/tw-merge";
import { STATUS_STYLES } from "../GiveawayStatusIcon";
import { STATUS_OPTIONS, type GiveawayStatus } from "../giveawayModel";

const SEGMENT_ACTIVE: Record<GiveawayStatus, string> = {
  "": "bg-muted",
  Хочет: STATUS_STYLES["Хочет"].badge,
  "В наличии": STATUS_STYLES["В наличии"].badge,
  Выдано: STATUS_STYLES["Выдано"].badge,
};

export default function StatusSegments({
  value,
  onChange,
}: {
  value: GiveawayStatus;
  onChange: (status: GiveawayStatus) => void;
}) {
  const options: [GiveawayStatus, string][] = [
    ["", "–"],
    ...STATUS_OPTIONS.map((s): [GiveawayStatus, string] => [s, s]),
  ];
  return (
    <span className="inline-flex overflow-hidden rounded-lg border">
      {options.map(([status, label]) => (
        <button
          key={label}
          type="button"
          aria-pressed={value === status}
          onClick={() => value !== status && onChange(status)}
          className={cn(
            "cursor-pointer border-l px-2 py-1 text-2xs first:border-l-0 hover:bg-muted",
            value === status && cn("font-semibold", SEGMENT_ACTIVE[status]),
          )}
        >
          {label}
        </button>
      ))}
    </span>
  );
}
