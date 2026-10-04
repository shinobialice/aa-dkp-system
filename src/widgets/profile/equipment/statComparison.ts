import type { ComparisonProfile } from "@/actions/getComparisonProfile";
import type { SelectedBuffs } from "./characterBuffs";
import {
  computeCharacterBonuses,
  computeDerivedStats,
  type DerivedStats,
} from "./characterStats";
import type { StatBonuses } from "./itemsData/statEffects";

export type ProfileStats = {
  flat: StatBonuses;
  stats: DerivedStats;
};

const LOWER_IS_BETTER_PREFIXES = [
  "Время применения умений",
  "Уязвимость",
  "Получаемый урон",
  "Задержка применения умений",
];

export function computeProfileStats(
  profile: ComparisonProfile,
  guildBuffs: SelectedBuffs,
): ProfileStats {
  const { totals, flat } = computeCharacterBonuses(
    profile.equipment,
    profile.seals,
    { ...profile.buffs, ...guildBuffs },
    profile.skillBuild,
  );
  return { flat, stats: computeDerivedStats(totals, profile.level) };
}

export function statDiff(
  viewer: number,
  owner: number,
  decimals: number,
): number {
  const factor = 10 ** decimals;
  return Math.round((viewer - owner) * factor) / factor;
}

export function isLowerBetter(label: string): boolean {
  return LOWER_IS_BETTER_PREFIXES.some((prefix) => label.startsWith(prefix));
}
