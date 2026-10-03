import type { RespawnHistoryEntry } from "@/actions/getBossRespawnHistoryPage";
import { formatMoscowShort } from "../mainPageTime";

export function actionText(row: RespawnHistoryEntry, now: Date) {
  const kill = formatMoscowShort(new Date(row.kill_time), now);
  if (row.action === "Убит сейчас") return `убит в ${kill}`;
  return `${row.action.toLowerCase()}: ${kill}`;
}

export function respawnHint(row: RespawnHistoryEntry, now: Date) {
  const parts = [
    row.next_respawn &&
      `Следующий респаун ${formatMoscowShort(new Date(row.next_respawn), now)}`,
    row.prev_kill_time &&
      `до этого ${formatMoscowShort(new Date(row.prev_kill_time), now)}`,
  ];
  return parts.filter(Boolean).join(" · ");
}

export function authorName(row: RespawnHistoryEntry) {
  return row.username ?? "?";
}
