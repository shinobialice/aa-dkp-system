// Боссы Прайм с одним жёстко зафиксированным временем в неделю (по данным
// из week_schedule_event) — для остальных Прайм-боссов (Дельфиец, Калеиль,
// Корвус, Осада) время остаётся свободным выбором, как раньше.
//
// Вынесено из getBossSchedule.ts: "use server" файл может экспортировать
// только async-функции — константа там ломала сборку ("A 'use server' file
// can only export async functions, found object").
export const LOCKED_SINGLE_TIME_PRIME_BOSSES = [
  "Кракен",
  "Калидис",
  "Анталлон",
  "Левиафан",
  "Ксанатос",
];
