// Сгенерировано `pnpm game:tables` из данных игры. Не редактировать вручную.
import type { ArmorWeight } from "./armorType";

// Прибавка за 100 уровней баффа; skillDamage — в десятых долях процента.
export type ArmorQualityBuffRates = {
  health: number;
  mana: number;
  skillDamage: number;
};

export const ARMOR_QUALITY_BUFF_RATES: Record<
  ArmorWeight,
  Record<number, ArmorQualityBuffRates>
> = {
  light: {
    2: { health: 616, mana: 616, skillDamage: 4 },
    3: { health: 822, mana: 822, skillDamage: 6 },
    4: { health: 1027, mana: 1027, skillDamage: 8 },
    5: { health: 1232, mana: 1232, skillDamage: 10 },
    6: { health: 1438, mana: 1438, skillDamage: 12 },
    7: { health: 1643, mana: 1643, skillDamage: 14 },
    8: { health: 1848, mana: 1848, skillDamage: 16 },
    9: { health: 2054, mana: 2054, skillDamage: 18 },
    10: { health: 2259, mana: 2259, skillDamage: 20 },
    11: { health: 2465, mana: 2465, skillDamage: 21 },
    12: { health: 2670, mana: 2670, skillDamage: 22 },
  },
  medium: {
    2: { health: 606, mana: 308, skillDamage: 6 },
    3: { health: 802, mana: 411, skillDamage: 8 },
    4: { health: 997, mana: 513, skillDamage: 10 },
    5: { health: 1192, mana: 616, skillDamage: 12 },
    6: { health: 1388, mana: 719, skillDamage: 14 },
    7: { health: 1573, mana: 822, skillDamage: 16 },
    8: { health: 1778, mana: 924, skillDamage: 18 },
    9: { health: 1974, mana: 1027, skillDamage: 20 },
    10: { health: 2149, mana: 1130, skillDamage: 22 },
    11: { health: 2345, mana: 1232, skillDamage: 24 },
    12: { health: 2530, mana: 1335, skillDamage: 26 },
  },
  heavy: {
    2: { health: 778, mana: 308, skillDamage: 1 },
    3: { health: 1038, mana: 411, skillDamage: 1 },
    4: { health: 1297, mana: 513, skillDamage: 1 },
    5: { health: 1557, mana: 616, skillDamage: 2 },
    6: { health: 1816, mana: 719, skillDamage: 2 },
    7: { health: 2076, mana: 822, skillDamage: 2 },
    8: { health: 2335, mana: 924, skillDamage: 2 },
    9: { health: 2595, mana: 1027, skillDamage: 3 },
    10: { health: 2854, mana: 1130, skillDamage: 4 },
    11: { health: 3114, mana: 1232, skillDamage: 5 },
    12: { health: 3373, mana: 1335, skillDamage: 6 },
  },
};
