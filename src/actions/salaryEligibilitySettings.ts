"use server";

import supabase from "@/shared/lib/supabaseAdmin";
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
  const { data, error } = await supabase
    .from("salary_eligibility_settings")
    .select("*")
    .eq("id", 1)
    .maybeSingle();

  if (error) {
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

  const { error } = await supabase.from("salary_eligibility_settings").upsert({
    id: 1,
    prime_enabled: settings.primeEnabled,
    prime_threshold_percent: settings.primeThresholdPercent,
    points_enabled: settings.pointsEnabled,
    points_threshold_percent: settings.pointsThresholdPercent,
    dv_bypass_enabled: settings.dvBypassEnabled,
    gs_enabled: settings.gsEnabled,
    updated_at: new Date().toISOString(),
  });

  if (error) {
    console.error("Ошибка при сохранении критериев допуска к ЗП:", error);
    throw new Error("Не удалось сохранить критерии допуска к зарплате");
  }

  revalidatePath("/settings");
  await triggerFinanceRecalcForCurrentMonth();
}
