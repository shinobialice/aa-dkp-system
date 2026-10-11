import type { Engraving } from "../itemsData/engravings";
import { parseEngravingEffect } from "../engravingBonuses";

export type EngravingGroup = {
  label: string;
  engravings: Engraving[];
};

const SPECIAL_EFFECTS_LABEL = "Особые эффекты";

export function matchesEngravingQuery(
  engraving: Engraving,
  query: string,
): boolean {
  const words = normalizeSearchText(query).split(/\s+/).filter(Boolean);
  const text = normalizeSearchText(
    `${engraving.name} ${engraving.effect ?? ""}`,
  );
  return words.every((word) => text.includes(word));
}

export function groupEngravingsByEffect(
  engravings: Engraving[],
): EngravingGroup[] {
  const byLabel = new Map<string, Engraving[]>();
  for (const engraving of engravings) {
    const label = parseEffect(engraving)?.label ?? SPECIAL_EFFECTS_LABEL;
    byLabel.set(label, [...(byLabel.get(label) ?? []), engraving]);
  }
  return [...byLabel]
    .map(([label, group]) => ({
      label,
      engravings: group.sort(compareByStrength),
    }))
    .sort(compareGroups);
}

function parseEffect(engraving: Engraving) {
  return engraving.effect ? parseEngravingEffect(engraving.effect) : null;
}

function effectStrength(engraving: Engraving): number {
  return Math.abs(parseEffect(engraving)?.value ?? 0);
}

function compareByStrength(a: Engraving, b: Engraving): number {
  return (
    effectStrength(b) - effectStrength(a) ||
    b.grade - a.grade ||
    a.name.localeCompare(b.name, "ru")
  );
}

function compareGroups(a: EngravingGroup, b: EngravingGroup): number {
  const isSpecialA = a.label === SPECIAL_EFFECTS_LABEL;
  const isSpecialB = b.label === SPECIAL_EFFECTS_LABEL;
  if (isSpecialA !== isSpecialB) return isSpecialA ? 1 : -1;
  return a.label.localeCompare(b.label, "ru");
}

function normalizeSearchText(text: string): string {
  return text.toLowerCase().replaceAll("ё", "е");
}
