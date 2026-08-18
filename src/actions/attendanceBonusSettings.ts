"use server";

import sql from "@/shared/lib/db";
import ensurePrivilieges from "./ensurePrivilieges";
import { revalidatePath } from "next/cache";
import { getGuildStatus } from "./guildStatusSettings";
import {
  DEFAULT_ATTENDANCE_BONUS_SETTINGS,
  DEFAULT_ATTENDANCE_BONUS_SETTINGS_ROW,
  type AttendanceBonusSettings,
  type AttendanceBonusSettingsRow,
} from "@/utils/attendanceBonusDefaults";

// Используется при создании/редактировании рейда — резолвит сразу под
// текущий режим гильдии (фришка/пвп), как getBosses() делает для dkp_points.
export async function getAttendanceBonusSettings(): Promise<AttendanceBonusSettings> {
  let data, status;
  try {
    [[data], status] = await Promise.all([
      sql<any[]>`SELECT * FROM attendance_bonus_settings WHERE id = 1`,
      getGuildStatus(),
    ]);
  } catch (error) {
    console.error("Ошибка при получении бонусов за посещение:", error);
    throw new Error("Не удалось загрузить бонусы за посещение");
  }

  if (!data) return DEFAULT_ATTENDANCE_BONUS_SETTINGS;

  const isPvp = status.mode === "pvp";

  return {
    pvpPoints: isPvp ? data.pvp_points_pvp : data.pvp_points_freeshard,
    pvpLongPoints: isPvp
      ? data.pvp_long_points_pvp
      : data.pvp_long_points_freeshard,
    procPoints: isPvp ? data.proc_points_pvp : data.proc_points_freeshard,
    doubleProcPoints: isPvp
      ? data.double_proc_points_pvp
      : data.double_proc_points_freeshard,
  };
}

// Используется в Настройках — отдаёт оба варианта (фришка и пвп) сразу,
// чтобы админ мог редактировать их одной формой.
export async function getAttendanceBonusSettingsForSettings(): Promise<AttendanceBonusSettingsRow> {
  let data;
  try {
    [data] = await sql<any[]>`
      SELECT * FROM attendance_bonus_settings WHERE id = 1
    `;
  } catch (error) {
    console.error("Ошибка при получении бонусов за посещение:", error);
    throw new Error("Не удалось загрузить бонусы за посещение");
  }

  if (!data) return DEFAULT_ATTENDANCE_BONUS_SETTINGS_ROW;

  return {
    pvpPointsFreeshard: data.pvp_points_freeshard,
    pvpPointsPvp: data.pvp_points_pvp,
    pvpLongPointsFreeshard: data.pvp_long_points_freeshard,
    pvpLongPointsPvp: data.pvp_long_points_pvp,
    procPointsFreeshard: data.proc_points_freeshard,
    procPointsPvp: data.proc_points_pvp,
    doubleProcPointsFreeshard: data.double_proc_points_freeshard,
    doubleProcPointsPvp: data.double_proc_points_pvp,
  };
}

export async function updateAttendanceBonusSettings(
  settings: AttendanceBonusSettingsRow,
) {
  await ensurePrivilieges(["Администратор"]);

  try {
    await sql<any[]>`
      INSERT INTO attendance_bonus_settings
        (id, pvp_points_freeshard, pvp_points_pvp, pvp_long_points_freeshard, pvp_long_points_pvp,
         proc_points_freeshard, proc_points_pvp, double_proc_points_freeshard, double_proc_points_pvp, updated_at)
      VALUES (
        1, ${settings.pvpPointsFreeshard}, ${settings.pvpPointsPvp},
        ${settings.pvpLongPointsFreeshard}, ${settings.pvpLongPointsPvp},
        ${settings.procPointsFreeshard}, ${settings.procPointsPvp},
        ${settings.doubleProcPointsFreeshard}, ${settings.doubleProcPointsPvp}, now()
      )
      ON CONFLICT (id) DO UPDATE SET
        pvp_points_freeshard = EXCLUDED.pvp_points_freeshard,
        pvp_points_pvp = EXCLUDED.pvp_points_pvp,
        pvp_long_points_freeshard = EXCLUDED.pvp_long_points_freeshard,
        pvp_long_points_pvp = EXCLUDED.pvp_long_points_pvp,
        proc_points_freeshard = EXCLUDED.proc_points_freeshard,
        proc_points_pvp = EXCLUDED.proc_points_pvp,
        double_proc_points_freeshard = EXCLUDED.double_proc_points_freeshard,
        double_proc_points_pvp = EXCLUDED.double_proc_points_pvp,
        updated_at = EXCLUDED.updated_at
    `;
  } catch (error) {
    console.error("Ошибка при сохранении бонусов за посещение:", error);
    throw new Error("Не удалось сохранить бонусы за посещение");
  }

  revalidatePath("/settings");
}
