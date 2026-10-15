"use client";

import { useEffect, useState } from "react";
import { formatNumber } from "@/shared/lib/format";

const DURATION_MS = 1100;

type Props = {
  value: number;
};

export default function CountUp({ value }: Props) {
  const [shown, setShown] = useState(0);

  useEffect(() => {
    const isReduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const startedAt = performance.now();
    let frame = requestAnimationFrame(function step(time) {
      const progress = isReduced
        ? 1
        : Math.min(1, (time - startedAt) / DURATION_MS);
      setShown(value * (1 - (1 - progress) ** 3));
      if (progress < 1) frame = requestAnimationFrame(step);
    });
    return () => cancelAnimationFrame(frame);
  }, [value]);

  return formatNumber(Math.round(shown), 0);
}
