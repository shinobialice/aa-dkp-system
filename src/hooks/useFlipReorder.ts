"use client";

import { useLayoutEffect, useRef, type RefObject } from "react";

const DURATION_MS = 550;
const EASING = "cubic-bezier(0.2, 0.8, 0.2, 1)";

export function useFlipReorder(
  containerRef: RefObject<HTMLElement | null>,
  orderKey: string,
) {
  const positions = useRef(new Map<string, number>());

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const isReduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const next = new Map<string, number>();
    container
      .querySelectorAll<HTMLElement>("[data-flip-key]")
      .forEach((item) => {
        const key = item.dataset.flipKey ?? "";
        const top = item.offsetTop;
        next.set(key, top);
        const previous = positions.current.get(key);
        if (isReduced || previous === undefined || previous === top) return;
        item.animate(
          [{ translate: `0 ${previous - top}px` }, { translate: "0 0" }],
          { duration: DURATION_MS, easing: EASING },
        );
      });
    positions.current = next;
  }, [containerRef, orderKey]);
}
