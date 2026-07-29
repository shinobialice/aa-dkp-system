import { createClient } from "@supabase/supabase-js";

const DRY_RUN = process.env.DRY_RUN !== "false";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
);

// Только предметы, которые реально трекаются в системе (lootColumns.ts).
// 6 безымянных колонок из экселя туда не входят — пропускаем.
const ROKANA = "Ро'кана, Безумие морей";
const SHIELD = "Анд'хакар, Чернильная тьма"; // "Щит с Кряки"
const GLIDER = "Глайдер охотника на драконов"; // "Летак Кряки/Драк"
const FREGAT = "Фрегат";

const RAW = `
Гуатамма	FALSE	FALSE		TRUE	30.04.22	FALSE	В наличии	TRUE	07.12.21	FALSE		FALSE		FALSE		FALSE		FALSE		FALSE
Дайтедроп	FALSE	FALSE	01.01.2024	TRUE		FALSE		FALSE		FALSE		FALSE		FALSE		FALSE		FALSE		FALSE
Пыльсдуй	FALSE	FALSE		FALSE		FALSE		FALSE		FALSE		FALSE		FALSE		FALSE		FALSE		FALSE		Т2 Коллекция боевых питомцев	25.02.25	Т2 Коллекция глайдеров	29.12.25
Dimonish	FALSE	TRUE	Хрен знает	FALSE		FALSE	Подарили	TRUE	22.07.20	FALSE		FALSE		TRUE		FALSE		FALSE		FALSE		Фениксы	Подарили	Дьявокрыл, Маназмей	Когда то там
Keepingyouincheck 	FALSE	FALSE	В наличии	FALSE	В наличии	TRUE	01.05.2026	FALSE		FALSE		FALSE		FALSE		FALSE		FALSE		FALSE		Т2 коллекция боевых питомцев	14.01.26
Raivent	FALSE	TRUE	21.10.23	FALSE	В наличии	FALSE	В наличии	FALSE	В наличии	FALSE		FALSE		FALSE		FALSE		FALSE		FALSE		Т2 Коллекция боевых питомцев	12.10.25	Квадрум, Мистирион	10.05.23
Бистиарий	FALSE	FALSE	Когда то там	FALSE	Когда то там	FALSE	Когда то там	FALSE	Когда то там	FALSE		FALSE		FALSE		FALSE		FALSE		FALSE
Задиглвголову	FALSE	FALSE	В наличии	TRUE	08.02.2025	FALSE	В наличии	FALSE		FALSE		FALSE		FALSE		FALSE		FALSE		FALSE		Т2 Коллекция боевых питомцев	22.02.2025
Кмспозачатию	FALSE	FALSE		TRUE		FALSE		FALSE	В наличии	FALSE		FALSE		FALSE		FALSE		FALSE		FALSE
Необъятнаябездна	FALSE	FALSE	В наличии	TRUE		FALSE	В наличии	FALSE	В наличии	FALSE		FALSE		FALSE		FALSE		FALSE		FALSE		Т2 Коллекция боевых питомцев	04.12.25
Ноеездесьнет	FALSE	FALSE		TRUE	15.06.2026	FALSE		FALSE		FALSE		FALSE		FALSE		FALSE		FALSE		FALSE		Т2 Коллекция боевых питомцев	26.12.25
Depai	FALSE	FALSE		TRUE		FALSE		FALSE		FALSE		FALSE		FALSE		FALSE		FALSE		FALSE
Nidhoggur	FALSE	FALSE	В наличии	TRUE	Когдла то там	TRUE	Когда то там	FALSE	В наличии	FALSE		FALSE		FALSE		FALSE		FALSE		FALSE
Takamurra	FALSE	FALSE	В наличии	FALSE	В наличии	FALSE	В наличии	TRUE		FALSE		FALSE		FALSE		FALSE		FALSE		FALSE
Атутчтоязабыл	FALSE	TRUE	07.11.25	TRUE		FALSE	В наличии	FALSE		FALSE		FALSE		FALSE		FALSE		FALSE		FALSE
Метх	FALSE	TRUE		TRUE	19.07.25	FALSE	В наличии	FALSE	В наличии	FALSE		FALSE		FALSE		FALSE		FALSE		FALSE		Феникс(жёлтый)	07.02.24	Т2 коллекция боевых питомцев	08.05.25
Рейков	FALSE	FALSE	Когда то там	TRUE	01.01.24	FALSE	В наличии	TRUE		FALSE		FALSE		FALSE		FALSE		FALSE		FALSE		Т2 Коллекция боевых питомцев	02.03.25	Феникс, Квадрум	13.11.23
Panibrat	FALSE	TRUE	29.06.25	TRUE		FALSE	В наличии	TRUE		FALSE		FALSE		FALSE		FALSE		FALSE		FALSE		Т2 Коллекция Глайдеров	30.06.2026
Wdx	FALSE	FALSE		FALSE		FALSE		FALSE		FALSE		FALSE		FALSE		FALSE		FALSE		FALSE		Т2 Коллекция гладеров	24.07.2026
Тройнымипохлебалу	FALSE	TRUE		TRUE		FALSE		FALSE		FALSE		FALSE		FALSE		FALSE		FALSE		FALSE		Дьявокрыл, Квадрум	Когда то там
Draganc	FALSE	FALSE	30.04.23	FALSE		FALSE	В наличии	TRUE	21.01.23	FALSE		FALSE		FALSE		FALSE		FALSE		FALSE
Insee	FALSE	FALSE	Когда то там	FALSE		FALSE	В наличии	FALSE		FALSE		FALSE		FALSE		FALSE		FALSE		FALSE		Т2 Коллекция боевых питомцев	01.01.25
Mnrqw	FALSE	TRUE	В наличии	FALSE	В наличии	FALSE	В наличии	FALSE	В наличии	FALSE		FALSE		FALSE		FALSE		FALSE		FALSE		Т2 Коллекция глайдеров	06.03.25
Nadson	FALSE	FALSE	В наличии	TRUE		FALSE	В наличии	FALSE		FALSE		FALSE		FALSE		FALSE		FALSE		FALSE		Квадрум, Феникс	29.12.23	Т2 Коллекция глайдеров	03.06.2025
Sarin	FALSE	TRUE	В наличии	FALSE	В наличии	FALSE	В наличии	FALSE	В наличии	FALSE		FALSE		FALSE		FALSE		FALSE		FALSE		Глайдер "Рассекатель небес"	31.01.23
Yidhari	FALSE	TRUE	В наличии	TRUE		FALSE	В наличии	FALSE	В наличии	FALSE		FALSE		FALSE		FALSE		FALSE		FALSE
Пельменебл	FALSE	TRUE	В наличии	TRUE		FALSE		FALSE	В наличии	FALSE		FALSE		FALSE		FALSE		FALSE		FALSE
Clado	FALSE	TRUE	01.02.24	TRUE	В наличии	FALSE	В наличии	FALSE	В наличии	FALSE		FALSE		FALSE		FALSE		FALSE		FALSE		Т2 Коллекция глайдеров	02.01.2025
Lekontant	FALSE	FALSE	В наличии	FALSE		FALSE	В наличии	FALSE	В наличии	FALSE		FALSE		FALSE		FALSE		FALSE		FALSE
Tairneanach	FALSE	FALSE		FALSE		FALSE		FALSE		FALSE		FALSE		FALSE		FALSE		FALSE		FALSE		Т2 Коллекция глайдеров	01.08.25
Парирум	FALSE	TRUE	В наличии	TRUE		FALSE	В наличии	FALSE	В наличии	FALSE		FALSE		FALSE		FALSE		FALSE		FALSE
Бритуля	FALSE	FALSE		TRUE		FALSE		FALSE		FALSE		FALSE		FALSE		FALSE		FALSE		FALSE
Играюсдиглом	FALSE	TRUE		FALSE	В наличии	FALSE	В наличии	FALSE		FALSE		FALSE		FALSE		FALSE		FALSE		FALSE		Квадрум, Феникс	24.12.23	Т2 Коллекция боевых питомцев	19.07.26
Исполинскийкозодой	FALSE	FALSE		TRUE		FALSE	Когда то там	FALSE		FALSE		FALSE		FALSE		FALSE		FALSE		FALSE		Т2 Коллекция глайдеров	12.07.2025
Кидаюфлешки	FALSE	FALSE		FALSE	В наличии	FALSE	В наличии	FALSE	В наличии	FALSE		FALSE		FALSE		FALSE		FALSE		FALSE		Мистерион ужас ночи, Феникс	29.06.23	Т2 Коллекция боевых питомцев	04.08.25
Нарасслабоне	FALSE	FALSE		TRUE		FALSE		FALSE		FALSE		FALSE		FALSE		FALSE		FALSE		FALSE
Прыгайкискаъ	FALSE	FALSE		FALSE	В наличии	FALSE	В наличии	FALSE	В наличии	FALSE		FALSE		FALSE		FALSE		FALSE		FALSE		Т2 Коллекция боевых питомцев	Когда то там
Садтеневыххимер	FALSE	FALSE		FALSE	В наличии	FALSE		FALSE	В наличии	FALSE		FALSE		FALSE		FALSE		FALSE		FALSE
Слипдам	FALSE	FALSE		TRUE		FALSE		FALSE		FALSE		FALSE		FALSE		FALSE		FALSE		FALSE
Тутмоглабытьваша	FALSE	TRUE	В наличии	FALSE	В наличии	FALSE	В наличии	TRUE	Когда то там	FALSE		FALSE		FALSE		FALSE		FALSE		FALSE		Спек тактика + Авиара	01.03.24	Т2 Коллекция боевых питомцев	14.02.25
Уменясновалапки	FALSE	TRUE	23.03.24	TRUE	06.12.22	TRUE	Т2 Коллекция глайдеров 01.08.2025	TRUE	08.03.22	FALSE		FALSE		FALSE		FALSE		FALSE		FALSE		Феникс	01.12.21	Т2 Коллекция боевых питомцев	11.05.2025
Чорти	FALSE	FALSE		TRUE	19.06.26	FALSE		FALSE		FALSE		FALSE		FALSE		FALSE		FALSE		FALSE
Ahegaonnesh	FALSE	FALSE		TRUE	30.12.21	FALSE	В наличии	TRUE	20.09.22	FALSE		FALSE		FALSE		FALSE		FALSE		FALSE		Т2 Коллекция глайдеров	01.06.25
Arasaka	FALSE	FALSE		TRUE	18.07.2025	FALSE	В наличии	FALSE	В наличии	FALSE		FALSE		FALSE		FALSE		FALSE		FALSE		Т2 Коллекция глайдеров	28.05.2025
Daisynotpie	FALSE	FALSE		FALSE	В наличии	FALSE	В наличии	FALSE		FALSE		FALSE		FALSE		FALSE		FALSE		FALSE
Felanza	FALSE	TRUE		TRUE	27.06.25	FALSE	В наличии	TRUE		FALSE		FALSE		FALSE		FALSE		FALSE		FALSE		ККЛ	02.01.25	Т2 Коллекция боевых питомцев	23.05.25
Flams	FALSE	FALSE		TRUE	21.06.2026	FALSE		FALSE		FALSE		FALSE		FALSE		FALSE		FALSE		FALSE
Keepingyouobsessed	FALSE	TRUE		FALSE	В наличии	FALSE		FALSE		FALSE		FALSE		FALSE		FALSE		FALSE		FALSE
Loraiine	FALSE	FALSE		TRUE	17.11.2024	FALSE	В наличии	FALSE		FALSE		FALSE		FALSE		FALSE		FALSE		FALSE		Т2 Коллекция боевых питомцев	16.02.25
Manekii	FALSE	FALSE		TRUE	01.06.26	TRUE		FALSE	В наличии	FALSE		FALSE		FALSE		FALSE		FALSE		FALSE		Т2 Коллекция боевых питомцев	27.07.2026
Moonflare	FALSE	FALSE	В наличии	TRUE	27.01.24	FALSE	В наличии	FALSE		FALSE		FALSE		FALSE		FALSE		FALSE		FALSE		Мистерион, Феникс	19.07.23	Т2 Коллекция глайдеров	15.06.25
Помянем	FALSE	FALSE		TRUE	28.05.22	FALSE	В наличии	TRUE	Когда то там	FALSE		FALSE		FALSE		FALSE		FALSE		FALSE				Квадрум, Дьявокрыл	Когда то там
Osmium	FALSE	FALSE		TRUE	08.07.23	TRUE	18.09.22	TRUE	19.09.22	FALSE		FALSE		FALSE		FALSE		FALSE		FALSE				Дьявокрыл, Мистирион	04.01.23
Paulafucking	FALSE	FALSE	17.06.26	FALSE	В наличии	FALSE		FALSE		FALSE		FALSE		FALSE		FALSE		FALSE		FALSE		Т2 Коллекция боевых питомцев	27.07.2026
Rigell	FALSE	FALSE	В наличии	FALSE	В наличии	FALSE	В наличии	TRUE	12.09.22	FALSE		FALSE		FALSE		FALSE		FALSE		FALSE		Т2 Коллекция боевых питомцев	01.02.2025	Дьявокрыл, Квадрум	28.12.22
Vilvian	FALSE	FALSE		TRUE	13.01.2025	FALSE	В наличии	FALSE	В наличии	FALSE		FALSE		FALSE		FALSE		FALSE		FALSE		Феникс(жёлтый)	12.12.23	ККЛ	30.01.23
Yadik	FALSE	FALSE	02.03.2024	FALSE	В наличии	FALSE	В наличии	FALSE	В наличии	FALSE		FALSE		FALSE		FALSE		FALSE		FALSE
Yasyayummy	FALSE	FALSE		FALSE	В наличии	FALSE	В наличии	TRUE		FALSE		FALSE		FALSE		FALSE		FALSE		FALSE
Поднялгснапаках	TRUE	FALSE		TRUE	27.06.2025	FALSE	В наличии	FALSE		FALSE		FALSE		FALSE		FALSE		FALSE		FALSE
Сплёвыш	TRUE	TRUE	01.01.24	FALSE	В наличии	FALSE	В наличии	FALSE	В наличии	FALSE		FALSE		FALSE		FALSE		FALSE		FALSE		Т2 Коллекция боевых питомцев	24.03.25
Aurumm	TRUE	FALSE		TRUE		FALSE	В наличии	TRUE		FALSE		FALSE		FALSE		FALSE		FALSE		FALSE
Neshh	TRUE	FALSE		TRUE		FALSE		FALSE		FALSE		FALSE		FALSE		FALSE		FALSE		FALSE
Кузовок	TRUE	FALSE		TRUE		FALSE		FALSE		FALSE		FALSE		FALSE		FALSE		FALSE		FALSE
Хыхбл	TRUE	TRUE	03.08.2025	TRUE		FALSE	В наличии	TRUE		FALSE		FALSE		FALSE		FALSE		FALSE		FALSE		ККЛ	06.04.2025
Damvey	TRUE	TRUE	25.07.25	TRUE		FALSE		FALSE		FALSE		FALSE		FALSE		FALSE		FALSE		FALSE
Hokou	TRUE	TRUE	29.01.24	FALSE	В наличии	FALSE	В наличии	TRUE	10.06.22	FALSE		FALSE		FALSE		FALSE		FALSE		FALSE
Гелякоптер	TRUE	FALSE		FALSE		FALSE		FALSE		FALSE		FALSE		FALSE		FALSE		FALSE		FALSE		Т2 Коллекция боевых питомцев	23.11.25
Невидимаисвободна	TRUE	FALSE		TRUE		FALSE		FALSE		FALSE		FALSE		FALSE		FALSE		FALSE		FALSE
Сблёвыш	TRUE	FALSE	01.01.24	FALSE	В наличии	FALSE	В наличии	FALSE		FALSE		FALSE		FALSE		FALSE		FALSE		FALSE		Т2 Коллекция боевых питомцев	Когда то там
Iemonpies	TRUE	FALSE	01.01.2024	FALSE	В наличии	FALSE	В наличии	FALSE		FALSE		FALSE		FALSE		FALSE		FALSE		FALSE		Т2 Коллекция боевых питомцев	21.12.24
Llikethewayulickme	TRUE	TRUE		FALSE	В наличии	FALSE	В наличии	TRUE		FALSE		FALSE		FALSE		FALSE		FALSE		FALSE
Цежёсткиелапки	TRUE	TRUE	В наличии	FALSE		FALSE	В наличии	FALSE	В наличии	FALSE		FALSE		FALSE		FALSE		FALSE		FALSE
Эльстан	TRUE	TRUE	01.08.22	TRUE	01.01.24	FALSE	В наличии	TRUE	22.03.22	FALSE		FALSE		FALSE		FALSE		FALSE		FALSE		Феникс	10.05.22	Дьявокрыл, Мистерион	19.12.22
Япесокинефертити	TRUE	FALSE	В наличии	TRUE		FALSE	В наличии	FALSE	В наличии	FALSE		FALSE		FALSE		FALSE		FALSE		FALSE
Bellatriceee	TRUE	FALSE		TRUE	24.04.23	FALSE	В наличии	FALSE		FALSE		FALSE		FALSE		FALSE		FALSE		FALSE		Т2 Коллекция глайдеров	15.06.2025	Маназмей, Дьявокрыл	20.09.22
Fntzer	TRUE	TRUE	Когда то там	TRUE	Когда то там	FALSE		TRUE	Когда то там	FALSE		FALSE		FALSE		FALSE		FALSE		FALSE		Крылья Авиары	Когда то там
Khallddrogo	TRUE	TRUE		FALSE		FALSE	В наличии	TRUE	26.01.23	FALSE		FALSE		FALSE		FALSE		FALSE		FALSE
Tipperary	TRUE	FALSE		TRUE	В наличии	FALSE	В наличии	FALSE		FALSE		FALSE		FALSE		FALSE		FALSE		FALSE
Балдежныйкрип	TRUE	FALSE	11.11.23	FALSE	В наличии	FALSE	В наличии	FALSE	В наличии	FALSE		FALSE		FALSE		FALSE		FALSE		FALSE
Помятыйхил	TRUE	FALSE	В наличии	FALSE	В наличии	FALSE	В наличии	FALSE	В наличии	FALSE		FALSE		FALSE		FALSE		FALSE		FALSE
Трусикиибусики	TRUE	FALSE		FALSE	В наличии	FALSE	В наличии	TRUE	13.01.23	FALSE		FALSE		FALSE		FALSE		FALSE		FALSE
Alinary	TRUE	FALSE		TRUE	07.07.23	FALSE	В наличии	TRUE	21.07.22	FALSE		FALSE		FALSE		FALSE		FALSE		FALSE		Феникс(жёлтый)	21.07.22	Дьявокрыл, Феникс	21.07.23
Killjoy	TRUE	TRUE	Когда то там	FALSE		FALSE	В наличии	TRUE	02.09.22	FALSE		FALSE		FALSE		FALSE		FALSE		FALSE
Kvinsologia	TRUE	FALSE	В наличии	TRUE		FALSE	В наличии	FALSE		FALSE		FALSE		FALSE		FALSE		FALSE		FALSE
Qybee	TRUE	TRUE	В наличии	TRUE	24.04.23	FALSE	В наличии	TRUE		FALSE		FALSE		FALSE		FALSE		FALSE		FALSE				Квадрум, Дьявокрыл	Когда то там
Snegr	TRUE	FALSE	В наличии	FALSE	В наличии	FALSE	В наличии	TRUE		FALSE		FALSE		FALSE		FALSE		FALSE		FALSE		Коллеуция боевых	03.07.24	Коллекция глайдеров	03.07.24
`;

