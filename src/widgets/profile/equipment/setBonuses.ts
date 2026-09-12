import type { UserEquipment } from "@/actions/getUserEquipment";
import { findGearItem } from "./itemsData";
import { ARMOR_TYPE, type ArmorWeight } from "./itemsData/armorType";

const ARMOR_SLOTS = [
  "head",
  "chest",
  "belt",
  "bracers",
  "hands",
  "legs",
  "feet",
] as const;

export type SetBuffTier = "partial" | "full";

export type ArmorSetBuff = {
  weight: ArmorWeight;
  count: number;
  tier: SetBuffTier;
  icon: string;
  title: string;
  description: string;
};

const SET_BUFF_ICON: Record<ArmorWeight, string> = {
  light: "/images/equipment/buffs/light_armor.png",
  medium: "/images/equipment/buffs/medium_armor.png",
  heavy: "/images/equipment/buffs/heavy_armor.png",
};

const SET_BUFF_TITLE: Record<ArmorWeight, string> = {
  light: "Лёгкие доспехи",
  medium: "Средние доспехи",
  heavy: "Тяжелые доспехи",
};

const SET_BUFF_TEXT: Record<ArmorWeight, Record<SetBuffTier, string>> = {
  light: {
    partial:
      "Герой, одетый в лёгкие доспехи, передвигается на 1% быстрее обычного.\nСопротивление повышается на 2%, а восприимчивость к исцелению — на +5%.\nРасход маны снижается на 5%.\nЗащита от дополнительного колющего урона снижена.",
    full:
      "Герой, одетый в полный комплект лёгких доспехов, передвигается на 1% быстрее обычного.\nСопротивление повышается на 3%.\nВосприимчивость к исцелению повышается на 10%.\nУстойчивость к критическому урону повышается на 100 единиц.\nРасход маны уменьшается на 10%.\nЗащита от дополнительного колющего урона снижена.",
  },
  medium: {
    partial:
      "Герой, одетый в средние доспехи, уклоняется от атак на 3% лучше обычного, его скорость передвижения повышается на 3%.\nДальность стрельбы и действия умений дальнего боя (кроме умений специализации «Стрельба») увеличивается на 2 м.\nЗащита от дополнительного режущего урона снижена.",
    full:
      "Герой, одетый в полный комплект средних доспехов, уклоняется от атак на 3% лучше обычного.\nДальность стрельбы и действия умений дальнего боя (кроме умений специальности «Стрельба») увеличивается на 3 метра.\nПоказатели защиты и сопротивления повышаются на 1%, а устойчивость к критическому урону — на 200 единиц.\nЗащита от дополнительного режущего урона снижена.",
  },
  heavy: {
    partial:
      "Показатель защиты бойца, одетого в тяжелые доспехи, повышается на 2%, а устойчивость к критическому урону — на 100 ед.\nСкорость передвижения и показатель уклонения снижаются на 3%.\nЗащита от дополнительного магического урона снижена.",
    full:
      "Показатель защиты бойца, одетого в полный комплект тяжелых доспехов, повышается на 3%, а устойчивость к критическому урону — на 300 единиц.\nСкорость передвижения и показатель уклонения снижаются на 3%.\nЗащита от дополнительного магического урона снижена.\nПоказатель сопротивления латного снаряжения был увеличен, а показатель защиты — снижен.",
  },
};

export function computeArmorSetCounts(
  equipment: UserEquipment[],
): Record<ArmorWeight, number> {
  const counts: Record<ArmorWeight, number> = { light: 0, medium: 0, heavy: 0 };

  for (const slotKey of ARMOR_SLOTS) {
    const eq = equipment.find((e) => e.slot === slotKey);
    if (!eq?.item_name) continue;
    const gearItem = findGearItem(slotKey, eq.item_name);
    if (!gearItem) continue;
    const weight = ARMOR_TYPE[gearItem.id];
    if (!weight) continue;
    counts[weight] += 1;
  }

  return counts;
}

function buildSetBuff(weight: ArmorWeight, count: number): ArmorSetBuff | null {
  if (count < 4) return null;
  const tier: SetBuffTier = count >= 7 ? "full" : "partial";
  return {
    weight,
    count,
    tier,
    icon: SET_BUFF_ICON[weight],
    title: SET_BUFF_TITLE[weight],
    description: SET_BUFF_TEXT[weight][tier],
  };
}

export function getActiveSetBuffs(equipment: UserEquipment[]): ArmorSetBuff[] {
  const counts = computeArmorSetCounts(equipment);
  return (Object.keys(counts) as ArmorWeight[])
    .map((weight) => buildSetBuff(weight, counts[weight]))
    .filter((buff): buff is ArmorSetBuff => buff !== null);
}

export function getSetProgressForItem(
  itemId: number,
  equipment: UserEquipment[],
): { weight: ArmorWeight; count: number; title: string; buff: ArmorSetBuff | null } | null {
  const weight = ARMOR_TYPE[itemId];
  if (!weight) return null;

  const counts = computeArmorSetCounts(equipment);
  const count = counts[weight];

  return {
    weight,
    count,
    title: SET_BUFF_TITLE[weight],
    buff: buildSetBuff(weight, count),
  };
}
