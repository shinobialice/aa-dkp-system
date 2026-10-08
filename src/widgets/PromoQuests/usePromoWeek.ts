"use client";

import { useState } from "react";
import { toast } from "sonner";
import { getPromoWeek, setPromoQuestDone } from "@/actions/promoQuestActions";
import { useAsyncData } from "@/hooks/useAsyncData";
import { errorMessage } from "@/shared/lib/errorMessage";
import { doneKey, withOverrides } from "./promoQuestsModel";

export type PromoWeekState = ReturnType<typeof usePromoWeek>;

export function usePromoWeek(weekStart: string) {
  const week = useAsyncData(weekStart, () => getPromoWeek(weekStart));
  const [overrides, setOverrides] = useState<Record<string, boolean>>({});
  const [savingKeys, setSavingKeys] = useState<string[]>([]);

  const toggleDay = async (
    characterId: number,
    questId: number,
    dayIndex: number,
    isDone: boolean,
  ) => {
    const key = `${weekStart}:${doneKey(characterId, questId, dayIndex)}`;
    if (savingKeys.includes(key)) return;
    setOverrides((current) => ({ ...current, [key]: isDone }));
    setSavingKeys((current) => [...current, key]);
    try {
      await setPromoQuestDone(
        characterId,
        weekStart,
        questId,
        dayIndex,
        isDone,
      );
    } catch (error) {
      setOverrides((current) => ({ ...current, [key]: !isDone }));
      toast.error(errorMessage(error, "Не удалось сохранить отметку"));
    } finally {
      setSavingKeys((current) => current.filter((saving) => saving !== key));
    }
  };

  return {
    characters: week.data?.characters ?? [],
    marks: withOverrides(week.data?.doneKeys ?? [], overrides, weekStart),
    isLoading: week.isLoading,
    error: week.error,
    reload: week.reload,
    toggleDay,
  };
}
