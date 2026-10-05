"use client";

import { useEffect, useState } from "react";
import { getRaidsInRange, type RangeRaid } from "@/actions/getRaidsInRange";
import { useLiveChanges } from "@/hooks/useLiveChanges";
import type { DateRange } from "./attendanceModel";

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

  useLiveChanges(["raids"], refresh);

  return { raids: isLoaded ? loaded.raids : [], isLoaded, refresh };
}
