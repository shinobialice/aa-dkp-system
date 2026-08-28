import Image from "next/image";
import {
  getGuildStatus,
  type GuildFaction,
  type GuildMode,
} from "@/actions/guildStatusSettings";

const FACTION_LABEL: Record<GuildFaction, string> = {
  nuian: "Запад",
  hariharan: "Восток",
};

const FACTION_ICON: Record<GuildFaction, string> = {
  nuian: "/images/server/west.png",
  hariharan: "/images/server/east.png",
};

const MODE_LABEL: Record<GuildMode, string> = {
  freeshard: "Фришка",
  pvp: "ПВП",
};

const MODE_ICON: Record<GuildMode, string> = {
  freeshard: "/images/nation/friendship.png",
  pvp: "/images/nation/hostile.png",
};

export async function GuildLocationBadge({
  variant = "card",
  className,
}: {
  variant?: "card" | "compact";
  className?: string;
}) {
  const { server, faction, mode } = await getGuildStatus();
  const icon = FACTION_ICON[faction];
  const factionLabel = FACTION_LABEL[faction];
  const modeIcon = MODE_ICON[mode];
  const modeLabel = MODE_LABEL[mode];

  if (variant === "compact") {
    return (
      <div
        className={`flex items-center gap-2 rounded-full border border-border bg-muted/50 py-1 pr-3 pl-1 ${className ?? ""}`}
        title={`${server} · ${factionLabel} · ${modeLabel}`}
      >
        <Image src={icon} alt={factionLabel} width={26} height={26} />
        <span className="text-sm font-medium">{server}</span>
        <Image src={modeIcon} alt={modeLabel} width={18} height={18} />
      </div>
    );
  }

  return (
    <div
      className={`flex items-center gap-2.5 rounded-lg border border-border bg-muted/50 px-2.5 py-1.5 ${className ?? ""}`}
      title={`${server} · ${factionLabel} · ${modeLabel}`}
    >
      <Image
        src={icon}
        alt={factionLabel}
        width={30}
        height={30}
        className="shrink-0"
      />
      <div className="flex min-w-0 items-baseline gap-1.5">
        <span className="truncate text-sm font-medium">{server}</span>
        <span className="text-xs text-muted-foreground">{factionLabel}</span>
      </div>
      <Image
        src={modeIcon}
        alt={modeLabel}
        width={35}
        height={35}
        className="ml-auto shrink-0"
      />
    </div>
  );
}
