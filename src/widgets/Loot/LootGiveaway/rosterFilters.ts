import {
  matchesFilter,
  sortForItem,
  type Player,
  type RosterFilter,
} from "./giveawayModel";

export const FILTERS: { key: RosterFilter; label: string }[] = [
  { key: "all", label: "Все" },
  { key: "want", label: "Хотят" },
  { key: "stock", label: "В наличии" },
];

export type RosterQuery = {
  showInactive: boolean;
  search: string;
  filter: RosterFilter;
  itemName: string | null;
};

export function filterRoster(players: Player[], query: RosterQuery) {
  const term = query.search.trim().toLowerCase();
  const searched = players
    .filter((player) => (player.active && !player.isAfk) || query.showInactive)
    .filter((player) => !term || player.username.toLowerCase().includes(term));

  const displayed = sortForItem(
    searched.filter((player) =>
      matchesFilter(player, query.filter, query.itemName),
    ),
    query.itemName,
  );
  const counts = Object.fromEntries(
    FILTERS.map(({ key }) => [
      key,
      searched.filter((player) => matchesFilter(player, key, query.itemName))
        .length,
    ]),
  ) as Record<RosterFilter, number>;

  return { displayed, counts };
}
