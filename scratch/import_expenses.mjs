import { createClient } from "@supabase/supabase-js";

const DRY_RUN = process.env.DRY_RUN !== "false";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
);

// [date, amount, target(цель), source(источник/кому)]
const RAW = [
  ["07.07.2026", "14 200", "Доделываю Анталона в 12 эп", "Dimonish"],
  ["19.07.2026", "63 000", "Т2 Коллекция боевых петов", "Играюсдиглом"],
  ["17.07.2026", "30 000", "Т2 Коллекция гладеров", "Keepingyouincheck"],
  ["19.07.2026", "63 000", "Т2 Коллекция боевых петов", "Manekii"],
  ["24.7.2026", "33 000", "Т2 Коллекция гладеров", "Wdx"],
  ["26.07.2026", "93 000", "Средоточие морей", "Аук"],
  ["26.07.2026", "400 000", "Крылья Корвуса", "Аук"],
  ["27.07.2026", "41 000", "Т2 Коллекция боевых петов", "Paulafucking"],
];

function parseDate(d) {
  const m = d.trim().match(/^(\d{1,2})\.(\d{1,2})\.(\d{4})$/);
  if (!m) return null;
  const [, day, month, year] = m;
  return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}T00:00:00.000Z`;
}

function parseAmount(a) {
  return parseInt(a.replace(/\s/g, ""), 10);
}

const rows = RAW.map(([date, amount, target, source]) => ({
  date: parseDate(date),
  amount: parseAmount(amount),
  target,
  source,
}));

console.log(JSON.stringify(rows, null, 2));
console.log("Сумма расходов:", rows.reduce((s, r) => s + r.amount, 0));

if (DRY_RUN) {
  console.log("\n[DRY RUN] Ничего не записано. DRY_RUN=false для реальной записи.");
  process.exit(0);
}

const { error } = await supabase.from("Expense").insert(rows);
if (error) {
  console.error("Ошибка вставки:", error);
  process.exit(1);
}
console.log(`Готово. Вставлено расходов: ${rows.length}`);
