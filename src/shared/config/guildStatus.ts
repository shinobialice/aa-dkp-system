import type { GuildFaction, GuildMode } from "@/actions/guildStatusSettings";

export const MODE_LABEL: Record<GuildMode, string> = {
  freeshard: "Фришка",
  pvp: "ПВП",
};

export const MODE_ICON: Record<GuildMode, string> = {
  freeshard: "/images/nation/friendship.png",
  pvp: "/images/nation/hostile.png",
};

export const FACTION_LABEL: Record<GuildFaction, string> = {
  nuian: "Запад",
  hariharan: "Восток",
};

export const FACTION_ICON: Record<GuildFaction, string> = {
  nuian: "/images/server/west.png",
  hariharan: "/images/server/east.png",
};
