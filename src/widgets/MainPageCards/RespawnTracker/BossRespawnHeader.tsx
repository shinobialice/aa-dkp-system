import Image from "next/image";
import { bossImages } from "@/shared/config/bossImages";
import { respawnWindow, type BossName } from "@/shared/config/bossRespawn";
import { cn } from "@/shared/lib/tw-merge";

type Props = {
  boss: BossName;
  respawnHours: number;
  style: { label: string; chip: string; dot: string };
};

export default function BossRespawnHeader({
  boss,
  respawnHours,
  style,
}: Props) {
  const image = bossImages[boss];

  return (
    <div className="flex items-center gap-3">
      {image && (
        <Image
          src={image}
          alt={boss}
          width={56}
          height={56}
          className="size-14 shrink-0 rounded-lg object-cover"
        />
      )}
      <div className="min-w-0 flex-1">
        <p className="text-lg leading-tight font-bold">{boss}</p>
        <p className="text-xs text-muted-foreground">
          Респаун {respawnHours} ч + окно {respawnWindow} ч
        </p>
      </div>
      <span
        className={cn(
          "inline-flex h-6 shrink-0 items-center gap-1.5 rounded-full px-2.5 text-xs font-semibold whitespace-nowrap",
          style.chip,
        )}
      >
        <span className={cn("size-[7px] rounded-full", style.dot)} />
        {style.label}
      </span>
    </div>
  );
}
