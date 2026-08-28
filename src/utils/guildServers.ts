export const GUILD_SERVERS = [
  "Луций",
  "Корвус",
  "Фанем",
  "Шаеда",
  "Ифнир",
  "Ксанатос",
  "Тарон",
] as const;

export type GuildServer = (typeof GUILD_SERVERS)[number];
