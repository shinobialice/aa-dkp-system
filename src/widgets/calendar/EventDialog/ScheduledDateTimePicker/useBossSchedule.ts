"use client";

import { useEffect, useEffectEvent } from "react";
import { useAsyncData } from "@/hooks/useAsyncData";
import { getMoscowWeekday } from "@/utils/weekday";
import {
  combineDateAndTime,
  loadBossSchedule,
  type BossSchedule,
  type ScheduleMode,
} from "./scheduleModel";

const EMPTY_SCHEDULE: BossSchedule = { times: [], takenTimes: [] };

export function useBossSchedule(
  mode: ScheduleMode,
  bossName: string | null,
  date: Date | null,
  onDateResolved: (date: Date | null) => void,
) {
  const request =
    mode !== "free" && bossName && date ? { mode, bossName, date } : null;
  const key = request
    ? `${request.mode}::${request.bossName}::${request.date.getTime()}`
    : null;

  const { data, error, isLoading } = useAsyncData(key, async () => {
    if (!request) return EMPTY_SCHEDULE;
    try {
      return await loadBossSchedule(
        request.mode,
        request.bossName,
        getMoscowWeekday(request.date),
        request.date,
      );
    } catch (loadError) {
      console.error("Не удалось загрузить расписание босса:", loadError);
      throw loadError;
    }
  });

  const resolveDate = useEffectEvent(() => {
    const lockedTime =
      request?.mode === "locked-single" ? data?.times[0] : undefined;
    onDateResolved(
      request && lockedTime
        ? combineDateAndTime(request.date, lockedTime)
        : null,
    );
  });

  useEffect(() => {
    if (key !== null && !isLoading) resolveDate();
  }, [key, isLoading]);

  return {
    key,
    isLoading,
    hasError: error !== undefined,
    schedule: data ?? EMPTY_SCHEDULE,
  };
}
