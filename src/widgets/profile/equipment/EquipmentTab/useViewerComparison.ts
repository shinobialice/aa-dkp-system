import { useState } from "react";
import { getComparisonProfile } from "@/actions/getComparisonProfile";
import type { UserEquipment } from "@/actions/getUserEquipment";
import { useAsyncData } from "@/hooks/useAsyncData";
import type { SelectedBuffs } from "../characterBuffs";
import { computeProfileStats, type ProfileStats } from "../statComparison";

export type ViewerComparison = {
  equipment: UserEquipment[] | null;
  stats: ProfileStats | null;
  canCompare: boolean;
  isComparing: boolean;
  setComparing: (isComparing: boolean) => void;
};

export function useViewerComparison(
  ownerId: number,
  guildBuffs: SelectedBuffs,
): ViewerComparison {
  const [isComparing, setComparing] = useState(false);
  const profile =
    useAsyncData(`compare-${ownerId}`, () => getComparisonProfile(ownerId))
      .data ?? null;
  const toggle = { canCompare: profile !== null, isComparing, setComparing };
  if (!profile || !isComparing) {
    return { equipment: null, stats: null, ...toggle };
  }
  return {
    equipment: profile.equipment,
    stats: computeProfileStats(profile, guildBuffs),
    ...toggle,
  };
}