function parseDate(raw) {
  if (!raw) return null;
  const m = raw.trim().match(/^(\d{1,2})\.(\d{1,2})\.(\d{2}|\d{4})$/);
  if (!m) return null;
  let [, d, mo, y] = m;
  if (y.length === 2) y = "20" + y;
  const day = parseInt(d, 10);
  const month = parseInt(mo, 10);
  const year = parseInt(y, 10);
  if (month < 1 || month > 12 || day < 1 || day > 31) return null;
  const date = new Date(Date.UTC(year, month - 1, day));
  if (isNaN(date.getTime())) return null;
  return date.toISOString();
}

// Возвращает { status, date } или null, если данных недостаточно/непонятны.
function extractItemStatus(valA, valB) {
  const a = (valA || "").trim();
  const b = (valB || "").trim();
  for (const v of [b, a]) {
    const iso = parseDate(v);
    if (iso) return { status: "Выдано", date: iso };
  }
  for (const v of [a, b]) {
    if (v.toLowerCase() === "в наличии") return { status: "В наличии", date: null };
  }
  // TRUE без конкретной даты = выдано, но дата неизвестна (например "Хрен знает",
  // "Когда то там", "Подарили" или просто пусто) — всё равно фиксируем факт выдачи.
  if (a.toUpperCase() === "TRUE") return { status: "Выдано", date: null };
  return null;
}

