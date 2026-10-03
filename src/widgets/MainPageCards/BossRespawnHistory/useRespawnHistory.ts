"use client";

import { getBossRespawnHistoryPage } from "@/actions/getBossRespawnHistoryPage";
import { useAsyncData } from "@/hooks/useAsyncData";
import { useVisiblePolling } from "@/hooks/useVisiblePolling";

const REFRESH_MS = 20_000;

export function useRespawnHistory(
  page: number,
  pageSize: number,
  enabled = true,
) {
  const { data, reload } = useAsyncData(
    enabled ? `${page}:${pageSize}` : null,
    () => getBossRespawnHistoryPage(page, pageSize),
  );
  useVisiblePolling(reload, REFRESH_MS);

  return {
    rows: data?.rows ?? [],
    total: data?.total ?? 0,
    loading: data === undefined,
  };
}
