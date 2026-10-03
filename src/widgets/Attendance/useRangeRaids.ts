"use client";

import { useEffect, useState } from "react";
import { getRaidsInRange, type RangeRaid } from "@/actions/getRaidsInRange";
import { useVisiblePolling } from "@/hooks/useVisiblePolling";
import type { DateRange } from "./attendanceModel";

const POLL_INTERVAL_MS = 30_000;

type Loaded = { key: string; raids: RangeRaid[] };

export function useRangeRaids(
  requestKey: string,
  range: DateRange,
  initial: Loaded,
) {
  const [loaded, setLoaded] = useState(initial);
  const isLoaded = loaded.key === requestKey;

  useEffect(() => {
    if (isLoaded) return;
    let cancelled = false;
    getRaidsInRange(range.from, range.to).then((raids) => {
      if (!cancelled) setLoaded({ key: requestKey, raids });
    });
    return () => {
      cancelled = true;
    };
  }, [requestKey, range.from, range.to, isLoaded]);

  const refresh = () =>
    getRaidsInRange(range.from, range.to).then((raids) =>
      setLoaded({ key: requestKey, raids }),
    );

  useVisiblePolling(refresh, POLL_INTERVAL_MS);

  return { raids: isLoaded ? loaded.raids : [], isLoaded, refresh };
}
