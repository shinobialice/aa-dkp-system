type Boss = {
  id: number;
  boss_name: string;
  category: string;
  dkp_points: number;
};

export function eventDkpCalculator(
  selectedBosses: Boss[],
  isPvp: boolean,
  isPvpLong: boolean
): number {
  const bossPoints = selectedBosses.reduce(
    (sum, boss) => sum + boss.dkp_points,
    0
  );

  const pvpBonus = isPvp ? 1 : 0;
  const longPvpBonus = isPvpLong ? 3 : 0;

  return bossPoints + pvpBonus + longPvpBonus;
}
