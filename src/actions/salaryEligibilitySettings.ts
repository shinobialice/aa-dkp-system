"use server";

import sql from "@/shared/lib/db";
import ensurePrivilieges from "./ensurePrivilieges";
import { revalidatePath } from "next/cache";
import { triggerFinanceRecalcForCurrentMonth } from "./recalculateFinanceForMonth";

export type SalaryEligibilitySettings = {
  primeEnabled: boolean;
  primeThresholdPercent: number;
  pointsEnabled: boolean;
  pointsThresholdPercent: number;
  dvBypassEnabled: boolean;
  gsEnabled: boolean;
};

// Совпадает с DEFAULT'ами в migration_salary_eligibility_settings.sql —
// подстраховка на случай, если singleton-строка ещё не создана в БД.
const DEFAULT_SETTINGS: SalaryEligibilitySettings = {
  primeEnabled: true,
  primeThresholdPercent: 30,
  pointsEnabled: false,
  pointsThresholdPercent: 20,
  dvBypassEnabled: true,
  gsEnabled: false,
};

export async function getSalaryEligibilitySettings(): Promise<SalaryEligibilitySettings> {
  let data;
  try {
    [data] = await sql<any[]>`
      SELECT * FROM salary_eligibility_settings WHERE id = 1
    `;
  } catch (error) {
    console.error("Ошибка при получении критериев допуска к ЗП:", error);
    throw new Error("Не удалось загрузить критерии допуска к зарплате");
  }

  if (!data) return DEFAULT_SETTINGS;

  return {
    primeEnabled: data.prime_enabled,
    primeThresholdPercent: data.prime_threshold_percent,
    pointsEnabled: data.points_enabled,
    pointsThresholdPercent: data.points_threshold_percent,
    dvBypassEnabled: data.dv_bypass_enabled,
    gsEnabled: data.gs_enabled,
  };
}

export async function updateSalaryEligibilitySettings(
  settings: SalaryEligibilitySettings,
) {
  await ensurePrivilieges(["Администратор"]);

  try {
    await sql<any[]>`
      INSERT INTO salary_eligibility_settings
        (id, prime_enabled, prime_threshold_percent, points_enabled,
         points_threshold_percent, dv_bypass_enabled, gs_enabled, updated_at)
      VALUES (
        1, ${settings.primeEnabled}, ${settings.primeThresholdPercent}, ${settings.pointsEnabled},
        ${settings.pointsThresholdPercent}, ${settings.dvBypassEnabled}, ${settings.gsEnabled}, now()
      )
      ON CONFLICT (id) DO UPDATE SET
        prime_enabled = EXCLUDED.prime_enabled,
        prime_threshold_percent = EXCLUDED.prime_threshold_percent,
        points_enabled = EXCLUDED.points_enabled,
        points_threshold_percent = EXCLUDED.points_threshold_percent,
        dv_bypass_enabled = EXCLUDED.dv_bypass_enabled,
        gs_enabled = EXCLUDED.gs_enabled,
        updated_at = EXCLUDED.updated_at
    `;
  } catch (error) {
    console.error("Ошибка при сохранении критериев допуска к ЗП:", error);
    throw new Error("Не удалось сохранить критерии допуска к зарплате");
  }

  revalidatePath("/settings");
  await triggerFinanceRecalcForCurrentMonth();
}
