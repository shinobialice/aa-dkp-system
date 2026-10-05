import "server-only";
import type { EquipmentInput } from "@/actions/saveUserEquipment";
import { isValidEquipmentSlot } from "@/widgets/profile/equipment/equipmentData";
import { isValidSealGrade } from "@/widgets/profile/seals/sealsData";
import {
  getMaxEnchant,
  isValidEnchantLevel,
  isValidExtraProtectionLevel,
} from "@/widgets/profile/equipment/itemsData/statsFormula";
import { getEngravingSlotCount } from "@/widgets/profile/equipment/itemsData/engravingSlots";
import { isValidEngravingId } from "@/widgets/profile/equipment/itemsData/engravings";
import { isValidRuneId } from "@/widgets/profile/equipment/itemsData/runes";
import {
  WEAPON_HANDEDNESS,
  isTwoHandedMainWeapon,
} from "@/widgets/profile/equipment/itemsData/weaponHandedness";
import { findGearItem } from "@/widgets/profile/equipment/itemsData";
import { isValidSynthesisSelection } from "@/widgets/profile/equipment/itemsData/synthesis";
import { isValidEpheSealLevel } from "@/widgets/profile/ephe/epheSealsData";

type CheckContext = {
  gearItemId: number | undefined;
  gearId: number;
  handedness: (typeof WEAPON_HANDEDNESS)[number] | undefined;
};

type Check = {
  isValid: (item: EquipmentInput, context: CheckContext) => boolean;
  message: (item: EquipmentInput) => string;
};

const NO_GEAR_ID = -1;

const CHECKS: Check[] = [
  {
    isValid: (item) => isValidEquipmentSlot(item.slot),
    message: (item) => `Неизвестный слот экипировки: ${item.slot}`,
  },
  {
    isValid: (item) => isValidSealGrade(item.grade),
    message: (item) => `Некорректный грейд: ${item.grade}`,
  },
  {
    isValid: (item, { gearItemId }) =>
      isValidEnchantLevel(item.enchant, getMaxEnchant(gearItemId)),
    message: (item) => `Некорректный уровень заточки: ${item.enchant}`,
  },
  {
    isValid: (item) =>
      isValidExtraProtectionLevel(item.extraProtection, item.slot),
    message: (item) =>
      `Некорректный уровень защиты от доп. урона: ${item.extraProtection}`,
  },
  {
    isValid: (item, { gearItemId, handedness }) =>
      item.engravings.every(
        (id) =>
          id === 0 || isValidEngravingId(id, item.slot, handedness, gearItemId),
      ),
    message: (item) => `Некорректная гравировка в слоте: ${item.slot}`,
  },
  {
    isValid: (item) =>
      item.engravings.length <= getEngravingSlotCount(item.slot, item.grade),
    message: (item) => `Слишком много гравировок для слота: ${item.slot}`,
  },
  {
    isValid: (item, { gearItemId, handedness }) =>
      item.runeId === 0 ||
      isValidRuneId(item.runeId, item.slot, handedness, gearItemId),
    message: (item) =>
      `Некорректный лунный камень / руна в слоте: ${item.slot}`,
  },
  {
    isValid: (item, { gearId }) =>
      isValidSynthesisSelection(
        gearId,
        item.grade,
        item.synthesisEffects,
        item.synthesisPercent,
      ),
    message: (item) => `Некорректные эффекты синтеза в слоте: ${item.slot}`,
  },
  {
    isValid: (item) => isValidEpheSealLevel(item.slot, item.epheSealLevel),
    message: (item) => `Некорректный уровень печати Эфе в слоте: ${item.slot}`,
  },
];

export function assertValidEquipmentItem(item: EquipmentInput) {
  const gearItem = findGearItem(item.slot, item.itemName);
  const context: CheckContext = {
    gearItemId: gearItem?.id,
    gearId: gearItem?.id ?? NO_GEAR_ID,
    handedness: gearItem ? WEAPON_HANDEDNESS[gearItem.id] : undefined,
  };
  const failed = CHECKS.find((check) => !check.isValid(item, context));
  if (failed) throw new Error(failed.message(item));
}

export function assertValidWeaponSet(items: EquipmentInput[]) {
  const mainHand = items.find((item) => item.slot === "weapon_main");
  const offHand = items.find((item) => item.slot === "weapon_off");
  if (isTwoHandedMainWeapon(mainHand?.itemName) && offHand?.itemName?.trim()) {
    throw new Error("С двуручным оружием нельзя надеть предмет во вторую руку");
  }
}
