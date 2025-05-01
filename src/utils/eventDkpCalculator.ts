export function eventDkpCalculator(
  boss: string | null,
  isPvp: boolean,
  isLongPvp: boolean,
  isProc: boolean,
  isDoubleProc: boolean
): number {
  let total = 0;

  switch (boss) {
    case "raid.boss_name.kraken":
    case "raid.boss_name.ksanatos":
    case "raid.boss_name.kalidis":
    case "raid.boss_name.leviathan":
      total += 7;
      break;
    case "raid.boss_name.antallon":
      total += 5;
      break;
    case "raid.boss_name.kaleil":
    case "raid.boss_name.korvus":
    case "raid.boss_name.delphie":
    case "raid.boss_name.siege":
      total += 3;
      break;
    case "raid.boss_name.agl":
    case "raid.boss_name.marli":
    case "raid.boss_name.morpheus":
    case "raid.boss_name.koshka":
      total += 1;
      break;
  }

  if (isPvp) total += 1;
  if (isLongPvp) total += 3;
  if (isProc) total += 1;
  if (isDoubleProc) total += 2;

  return total;
}