// Для "Прочее" — value = название предмета текстом, date может быть реальной датой или пустой/неточной.
function extractProchee(comment, dateRaw) {
  const c = (comment || "").trim();
  if (!c || c.toUpperCase() === "TRUE" || c.toUpperCase() === "FALSE") return null;
  return { comment: c, date: parseDate(dateRaw) };
}

const lines = RAW.split("\n").map((l) => l.replace(/\r$/, "")).filter((l) => l.trim().length > 0);

const rows = [];
for (const line of lines) {
  const cols = line.split("\t");
  const username = (cols[0] || "").trim();
  if (!username) continue;

  const rokana = extractItemStatus(cols[2], cols[3]);
  const shield = extractItemStatus(cols[4], cols[5]);
  const glider = extractItemStatus(cols[6], cols[7]);
  const fregat = extractItemStatus(cols[8], cols[9]);
  const prochee1 = extractProchee(cols[22], cols[23]);
  const prochee2 = extractProchee(cols[24], cols[25]);

  const items = [];
  if (rokana) items.push({ name: ROKANA, ...rokana });
  if (shield) items.push({ name: SHIELD, ...shield });
  if (glider) items.push({ name: GLIDER, ...glider });
  if (fregat) items.push({ name: FREGAT, ...fregat });
  if (prochee1) items.push({ name: "Прочее", status: null, date: prochee1.date, comment: prochee1.comment });
  if (prochee2) items.push({ name: "Прочее 2", status: null, date: prochee2.date, comment: prochee2.comment });

  if (items.length > 0) {
    rows.push({ username, items });
  }
}

