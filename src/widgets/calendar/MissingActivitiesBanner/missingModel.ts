import type { MissingSlot } from "@/actions/getMissingActivities";
import { getMoscowYearMonth } from "@/utils/getMoscowISOString";

export const KNOWN_BOSS_NAMES = [
  "Кракен",
  "Ксанатос",
  "Левиафан",
  "Калидис",
  "Анталлон",
  "Корвус",
  "АГЛ",
  "Кошка",
  "Морф",
  "Марли Прок",
];

export function currentMoscowMonth() {
  return getMoscowYearMonth(new Date());
}

export function slotKey(slot: MissingSlot) {
  return `${slot.rawDate}|${slot.time}|${slot.bossName}`;
}

export function groupSlotsByDate(slots: MissingSlot[]) {
  const byDate = new Map<string, MissingSlot[]>();
  for (const slot of slots) {
    byDate.set(slot.date, [...(byDate.get(slot.date) ?? []), slot]);
  }
  return [...byDate.entries()];
}
