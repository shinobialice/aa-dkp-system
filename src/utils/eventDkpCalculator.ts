export function eventDkpCalculator(
  boss: string | null,
  isPvp: boolean,
  isLongPvp: boolean,
  isProc: boolean,
  isDoubleProc: boolean,
  isMarliProc: boolean
): number {
  let total = 0;

  switch (boss) {
    case "Кракен":
    case "Ксанатос":
    case "Калидис":
    case "Левиафан":
      total += 7;
      break;
    case "Анталлон":
      total += 5;
      break;
    case "Калеиль":
    case "Корвус":
    case "Дельфиец":
    case "Осада":
      total += 3;
      break;
    case "АГЛ":
    case "Марли":
    case "Морфеос":
    case "Разъяренная Сехекмет":
      total += 1;
      break;
  }

  if (isPvp) total += 1;
  if (isLongPvp) total += 3;
  if (isProc) total += 1;
  if (isDoubleProc) total += 2;
  if (isMarliProc) total += 1;
  return total;
}
