"use client";

import { useEffect, useRef, useState } from "react";

const DURATION_MS = 700;
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

export function useCountUp(target: number) {
  const [shown, setShown] = useState(0);
  const shownRef = useRef(0);

  useEffect(() => {
    const from = shownRef.current;
    const duration = window.matchMedia(REDUCED_MOTION_QUERY).matches
      ? 0
      : DURATION_MS;
    const startedAt = performance.now();
    let frame = requestAnimationFrame(function step(now) {
      const progress =
        duration === 0 ? 1 : Math.min(1, (now - startedAt) / duration);
      const eased = 1 - (1 - progress) ** 3;
      shownRef.current = Math.round(from + (target - from) * eased);
      setShown(shownRef.current);
      if (progress < 1) frame = requestAnimationFrame(step);
    });
    return () => cancelAnimationFrame(frame);
  }, [target]);

  return shown;
}
