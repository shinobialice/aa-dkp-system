"use server";
import sql from "@/shared/lib/db";
import ensureCanEditUserData from "./ensureCanEditUserData";
import getUserEquipment, { UserEquipment } from "./getUserEquipment";
import {
  EPHE_SLOT_TRACK,
  EPHE_TRACK_MAX_LEVEL,
} from "@/widgets/profile/ephe/epheSealsData";

const maxAllEpheSealLevels = async (
  userId: number,
): Promise<UserEquipment[]> => {
  await ensureCanEditUserData(userId, "equipmentEditEnabled");

  try {
    await sql.begin(async (tx) => {
      for (const [slot, track] of Object.entries(EPHE_SLOT_TRACK)) {
        await tx`
          UPDATE user_equipment SET ephe_seal_level = ${EPHE_TRACK_MAX_LEVEL[track]}
          WHERE user_id = ${userId} AND slot = ${slot}
        `;
      }
    });
  } catch (error) {
    console.error("Ошибка при максимальной прокачке печатей Эфе:", error);
    throw new Error("Не удалось прокачать печати Эфе");
  }

  return getUserEquipment(userId);
};

export default maxAllEpheSealLevels;
