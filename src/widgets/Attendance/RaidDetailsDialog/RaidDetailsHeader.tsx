import type { RaidDetails } from "@/actions/getRaidById";
import { cn } from "@/shared/lib/tw-merge";
import { DialogDescription, DialogTitle } from "@/shared/ui";
import { formatDay } from "../attendanceModel";
import { RAID_TEXT, raidColorStyle, raidKind, raidTitle } from "../raidKinds";

type Props = {
  raid: RaidDetails;
};

export default function RaidDetailsHeader({ raid }: Props) {
  const type = raid.type ?? "";
  const summary = {
    type,
    bosses: raid.raid_boss.map((row) => row.boss.boss_name),
  };
  const title = raidTitle(summary);
  const kindLabel = raidKind(summary) === "prime" ? "Прайм" : type;

  return (
    <div className="flex flex-col gap-0.5 px-5 pt-5 pb-3 pr-12">
      <div className="flex flex-wrap items-center gap-2">
        <DialogTitle
          style={raidColorStyle(summary)}
          className={cn("text-2xl leading-tight font-extrabold", RAID_TEXT)}
        >
          {title}
        </DialogTitle>
        {kindLabel !== title && (
          <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-semibold text-muted-foreground">
            {kindLabel}
          </span>
        )}
      </div>
      <DialogDescription className="text-sm text-foreground/70">
        {raidDateLabel(raid.start_date)}
      </DialogDescription>
    </div>
  );
}

function raidDateLabel(startDate: string | null) {
  if (!startDate) return "";
  const dateKey = startDate.slice(0, 10);
  const weekday = formatDay(dateKey, { weekday: "long" });
  const day = formatDay(dateKey, { day: "numeric", month: "long" });
  return `${weekday.charAt(0).toUpperCase()}${weekday.slice(1)}, ${day} · ${startDate.slice(11, 16)} МСК`;
}
