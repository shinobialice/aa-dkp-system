"use client";

import { useState, type PointerEvent } from "react";
import Image from "next/image";
import { lensStyle, type LensPosition } from "./usefulInfoModel";

type Props = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

export default function ZoomableImage({ src, alt, width, height }: Props) {
  const [lens, setLens] = useState<LensPosition | null>(null);

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "mouse") return;
    const rect = event.currentTarget.getBoundingClientRect();
    setLens({
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
      width: rect.width,
      height: rect.height,
    });
  };

  return (
    <div
      onPointerMove={handlePointerMove}
      onPointerLeave={() => setLens(null)}
      className="relative mx-auto w-fit cursor-none overflow-hidden rounded-lg border"
    >
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        sizes={`(min-width: ${width + 40}px) ${width}px, 100vw`}
        className="h-auto max-w-full"
      />
      {lens && (
        <span
          aria-hidden
          style={lensStyle(src, lens)}
          className="pointer-events-none absolute rounded-full border-2 border-white bg-no-repeat shadow-lg"
        />
      )}
    </div>
  );
}
