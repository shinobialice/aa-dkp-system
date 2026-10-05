export const LIVE_TOPICS = [
  "respawn",
  "maintenance",
  "raidSuggestions",
  "raids",
  "loot",
  "finance",
  "members",
] as const;

export type LiveTopic = (typeof LIVE_TOPICS)[number];
