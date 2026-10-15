import type { RespawnHistoryEntry } from "@/actions/getBossRespawnHistoryPage";

export function authorName(row: RespawnHistoryEntry) {
  return row.username ?? "?";
}
