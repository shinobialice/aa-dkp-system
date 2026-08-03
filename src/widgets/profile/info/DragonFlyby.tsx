"use client";

import Image from "next/image";

const DRAGON_USERNAME = "wdx";

export default function DragonFlyby({ username }: { username: string }) {
  if (username.toLowerCase() !== DRAGON_USERNAME) return null;

  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 z-20 h-16 overflow-hidden md:h-20">
      <Image
        src="https://archeagecodex.com/items/icon_item_4310.png"
        alt=""
        width={48}
        height={48}
        className="dragon-flyby absolute size-10 -scale-x-100 md:size-12"
      />
    </div>
  );
}
