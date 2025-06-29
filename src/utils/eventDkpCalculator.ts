type Boss = {
  id: number;
  boss_name: string;
  category: string;
  dkp_points: number;
};

const bossGroups = [
  ["Ашьяра", "Гленн и Лорея"], // Группа, которая дает 1 балл
];

export default function eventDkpCalculator(
  selectedBosses: any[],
  isPvp: boolean,
  isPvpLong: boolean
) {
  const uniqueGroups = new Set();

  selectedBosses.forEach((boss) => {
    const group = bossGroups.find((group) => group.includes(boss.boss_name));
    if (group) {
      uniqueGroups.add(group); // Добавляем группу в Set
    } else {
      uniqueGroups.add(boss.boss_name); // Если босс не в группе, добавляем его имя
    }
  });

  const basePoints = uniqueGroups.size; // Количество уникальных групп и одиночных боссов

  // Дополнительная логика для ПВП
  if (isPvp) {
    return basePoints + 2; // Например, добавляем 2 балла за ПВП
  }
  if (isPvpLong) {
    return basePoints + 1; // Например, добавляем 1 балл за длительное ПВП
  }

  return basePoints;
}
