import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";

const DRY_RUN = process.env.DRY_RUN !== "false";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
);

const { primeRaids, aglRaids, rosterUsernames } = JSON.parse(
  readFileSync("./scratch/july_2026_import_data.json", "utf8"),
);
const allRaids = [...primeRaids, ...aglRaids];

// 1. Resolve usernames -> user_id
const { data: users, error: usersError } = await supabase
  .from("user")
  .select("id, username");
if (usersError) throw usersError;

const usernameToId = new Map(users.map((u) => [u.username.trim(), u.id]));
const missing = rosterUsernames.filter((u) => !usernameToId.has(u));
console.log("=== Юзернеймы из экселя, которых нет в базе ===");
console.log(missing.length ? missing : "(нет, все совпали)");

// 2. Count existing July 2026 data that would be wiped
const { data: existingRaids, error: existingErr } = await supabase
  .from("raid")
  .select("id")
  .gte("start_date", "2026-07-01")
  .lt("start_date", "2026-08-01");
if (existingErr) throw existingErr;
const existingIds = existingRaids.map((r) => r.id);

const { count: existingAttendanceCount } = await supabase
  .from("raid_attendance")
  .select("*", { count: "exact", head: true })
  .in("raid_id", existingIds.length ? existingIds : [-1]);

console.log("\n=== Что будет удалено ===");
console.log("Существующих raid за июль 2026:", existingIds.length);
console.log("Существующих raid_attendance за эти рейды:", existingAttendanceCount);

console.log("\n=== Что будет создано ===");
console.log("Прайм рейдов:", primeRaids.length);
console.log("АГЛ рейдов:", aglRaids.length);
console.log(
  "Всего raid_attendance записей:",
  allRaids.reduce((s, r) => s + r.attendees.length, 0),
);

// 3. Preview per-user total DKP for July (using dkp_summary * attendance, half if late)
const userDkpPreview = new Map();
for (const raid of allRaids) {
  for (const att of raid.attendees) {
    const earned = att.late ? raid.dkp_summary / 2 : raid.dkp_summary;
    userDkpPreview.set(
      att.username,
      (userDkpPreview.get(att.username) || 0) + earned,
    );
  }
}
const preview = [...userDkpPreview.entries()]
  .sort((a, b) => b[1] - a[1])
  .slice(0, 10);
console.log("\n=== Топ-10 пользователей по DKP за июль (превью) ===");
preview.forEach(([u, dkp]) => console.log(u, dkp));

if (DRY_RUN) {
  console.log("\n[DRY RUN] Ничего не записано в базу. Запустите с DRY_RUN=false для реального применения.");
  process.exit(0);
}

if (missing.length) {
  console.error("\nЕсть юзернеймы без соответствия в БД — прерываю запись.");
  process.exit(1);
}

// ---- REAL RUN ----
console.log("\n=== Удаляю старые данные за июль 2026 ===");
if (existingIds.length) {
  const { error: delAttErr } = await supabase
    .from("raid_attendance")
    .delete()
    .in("raid_id", existingIds);
  if (delAttErr) throw delAttErr;

  const { error: delBossErr } = await supabase
    .from("raid_boss")
    .delete()
    .in("raid_id", existingIds);
  if (delBossErr) throw delBossErr;

  const { error: delRaidErr } = await supabase
    .from("raid")
    .delete()
    .in("id", existingIds);
  if (delRaidErr) throw delRaidErr;
}
console.log("Удалено:", existingIds.length, "рейдов");

console.log("\n=== Создаю новые рейды ===");
let created = 0;
for (const raid of allRaids) {
  const { data: newRaid, error: raidErr } = await supabase
    .from("raid")
    .insert([
      {
        type: raid.type,
        dkp_summary: raid.dkp_summary,
        start_date: raid.start_date,
        created_at: new Date().toISOString(),
        is_pvp: raid.is_pvp,
        is_pvp_long: raid.is_pvp_long,
        is_proc: raid.is_proc,
        is_double_proc: raid.is_double_proc,
        active_user_count: raid.attendees.length,
      },
    ])
    .select()
    .single();
  if (raidErr) throw raidErr;

  const { error: bossErr } = await supabase
    .from("raid_boss")
    .insert([{ raid_id: newRaid.id, boss_id: raid.boss_id }]);
  if (bossErr) throw bossErr;

  if (raid.attendees.length) {
    const attendanceRows = raid.attendees.map((att) => ({
      raid_id: newRaid.id,
      user_id: usernameToId.get(att.username),
      created_at: new Date().toISOString(),
      is_late: att.late,
    }));
    const { error: attErr } = await supabase
      .from("raid_attendance")
      .insert(attendanceRows);
    if (attErr) throw attErr;
  }

  created++;
  if (created % 50 === 0) console.log(`  ...${created}/${allRaids.length}`);
}

console.log(`\nГотово. Создано рейдов: ${created}`);
