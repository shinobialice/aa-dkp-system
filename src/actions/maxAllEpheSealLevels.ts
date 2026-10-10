"use server";
import sql from "@/shared/lib/db";
import ensureCanEditUserData from "./ensureCanEditUserData";
import getUserEquipment from "./getUserEquipment";
import getUserEpheSeals from "./getUserEpheSeals";
import type { EpheSealsUpdate } from "./saveEpheSealLevel";
import {
  EPHE_SLOT_TRACK,
  EPHE_TRACK_MAX_LEVEL,
} from "@/widgets/profile/ephe/epheSealsData";

const maxAllEpheSealLevels = async (
  userId: number,
): Promise<EpheSealsUpdate> => {
  await ensureCanEditUserData(userId, "equipmentEditEnabled");

  const rows = Object.entries(EPHE_SLOT_TRACK).map(([slot, track]) => ({
    user_id: userId,
    slot,
    level: EPHE_TRACK_MAX_LEVEL[track],
  }));

  try {
    await sql`
      INSERT INTO user_ephe_seals ${sql(rows)}
      ON CONFLICT (user_id, slot) DO UPDATE SET level = EXCLUDED.level
    `;
  } catch (error) {
    console.error("Ошибка при максимальной прокачке печатей Эфе:", error);
    throw new Error("Не удалось прокачать печати Эфе");
  }

  const [epheSeals, equipment] = await Promise.all([
    getUserEpheSeals(userId),
    getUserEquipment(userId),
  ]);
  return { epheSeals, equipment };
};

export default maxAllEpheSealLevels;
