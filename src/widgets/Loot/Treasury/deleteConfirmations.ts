import { formatNumber } from "@/shared/lib/format";
import type { ExpenseItem } from "../GuildLoot/ExpensesTypes";
import type { LootItem } from "../GuildLoot/LootTypes";
import type { JournalKind } from "./journalModel";
import type { StockGroup, StockLot } from "./stockModel";
import { formatDate } from "./treasuryModel";

type ConfirmText = { title: string; description: string };

const DROP_HINT =
  "Если предмет продали или выдали — оформите это через «Продать», а не удаляйте.";

export function expenseDeleteText(expense: ExpenseItem): ConfirmText {
  return {
    title: "Удалить расход?",
    description: `${expense.target} — ${formatNumber(expense.amount)}. Это действие нельзя отменить.`,
  };
}

export function lotDeleteText(group: StockGroup, lot: StockLot): ConfirmText {
  const details = [
    lot.quantity > 1 ? `${group.name} ×${lot.quantity}` : group.name,
    lot.acquiredAt ? `получен ${formatDate(lot.acquiredAt)}` : null,
    lot.source,
  ]
    .filter(Boolean)
    .join(", ");
  return {
    title: "Удалить дроп со склада?",
    description: `${details}. ${DROP_HINT}`,
  };
}

export function recordDeleteText(
  record: LootItem,
  kind: JournalKind,
): ConfirmText {
  const name = record.itemType.name;
  const price = formatNumber(record.price ?? 0);
  const recipient = record.sold_to ?? "—";

  switch (kind) {
    case "sale":
      return {
        title: "Удалить запись о продаже?",
        description: `${name} → ${recipient}, ${price}. Предмет на склад не вернётся, доход месяца уменьшится.`,
      };
    case "gift":
      return {
        title: "Удалить запись о выдаче?",
        description: `${name} → ${recipient}. Предмет на склад не вернётся.`,
      };
    case "treasury":
      return {
        title: "Удалить поступление?",
        description: `${price} от ${record.source ?? "неизвестного источника"}. Сумма пропадёт из поступлений месяца.`,
      };
    default: {
      const quantity = record.quantity > 1 ? ` ×${record.quantity}` : "";
      return {
        title: "Удалить дроп со склада?",
        description: `${name}${quantity}. ${DROP_HINT}`,
      };
    }
  }
}