const { data: users, error: usersError } = await supabase.from("user").select("id, username");
if (usersError) {
  console.error(usersError);
  process.exit(1);
}
const userByName = new Map(users.map((u) => [u.username.trim(), u]));

let matchedUsers = 0;
let skippedUsers = [];
let totalItems = 0;
const toInsert = [];

for (const row of rows) {
  const user = userByName.get(row.username);
  if (!user) {
    skippedUsers.push(row.username);
    continue;
  }
  matchedUsers++;
  for (const item of row.items) {
    totalItems++;
    // Если точной даты нет (В наличии, "Хрен знает", "Когда то там" и т.п.) —
    // оставляем date=null, никакой даты-заглушки.
    const date = item.date ?? null;
    toInsert.push({
      user_id: user.id,
      username: row.username,
      name: item.name,
      date,
      comment: item.comment ?? null,
      status: item.status ?? (item.comment ? null : "Выдано"),
    });
  }
}

const pairCounts = {};
for (const rec of toInsert) {
  const key = rec.user_id + ":" + rec.name;
  pairCounts[key] = (pairCounts[key] || 0) + 1;
}
const dupes = Object.entries(pairCounts).filter(([, c]) => c > 1);
console.log("DUPLICATE (user_id,name) pairs within toInsert:", dupes.length);
console.log(JSON.stringify(dupes, null, 2));

