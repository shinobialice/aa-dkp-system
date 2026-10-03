"use server";
import sql from "@/shared/lib/db";
import ensureCanEditUserData from "./ensureCanEditUserData";
import getUserEquipment, { type UserEquipment } from "./getUserEquipment";
import { assertValidEquipmentItem } from "@/server/equipmentValidation";

export type EquipmentInput = {
  slot: string;
  itemName: string | null;
  grade: number;
  enchant: number;
  extraProtection: number;
  engravings: number[];
  runeId: number;
  costumeSynthesisEffects: number[];
  underwearSynthesisEffects: number[];
  cursedSynthesisEffects: number[];
  ringSynthesisEffects: number[];
  ephenSynthesisPercent: number;
  ephenSynthesisPrimary: string;
  ephenSynthesisSecondary: string;
  ephenSynthesisTertiary: string[];
  epheSealLevel: number;
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

  items.forEach(assertValidEquipmentItem);

  const filled = items.flatMap((item) => {
    const itemName = item.itemName?.trim();
    return itemName ? [{ ...item, itemName }] : [];
  });

  try {
    await sql.begin(async (tx) => {
      await tx`DELETE FROM user_equipment WHERE user_id = ${userId}`;
      for (const item of filled) {
        await tx`
          INSERT INTO user_equipment (user_id, slot, item_name, grade, enchant, extra_protection, engravings, rune_id, costume_synthesis_effects, underwear_synthesis_effects, cursed_synthesis_effects, ring_synthesis_effects, ephen_synthesis_percent, ephen_synthesis_primary, ephen_synthesis_secondary, ephen_synthesis_tertiary, ephe_seal_level)
          VALUES (${userId}, ${item.slot}, ${item.itemName}, ${item.grade}, ${item.enchant}, ${item.extraProtection}, ${sql.array(item.engravings)}::integer[], ${item.runeId}, ${sql.array(item.costumeSynthesisEffects)}::integer[], ${sql.array(item.underwearSynthesisEffects)}::integer[], ${sql.array(item.cursedSynthesisEffects)}::integer[], ${sql.array(item.ringSynthesisEffects)}::integer[], ${item.ephenSynthesisPercent}, ${item.ephenSynthesisPrimary}, ${item.ephenSynthesisSecondary}, ${sql.array(item.ephenSynthesisTertiary)}::text[], ${item.epheSealLevel})
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
