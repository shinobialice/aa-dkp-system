import Image from "next/image";
import { ChevronRight } from "lucide-react";
import {
  MODE_ICON,
  MODE_LABEL,
  type GuildMode,
} from "@/shared/config/guildStatus";
import { cn } from "@/shared/lib/tw-merge";
import SkewTag from "@/widgets/arena/SkewTag";

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
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "arena-cut arena-enter grid w-full cursor-pointer grid-cols-[44px_minmax(0,1fr)_auto] items-center gap-3 border border-l-[3px] bg-card p-3 text-left transition-[translate,background-color] hover:translate-x-1 hover:bg-accent/50 sm:grid-cols-[56px_minmax(0,1fr)_auto_20px] sm:gap-4 sm:px-5 sm:py-4",
        mode === "pvp" ? "border-l-red-500" : "border-l-green-500",
      )}
    >
      <Image
        src={MODE_ICON[mode]}
        alt=""
        width={56}
        height={56}
        className="size-11 object-contain sm:size-14"
      />
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-display text-lg tracking-wide uppercase">
            {MODE_LABEL[mode]}
          </span>
          {live && (
            <SkewTag className="bg-green-500 text-green-950">Сейчас</SkewTag>
          )}
        </div>
        <p className="mt-0.5 truncate text-sm text-muted-foreground">{where}</p>
        <p className="mt-0.5 text-xs text-muted-foreground tabular-nums">
          {dates}
        </p>
      </div>
      <div className="flex flex-col items-end">
        <span className="font-display tabular-nums sm:text-lg">
          {duration ?? "—"}
        </span>
        <span className="text-xs text-muted-foreground">длительность</span>
      </div>
      <ChevronRight className="hidden size-4.5 text-muted-foreground sm:block" />
    </button>
  );
}
