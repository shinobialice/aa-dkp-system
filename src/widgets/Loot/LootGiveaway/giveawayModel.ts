import { format } from "date-fns";
import type { MiscLootGrant } from "@/actions/miscLootGrants";
import type { WishlistItem } from "@/actions/lootWishlist";

export { avatarSrc } from "../LootBuy/lootBuyModel";

export type GiveawayStatus = "" | "Выдано" | "В наличии" | "Хочет";

export const STATUS_OPTIONS: Exclude<GiveawayStatus, "">[] = [
  "Хочет",
  "В наличии",
  "Выдано",
];

export type ItemKind = "loot" | "glider";

/** Один из отслеживаемых предметов (lootColumns + gliderTypes). */
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
  avatarUrl: string | null;
  /** По одному на каждый TrackedItem, в том же порядке. */
  items: PlayerItem[];
  miscGrants: MiscLootGrant[];
  wishlist: WishlistItem[];
};

export type RosterFilter = "all" | "want" | "stock" | "nothing";

export type StatusCounts = { given: number; stock: number; want: number };

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

export function countStatuses(players: Player[], itemName: string) {
  const counts: StatusCounts = { given: 0, stock: 0, want: 0 };
  for (const player of players) {
    const status = statusOf(player, itemName);
    if (status === "Выдано") counts.given++;
    else if (status === "В наличии") counts.stock++;
    else if (status === "Хочет") counts.want++;
  }
  return counts;
}

/** Подходит ли игрок под фильтр; если выбран предмет — фильтр по нему. */
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
    case "nothing":
      return !player.items.some((i) => i.status === "Выдано");
    default:
      return true;
  }
}

const STATUS_RANK: Record<GiveawayStatus, number> = {
  Хочет: 0,
  "В наличии": 1,
  "": 2,
  Выдано: 3,
};

/** При выбранном предмете сверху те, кто его ждёт, внизу — уже получившие. */
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

/** Хотелки — свободный текст, не привязаны к списку предметов. */
export function formatWishlistItem(item: WishlistItem) {
  return item.comment ? `${item.itemName} (${item.comment})` : item.itemName;
}
