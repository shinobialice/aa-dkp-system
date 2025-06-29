const bossGroups = [["Ашьяра", "Гленн и Лорея"]];

export default function eventDkpCalculator(
  selectedBosses: { boss_name: string }[],
  isPvp: boolean,
  isPvpLong: boolean
) {
  const uniqueGroups = new Set();

  selectedBosses.forEach((boss) => {
    const group = bossGroups.find((group) => group.includes(boss.boss_name));
    if (group) {
      uniqueGroups.add(group);
    } else {
      uniqueGroups.add(boss.boss_name);
    }
  });

  const basePoints = uniqueGroups.size;

  if (isPvp) {
    return basePoints + 2;
  }
  if (isPvpLong) {
    return basePoints + 1;
  }

  return basePoints;
}
