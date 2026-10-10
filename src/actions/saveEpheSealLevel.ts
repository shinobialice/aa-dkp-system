"use server";
import sql from "@/shared/lib/db";
import ensureCanEditUserData from "./ensureCanEditUserData";
import getUserEquipment, { type UserEquipment } from "./getUserEquipment";
import getUserEpheSeals, { type UserEpheSeals } from "./getUserEpheSeals";
import {
  EPHE_SLOT_TRACK,
  isValidEpheSealLevel,
} from "@/widgets/profile/ephe/epheSealsData";

export type EpheSealsUpdate = {
  epheSeals: UserEpheSeals;
  equipment: UserEquipment[];
};

const saveEpheSealLevel = async (
  userId: number,
  slot: string,
  level: number,
): Promise<EpheSealsUpdate> => {
  await ensureCanEditUserData(userId, "equipmentEditEnabled");

  if (!Object.hasOwn(EPHE_SLOT_TRACK, slot)) {
    throw new Error(`Неизвестный слот печати Эфе: ${slot}`);
  }
  if (!isValidEpheSealLevel(slot, level)) {
    throw new Error(`Некорректный уровень печати Эфе: ${level}`);
  }

  try {
    await sql`
      INSERT INTO user_ephe_seals (user_id, slot, level)
      VALUES (${userId}, ${slot}, ${level})
      ON CONFLICT (user_id, slot) DO UPDATE SET level = EXCLUDED.level
    `;
  } catch (error) {
    console.error("Ошибка при сохранении печати Эфе:", error);
    throw new Error("Не удалось сохранить печать Эфе");
  }

  const [epheSeals, equipment] = await Promise.all([
    getUserEpheSeals(userId),
    getUserEquipment(userId),
  ]);
  return { epheSeals, equipment };
};

export default saveEpheSealLevel;
