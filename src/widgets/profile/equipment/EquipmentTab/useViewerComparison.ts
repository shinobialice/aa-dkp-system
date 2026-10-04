import { getComparisonProfile } from "@/actions/getComparisonProfile";
import type { UserEquipment } from "@/actions/getUserEquipment";
import { useAsyncData } from "@/hooks/useAsyncData";
import type { SelectedBuffs } from "../characterBuffs";
import { computeProfileStats, type ProfileStats } from "../statComparison";

export type ViewerComparison = {
  equipment: UserEquipment[] | null;
  stats: ProfileStats | null;
};

export function useViewerComparison(
  ownerId: number,
  guildBuffs: SelectedBuffs,
): ViewerComparison {
  const profile =
    useAsyncData(`compare-${ownerId}`, () => getComparisonProfile(ownerId))
      .data ?? null;
  if (!profile) return { equipment: null, stats: null };
  return {
    equipment: profile.equipment,
    stats: computeProfileStats(profile, guildBuffs),
  };
}
