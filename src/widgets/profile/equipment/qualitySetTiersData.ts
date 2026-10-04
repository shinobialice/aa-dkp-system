import { type ArmorWeight } from "./itemsData/armorType";

type QualityTier = {
  quality: string;
  title: (armor: string) => string;
};

export type QualitySetValues = {
  health: number;
  mana: number;
  skillDamagePercent: number;
};

const ARMOR_NAMES: Record<ArmorWeight, string> = {
  light: "легких",
  medium: "средних",
  heavy: "тяжелых",
};

const TWELVE_GRADE = 12;

const QUALITY_TIERS: Record<number, QualityTier> = {
  2: {
    quality: "необычного",
    title: (armor) => `Комплект необычных ${armor} доспехов`,
  },
  3: {
    quality: "редкого",
    title: (armor) => `Комплект редких ${armor} доспехов`,
  },
  4: {
    quality: "уникального",
    title: (armor) => `Комплект уникальных ${armor} доспехов`,
  },
  5: {
    quality: "эпического",
    title: (armor) => `Комплект эпических ${armor} доспехов`,
  },
  6: {
    quality: "легендарного",
    title: (armor) => `Комплект легендарных ${armor} доспехов`,
  },
  7: {
    quality: "реликвии",
    title: (armor) => `Комплект ${armor} доспехов-реликвий`,
  },
  8: {
    quality: "эпохи чудес",
    title: (armor) => `Комплект ${armor} доспехов эпохи чудес`,
  },
  9: {
    quality: "эпохи сказаний",
    title: (armor) => `Комплект ${armor} доспехов эпохи сказаний`,
  },
  10: {
    quality: "эпохи легенд",
    title: (armor) => `Комплект ${armor} доспехов эпохи легенд`,
  },
  11: {
    quality: "эпохи мифов",
    title: (armor) => `Комплект ${armor} доспехов эпохи мифов`,
  },
  12: {
    quality: "эпохи Двенадцати",
    title: (armor) => `Комплект ${armor} доспехов эпохи Двенадцати`,
  },
};

export function qualitySetTexts(
  weight: ArmorWeight,
  grade: number,
  values: QualitySetValues,
) {
  const tier = QUALITY_TIERS[grade];
  if (!tier) return null;

  const armor = ARMOR_NAMES[weight];
  const skillLine =
    grade === TWELVE_GRADE
      ? "Дополнительный урон боевых умений и дополнительная эффективность исцеляющих умений"
      : "Дополнительный урон умений и дополнительная эффективность целительных умений";

  return {
    icon: `/images/equipment/buffs/quality_${weight}/grade${grade}.png`,
    title: tier.title(armor),
    description: [
      `В экипировке персонажа есть не менее 4-х предметов ${armor} доспехов качеством не ниже ${tier.quality}.`,
      `Объем здоровья +${values.health} ед.`,
      `Объем маны +${values.mana} ед.`,
      `${skillLine} +${values.skillDamagePercent.toFixed(1)}%.`,
    ].join("\n"),
  };
}
