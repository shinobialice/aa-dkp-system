"use server";
import sql from "@/shared/lib/db";
import ensureCanEditUserData from "./ensureCanEditUserData";
import getUserEquipment, { UserEquipment } from "./getUserEquipment";
import { isValidEquipmentSlot } from "@/widgets/profile/equipment/equipmentData";
import { isValidSealGrade } from "@/widgets/profile/seals/sealsData";
import {
  isValidEnchantLevel,
  isValidExtraProtectionLevel,
} from "@/widgets/profile/equipment/itemsData/statsFormula";
import { getEngravingSlotCount } from "@/widgets/profile/equipment/itemsData/engravingSlots";
import { isValidEngravingId } from "@/widgets/profile/equipment/itemsData/engravings";
import { WEAPON_HANDEDNESS } from "@/widgets/profile/equipment/itemsData/weaponHandedness";
import { findGearItem } from "@/widgets/profile/equipment/itemsData";

export type EquipmentInput = {
  slot: string;
  itemName: string | null;
  grade: number;
  enchant: number;
  extraProtection: number;
  engravings: number[];
};

const saveUserEquipment = async (
  userId: number,
  items: EquipmentInput[],
): Promise<UserEquipment[]> => {
  await ensureCanEditUserData(userId, "equipmentEditEnabled");

  const uniqueSlots = new Set(items.map((i) => i.slot));
  if (uniqueSlots.size !== items.length) {
    throw new Error("Слоты экипировки не должны повторяться");
  }

  for (const item of items) {
    if (!isValidEquipmentSlot(item.slot)) {
      throw new Error(`Неизвестный слот экипировки: ${item.slot}`);
    }
    if (!isValidSealGrade(item.grade)) {
      throw new Error(`Некорректный грейд: ${item.grade}`);
    }
    if (!isValidEnchantLevel(item.enchant)) {
      throw new Error(`Некорректный уровень заточки: ${item.enchant}`);
    }
    if (!isValidExtraProtectionLevel(item.extraProtection)) {
      throw new Error(
        `Некорректный уровень защиты от доп. урона: ${item.extraProtection}`,
      );
    }
    const gearItem = findGearItem(item.slot, item.itemName);
    const handedness = gearItem ? WEAPON_HANDEDNESS[gearItem.id] : undefined;
    if (
      !item.engravings.every(
        (id) =>
          id === 0 ||
          isValidEngravingId(id, item.slot, handedness, gearItem?.id),
      )
    ) {
      throw new Error(`Некорректная гравировка в слоте: ${item.slot}`);
    }
    const maxSlots = getEngravingSlotCount(item.slot, item.grade);
    if (item.engravings.length > maxSlots) {
      throw new Error(`Слишком много гравировок для слота: ${item.slot}`);
    }
  }

  const filled = items.filter((i) => (i.itemName ?? "").trim() !== "");

  try {
    await sql.begin(async (tx) => {
      await tx`DELETE FROM user_equipment WHERE user_id = ${userId}`;
      for (const item of filled) {
        await tx`
          INSERT INTO user_equipment (user_id, slot, item_name, grade, enchant, extra_protection, engravings)
          VALUES (${userId}, ${item.slot}, ${item.itemName!.trim()}, ${item.grade}, ${item.enchant}, ${item.extraProtection}, ${sql.array(item.engravings)}::integer[])
        `;
      }
    });
  } catch (error) {
    console.error("Ошибка при сохранении экипировки:", error);
    throw new Error("Не удалось сохранить экипировку");
  }

  return getUserEquipment(userId);
};

export default saveUserEquipment;
