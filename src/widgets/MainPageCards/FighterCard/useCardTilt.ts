"use client";

import { useState, type PointerEvent } from "react";

const MAX_TILT_Y_DEG = 22;
const MAX_TILT_X_DEG = 18;

export function useCardTilt() {
  const [isTilting, setIsTilting] = useState(false);

  const handlePointerMove = (event: PointerEvent<HTMLElement>) => {
    if (event.pointerType !== "mouse") return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;
    const style = event.currentTarget.style;
    style.setProperty("--ry", `${((x - 0.5) * MAX_TILT_Y_DEG).toFixed(2)}deg`);
    style.setProperty("--rx", `${((0.5 - y) * MAX_TILT_X_DEG).toFixed(2)}deg`);
    style.setProperty("--mx", `${(x * 100).toFixed(1)}%`);
    style.setProperty("--my", `${(y * 100).toFixed(1)}%`);
    setIsTilting(true);
  };

  const handlePointerLeave = (event: PointerEvent<HTMLElement>) => {
    const style = event.currentTarget.style;
    style.setProperty("--ry", "0deg");
    style.setProperty("--rx", "0deg");
    setIsTilting(false);
  };

  return {
    isTilting,
    handlePointerMove,
    handlePointerLeave,
    stopTilting: () => setIsTilting(false),
  };
}
