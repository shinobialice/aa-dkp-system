import type { UserEquipment } from "@/actions/getUserEquipment";
import { findGearItem } from "./itemsData";
import {
  getEphenSynthesisCategory,
  interpolateSynthesisValue,
} from "./itemsData/ephenSynthesis";
import { getEphenSynthesisOptionRange } from "./itemsData/ephenSynthesisData";

const ATTRIBUTE_LABELS: Record<string, "str" | "dex" | "int" | "spi" | "sta"> =
  {
    str: "str",
    dex: "dex",
    sta: "sta",
    int: "int",
    spi: "spi",
  };

export type EphenSynthesisRoll = {
  key: string;
  label: string;
  value: number;
  isPercent: boolean;
};

export function hasEphenSynthesisSelection(eq: UserEquipment): boolean {
  return (
    !!eq.ephen_synthesis_primary ||
    !!eq.ephen_synthesis_secondary ||
    eq.ephen_synthesis_tertiary.length > 0
  );
}

export function getEphenSynthesisRolls(
  eq: UserEquipment,
): EphenSynthesisRoll[] {
  const gearItem = findGearItem(eq.slot, eq.item_name);
  if (!gearItem) return [];
  const category = getEphenSynthesisCategory(gearItem.id);
  if (!category) return [];

  const grade = eq.grade;
  const percent = eq.ephen_synthesis_percent;
  // Уникальное легендарное оружие (2 независимых пула): pool А — в tertiary,
  // pool Б — в secondary (см. isValidEphenSynthesisSelection).
  const selectedKeysByGroup =
    category.groups.length === 2
      ? [
          eq.ephen_synthesis_tertiary,
          eq.ephen_synthesis_secondary ? [eq.ephen_synthesis_secondary] : [],
        ]
      : [
          eq.ephen_synthesis_primary ? [eq.ephen_synthesis_primary] : [],
          eq.ephen_synthesis_secondary ? [eq.ephen_synthesis_secondary] : [],
          eq.ephen_synthesis_tertiary,
        ];

  const rolls: EphenSynthesisRoll[] = [];
  category.groups.forEach((group, i) => {
    const selectedKeys = selectedKeysByGroup[i] ?? [];
    for (const option of group.options) {
      if (!selectedKeys.includes(option.key)) continue;
      const range = getEphenSynthesisOptionRange(
        option,
        grade,
        category.minGrade,
      );
      if (!range) continue;
      const value = interpolateSynthesisValue(range, percent, option.isPercent);
      rolls.push({
        key: option.key,
        label: option.label,
        value,
        isPercent: option.isPercent,
      });
    }
  });
  return rolls;
}

export type EphenSynthesisAttributeBonuses = {
  str: number;
  dex: number;
  int: number;
  spi: number;
  sta: number;
};

export function computeEphenSynthesisBonuses(equipment: UserEquipment[]): {
  attributes: EphenSynthesisAttributeBonuses;
  stats: Map<string, number>;
} {
  const attributes: EphenSynthesisAttributeBonuses = {
    str: 0,
    dex: 0,
    int: 0,
    spi: 0,
    sta: 0,
  };
  const stats = new Map<string, number>();

  for (const eq of equipment) {
    if (!hasEphenSynthesisSelection(eq)) continue;
    for (const roll of getEphenSynthesisRolls(eq)) {
      const attr = ATTRIBUTE_LABELS[roll.key];
      if (attr) {
        attributes[attr] += roll.value;
      } else {
        stats.set(roll.label, (stats.get(roll.label) ?? 0) + roll.value);
      }
    }
  }

  return { attributes, stats };
}
