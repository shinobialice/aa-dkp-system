import { formatNumber, plural } from "@/shared/lib/format";
import type { KillCount, KillCountExclusion } from "@/widgets/killcount/types";
import { honor, kills } from "@/widgets/killcount/ui/killcountModel";

export function killcountSummary(rows: KillCount[]) {
  const totalKills = rows.reduce((sum, row) => sum + kills(row), 0);
  const totalHonor = rows.reduce((sum, row) => sum + honor(row), 0);
  const players = `${rows.length} ${plural(rows.length, "игрок", "игрока", "игроков")}`;
  return `${players} · ${formatNumber(totalKills)} килов · ${formatNumber(totalHonor)} хонора`;
}

export function exclusionsText(excluded: KillCountExclusion[]) {
  return excluded.map((item) => `${item.userName} — ${item.reason}`).join("; ");
}
