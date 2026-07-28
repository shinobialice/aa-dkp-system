import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
);

// [username, primePercent, aglPercent, totalPercent] from the excel (ground truth)
const EXCEL = [
  ["Dimonish", 84.75, 30.29, 70.07],
  ["Гуатамма", 83.05, 30.00, 68.06],
  ["Raivent", 47.46, 15.14, 38.80],
  ["Дайтедроп", 98.31, 15.43, 73.91],
  ["Keepingyouincheck", 100.00, 69.14, 92.64],
  ["Бистиарий", 0.00, 1.14, 0.17],
  ["Задиглвголову", 57.63, 34.57, 50.50],
  ["Nidhoggur", 72.88, 30.29, 60.87],
  ["Ноеездесьнет", 42.37, 21.71, 35.95],
  ["Takamurra", 5.08, 3.43, 5.02],
  ["Барикккк", 1.69, 8.57, 3.18],
  ["Кмспозачатию", 0.00, 0.00, 0.00],
  ["Кортиъ", 86.44, 25.71, 68.90],
  ["Depai", 89.83, 47.43, 77.42],
  ["Джейсонстейксъем", 98.31, 58.86, 88.46],
  ["Sokec", 78.26, 48.39, 75.73],
  ["Рейков", 23.73, 11.43, 20.57],
  ["Метх", 8.47, 1.43, 6.69],
  ["Wdx", 77.97, 47.71, 70.74],
  ["Panibrat", 5.08, 0.57, 4.18],
  ["Атутчтоязабыл", 66.10, 40.57, 59.20],
  ["Kenzie", 83.05, 49.14, 72.41],
  ["Биткойн", 2.27, 6.86, 3.33],
  ["Draganc", 0.00, 2.29, 0.84],
  ["Mnrqw", 81.36, 8.57, 60.87],
  ["Sarin", 98.31, 39.71, 82.61],
  ["Nadson", 62.71, 37.14, 54.35],
  ["Yidhari", 96.61, 18.86, 75.92],
  ["Insee", 35.59, 26.86, 34.45],
  ["Кёджуро", 49.15, 19.43, 41.30],
  ["Отагрдам", 55.93, 22.86, 47.16],
  ["Canneex", 30.00, 50.00, 32.14],
  ["Акрн", 6.78, 9.14, 7.53],
  ["Пельменебл", 58.47, 8.57, 43.65],
  ["Lekontant", 74.58, 26.29, 62.88],
  ["Tairneanach", 68.64, 16.86, 52.34],
  ["Garciafucking", 52.54, 38.29, 48.49],
  ["Парирум", 35.59, 11.43, 28.93],
  ["Ahegaonnesh", 83.05, 18.29, 63.55],
  ["Уменясновалапки", 98.31, 44.57, 82.94],
  ["Rigell", 89.83, 20.86, 71.24],
  ["Прыгайкискаъ", 13.56, 4.00, 10.87],
  ["Osmium", 35.59, 32.57, 32.78],
  ["Yadik", 93.22, 9.14, 69.90],
  ["Yasyayummy", 1.69, 26.86, 9.87],
  ["Кидаюфлешки", 96.61, 39.43, 79.77],
  ["Играюсдиглом", 89.83, 24.29, 69.06],
  ["Тутмоглабытьваша", 32.20, 11.43, 27.09],
  ["Loraiine", 48.31, 42.57, 47.66],
  ["Vilvian", 0.00, 0.00, 0.00],
  ["Моглабытьздесь", 18.64, 7.71, 15.72],
  ["Felanza", 74.58, 41.14, 64.38],
  ["Arasaka", 13.56, 13.43, 14.05],
  ["Manekii", 91.53, 49.14, 77.93],
  ["Flams", 79.66, 27.71, 64.72],
  ["Бритуля", 16.95, 7.43, 14.72],
  ["Keepingyouobsessed", 100.00, 69.14, 91.14],
  ["Daisynotpie", 83.05, 41.14, 69.57],
  ["Paulafucking", 71.19, 42.29, 62.21],
  ["Чорти", 77.97, 18.57, 60.03],
  ["Нарасслабоне", 59.32, 29.71, 50.84],
  ["Немкудам", 13.56, 7.43, 12.04],
  ["Слипдам", 98.31, 38.29, 81.44],
  ["Безбабла", 69.49, 10.57, 52.84],
  ["Безсердца", 88.14, 60.00, 78.43],
  ["Кейтмопс", 76.27, 28.57, 62.54],
];

const EXCLUDED = [14, 11]; // Koshka, Morf

const { data: users } = await supabase.from("user").select("id, username, joined_at");
const usernameToId = new Map(users.map((u) => [u.username.trim(), u.id]));
const usersById = new Map(users.map((u) => [u.id, u]));

const { data: raids } = await supabase
  .from("raid")
  .select("id,type,start_date,dkp_summary,raid_boss(boss_id),raid_attendance(user_id,is_late)")
  .gte("start_date", "2026-07-01")
  .lt("start_date", "2026-08-01");

