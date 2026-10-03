"use client";

import { useEffect, useRef } from "react";

export function useStickyBar(heightVar: string) {
  const containerRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const bar = barRef.current;
    const sentinel = sentinelRef.current;
    if (!container || !bar || !sentinel) return;
    const resize = new ResizeObserver(() => {
      container.style.setProperty(heightVar, `${bar.offsetHeight}px`);
    });
    resize.observe(bar);
    const stuck = new IntersectionObserver(([entry]) => {
      bar.dataset.stuck = String(!entry.isIntersecting);
    });
    stuck.observe(sentinel);
    return () => {
      resize.disconnect();
      stuck.disconnect();
    };
  }, [heightVar]);

  const scrollToListTop = () => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    const top = sentinel.getBoundingClientRect().top;
    if (top < 0) window.scrollTo({ top: top + window.scrollY });
  };

  return { containerRef, barRef, sentinelRef, scrollToListTop };
}
