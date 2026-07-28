import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
);

const { data: raids, error: raidErr } = await supabase
  .from("raid")
  .select("id, type, start_date")
  .gte("start_date", "2026-07-01")
  .lt("start_date", "2026-08-01")
  .order("start_date");
console.log("--- raids in July 2026 ---");
console.log(raidErr || raids);

const { data: bosses, error: bossErr } = await supabase
  .from("boss")
  .select("id, boss_name, category, dkp_points");
console.log("--- bosses ---");
console.log(bossErr || bosses);

const { data: users, error: userErr } = await supabase
  .from("user")
  .select("id, username")
  .in("username", ["Dimonish", "Гуатамма", "Дайтедроп", "Keepingyou", "Raivent"]);
console.log("--- sample users ---");
console.log(userErr || users);

const { data: rb, error: rbErr } = await supabase
  .from("raid_boss")
  .select("raid_id, boss_id")
  .in("raid_id", [410, 411, 469, 470]);
console.log("--- raid_boss for a few July raids ---");
console.log(rbErr || rb);

const { count: attCount, error: attErr } = await supabase
  .from("raid_attendance")
  .select("*", { count: "exact", head: true })
  .in("raid_id", [410, 411, 469, 470]);
console.log("--- attendance count for those raids ---", attErr || attCount);

const { count: totalJulyRaids } = await supabase
  .from("raid")
  .select("*", { count: "exact", head: true })
  .gte("start_date", "2026-07-01")
  .lt("start_date", "2026-08-01");
console.log("--- total July 2026 raids ---", totalJulyRaids);
