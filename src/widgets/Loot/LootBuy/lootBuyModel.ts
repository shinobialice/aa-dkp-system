import { ROLL_BASED_QUEUE_ITEMS } from "@/utils/rollBasedQueueItems";

export const AMOUNT_QUEUE_ITEMS = [
  "Эссенция ярости",
  "Трофейная эссенция стихий",
];

export const MISC_SOURCE = "Разное";

export type QueueKind = "plain" | "roll" | "amount";

export type BuyItem = {
  name: string;
  source: string;
  price: number | null;
  icon: string | null;
  grade: number | null;
  stock: number;
};

export type QueueEntry = {
  id: number;
  userId: number;
  username: string;
  avatarUrl: string | null;
  userClass: string | null;
  status: string;
  synthTarget: string;
  required: number;
  delivered: number;
  createdAt: string;
  roll: number | null;
  position: number | null;
};

export type QueueMap = Record<string, QueueEntry[]>;

export type QueueStatusToggle = "позже" | "пропуск";

export function queueKind(itemName: string): QueueKind {
  if (ROLL_BASED_QUEUE_ITEMS.includes(itemName)) return "roll";
  if (AMOUNT_QUEUE_ITEMS.includes(itemName)) return "amount";
  return "plain";
}

export function mapQueueRow(row: {
  id: number;
  user_id: number;
  username: string | null;
  avatar_url: string | null;
  class: string | null;
  status: string | null;
  synth_target: string | null;
  required: number | null;
  delivered: number | null;
  created_at: Date | string;
  roll: number | null;
  position: number | null;
}): QueueEntry {
  return {
    id: row.id,
    userId: row.user_id,
    username: row.username || "Unknown",
    avatarUrl: row.avatar_url,
    userClass: row.class,
    status: row.status ?? "",
    synthTarget: row.synth_target ?? "",
    required: row.required ?? 0,
    delivered: row.delivered ?? 0,
    createdAt: new Date(row.created_at).toISOString(),
    roll: row.roll,
    position: row.position,
  };
}

export function sortQueue(itemName: string, entries: QueueEntry[]) {
  const byOrder = [...entries].sort((a, b) => {
    if (a.position !== null && b.position !== null) {
      return a.position - b.position;
    }
    if (a.position !== null) return -1;
    if (b.position !== null) return 1;
    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
  });
  if (queueKind(itemName) !== "roll") return byOrder;
  return byOrder.sort((a, b) => (b.roll ?? -1) - (a.roll ?? -1));
}

export function isBundled(item: BuyItem) {
  return item.name.includes("Средоточие") && item.price === null;
}

export function formatPrice(price: number) {
  return price.toLocaleString("ru-RU", { maximumFractionDigits: 2 });
}

export function formatAmount(value: number) {
  return Math.round(value).toLocaleString("ru-RU");
}

export function priceLabel(item: BuyItem) {
  if (item.price !== null) return formatPrice(item.price);
  return isBundled(item) ? "в комплекте" : "не указана";
}

export function plural(n: number, one: string, few: string, many: string) {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return one;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return few;
  return many;
}

export function playersCount(n: number) {
  return `${n} ${plural(n, "игрок", "игрока", "игроков")}`;
}

export function formatQueueDate(iso: string) {
  return new Date(iso).toLocaleDateString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  });
}

export const STATUS_BADGES: Record<
  string,
  { label: string; className: string }
> = {
  позже: {
    label: "Позже",
    className:
      "bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-300",
  },
  пропуск: {
    label: "Пропускает",
    className: "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-300",
  },
  продано: {
    label: "Продано",
    className:
      "bg-green-100 text-green-800 dark:bg-green-500/15 dark:text-green-300",
  },
};

export function avatarSrc(entry: {
  avatarUrl: string | null;
  username: string;
}) {
  return (
    entry.avatarUrl ??
    `https://api.dicebear.com/6.x/initials/svg?seed=${entry.username}`
  );
}
