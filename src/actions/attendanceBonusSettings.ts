"use server";

import supabase from "@/shared/lib/supabaseAdmin";
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
  const [{ data, error }, status] = await Promise.all([
    supabase
      .from("attendance_bonus_settings")
      .select("*")
      .eq("id", 1)
      .maybeSingle(),
    getGuildStatus(),
  ]);

  if (error) {
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
  const { data, error } = await supabase
    .from("attendance_bonus_settings")
    .select("*")
    .eq("id", 1)
    .maybeSingle();

  if (error) {
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

  const { error } = await supabase.from("attendance_bonus_settings").upsert({
    id: 1,
    pvp_points_freeshard: settings.pvpPointsFreeshard,
    pvp_points_pvp: settings.pvpPointsPvp,
    pvp_long_points_freeshard: settings.pvpLongPointsFreeshard,
    pvp_long_points_pvp: settings.pvpLongPointsPvp,
    proc_points_freeshard: settings.procPointsFreeshard,
    proc_points_pvp: settings.procPointsPvp,
    double_proc_points_freeshard: settings.doubleProcPointsFreeshard,
    double_proc_points_pvp: settings.doubleProcPointsPvp,
    updated_at: new Date().toISOString(),
  });

  if (error) {
    console.error("Ошибка при сохранении бонусов за посещение:", error);
    throw new Error("Не удалось сохранить бонусы за посещение");
  }

  revalidatePath("/settings");
}
