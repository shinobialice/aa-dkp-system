import type { ProfileEffect } from "@/shared/config/profileStyle";

export type ParticleEffect = Exclude<ProfileEffect, "dragon">;

export type ParticleShapeName =
  | "dot"
  | "bubble"
  | "snowflake"
  | "petal"
  | "heart"
  | "maple"
  | "leaf"
  | "bat"
  | "sparkle"
  | "crystal";

export type ParticleMotion = "fall" | "rise" | "drift" | "cross" | "still";

export type ParticleBody =
  | "sway"
  | "spin"
  | "flutter"
  | "flap"
  | "pulse"
  | "twinkle"
  | "flicker"
  | "rainbow"
  | "shimmer";

type Range = [number, number];

export type ParticleStream = {
  shape: ParticleShapeName;
  motion: ParticleMotion;
  body: ParticleBody;
  count: number;
  colors: string[];
  size: Range;
  duration: Range;
  sway?: Range;
  drift?: Range;
  spin?: Range;
  alpha?: Range;
  glow?: string;
};

const RAINBOW = [
  "#f472b6",
  "#fb923c",
  "#facc15",
  "#4ade80",
  "#38bdf8",
  "#a78bfa",
];

export const EFFECT_STREAMS: Record<ParticleEffect, ParticleStream[]> = {
  snow: [
    {
      shape: "snowflake",
      motion: "fall",
      body: "spin",
      count: 12,
      colors: ["#ffffff", "#f0f9ff"],
      size: [14, 22],
      duration: [9, 14],
      sway: [8, 18],
      drift: [-20, 20],
      spin: [-200, 200],
      glow: "#7dd3fc",
    },
    {
      shape: "dot",
      motion: "fall",
      body: "sway",
      count: 18,
      colors: ["#ffffff"],
      size: [4, 8],
      duration: [7, 12],
      sway: [4, 12],
      drift: [-15, 15],
      alpha: [0.75, 1],
      glow: "#bae6fd",
    },
  ],
  sakura: [
    {
      shape: "petal",
      motion: "fall",
      body: "flutter",
      count: 20,
      colors: ["#fbcfe8", "#f9a8d4", "#f472b6", "#fdf2f8"],
      size: [13, 20],
      duration: [8, 13],
      sway: [10, 24],
      drift: [30, 90],
      spin: [180, 540],
      glow: "#be185d",
    },
  ],
  halloween: [
    {
      shape: "bat",
      motion: "cross",
      body: "flap",
      count: 5,
      colors: ["#1e1033", "#2e1065"],
      size: [30, 44],
      duration: [9, 14],
      glow: "#fb923c",
    },
    {
      shape: "dot",
      motion: "rise",
      body: "flicker",
      count: 14,
      colors: ["#fdba74", "#fb923c", "#fde047"],
      size: [4, 7],
      duration: [5, 9],
      sway: [6, 14],
      drift: [-10, 10],
      glow: "#f97316",
    },
    {
      shape: "sparkle",
      motion: "still",
      body: "twinkle",
      count: 7,
      colors: ["#d8b4fe", "#c084fc"],
      size: [12, 18],
      duration: [2.5, 4.5],
      spin: [0, 90],
      glow: "#a855f7",
    },
  ],
  hearts: [
    {
      shape: "heart",
      motion: "rise",
      body: "pulse",
      count: 16,
      colors: ["#f43f5e", "#fb7185", "#ec4899", "#e11d48", "#be123c"],
      size: [14, 24],
      duration: [7, 11],
      sway: [8, 18],
      drift: [-10, 10],
      glow: "#ffffff",
    },
    {
      shape: "sparkle",
      motion: "still",
      body: "twinkle",
      count: 8,
      colors: ["#ffe4e6", "#ffffff"],
      size: [10, 16],
      duration: [2, 4],
      spin: [0, 90],
      glow: "#fb7185",
    },
  ],
  sea: [
    {
      shape: "bubble",
      motion: "rise",
      body: "pulse",
      count: 18,
      colors: ["#e0f2fe"],
      size: [9, 22],
      duration: [5, 9],
      sway: [5, 12],
      drift: [-8, 8],
      alpha: [0.75, 1],
    },
    {
      shape: "sparkle",
      motion: "still",
      body: "twinkle",
      count: 8,
      colors: ["#ffffff", "#cffafe"],
      size: [10, 16],
      duration: [2, 4],
      spin: [0, 90],
      glow: "#22d3ee",
    },
  ],
  leaves: [
    {
      shape: "maple",
      motion: "fall",
      body: "flutter",
      count: 12,
      colors: ["#ea580c", "#dc2626", "#d97706", "#b91c1c"],
      size: [18, 26],
      duration: [8, 12],
      sway: [12, 26],
      drift: [-60, 60],
      spin: [180, 540],
      glow: "#451a03",
    },
    {
      shape: "leaf",
      motion: "fall",
      body: "flutter",
      count: 8,
      colors: ["#eab308", "#f59e0b", "#c2410c"],
      size: [14, 20],
      duration: [7, 11],
      sway: [10, 22],
      drift: [-40, 40],
      spin: [180, 400],
      glow: "#451a03",
    },
  ],
  fire: [
    {
      shape: "dot",
      motion: "rise",
      body: "flicker",
      count: 22,
      colors: ["#fde047", "#facc15", "#fdba74"],
      size: [4, 7],
      duration: [3, 6],
      sway: [6, 16],
      drift: [-12, 12],
      glow: "#f97316",
    },
    {
      shape: "dot",
      motion: "rise",
      body: "flicker",
      count: 6,
      colors: ["#f97316", "#ea580c"],
      size: [14, 24],
      duration: [4, 7],
      sway: [4, 10],
      alpha: [0.35, 0.55],
      glow: "#ea580c",
    },
  ],
  rainbow: [
    {
      shape: "sparkle",
      motion: "still",
      body: "rainbow",
      count: 14,
      colors: RAINBOW,
      size: [12, 20],
      duration: [2.5, 4.5],
      spin: [0, 90],
      glow: "#ffffff",
    },
    {
      shape: "dot",
      motion: "fall",
      body: "shimmer",
      count: 16,
      colors: RAINBOW,
      size: [4, 7],
      duration: [8, 13],
      sway: [6, 14],
      drift: [-15, 15],
      glow: "#ffffff",
    },
  ],
  crystal_moon: [
    {
      shape: "sparkle",
      motion: "still",
      body: "twinkle",
      count: 12,
      colors: ["#ffffff", "#f3e8ff", "#ddd6fe"],
      size: [10, 18],
      duration: [2.5, 5],
      spin: [0, 45],
      glow: "#a78bfa",
    },
    {
      shape: "crystal",
      motion: "fall",
      body: "spin",
      count: 8,
      colors: ["#c4b5fd", "#a78bfa", "#ddd6fe"],
      size: [13, 20],
      duration: [11, 16],
      sway: [6, 14],
      drift: [-20, 20],
      spin: [-120, 120],
      glow: "#7c3aed",
    },
    {
      shape: "dot",
      motion: "drift",
      body: "flicker",
      count: 8,
      colors: ["#f3e8ff"],
      size: [4, 6],
      duration: [6, 10],
      drift: [-20, 20],
      glow: "#a78bfa",
    },
  ],
  fireflies: [
    {
      shape: "dot",
      motion: "drift",
      body: "flicker",
      count: 18,
      colors: ["#fef9c3", "#fde047"],
      size: [5, 8],
      duration: [6, 10],
      drift: [-24, 24],
      glow: "#facc15",
    },
  ],
};

export const EFFECT_BACKDROPS: Partial<Record<ParticleEffect, string>> = {
  fire: "pfx-heat",
  halloween: "pfx-mist",
};
