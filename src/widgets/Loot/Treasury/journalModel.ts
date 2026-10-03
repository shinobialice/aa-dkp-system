import type { LootItem } from "../GuildLoot/LootTypes";
import { isInUtcMonth, NON_STOCK_NAMES, toDate } from "./treasuryModel";

export type JournalKind = "drop" | "sale" | "gift" | "treasury";

export type JournalEntry = {
  key: string;
  kind: JournalKind;
  at: Date;
  title: string;
  quantity: number;
  showQuantity: boolean;
  iconName: string;
  iconUrl: string | null;
  grade: number | null;
  source: string | null;
  recipient: string | null;
  recipientId: number | null;
  comment: string | null;
  amount: number;
  records: LootItem[];
};

export type JournalDay = {
  key: string;
  label: string;
  entries: JournalEntry[];
};

type JournalEvent = { kind: JournalKind; at: Date; groupKey: string };
type EntryDraft = { kind: JournalKind; at: Date; records: LootItem[] };

const KIND_ORDER: Record<JournalKind, number> = {
  treasury: 0,
  sale: 1,
  gift: 2,
  drop: 3,
};

export function buildJournal(
  loot: LootItem[],
  month: number,
  year: number,
): JournalDay[] {
  const drafts = new Map<string, EntryDraft>();
  for (const item of loot) {
    for (const event of journalEvents(item, month, year)) {
      const key = `${localDayKey(event.at)}|${event.kind}|${event.groupKey}`;
      const draft = drafts.get(key);
      if (!draft) {
        drafts.set(key, { kind: event.kind, at: event.at, records: [item] });
        continue;
      }
      draft.records.push(item);
      if (event.at > draft.at) draft.at = event.at;
    }
  }

  const entries = [...drafts].map(([key, draft]) => toEntry(key, draft));
  return groupByDay(entries);
}

// Одна запись лута может дать до двух событий журнала: получение на склад и
// выдачу/продажу. Если предмет ушёл в тот же день, что и пришёл, получение
// не показываем — иначе в журнале дублировалась бы одна и та же вещь.
function journalEvents(
  item: LootItem,
  month: number,
  year: number,
): JournalEvent[] {
  const acquired = toDate(item.acquired_at);
  const sold = toDate(item.sold_at);
  const inMonth = (date: Date | null): date is Date =>
    isInUtcMonth(date, month, year);

  if (item.status === "В казну") {
    return inMonth(sold)
      ? [{ kind: "treasury", at: sold, groupKey: String(item.id) }]
      : [];
  }
  if (item.status === "Распродано" || NON_STOCK_NAMES.has(item.itemType.name)) {
    return [];
  }

  const events: JournalEvent[] = [];
  const isOut = item.status === "Продано" || item.status === "Выдано";
  if (isOut && inMonth(sold)) events.push(outEvent(item, sold));

  const soldSameDay =
    isOut &&
    !!acquired &&
    !!sold &&
    localDayKey(acquired) === localDayKey(sold);
  if (inMonth(acquired) && !soldSameDay) {
    events.push({
      kind: "drop",
      at: acquired,
      groupKey: `${item.itemType.id}|${item.source ?? ""}`,
    });
  }
  return events;
}

function outEvent(item: LootItem, sold: Date): JournalEvent {
  const recipient = `${item.sold_to_user_id ?? ""}:${item.sold_to ?? ""}`;
  const comment = item.comment ?? "";
  if (item.status === "Продано") {
    return {
      kind: "sale",
      at: sold,
      groupKey: `${item.itemType.id}|${recipient}|${comment}`,
    };
  }
  return { kind: "gift", at: sold, groupKey: `${recipient}|${comment}` };
}

function toEntry(key: string, { kind, at, records }: EntryDraft): JournalEntry {
  const first = records[0];
  const quantity = records.reduce((sum, record) => sum + record.quantity, 0);
  const title =
    kind === "treasury" ? "Поступление в казну" : entryTitle(records);
  const sources = [
    ...new Set(
      records
        .map((record) => record.source?.trim())
        .filter((source): source is string => !!source),
    ),
  ];
  const isTransfer = kind === "sale" || kind === "gift";
  const hasAmount = kind === "sale" || kind === "treasury";

  return {
    key,
    kind,
    at,
    title,
    quantity,
    showQuantity: kind !== "treasury" && quantity > 1 && !title.includes("×"),
    iconName: first.itemType.name,
    iconUrl: first.itemType.icon_url,
    grade: first.itemType.grade,
    source: sources.length ? sources.join(", ") : null,
    recipient: isTransfer ? first.sold_to : null,
    recipientId: isTransfer ? first.sold_to_user_id : null,
    comment: kind === "drop" ? null : first.comment,
    amount: hasAmount
      ? records.reduce((sum, record) => sum + (record.price ?? 0), 0)
      : 0,
    records,
  };
}

function groupByDay(entries: JournalEntry[]): JournalDay[] {
  const days = new Map<string, { at: Date; entries: JournalEntry[] }>();
  for (const entry of entries) {
    const key = localDayKey(entry.at);
    const day = days.get(key);
    if (!day) {
      days.set(key, { at: entry.at, entries: [entry] });
      continue;
    }
    day.entries.push(entry);
    if (entry.at > day.at) day.at = entry.at;
  }

  return [...days.entries()]
    .sort(([, a], [, b]) => b.at.getTime() - a.at.getTime())
    .map(([key, day]) => ({
      key,
      label: dayLabel(day.at),
      entries: day.entries.sort(
        (a, b) =>
          b.at.getTime() - a.at.getTime() ||
          KIND_ORDER[a.kind] - KIND_ORDER[b.kind],
      ),
    }));
}

function entryTitle(records: LootItem[]) {
  const byName = new Map<string, number>();
  for (const record of records) {
    const name = record.itemType.name;
    byName.set(name, (byName.get(name) ?? 0) + record.quantity);
  }
  if (byName.size === 1) return [...byName.keys()][0];
  return [...byName.entries()]
    .map(([name, quantity]) => (quantity > 1 ? `${name} ×${quantity}` : name))
    .join(", ");
}

function localDayKey(date: Date) {
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
}

function dayLabel(date: Date) {
  const day = date.toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
  });
  const weekday = date.toLocaleDateString("ru-RU", { weekday: "short" });
  return `${day}, ${weekday}`;
}
