import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";

const DRY_RUN = process.env.DRY_RUN !== "false";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
);

// Итем -> item_type.name (для точного/контекстного маппинга по названиям из вклада)
const ITEM_NAME_MAP = {
  "Эссенция кошмара": "Эссенция кошмара",
  "Эссенция гнева": "Эссенция гнева",
  "Эссенция ужаса": "Эссенция ужаса",
  "Эссенки акхиума": "Эссенция звездного акхиума",
  "Рокана": "Ро'кана, Безумие морей",
  "Сапоги ифериского советника": "Сапоги иферийского советника",
  "Кристалл": "Кристалл властелина морей",
  "Клык Калидиса": "Клык Калидиса",
  "Средоточие морей": "Средоточие морей",
  "Свиток пробуждения": "Свиток пробуждения драконоборца",
  "Щит": "Анд'хакар, Чернильная тьма",
  "Глаз Левиафана": "Глаз Левиафана",
  "Лоскут Кожи Калидиса": "Лоскут кожи Калидиса",
  "Застывшее пламя": "Застывшее пламя",
  "Мантия иферийского советника": "Мантия иферийского советника",
  "Равимар": "Рави’мар, Драконья ярость",
  "Средоточие безумия": "Средоточие безумия",
  "Корона": "Корона",
  "Поножи иферийского советника": "Поножи иферийского советника",
  "РБ ОПЫТ": "Эссенция ярости",
  "Рб ОПЫТ": "Эссенция ярости",
  "Генетический материал": "Генетический материал дракона",
  "Грава(Корвус)": "Аметистовая гравировка северной звезды",
  "Моргур": "Мор’гур, Смерть драконов",
  'Глайдер "Рассекатель небес"': "Глайдер «Рассекатель небес»",
  'Глайдер "Властелин морей"': "Глайдер «Властелин морей»",
  "Свиток стойкости": "В казну", // сводная строка без даты, идёт как есть в казну
  "Всякие мелочи": "В казну", // сводная строка
  "Казна": "В казну", // сводная строка (сам остаток в казну)
};

const STATUS_MAP = {
  "На складе": "В наличии",
  "Продаётся": "В наличии",
  "Выдано": "Выдано",
  "В казну": "В казну",
};

function parseDate(d) {
  // DD.MM.YYYY -> YYYY-MM-DD
  const m = d.trim().match(/^(\d{1,2})\.(\d{1,2})\.(\d{4})$/);
  if (!m) return null;
  const [, day, month, year] = m;
  return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
}

function parsePrice(p) {
  if (!p || !p.trim()) return null;
  const cleaned = p.trim().replace(/\s/g, "").replace(",", ".");
  const n = parseFloat(cleaned);
  return isNaN(n) ? null : n;
}

const raw = readFileSync("./scratch/loot_july_raw.tsv", "utf8");
const lines = raw.split("\n").filter((l) => l.trim().length > 0);

const rows = [];
for (const line of lines) {
  const cols = line.split("\t");
  const [dateRaw, boss, itemRaw, qtyRaw, priceRaw, statusRaw, soldDateRaw, , soldToRaw, boolRaw] =
    cols;

  const item = (itemRaw || "").trim();
  const mappedItemName = ITEM_NAME_MAP[item];
  if (!mappedItemName) {
    console.error("НЕТ МАППИНГА для предмета:", JSON.stringify(item), "raw line:", line);
    continue;
  }

  const isSummaryRow = !dateRaw || !dateRaw.trim();
  const acquiredDate = isSummaryRow ? "2026-07-01" : parseDate(dateRaw);
  if (!acquiredDate) {
    console.error("Не удалось распарсить дату:", JSON.stringify(dateRaw), "line:", line);
    continue;
  }

  const quantity = isSummaryRow ? 1 : parseInt((qtyRaw || "1").trim() || "1", 10);
  const price = parsePrice(priceRaw);
  const statusText = (statusRaw || "").trim();
  const soldTo = (soldToRaw || "").trim() || null;
  const soldDate = parseDate((soldDateRaw || "").trim());

  let status;
  if (statusText && STATUS_MAP[statusText]) {
    status = STATUS_MAP[statusText];
  } else if (soldTo || price !== null) {
    status = "Продано";
  } else {
    status = "В наличии";
  }

  rows.push({
    source: (boss || "").trim() || null,
    item_type_name: mappedItemName,
    quantity,
    price,
    status,
    acquired_at: acquiredDate,
    sold_at: soldDate,
    sold_to: soldTo,
    is_summary_row: isSummaryRow,
  });
}

console.log(`Распарсено строк: ${rows.length} (из ${lines.length} строк файла)`);

// Resolve item_type_name -> id
const { data: itemTypes } = await supabase.from("item_type").select("id, name");
const nameToId = new Map(itemTypes.map((it) => [it.name, it.id]));

const missingItemTypes = new Set();
for (const r of rows) {
  if (!nameToId.has(r.item_type_name)) missingItemTypes.add(r.item_type_name);
}
if (missingItemTypes.size) {
  console.error("Эти названия предметов не найдены в item_type (примените миграцию):", [...missingItemTypes]);
  process.exit(1);
}

// Resolve sold_to -> user_id (best effort by username)
const { data: users } = await supabase.from("user").select("id, username");
const usernameToId = new Map(users.map((u) => [u.username.trim(), u.id]));

const unmatchedRecipients = new Set();
for (const r of rows) {
  if (r.sold_to && !usernameToId.has(r.sold_to)) unmatchedRecipients.add(r.sold_to);
}
console.log("Получатели без совпадения по юзернейму (останутся текстом в sold_to, sold_to_user_id=null):", [...unmatchedRecipients]);

const totalByStatus = {};
let totalPriceSum = 0;
for (const r of rows) {
  totalByStatus[r.status] = (totalByStatus[r.status] || 0) + 1;
  totalPriceSum += r.price || 0;
}
console.log("Строк по статусам:", totalByStatus);
console.log("Сумма всех price (по всем статусам, для справки):", totalPriceSum);

const soldSum = rows.filter((r) => r.status === "Продано").reduce((s, r) => s + (r.price || 0), 0);
console.log("Сумма price по статусу 'Продано' (это пойдёт в доход гильдии):", soldSum);

if (DRY_RUN) {
  console.log("\n[DRY RUN] Ничего не записано. DRY_RUN=false для реальной записи.");
  process.exit(0);
}

const insertRows = rows.map((r) => ({
  item_type_id: nameToId.get(r.item_type_name),
  quantity: r.quantity,
  price: r.price,
  status: r.status,
  source: r.source,
  acquired_at: r.acquired_at,
  sold_at: r.sold_at,
  sold_to: r.sold_to,
  sold_to_user_id: r.sold_to ? usernameToId.get(r.sold_to) ?? null : null,
  created_at: new Date().toISOString(),
}));

const { error } = await supabase.from("loot").insert(insertRows);
if (error) {
  console.error("Ошибка вставки:", error);
  process.exit(1);
}
console.log(`Готово. Вставлено строк лута: ${insertRows.length}`);
