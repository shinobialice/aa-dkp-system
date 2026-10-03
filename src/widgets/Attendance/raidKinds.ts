import type { CSSProperties } from "react";

export type RaidKind = "prime" | "agl" | "koshka" | "morph" | "marli";

type RaidSummary = { type: string; bosses: string[] };
type ColorPair = { light: string; dark: string };

export const KINDS: { kind: RaidKind; label: string; dot: string }[] = [
  { kind: "prime", label: "Праймы", dot: "bg-red-600" },
  { kind: "agl", label: "АГЛ", dot: "bg-green-700" },
  { kind: "koshka", label: "Кошка", dot: "bg-pink-700" },
  { kind: "morph", label: "Морф", dot: "bg-blue-700" },
  { kind: "marli", label: "Марли Прок", dot: "bg-amber-800" },
];

const PRIME_COLORS: Record<string, ColorPair> = {
  Кракен: { light: "#dc2626", dark: "#f87171" },
  Калидис: { light: "#7c3aed", dark: "#a78bfa" },
  Левиафан: { light: "#0e7490", dark: "#22d3ee" },
  Ксанатос: { light: "#c2410c", dark: "#fb923c" },
  Анталлон: { light: "#a16207", dark: "#facc15" },
  Корвус: { light: "#9333ea", dark: "#c084fc" },
  Калеиль: { light: "#0f766e", dark: "#2dd4bf" },
  Дельфиец: { light: "#2563eb", dark: "#60a5fa" },
  Осада: { light: "#18181b", dark: "#f4f4f5" },
};

const KIND_COLORS: Record<RaidKind, ColorPair> = {
  prime: { light: "#b91c1c", dark: "#f87171" },
  agl: { light: "#15803d", dark: "#4ade80" },
  koshka: { light: "#be185d", dark: "#f472b6" },
  morph: { light: "#1d4ed8", dark: "#60a5fa" },
  marli: { light: "#92400e", dark: "#fbbf24" },
};

export const RAID_TEXT =
  "text-[var(--raid-color)] dark:text-[var(--raid-color-dark)]";
export const RAID_BG =
  "bg-[var(--raid-color)] dark:bg-[var(--raid-color-dark)]";

export function raidKind(raid: RaidSummary): RaidKind {
  if (raid.type === "Прайм") return "prime";
  const names = raid.bosses.join(" ");
  if (names.includes("Кошка")) return "koshka";
  if (names.includes("Морф")) return "morph";
  if (names.includes("Марли")) return "marli";
  return "agl";
}

export function raidTitle(raid: RaidSummary) {
  return raid.bosses.length ? raid.bosses.join(", ") : raid.type;
}

export function raidColorStyle(raid: RaidSummary): CSSProperties {
  const kind = raidKind(raid);
  const colors =
    (kind === "prime" && PRIME_COLORS[raid.bosses[0]]) || KIND_COLORS[kind];
  return {
    "--raid-color": colors.light,
    "--raid-color-dark": colors.dark,
  } as CSSProperties;
}

export function bossColorStyle(bossName: string, category: string) {
  return raidColorStyle({ type: category, bosses: [bossName] });
}
