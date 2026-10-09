import type { CSSProperties } from "react";
import {
  EFFECT_STREAMS,
  type ParticleBody,
  type ParticleEffect,
  type ParticleMotion,
  type ParticleShapeName,
  type ParticleStream,
} from "./particleStreamsData";

type ParticleStyle = CSSProperties & { [variable: `--${string}`]: string };

export type Particle = {
  key: string;
  shape: ParticleShapeName;
  motion: ParticleMotion;
  body: ParticleBody;
  color: string;
  alpha: number;
  size: number;
  glow: string | null;
  outerStyle: ParticleStyle;
  bodyStyle: ParticleStyle;
};

const NO_RANGE: [number, number] = [0, 0];

export function effectParticles(effect: ParticleEffect): Particle[] {
  return EFFECT_STREAMS[effect].flatMap((stream, streamIndex) =>
    Array.from({ length: stream.count }, (_, index) =>
      buildParticle(
        stream,
        `${streamIndex}-${index}`,
        streamIndex * 97 + index,
      ),
    ),
  );
}

function buildParticle(
  stream: ParticleStream,
  key: string,
  seed: number,
): Particle {
  const roll = (salt: number) => seededRandom(seed * 31 + salt);
  const pick = (range: [number, number], salt: number) =>
    range[0] + (range[1] - range[0]) * roll(salt);

  const size = Math.round(pick(stream.size, 1));
  const duration = pick(stream.duration, 2);

  return {
    key,
    shape: stream.shape,
    motion: stream.motion,
    body: stream.body,
    color: stream.colors[Math.floor(roll(3) * stream.colors.length)],
    alpha: pick(stream.alpha ?? [1, 1], 4),
    size,
    glow: stream.glow ?? null,
    outerStyle: {
      left: stream.motion === "cross" ? 0 : `${fixed(roll(5) * 100)}%`,
      top: `${fixed(startTop(stream.motion, roll(6)))}%`,
      width: size,
      height: size,
      "--dur": `${fixed(duration)}s`,
      "--delay": `-${fixed(roll(7) * duration)}s`,
      "--drift": `${fixed(pick(stream.drift ?? NO_RANGE, 8))}px`,
    },
    bodyStyle: {
      "--sway": `${fixed(pick(stream.sway ?? NO_RANGE, 9))}px`,
      "--sway-dur": `${fixed(1.6 + roll(10) * 2)}s`,
      "--spin": `${fixed(pick(stream.spin ?? NO_RANGE, 11))}deg`,
    },
  };
}

function startTop(motion: ParticleMotion, random: number) {
  if (motion === "fall" || motion === "rise") return 0;
  if (motion === "cross") return 5 + random * 50;
  return 8 + random * 84;
}

function fixed(value: number) {
  return value.toFixed(2);
}

function seededRandom(seed: number) {
  let hash = (seed + 0x6d2b79f5) | 0;
  hash = Math.imul(hash ^ (hash >>> 15), hash | 1);
  hash ^= hash + Math.imul(hash ^ (hash >>> 7), hash | 61);
  return ((hash ^ (hash >>> 14)) >>> 0) / 4294967296;
}