console.log(`Строк с данными в экселе: ${rows.length}`);
console.log(`Совпало с пользователями системы: ${matchedUsers}`);
console.log(`Не найдено в системе (пропущено): ${skippedUsers.length}`);
console.log(skippedUsers.join(", "));
console.log(`\nВсего записей лута к импорту: ${totalItems}`);
console.log("\nПримеры записей:");
console.log(JSON.stringify(toInsert.slice(0, 15), null, 2));

if (DRY_RUN) {
  console.log("\n[DRY RUN] Ничего не записано. DRY_RUN=false для реальной записи.");
  process.exit(0);
}

const failures = [];
for (const rec of toInsert) {
  const { data: existing, error: findErr } = await supabase
    .from("givenawayloot")
    .select("id")
    .eq("user_id", rec.user_id)
    .eq("name", rec.name)
    .maybeSingle();

  if (findErr) {
    failures.push({ rec, stage: "find", error: findErr });
    continue;
  }

  const payload = {
    date: rec.date,
    comment: rec.comment,
    status: rec.status,
  };

  if (existing) {
    const { error: updErr } = await supabase
      .from("givenawayloot")
      .update(payload)
      .eq("id", existing.id);
    if (updErr) failures.push({ rec, stage: "update", error: updErr });
  } else {
    const { error: insErr } = await supabase.from("givenawayloot").insert([
      { user_id: rec.user_id, name: rec.name, ...payload, created_at: new Date().toISOString() },
    ]);
    if (insErr) failures.push({ rec, stage: "insert", error: insErr });
  }

  // синхронизация с user_inventory, как делает saveGivenAwayLoot
  if (rec.status === "Выдано") {
    const { data: existingInv } = await supabase
      .from("user_inventory")
      .select("id")
      .eq("user_id", rec.user_id)
      .eq("name", rec.name)
      .eq("type", "Выдано")
      .maybeSingle();
    if (!existingInv) {
      await supabase.from("user_inventory").insert([
        { user_id: rec.user_id, name: rec.name, type: "Выдано", created_at: rec.date ?? new Date().toISOString() },
      ]);
    }
  }
}

console.log(`\nГотово. Обработано: ${toInsert.length}, ошибок: ${failures.length}`);
if (failures.length) {
  console.log(JSON.stringify(failures, null, 2));
}
