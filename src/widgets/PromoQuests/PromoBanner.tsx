"use client";

import type { PointerEvent } from "react";
import type { EventSettings } from "@/actions/eventSettings";
import EventBanner from "@/widgets/MainPageCards/EventBanner";

type Props = {
  event: EventSettings;
};

export default function PromoBanner({ event }: Props) {
  const handlePointerMove = (pointer: PointerEvent<HTMLDivElement>) => {
    const banner = pointer.currentTarget;
    const box = banner.getBoundingClientRect();
    const x = pointer.clientX - box.left;
    banner.style.setProperty("--spot-x", `${x}px`);
    banner.style.setProperty("--spot-y", `${pointer.clientY - box.top}px`);
    banner.style.setProperty("--tilt", String((x / box.width) * 2 - 1));
  };

  return (
    <div className="promo-banner promo-rise" onPointerMove={handlePointerMove}>
      <EventBanner event={event} />
    </div>
  );
}
