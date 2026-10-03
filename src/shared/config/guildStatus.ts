import { GUILD_SERVERS, type GuildServer } from "@/utils/guildServers";

export type GuildMode = "freeshard" | "pvp";
export type GuildFaction = "nuian" | "hariharan";

export const DEFAULT_MODE: GuildMode = "freeshard";
export const DEFAULT_SERVER: GuildServer = "Луций";
export const DEFAULT_FACTION: GuildFaction = "nuian";

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

export function toGuildMode(value: string | null | undefined): GuildMode {
  return value === "pvp" || value === "freeshard" ? value : DEFAULT_MODE;
}

export function toGuildFaction(value: string | null | undefined): GuildFaction {
  return value === "nuian" || value === "hariharan" ? value : DEFAULT_FACTION;
}

export function toGuildServer(value: string | null | undefined): GuildServer {
  return GUILD_SERVERS.find((server) => server === value) ?? DEFAULT_SERVER;
}
