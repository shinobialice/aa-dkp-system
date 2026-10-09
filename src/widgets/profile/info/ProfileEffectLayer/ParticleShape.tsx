import type { ReactNode } from "react";
import type { ParticleShapeName } from "./particleStreamsData";
import type { Particle } from "./profileEffectModel";

type Props = {
  particle: Particle;
};

type SvgShapeName = Exclude<ParticleShapeName, "dot" | "bubble">;

const SVG_SHAPES: Record<SvgShapeName, { viewBox: string; body: ReactNode }> = {
  snowflake: {
    viewBox: "0 0 24 24",
    body: (
      <path
        d="M12 2v20M3.34 7l17.32 10M3.34 17l17.32-10M9.5 4.5 12 7l2.5-2.5M9.5 19.5 12 17l2.5 2.5M4 10.4l3.1.9-.8-3.1M20 13.6l-3.1-.9.8 3.1M4 13.6l3.1-.9-.8 3.1M20 10.4l-3.1.9.8-3.1"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
  },
  petal: {
    viewBox: "0 0 24 24",
    body: (
      <path
        d="M12 22C6 18 5 10 9 3l3 3.5L15 3c4 7 3 15-3 19z"
        fill="currentColor"
      />
    ),
  },
  heart: {
    viewBox: "0 0 24 24",
    body: (
      <path
        d="M12 21s-7.5-4.6-9.6-9.2C.9 8.4 3 4.5 6.8 4.5c2.1 0 3.6 1.1 5.2 3 1.6-1.9 3.1-3 5.2-3 3.8 0 5.9 3.9 4.4 7.3C19.5 16.4 12 21 12 21z"
        fill="currentColor"
      />
    ),
  },
  maple: {
    viewBox: "0 0 24 24",
    body: (
      <path
        d="M12 2l1.6 4.4L17 5l-1 4 4.5.5-3 3 1.5 2H14l-1 3.5.5 4h-3l.5-4-1-3.5H5l1.5-2-3-3L8 9 7 5l3.4 1.4z"
        fill="currentColor"
      />
    ),
  },
  leaf: {
    viewBox: "0 0 24 24",
    body: (
      <>
        <path d="M12 2c6 4 7 12 0 20C5 14 6 6 12 2z" fill="currentColor" />
        <path
          d="M12 5v15"
          stroke="rgb(0 0 0 / 0.25)"
          strokeWidth={1}
          fill="none"
        />
      </>
    ),
  },
  bat: {
    viewBox: "0 0 24 12",
    body: (
      <path
        d="M12 4.5c-.6-1.3-1.2-1.3-1.7-.4C8.5 2.6 5.5 2.4 2 1c1.1 1.9 1.6 3.9 1 6 2-.6 3.6-.1 4.6 1.4 1-1.4 2.6-1.3 4.4 1.3 1.8-2.6 3.4-2.7 4.4-1.3 1-1.5 2.6-2 4.6-1.4-.6-2.1-.1-4.1 1-6-3.5 1.4-6.5 1.6-8.3 3.1-.5-.9-1.1-.9-1.7.4z"
        fill="currentColor"
      />
    ),
  },
  sparkle: {
    viewBox: "0 0 24 24",
    body: (
      <path
        d="M12 0c1 8 4 11 12 12-8 1-11 4-12 12-1-8-4-11-12-12 8-1 11-4 12-12z"
        fill="currentColor"
      />
    ),
  },
  crystal: {
    viewBox: "0 0 24 24",
    body: (
      <>
        <path d="M12 0l7 9-7 15-7-15z" fill="currentColor" />
        <path d="M12 0v24L5 9z" fill="rgb(255 255 255 / 0.4)" />
      </>
    ),
  },
};

export default function ParticleShape({ particle }: Props) {
  const { shape, color, alpha, size, glow } = particle;

  if (shape === "dot") {
    return (
      <span
        className="block size-full rounded-full"
        style={{
          background: color,
          opacity: alpha,
          boxShadow: dotShadow(size, glow),
        }}
      />
    );
  }
  if (shape === "bubble") {
    return (
      <span
        className="block size-full rounded-full border-[1.5px] border-white/90 bg-[radial-gradient(circle_at_30%_30%,rgb(255_255_255/0.95)_0_14%,rgb(165_243_252/0.35)_45%,rgb(14_116_144/0.15)_75%)] shadow-[0_0_4px_rgb(8_47_73/0.45)]"
        style={{ opacity: alpha }}
      />
    );
  }

  const svg = SVG_SHAPES[shape];
  return (
    <svg
      viewBox={svg.viewBox}
      className="block size-full overflow-visible"
      style={{
        color,
        opacity: alpha,
        filter: svgShadow(size, glow),
      }}
    >
      {svg.body}
    </svg>
  );
}

function dotShadow(size: number, glow: string | null) {
  const outline = "0 0 1px rgb(0 0 0 / 0.45)";
  if (!glow) return outline;
  return `${outline}, 0 0 ${size * 1.5}px ${size / 3}px ${glow}`;
}

function svgShadow(size: number, glow: string | null) {
  const outline = "drop-shadow(0 1px 1px rgb(0 0 0 / 0.4))";
  if (!glow) return outline;
  return `${outline} drop-shadow(0 0 ${Math.max(2, size / 5)}px ${glow})`;
}
