export const GAME_SERVERS = [
  "Ифнир",
  "Корвус",
  "Ксанатос",
  "Луций",
  "Мираж",
  "Мирр",
  "Нагашар",
  "Рейвен",
  "Тарон",
  "Фанем",
  "Фесаникс",
  "Шаеда",
] as const;

export type GameServer = (typeof GAME_SERVERS)[number];

export function isGameServer(value: string): value is GameServer {
  return GAME_SERVERS.some((server) => server === value);
}
