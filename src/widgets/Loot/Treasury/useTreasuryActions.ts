"use client";

import { useState } from "react";
import { toast } from "sonner";
import { deleteLootItem } from "@/actions/deleteLootItem";
import { updateLootSale } from "@/actions/distributeLootItems";
import {
  addExpense,
  deleteExpense,
  updateExpense,
} from "@/actions/expenseActions";
import { addLootItem, updateTreasuryIncome } from "@/actions/lootActions";
import { setMiscLootTotal } from "@/actions/miscLootTotals";
import { updateItemTypePrice } from "@/actions/updateItemTypePrice";
import type { SaleValues } from "../GuildLoot/EditSaleDialog/EditSaleForm";
import type { ExpenseDialogRequest } from "../GuildLoot/ExpenseDialog";
import type { ExpenseItem } from "../GuildLoot/ExpensesTypes";
import type { LootItem, NewLootItem } from "../GuildLoot/LootTypes";
import type { TreasuryIncomeValues } from "../GuildLoot/TreasuryIncomeDialog/TreasuryIncomeForm";
import type { ConfirmRequest } from "./ConfirmDialog";
import {
  expenseDeleteText,
  lotDeleteText,
  recordDeleteText,
} from "./deleteConfirmations";
import type { JournalKind } from "./journalModel";
import type { SellMode, SellTarget } from "./SellStockDialog/sellStockModel";
import type { StockGroup, StockLot } from "./stockModel";
import type { TreasuryData } from "./useTreasuryData";

type AddLootState = { open: boolean; key: number; preset?: string };

export type TreasuryActions = ReturnType<typeof useTreasuryActions>;

export function useTreasuryActions(
  data: TreasuryData,
  month: number,
  year: number,
) {
  const [addLoot, setAddLoot] = useState<AddLootState>({ open: false, key: 0 });
  const [expenseDialog, setExpenseDialog] =
    useState<ExpenseDialogRequest | null>(null);
  const [sellTarget, setSellTarget] = useState<SellTarget | null>(null);
  const [editSale, setEditSale] = useState<LootItem | null>(null);
  const [editTreasury, setEditTreasury] = useState<LootItem | null>(null);
  const [priceTarget, setPriceTarget] = useState<StockGroup | null>(null);
  const [confirm, setConfirm] = useState<ConfirmRequest | null>(null);

  const withToast = async (
    action: () => Promise<unknown>,
    success: string,
    failure: string,
  ) => {
    try {
      await action();
      toast.success(success);
    } catch (error) {
      console.error(error);
      toast.error(failure);
    }
  };

  const askDelete = (
    text: { title: string; description: string },
    errorMessage: string,
    onConfirm: () => Promise<void>,
  ) =>
    setConfirm({ ...text, confirmLabel: "Удалить", errorMessage, onConfirm });

  return {
    addLoot,
    expenseDialog,
    sellTarget,
    editSale,
    editTreasury,
    priceTarget,
    confirm,
    openAddLoot: (preset?: string) =>
      setAddLoot((current) => ({ open: true, key: current.key + 1, preset })),
    closeAddLoot: () => setAddLoot((current) => ({ ...current, open: false })),
    openExpense: (expense?: ExpenseItem) => setExpenseDialog({ expense }),
    closeExpense: () => setExpenseDialog(null),
    openSell: (group: StockGroup, mode: SellMode) =>
      setSellTarget({ group, mode }),
    closeSell: () => setSellTarget(null),
    openPrice: (group: StockGroup) => setPriceTarget({ ...group }),
    closePrice: () => setPriceTarget(null),
    closeEditSale: () => setEditSale(null),
    closeEditTreasury: () => setEditTreasury(null),
    closeConfirm: () => setConfirm(null),

    addLootItem: (item: NewLootItem) =>
      withToast(
        async () => {
          await addLootItem(item);
          await data.refreshLoot();
        },
        item.status === "В казну"
          ? "Поступление добавлено"
          : "Дроп добавлен на склад",
        "Не удалось добавить",
      ),

    saveExpense: (expense: ExpenseItem) =>
      withToast(
        async () => {
          const input = { ...expense, comment: expense.comment ?? undefined };
          if (expense.id) await updateExpense({ ...input, id: expense.id });
          else await addExpense(input);
          await data.refreshExpenses();
        },
        expense.id ? "Расход изменён" : "Расход добавлен",
        "Не удалось сохранить расход",
      ),

    saveSale: (values: SaleValues) =>
      withToast(
        async () => {
          if (!editSale) return;
          await updateLootSale({ lootId: editSale.id, ...values });
          await data.refreshLoot();
        },
        "Запись изменена",
        "Не удалось изменить запись",
      ),

    saveTreasuryIncome: (values: TreasuryIncomeValues) =>
      withToast(
        async () => {
          if (!editTreasury) return;
          await updateTreasuryIncome({ lootId: editTreasury.id, ...values });
          await data.refreshLoot();
        },
        "Поступление изменено",
        "Не удалось изменить поступление",
      ),

    savePrice: async (group: StockGroup, price: number | null) => {
      await updateItemTypePrice(group.name, price);
      await data.refreshLoot();
      toast.success("Цена сохранена");
    },

    setMiscTotal: async (name: string, amount: number) => {
      await setMiscLootTotal({ name, month, year, amount });
      await data.refreshMisc();
      toast.success("Сумма сохранена");
    },

    editRecord: (record: LootItem) => {
      if (record.status === "В казну") setEditTreasury(record);
      else setEditSale(record);
    },

    requestDeleteExpense: (expense: ExpenseItem) => {
      const id = expense.id;
      if (!id) return;
      askDelete(
        expenseDeleteText(expense),
        "Не удалось удалить расход",
        async () => {
          await deleteExpense(id, expense.date);
          await data.refreshExpenses();
          toast.success("Расход удалён");
        },
      );
    },

    requestDeleteLot: (group: StockGroup, lot: StockLot) =>
      askDelete(
        lotDeleteText(group, lot),
        "Не удалось удалить дроп",
        async () => {
          await deleteLootItem(lot.id);
          await data.refreshLoot();
          toast.success("Дроп удалён");
        },
      ),

    requestDeleteRecord: (record: LootItem, kind: JournalKind) =>
      askDelete(
        recordDeleteText(record, kind),
        "Не удалось удалить запись",
        async () => {
          await deleteLootItem(record.id);
          await data.refreshLoot();
          toast.success("Запись удалена");
        },
      ),
  };
}
