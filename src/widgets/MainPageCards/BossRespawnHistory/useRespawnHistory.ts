"use client";

import { getBossRespawnHistoryPage } from "@/actions/getBossRespawnHistoryPage";
import { useAsyncData } from "@/hooks/useAsyncData";
import { useLiveChanges } from "@/hooks/useLiveChanges";

export function useRespawnHistory(
  page: number,
  pageSize: number,
  enabled = true,
) {
  const { data, reload } = useAsyncData(
    enabled ? `${page}:${pageSize}` : null,
    () => getBossRespawnHistoryPage(page, pageSize),
  );
  useLiveChanges(["respawn"], reload);

  return {
    rows: data?.rows ?? [],
    total: data?.total ?? 0,
    loading: data === undefined,
  };
}
