export const LIVE_TOPICS = [
  "respawn",
  "maintenance",
  "raidSuggestions",
  "raids",
  "loot",
  "lootRequests",
  "notifications",
  "finance",
  "members",
] as const;

export type LiveTopic = (typeof LIVE_TOPICS)[number];
