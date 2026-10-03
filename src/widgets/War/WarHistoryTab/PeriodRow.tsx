import Image from "next/image";
import { ChevronRight } from "lucide-react";
import {
  MODE_ICON,
  MODE_LABEL,
  type GuildMode,
} from "@/shared/config/guildStatus";
import { cn } from "@/shared/lib/tw-merge";
import { periodTone } from "../periodStyles";

type Props = {
  mode: GuildMode;
  live: boolean;
  where: string;
  dates: string;
  duration: string | null;
  onClick: () => void;
};

export default function PeriodRow({
  mode,
  live,
  where,
  dates,
  duration,
  onClick,
}: Props) {
  const tone = periodTone(mode, live);

  return (
    <button
      type="button"
      onClick={onClick}
      className="grid w-full cursor-pointer grid-cols-[40px_minmax(0,1fr)_auto] items-center gap-3 rounded-xl border bg-card p-3 text-left transition-colors hover:bg-accent/50 sm:grid-cols-[52px_minmax(0,1fr)_auto_20px] sm:gap-4 sm:px-4.5 sm:py-4"
    >
      <Image
        src={MODE_ICON[mode]}
        alt=""
        width={52}
        height={52}
        className="size-10 object-contain sm:size-13"
      />
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-bold sm:text-base">{MODE_LABEL[mode]}</span>
          <span
            className={cn(
              "inline-flex h-5.5 items-center gap-1.5 rounded-full border-0 px-2 text-xs font-semibold",
              tone.chip,
            )}
          >
            <span className={cn("size-1.5 rounded-full", tone.dot)} />
            {statusLabel(mode, live)}
          </span>
        </div>
        <p className="mt-0.5 truncate text-sm text-muted-foreground">{where}</p>
        <p className="mt-0.5 text-xs text-muted-foreground tabular-nums">
          {dates}
        </p>
      </div>
      <div className="flex flex-col items-end">
        <span className="font-bold tabular-nums sm:text-base">
          {duration ?? "—"}
        </span>
        <span className="text-xs text-muted-foreground">длительность</span>
      </div>
      <ChevronRight className="hidden size-4.5 text-muted-foreground sm:block" />
    </button>
  );
}

function statusLabel(mode: GuildMode, live: boolean) {
  if (live) return "Сейчас";
  return mode === "pvp" ? "Завершён" : "Завершена";
}
