import type { UserEquipment } from "@/actions/getUserEquipment";
import { findGearItem } from "./itemsData";
import { ARMOR_TYPE, type ArmorWeight } from "./itemsData/armorType";
import {
  GAME_ELEMENT_LEVELS,
  GAME_WEAPON_ELEMENT,
} from "./itemsData/gameElementLevels";
import { ARMOR_SLOTS, computeArmorSetCounts } from "./setBonuses";

export type WeaponElementDamage = {
  element: string | null;
  value: number;
};

export type ArmorElementResist = {
  element: string;
  value: number;
};

export type GearElementStats = {
  mainHand: WeaponElementDamage;
  offHand: WeaponElementDamage;
  ranged: WeaponElementDamage;
  armorWeight: ArmorWeight | null;
  armorResists: ArmorElementResist[];
};

const ELEMENT_NAMES = [
  "Колющий урон",
  "Режущий урон",
  "Маг. урон",
  "Рубящий урон",
  "Дробящий урон",
];

// item_elements из дампа игры: 450 ед. и по 250 за каждый уровень.
const WEAPON_ELEMENT_BASE = 450;
const WEAPON_ELEMENT_PER_LEVEL = 250;

const ARMOR_WEIGHTS: ArmorWeight[] = ["light", "medium", "heavy"];

// armor_element_resists из дампа игры: защита за уровень одного предмета,
// по порядку ELEMENT_NAMES.
const ARMOR_RESIST_PER_LEVEL: Record<ArmorWeight, number[]> = {
  light: [20, 30, 40, 30, 30],
  medium: [40, 20, 30, 30, 30],
  heavy: [30, 40, 20, 30, 30],
};

export function computeGearElementStats(
  equipment: UserEquipment[],
): GearElementStats {
  return {
    mainHand: weaponDamage(equipment, "weapon_main"),
    offHand: weaponDamage(equipment, "weapon_off"),
    ranged: weaponDamage(equipment, "weapon_ranged"),
    armorWeight: dominantArmorWeight(equipment),
    armorResists: armorResists(equipment),
  };
}

export function getItemElementLabel(
  itemId: number,
  grade: number,
): string | null {
  const level = elementLevel(itemId, grade);
  const element = GAME_WEAPON_ELEMENT[itemId];
  if (element) return `${ELEMENT_NAMES[element - 1]} Lv.${level}`;
  if (ARMOR_TYPE[itemId]) return `Защита от доп. урона оружия Lv.${level}`;
  return null;
}

function weaponDamage(
  equipment: UserEquipment[],
  slot: string,
): WeaponElementDamage {
  const eq = equipment.find((e) => e.slot === slot);
  const item = eq?.item_name ? findGearItem(slot, eq.item_name) : null;
  const element = item ? GAME_WEAPON_ELEMENT[item.id] : undefined;
  if (!eq || !item || !element) return { element: null, value: 0 };
  const level = elementLevel(item.id, eq.grade);
  return {
    element: ELEMENT_NAMES[element - 1],
    value: WEAPON_ELEMENT_BASE + WEAPON_ELEMENT_PER_LEVEL * level,
  };
}

function armorResists(equipment: UserEquipment[]): ArmorElementResist[] {
  const totals = ELEMENT_NAMES.map(() => 0);
  for (const slot of ARMOR_SLOTS) {
    const eq = equipment.find((e) => e.slot === slot);
    const item = eq?.item_name ? findGearItem(slot, eq.item_name) : null;
    const weight = item ? ARMOR_TYPE[item.id] : undefined;
    if (!eq || !item || !weight) continue;
    const level = elementLevel(item.id, eq.grade);
    ARMOR_RESIST_PER_LEVEL[weight].forEach((perLevel, index) => {
      totals[index] += perLevel * level;
    });
  }
  return ELEMENT_NAMES.map((element, index) => ({
    element,
    value: totals[index],
  }));
}

function elementLevel(itemId: number, grade: number): number {
  return GAME_ELEMENT_LEVELS[itemId]?.[grade] ?? 0;
}

function dominantArmorWeight(equipment: UserEquipment[]): ArmorWeight | null {
  const counts = computeArmorSetCounts(equipment);
  let best: ArmorWeight | null = null;
  for (const weight of ARMOR_WEIGHTS) {
    if (counts[weight] > (best ? counts[best] : 0)) best = weight;
  }
  return best;
}
