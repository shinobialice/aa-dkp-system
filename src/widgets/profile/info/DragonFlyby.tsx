"use client";

import { useEffect, useState } from "react";
import Lottie from "lottie-react";

const DRAGON_USERNAME = "wdx";

export default function DragonFlyby({ username }: { username: string }) {
  const isDragonUser = username.toLowerCase() === DRAGON_USERNAME;
  const [animationData, setAnimationData] = useState<object | null>(null);

  useEffect(() => {
    if (!isDragonUser) return;

    let cancelled = false;
    fetch("/lottie/dragon.json")
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled) setAnimationData(data);
      });

    return () => {
      cancelled = true;
    };
  }, [isDragonUser]);

  if (!isDragonUser || !animationData) return null;

  return (
    <div className="pointer-events-none absolute inset-0 z-20 overflow-hidden">
      <div className="dragon-flyby absolute size-28 md:size-36">
        <Lottie animationData={animationData} loop autoplay />
      </div>
    </div>
  );
}
