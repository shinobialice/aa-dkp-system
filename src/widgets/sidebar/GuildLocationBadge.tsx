import Image from "next/image";
import Link from "next/link";
import { getGuildStatus } from "@/actions/guildStatusSettings";
import {
  FACTION_LABEL,
  FACTION_ICON,
  MODE_LABEL,
  MODE_ICON,
} from "@/shared/config/guildStatus";

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

  // Ведёт на "/war" — карточка со статусом сервера дублирует пункт меню
  // "Вар" (см. sidebar/index.tsx), чтобы не занимать место в меню лишним
  // пунктом.
  if (variant === "compact") {
    return (
      <Link
        href="/war"
        className={`flex items-center gap-2 rounded-full border border-border bg-muted/50 py-1 pr-3 pl-1 transition hover:bg-muted ${className ?? ""}`}
        title={`${server} · ${factionLabel} · ${modeLabel}`}
      >
        <Image src={icon} alt={factionLabel} width={26} height={26} />
        <span className="text-sm font-medium">{server}</span>
        <Image src={modeIcon} alt={modeLabel} width={18} height={18} />
      </Link>
    );
  }

  return (
    <Link
      href="/war"
      className={`flex items-center gap-2.5 rounded-lg border border-border bg-muted/50 px-2.5 py-1.5 transition hover:bg-muted ${className ?? ""}`}
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
    </Link>
  );
}
