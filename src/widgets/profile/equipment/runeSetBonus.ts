import type { UserEquipment } from "@/actions/getUserEquipment";
import { findEphenRuneSet } from "./itemsData/ephenRuneSets";

export type EphenRuneSetTierStatus = {
  count: number;
  text: string;
  active: boolean;
};

export type ActiveEphenRuneSet = {
  runeId: number;
  name: string;
  count: number;
  tiers: EphenRuneSetTierStatus[];
};

function countRuneId(equipment: UserEquipment[], runeId: number): number {
  return equipment.filter((eq) => eq.rune_id === runeId).length;
}

export function getEphenRuneSetForRune(
  runeId: number,
  equipment: UserEquipment[],
): ActiveEphenRuneSet | null {
  const set = findEphenRuneSet(runeId);
  if (!set) return null;
  const count = countRuneId(equipment, runeId);
  return {
    runeId,
    name: set.name,
    count,
    tiers: set.tiers.map((t) => ({ ...t, active: count >= t.count })),
  };
}

export function computeEphenRuneSetBonuses(
  equipment: UserEquipment[],
): Map<string, number> {
  const totals = new Map<string, number>();
  const seenRuneIds = new Set<number>();

  for (const eq of equipment) {
    if (!eq.rune_id || seenRuneIds.has(eq.rune_id)) continue;
    seenRuneIds.add(eq.rune_id);

    const active = getEphenRuneSetForRune(eq.rune_id, equipment);
    if (!active) continue;

    for (const tier of active.tiers) {
      if (!tier.active) continue;
      for (const [label, value] of parseTierBonuses(tier.text)) {
        totals.set(label, (totals.get(label) ?? 0) + value);
      }
    }
  }

  return totals;
}

function parseTierBonuses(text: string): [string, number][] {
  return text.split("\n").flatMap((line) => {
    const match = line.match(/^(.+?):\s*([+-]?\d+(?:\.\d+)?)\s*(?:%|ед\.)?$/);
    if (!match) return [];
    return [[match[1].trim(), Number(match[2])] as [string, number]];
  });
}
