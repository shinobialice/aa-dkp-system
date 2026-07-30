"use server";

import { generateGuildFunds } from "./generateGuildFunds";
import { generateSalaries } from "./financeActions";
import ensurePrivilieges from "./ensurePrivilieges";

// Раньше фонд/зарплаты пересчитывались по таймеру на клиенте (каждые 60 сек,
// причём для каждого открытого /loot/finance) — тяжело и с задержкой. Теперь
// пересчёт точечно вызывается из мест, которые реально меняют эти цифры:
// продажа/выдача лута (distributeLootItems.ts, lootActions.ts) и рейды/
// посещаемость (createRaidEvent.ts, updateEvent.ts). Страница /loot/finance
// сама больше не пишет в БД — только читает уже посчитанное.
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
}

// Безопасный вызов пересчёта из мест, которые меняют данные, влияющие на
// фонд/зарплаты (продажа лута, рейды, штрафы, тэги, бонусы, расходы,
// критерии допуска). Пересчёт — производная величина: ошибка в нём не
// должна валить уже успешно применённое основное действие, поэтому ошибка
// только логируется.
export async function triggerFinanceRecalc(month: number, year: number) {
  try {
    await recalculateFinanceForMonth(month, year);
  } catch (err) {
    console.error("Ошибка при пересчёте финансов:", err);
  }
}

// Для действий без явной даты (штрафы/тэги/доп. бонус/критерии допуска) —
// они не хранят период, за который применяются, поэтому всегда пересчитываем
// текущий открытый месяц (это единственный, на который такое изменение
// в принципе может повлиять прямо сейчас).
export async function triggerFinanceRecalcForCurrentMonth() {
  const now = new Date();
  await triggerFinanceRecalc(now.getMonth() + 1, now.getFullYear());
}

// Ручной пересчёт по кнопке "Пересчитать сейчас" на /loot/finance — в отличие
// от автоматических триггеров выше (продажа лута, рейды), которые дергают
// recalculateFinanceForMonth напрямую и не должны требовать админку (их могут
// вызывать Raid Manager и обычные продажи), эта обёртка — единственная точка
// входа для самой кнопки, поэтому проверка прав именно здесь.
export async function recalculateFinanceForMonthAsAdmin(
  month: number,
  year: number,
) {
  await ensurePrivilieges(["Администратор"]);
  await recalculateFinanceForMonth(month, year);
}
