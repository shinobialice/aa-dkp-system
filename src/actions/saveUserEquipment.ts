"use server";
import sql from "@/shared/lib/db";
import type { UserEquipmentRow } from "@/shared/lib/dbTypes";
import { isRoleSlot, type RoleSlot } from "@/shared/config/roleSlots";
import ensureCanEditUserData from "./ensureCanEditUserData";
import getUserEquipment, { type UserEquipment } from "./getUserEquipment";
import {
  assertValidEquipmentItem,
  assertValidWeaponSet,
} from "@/server/equipmentValidation";

export type EquipmentInput = {
  slot: string;
  itemName: string | null;
  grade: number;
  enchant: number;
  engravings: number[];
  runeId: number;
  synthesisEffects: number[];
  synthesisPercent: number;
  epheSealLevel: number;
};

const saveUserEquipment = async (
  userId: number,
  roleSlot: RoleSlot,
  items: EquipmentInput[],
): Promise<UserEquipment[]> => {
  await ensureCanEditUserData(userId, "equipmentEditEnabled");

  if (!isRoleSlot(roleSlot)) {
    throw new Error("Некорректная роль");
  }

  const uniqueSlots = new Set(items.map((i) => i.slot));
  if (uniqueSlots.size !== items.length) {
    throw new Error("Слоты экипировки не должны повторяться");
  }

  items.forEach(assertValidEquipmentItem);
  assertValidWeaponSet(items);

  const filled = items.flatMap((item) => {
    const itemName = item.itemName?.trim();
    return itemName ? [{ ...item, itemName }] : [];
  });

  try {
    await sql.begin(async (tx) => {
      const epheRows = await tx<
        Pick<UserEquipmentRow, "slot" | "ephe_seal_level">[]
      >`
        SELECT slot, max(ephe_seal_level) AS ephe_seal_level
        FROM user_equipment WHERE user_id = ${userId}
        GROUP BY slot
      `;
      const epheLevels = new Map(
        epheRows.map((row) => [row.slot, row.ephe_seal_level]),
      );
      await tx`DELETE FROM user_equipment WHERE user_id = ${userId} AND role_slot = ${roleSlot}`;
      for (const item of filled) {
        const epheSealLevel = epheLevels.get(item.slot) ?? item.epheSealLevel;
        await tx`
          INSERT INTO user_equipment (user_id, role_slot, slot, item_name, grade, enchant, engravings, rune_id, synthesis_effects, synthesis_percent, ephe_seal_level)
          VALUES (${userId}, ${roleSlot}, ${item.slot}, ${item.itemName}, ${item.grade}, ${item.enchant}, ${sql.array(item.engravings)}::integer[], ${item.runeId}, ${sql.array(item.synthesisEffects)}::integer[], ${item.synthesisPercent}, ${epheSealLevel})
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
