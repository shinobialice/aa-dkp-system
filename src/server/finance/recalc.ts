import "server-only";
import { publishChanges } from "@/server/liveChanges";
import { getMoscowYearMonth } from "@/utils/getMoscowISOString";
import { generateGuildFunds } from "./generateGuildFunds";
import { generateSalaries } from "./generateSalaries";

// Фонд и зарплаты пересчитываются точечно из мест, которые реально меняют
// эти цифры: продажа/выдача лута, рейды и посещаемость, штрафы, тэги, бонусы,
// расходы, критерии допуска. Страница /loot/finance сама в БД не пишет.
//
// Двойной вызов generateGuildFunds: второй проход пересчитывает "в казне" с
// учётом реального аванса по игрокам (Salary.sentAmount), который появляется
// только после generateSalaries.
export async function recalculateFinanceForMonth(month: number, year: number) {
  await generateGuildFunds(month, year);
  try {
    await generateSalaries(month, year);
  } catch {
    // Нет допущенных пользователей за месяц (например, ещё нет данных) —
    // фонд всё равно должен отобразиться.
  }
  await generateGuildFunds(month, year);
  await publishChanges("finance");
}

// Пересчёт — производная величина: ошибка в нём не должна валить уже успешно
// применённое основное действие, поэтому она только логируется.
export async function triggerFinanceRecalc(month: number, year: number) {
  try {
    await recalculateFinanceForMonth(month, year);
  } catch (error) {
    console.error("Ошибка при пересчёте финансов:", error);
  }
}

// Для действий без явной даты (штрафы/тэги/доп. бонус/критерии допуска):
// они не хранят период, поэтому пересчитываем текущий открытый месяц —
// единственный, на который такое изменение может повлиять прямо сейчас.
export async function triggerFinanceRecalcForCurrentMonth() {
  const { year, month } = getMoscowYearMonth(new Date());
  await triggerFinanceRecalc(month, year);
}
