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
  selectedBoss: Boss | null,
  isPvp: boolean,
  isPvpLong: boolean
) {
  if (!selectedBoss) return 0;

  let dkp = selectedBoss.dkp_points;

  if (isPvp) {
    dkp += 2;
  } else if (isPvpLong) {
    dkp += 1;
  }

  return dkp;
}
