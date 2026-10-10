import { plural } from "@/shared/lib/format";

export const REJECT_REASON_MAX = 300;

export function bellLabel(count: number) {
  if (count === 0) return "Уведомления";
  return `Уведомления: ${count} ${plural(count, "новое", "новых", "новых")}`;
}
