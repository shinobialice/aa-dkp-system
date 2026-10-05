import { format } from "date-fns";
import type { MiscLootGrant } from "@/actions/miscLootGrants";
import type { WishlistItem } from "@/actions/lootWishlist";

export type GiveawayStatus = "" | "Выдано" | "В наличии" | "Хочет";

export const STATUS_OPTIONS: Exclude<GiveawayStatus, "">[] = [
  "Хочет",
  "В наличии",
  "Выдано",
];

export type ItemKind = "loot" | "glider";

export type TrackedItem = {
  name: string;
  kind: ItemKind;
  iconUrl: string | null;
  grade: number | null;
};

export type PlayerItem = {
  name: string;
  date: string;
  status: GiveawayStatus;
};

export type Player = {
  id: number;
  username: string;
  active: boolean;
  isAfk: boolean;
  avatarUrl: string | null;
  items: PlayerItem[];
  miscGrants: MiscLootGrant[];
  wishlist: WishlistItem[];
};

export type RosterFilter = "all" | "want" | "stock";

export function playerStatusLabel(player: Player) {
  if (!player.active) return "Неактивен";
  if (player.isAfk) return "АФК";
  return "Активен";
}

export function todayIso() {
  return new Date().toISOString().split("T")[0];
}

export function isValidDate(date: string) {
  return Boolean(date) && !isNaN(Date.parse(date));
}

export function formatDate(date: string, pattern = "dd.MM.yyyy") {
  return isValidDate(date) ? format(new Date(date), pattern) : "";
}

export function statusOf(player: Player, itemName: string): GiveawayStatus {
  return player.items.find((i) => i.name === itemName)?.status ?? "";
}

export function matchesFilter(
  player: Player,
  filter: RosterFilter,
  itemName: string | null,
) {
  const statuses = itemName
    ? [statusOf(player, itemName)]
    : player.items.map((i) => i.status);
  switch (filter) {
    case "want":
      return (
        statuses.includes("Хочет") || (!itemName && player.wishlist.length > 0)
      );
    case "stock":
      return statuses.includes("В наличии");
    default:
      return true;
  }
}

const STATUS_RANK: Record<GiveawayStatus, number> = {
  Хочет: 0,
  "": 1,
  Выдано: 2,
  "В наличии": 3,
};

export function sortForItem(players: Player[], itemName: string | null) {
  if (!itemName) return players;
  return [...players].sort(
    (a, b) =>
      STATUS_RANK[statusOf(a, itemName)] - STATUS_RANK[statusOf(b, itemName)],
  );
}

export function formatMiscGrant(grant: MiscLootGrant) {
  return grant.amount != null
    ? `${grant.amount} · ${grant.comment}`
    : grant.comment;
}

export function formatWishlistItem(item: WishlistItem) {
  return item.comment ? `${item.itemName} (${item.comment})` : item.itemName;
}
