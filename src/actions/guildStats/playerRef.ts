// Игрок для списков в тултипах статистики (кто есть/кого нет и т.п.) —
// вместе с ролью (user.class), чтобы подсвечивать ник иконкой роли
// (см. PlayerNameList.tsx / classStyles.tsx).
export type NamedPlayer = {
  username: string;
  class: string | null;
  // Доп. пометка после ника (например "×2" — сколько печатей этой
  // редкости у игрока), без влияния на сортировку.
  suffix?: string;
};

// Порядок ролей в списках игроков: барды, луки, маги, милики, тактики,
// танцоры, хилы. Без роли — в конец.
const ROLE_ORDER = ["Бард", "Лук", "Маг", "Милик", "Тактик", "Танцор", "Хил"];

function roleRank(role: string | null): number {
  if (!role) return ROLE_ORDER.length;
  const index = ROLE_ORDER.indexOf(role);
  return index === -1 ? ROLE_ORDER.length : index;
}

export function sortPlayers(players: NamedPlayer[]): NamedPlayer[] {
  return [...players].sort(
    (a, b) =>
      roleRank(a.class) - roleRank(b.class) ||
      a.username.localeCompare(b.username, "ru"),
  );
}
