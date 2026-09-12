import type { UserEquipment } from "@/actions/getUserEquipment";
import { findGearItem } from "./itemsData";
import { WEAPON_HANDEDNESS } from "./itemsData/weaponHandedness";

export type WeaponBuff = {
  key: "shield" | "two_handed" | "dual_wield";
  icon: string;
  title: string;
  description: string;
};

const WEAPON_BUFFS: Record<WeaponBuff["key"], Omit<WeaponBuff, "key">> = {
  shield: {
    icon: "/images/equipment/buffs/weapon/shield.png",
    title: "Использование щита",
    description:
      "Точность ударов в дальнем и ближнем бою, а также точность заклинаний повышаются на 3%.\nДополнительный урон в ближнем и дальнем бою, а также дополнительный урон заклинаний и дополнительная эффективность умений целителя повышаются на 1%.\nПоказатель тактической подготовки возрастает на 100 единиц.",
  },
  two_handed: {
    icon: "/images/equipment/buffs/weapon/two_handed.png",
    title: "Использование двуручного оружия",
    description:
      "Точность ударов в дальнем и ближнем бою и точность заклинаний повышаются на 7%, а дополнительный урон боевых умений и дополнительная эффективность исцеляющих умений — на 3%.\nУвеличивается дальность применения заклинаний и умений исцеления на 2 метра, а умений ближнего боя — на 1 метр.\nПовышается шанс обхода обороны на 60%, а показатель тактической подготовки — на 200 единиц.",
  },
  dual_wield: {
    icon: "/images/equipment/buffs/weapon/dual_wield.png",
    title: "Оружие в обеих руках",
    description:
      "При использовании оружия в обеих руках показатель сноровки возрастает на 177 единиц, а время применения умений сокращается на 5%.\nТочность ударов в дальнем и ближнем бою, а также точность заклинаний повышаются на 5%.\nКритический урон в ближнем и дальнем бою, а также критический урон заклинаний и критический эффект исцеления повышаются на 4%.\nШанс обхода обороны увеличивается на 30%, а показатель тактической подготовки — на 400 единиц.",
  },
};

export function getActiveWeaponBuff(equipment: UserEquipment[]): WeaponBuff | null {
  const mainEq = equipment.find((e) => e.slot === "weapon_main");
  const offEq = equipment.find((e) => e.slot === "weapon_off");

  const mainItem = mainEq?.item_name
    ? findGearItem("weapon_main", mainEq.item_name)
    : null;
  const offItem = offEq?.item_name
    ? findGearItem("weapon_off", offEq.item_name)
    : null;

  const mainHand = mainItem ? WEAPON_HANDEDNESS[mainItem.id] : undefined;
  const offHand = offItem ? WEAPON_HANDEDNESS[offItem.id] : undefined;

  if (mainHand === "two-handed") {
    return { key: "two_handed", ...WEAPON_BUFFS.two_handed };
  }
  if (offHand === "shield") {
    return { key: "shield", ...WEAPON_BUFFS.shield };
  }
  if (mainHand === "one-handed" && offHand === "one-handed") {
    return { key: "dual_wield", ...WEAPON_BUFFS.dual_wield };
  }

  return null;
}
