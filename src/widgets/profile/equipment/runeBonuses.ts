import type { UserEquipment } from "@/actions/getUserEquipment";
import { findRune } from "./itemsData/runes";
import { addStat, type StatBonuses } from "./itemsData/statEffects";

const RUNE_EFFECT_SEPARATOR = /\n| \/ /;
const RUNE_STAT_LINE = /^(.+?):\s*([+\-−]?\d+(?:[.,]\d+)?)\s*(?:%|ед\.)?$/;

// Учитываются только постоянные статы вида «Сила атаки: +10 ед.»; эффекты,
// которые копятся по ходу боя («каждый раз, когда вас атакуют…»), — нет.
export function computeRuneBonuses(equipment: UserEquipment[]): StatBonuses {
  const bonuses: StatBonuses = new Map();
  for (const eq of equipment) {
    const effect = eq.rune_id ? findRune(eq.rune_id)?.effect : undefined;
    for (const part of effect?.split(RUNE_EFFECT_SEPARATOR) ?? []) {
      const match = part.trim().match(RUNE_STAT_LINE);
      if (match) addStat(bonuses, match[1], parseRuneNumber(match[2]));
    }
  }
  return bonuses;
}

function parseRuneNumber(text: string): number {
  return Number(text.replace("−", "-").replace(",", "."));
}
