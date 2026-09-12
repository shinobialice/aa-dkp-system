import type { UserEquipment } from "@/actions/getUserEquipment";
import { ITEM_STATS, findGearItem } from "./itemsData";
import { scaleStat } from "./itemsData/statsFormula";

// Стартовые значения персонажа без надетых предметов — дефолтный набор.
// Часть строк (урон/исцеление/скорости) не пересчитываем — для них нет
// данных/формулы, только у брони есть статы (Защита, Сопротивление,
// 5 атрибутов), остальное показываем статикой.
export const BASE_CHARACTER_STATS = {
  health: 10246,
  mana: 7180,
  meleeAttack: 39.5,
  spellPower: 39.5,
  rangedAttack: 39.5,
  healPower: 39.5,
  defense: 158,
  resist: 158,
  str: 158,
  int: 158,
  dex: 158,
  spi: 158,
  sta: 158,
  moveSpeed: 5.4,
  skillSpeed: 90.0,
  proficiency: 0,
};

export type EquippedBonuses = {
  defense: number;
  resist: number;
  str: number;
  int: number;
  dex: number;
  spi: number;
  sta: number;
};

export function computeEquippedBonuses(
  equipment: UserEquipment[],
): EquippedBonuses {
  const totals: EquippedBonuses = {
    defense: 0,
    resist: 0,
    str: 0,
    int: 0,
    dex: 0,
    spi: 0,
    sta: 0,
  };

  for (const eq of equipment) {
    const gearItem = findGearItem(eq.slot, eq.item_name);
    if (!gearItem) continue;
    const base = ITEM_STATS[gearItem.id];
    if (!base) continue;

    const enchant = eq.enchant ?? 0;

    if (base.wearable_armor) {
      totals.defense += scaleStat(base.wearable_armor, eq.grade, enchant, "wearable_armor");
    }
    if (base.wearable_magic_resistance) {
      totals.resist += scaleStat(
        base.wearable_magic_resistance,
        eq.grade,
        enchant,
        "wearable_magic_resistance",
      );
    }
    if (base.str) totals.str += scaleStat(base.str, eq.grade, enchant, "str");
    if (base.int) totals.int += scaleStat(base.int, eq.grade, enchant, "int");
    if (base.dex) totals.dex += scaleStat(base.dex, eq.grade, enchant, "dex");
    if (base.spi) totals.spi += scaleStat(base.spi, eq.grade, enchant, "spi");
    if (base.sta) totals.sta += scaleStat(base.sta, eq.grade, enchant, "sta");
  }

  return totals;
}