const MONTH_START = new Date(Date.UTC(2026, 6, 1));

function computeAll(userId) {
  const u = usersById.get(userId);
  const joinedAt = u?.joined_at ? new Date(u.joined_at) : null;
  const effectiveStart = joinedAt && joinedAt > MONTH_START ? joinedAt : MONTH_START;

  let totalPrimeRaids = 0, userPrimeW = 0, totalAglRaids = 0, userAglW = 0;
  let totalPrimeDkp = 0, userPrimeDkp = 0, totalAglDkp = 0, userAglDkp = 0;
  let totalAglDkpEx = 0, userAglDkpEx = 0;
  for (const r of raids) {
    if (new Date(r.start_date) < effectiveStart) continue;
    const att = r.raid_attendance.find((a) => a.user_id === userId);
    const w = att ? (att.is_late ? 0.5 : 1) : 0;
    const dkp = r.dkp_summary ?? 0;
    const earned = att ? (att.is_late ? dkp / 2 : dkp) : 0;
    const bossId = r.raid_boss[0]?.boss_id;
    const excluded = EXCLUDED.includes(bossId);
    if (r.type === "Прайм") {
      totalPrimeRaids++; userPrimeW += w; totalPrimeDkp += dkp; userPrimeDkp += earned;
    } else if (r.type === "АГЛ") {
      totalAglRaids++; userAglW += w; totalAglDkp += dkp; userAglDkp += earned;
      if (!excluded) { totalAglDkpEx += dkp; userAglDkpEx += earned; }
    }
  }
  const primePercent = totalPrimeRaids ? (userPrimeW / totalPrimeRaids) * 100 : 0;
  const aglPercent = totalAglRaids ? (userAglW / totalAglRaids) * 100 : 0;
  return {
    primePercent, aglPercent,
    prime_w: userPrimeDkp, prime_total: totalPrimeDkp,
    agl_w: userAglDkp, agl_total: totalAglDkp,
    aglEx_w: userAglDkpEx, aglEx_total: totalAglDkpEx,
  };
}

// candidate formulas, given per-user components + global totals
const candidates = {
  A_dkpAllExKM: (c) => ((c.prime_w + c.aglEx_w) / (c.prime_total + c.aglEx_total)) * 100,
  B_dkpAllIncl: (c) => ((c.prime_w + c.agl_w) / (c.prime_total + c.agl_total)) * 100,
  C_avgSimple: (c) => (c.primePercent + c.aglPercent) / 2,
  G_aglOnlyExKM: (c) => (c.aglEx_total ? (c.aglEx_w / c.aglEx_total) * 100 : 0),
  H_primeOnly: (c) => (c.prime_total ? (c.prime_w / c.prime_total) * 100 : 0),
  I_min: (c) => Math.min(c.primePercent, c.aglPercent),
  J_geomean: (c) => Math.sqrt(c.primePercent * c.aglPercent),
  K_2of3harmonic: (c) => (2 * c.primePercent * c.aglPercent) / (c.primePercent + c.aglPercent || 1),
};

const errors = {};
for (const key of Object.keys(candidates)) errors[key] = [];

let matched = 0;
for (const [username, exPrime, exAgl, exTotal] of EXCEL) {
  const userId = usernameToId.get(username.trim());
  if (!userId) { console.log("NO USER MATCH:", username); continue; }
  matched++;
  const c = computeAll(userId);
  for (const [key, fn] of Object.entries(candidates)) {
    const val = fn(c);
    errors[key].push(Math.abs(val - exTotal));
  }
}
console.log("matched users:", matched, "/", EXCEL.length);
console.log("\nMean absolute error per candidate formula:");
for (const [key, arr] of Object.entries(errors)) {
  const mae = arr.reduce((s, x) => s + x, 0) / arr.length;
  const max = Math.max(...arr);
  console.log(key, "MAE=" + mae.toFixed(3), "MAX=" + max.toFixed(3));
}

// per-user detail for candidate B, sorted by error desc
const rows = [];
for (const [username, exPrime, exAgl, exTotal] of EXCEL) {
  const userId = usernameToId.get(username.trim());
  if (!userId) continue;
  const c = computeAll(userId);
  const bVal = candidates.B_dkpAllIncl(c);
  const aVal = candidates.A_dkpAllExKM(c);
  rows.push({
    username, exTotal,
    bVal: bVal.toFixed(2), bErr: Math.abs(bVal - exTotal).toFixed(2),
    aVal: aVal.toFixed(2), aErr: Math.abs(aVal - exTotal).toFixed(2),
    primePercent: c.primePercent.toFixed(2), aglPercent: c.aglPercent.toFixed(2),
    exPrime, exAgl,
  });
}
rows.sort((x, y) => y.bErr - x.bErr);
console.log("\nTop 15 worst (candidate B):");
for (const r of rows.slice(0, 15)) console.log(JSON.stringify(r));
