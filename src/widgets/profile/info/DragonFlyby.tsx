"use client";

import { useEffect, useState } from "react";
import Lottie from "lottie-react";

export default function DragonFlyby() {
  const [animationData, setAnimationData] = useState<object | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/lottie/dragon.json")
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled) setAnimationData(data);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  if (!animationData) return null;

  return (
    <div
      aria-hidden
      className="dragon-layer pointer-events-none absolute inset-0 z-20 overflow-hidden"
    >
      <div className="dragon-flight">
        <div className="dragon-bob">
          <Lottie
            className="dragon-sprite"
            animationData={animationData}
            loop
            autoplay
          />
        </div>
      </div>
    </div>
  );
}
