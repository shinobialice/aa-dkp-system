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
    const stuck = new IntersectionObserver(
      ([entry]) => {
        bar.dataset.stuck = String(!entry.isIntersecting);
      },
      { rootMargin: `-${stickyTop(bar)}px 0px 0px 0px` },
    );
    stuck.observe(sentinel);
    return () => {
      resize.disconnect();
      stuck.disconnect();
    };
  }, [heightVar]);

  const scrollToListTop = () => {
    const sentinel = sentinelRef.current;
    const bar = barRef.current;
    if (!sentinel || !bar) return;
    const top = sentinel.getBoundingClientRect().top - stickyTop(bar);
    if (top < 0) window.scrollTo({ top: top + window.scrollY });
  };

  return { containerRef, barRef, sentinelRef, scrollToListTop };
}

function stickyTop(bar: HTMLElement) {
  return parseFloat(getComputedStyle(bar).top) || 0;
}
