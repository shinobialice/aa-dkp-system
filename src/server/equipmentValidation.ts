import "server-only";
import type { EquipmentInput } from "@/actions/saveUserEquipment";
import { isValidEquipmentSlot } from "@/widgets/profile/equipment/equipmentData";
import { isValidSealGrade } from "@/widgets/profile/seals/sealsData";
import {
  isValidEnchantLevel,
  isValidExtraProtectionLevel,
} from "@/widgets/profile/equipment/itemsData/statsFormula";
import { getEngravingSlotCount } from "@/widgets/profile/equipment/itemsData/engravingSlots";
import { isValidEngravingId } from "@/widgets/profile/equipment/itemsData/engravings";
import { isValidRuneId } from "@/widgets/profile/equipment/itemsData/runes";
import { WEAPON_HANDEDNESS } from "@/widgets/profile/equipment/itemsData/weaponHandedness";
import { findGearItem } from "@/widgets/profile/equipment/itemsData";
import {
  getCostumeRole,
  getCostumeSynthesisSlotCount,
  isValidCostumeSynthesisEffectId,
} from "@/widgets/profile/equipment/itemsData/costumeSynthesis";
import {
  getUnderwearRole,
  getUnderwearSynthesisSlotCount,
  isValidUnderwearSynthesisEffectId,
} from "@/widgets/profile/equipment/itemsData/underwearSynthesis";
import { isValidCursedArmorSynthesisEffectIds } from "@/widgets/profile/equipment/itemsData/cursedArmorSynthesis";
import { isValidRingSynthesisEffectIds } from "@/widgets/profile/equipment/itemsData/ringSynthesis";
import { isValidEphenSynthesisSelection } from "@/widgets/profile/equipment/itemsData/ephenSynthesis";
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
    isValid: (item) => isValidEnchantLevel(item.enchant),
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
    isValid: (item) => isValidCostumeSynthesis(item),
    message: (item) =>
      `Некорректные эффекты синтеза костюма в слоте: ${item.slot}`,
  },
  {
    isValid: (item) => isValidUnderwearSynthesis(item),
    message: (item) =>
      `Некорректные эффекты синтеза белья в слоте: ${item.slot}`,
  },
  {
    isValid: (item, { gearId }) =>
      item.cursedSynthesisEffects.length === 0 ||
      isValidCursedArmorSynthesisEffectIds(gearId, item.cursedSynthesisEffects),
    message: (item) => `Некорректные эффекты синтеза в слоте: ${item.slot}`,
  },
  {
    isValid: (item, { gearId }) =>
      isValidRingSynthesisEffectIds(gearId, item.ringSynthesisEffects),
    message: (item) =>
      `Некорректные эффекты синтеза кольца в слоте: ${item.slot}`,
  },
  {
    isValid: (item, { gearId }) =>
      isValidEphenSynthesisSelection(
        gearId,
        item.grade,
        item.ephenSynthesisPercent,
        item.ephenSynthesisPrimary,
        item.ephenSynthesisSecondary,
        item.ephenSynthesisTertiary,
      ),
    message: (item) =>
      `Некорректный синтез эфенского предмета в слоте: ${item.slot}`,
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

function isValidCostumeSynthesis(item: EquipmentInput) {
  if (item.costumeSynthesisEffects.length === 0) return true;
  const role = getCostumeRole(item.itemName ?? "");
  return (
    !!role &&
    item.costumeSynthesisEffects.length <=
      getCostumeSynthesisSlotCount(item.grade) &&
    item.costumeSynthesisEffects.every((id) =>
      isValidCostumeSynthesisEffectId(id, role),
    )
  );
}

function isValidUnderwearSynthesis(item: EquipmentInput) {
  if (item.underwearSynthesisEffects.length === 0) return true;
  const role = getUnderwearRole(item.itemName ?? "");
  return (
    !!role &&
    item.underwearSynthesisEffects.length <=
      getUnderwearSynthesisSlotCount(item.grade) &&
    item.underwearSynthesisEffects.every((id) =>
      isValidUnderwearSynthesisEffectId(id, role),
    )
  );
}
