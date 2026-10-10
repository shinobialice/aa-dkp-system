import { plural } from "@/shared/lib/format";

export function bellLabel(count: number) {
  if (count === 0) return "Уведомления";
  return `Уведомления: ${count} ${plural(count, "новое", "новых", "новых")}`;
}
