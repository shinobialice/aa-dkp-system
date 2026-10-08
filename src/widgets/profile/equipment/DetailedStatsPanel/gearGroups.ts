import type { ArmorWeight } from "../itemsData/armorType";
import type { GearElementStats, WeaponElementDamage } from "../weaponElements";

import { computedRow, staticRow, type RowGroup } from "./statRows";

const ARMOR_WEIGHT_NAMES: Record<ArmorWeight, string> = {
  light: "Легкие",
  medium: "Средние",
  heavy: "Тяжелые",
};

export function buildGearGroups(gear: GearElementStats): RowGroup[] {
  const armorName = gear.armorWeight
    ? ARMOR_WEIGHT_NAMES[gear.armorWeight]
    : "Нет";
  return [
    {
      title: "Доп. урон оружия",
      rows: [
        weaponRow("Оружие для правой руки", gear.mainHand),
        weaponRow("Оружие для левой руки", gear.offHand),
        weaponRow("Оружие дальнего боя", gear.ranged),
      ],
    },
    {
      title: "Защита от доп. урона оружия",
      rows: [
        staticRow("Доспехи", armorName),
        ...gear.armorResists.map(({ element, value }) =>
          computedRow(element, value, "", 0),
        ),
      ],
    },
  ];
}

function weaponRow(label: string, damage: WeaponElementDamage) {
  return computedRow(
    `${label} (${damage.element ?? "нет"})`,
    damage.value,
    "",
    0,
  );
}
