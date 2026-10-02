"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { ArrowUpDown, Search } from "lucide-react";
import { toast } from "sonner";
import {
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/shared/ui";
import {
  addLootItem,
  getItemTypes,
  getLoot,
  updateTreasuryIncome,
} from "@/actions/lootActions";
import {
  addExpense,
  deleteExpense,
  getExpenses,
  updateExpense,
} from "@/actions/expenseActions";
import { getMiscLootTotals, setMiscLootTotal } from "@/actions/miscLootTotals";
import { getActiveUsers } from "@/actions/getActiveUsers";
import { deleteLootItem } from "@/actions/deleteLootItem";
import { updateLootSale } from "@/actions/distributeLootItems";
import { updateItemTypePrice } from "@/actions/updateItemTypePrice";
import { useVisiblePolling } from "@/hooks/useVisiblePolling";
import type { ItemType, LootItem, NewLootItem } from "../GuildLoot/LootTypes";
import type { ExpenseItem } from "../GuildLoot/ExpensesTypes";
import { AddLootDialog } from "../GuildLoot/AddLootDialog";
import { AddExpenseDialog } from "../GuildLoot/AddExpenseDialog";
import { SellLootDialog } from "../GuildLoot/SellLootDialog";
import { EditTreasuryIncomeDialog } from "../GuildLoot/EditTreasuryIncomeDialog";
import { TreasuryHeader } from "./TreasuryHeader";
import { TreasuryStats } from "./TreasuryStats";
import { StockTab } from "./StockTab";
import { JournalTab } from "./JournalTab";
import { ExpensesTab } from "./ExpensesTab";
import { SellStockDialog, type SellMode } from "./SellStockDialog";
import { EditPriceDialog } from "./EditPriceDialog";
import { ConfirmDialog, type ConfirmRequest } from "./ConfirmDialog";
import {
  buildBossSales,
  buildJournal,
  buildMonthStats,
  buildStockGroups,
  expensesForMonth,
  formatDate,
  formatGold,
  monthName,
  sortStockGroups,
  type JournalKind,
  type MiscTotal,
  type StockGroup,
  type StockLot,
  type StockSort,
} from "./treasuryModel";

const POLL_MS = 30_000;

type Tab = "stock" | "journal" | "expenses";
type User = { id: number; username: string };

function expenseDate(expense: ExpenseItem) {
  return typeof expense.date === "string"
    ? expense.date
    : expense.date.toISOString().split("T")[0];
}

function TabCount({ value }: { value: number }) {
  return (
    <span className="min-w-5 rounded-full bg-foreground/10 px-1.5 text-xs tabular-nums">
      {value}
    </span>
  );
}

export default function TreasuryPage({ isAdmin }: { isAdmin: boolean }) {
  const [month, setMonth] = useState(() => new Date().getMonth() + 1);
  const [year, setYear] = useState(() => new Date().getFullYear());
  const [tab, setTab] = useState<Tab>("stock");
  const [loot, setLoot] = useState<LootItem[]>([]);
  const [expenses, setExpenses] = useState<ExpenseItem[]>([]);
  const [misc, setMisc] = useState<MiscTotal[]>([]);
  const [itemTypes, setItemTypes] = useState<ItemType[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<StockSort>("value");

  const [addLoot, setAddLoot] = useState<{
    open: boolean;
    key: number;
    preset?: string;
  }>({ open: false, key: 0 });
  const [expenseDialog, setExpenseDialog] = useState<{ expense?: ExpenseItem } | null>(
    null,
  );
  const [sellTarget, setSellTarget] = useState<{
    group: StockGroup;
    mode: SellMode;
  } | null>(null);
  const [editSale, setEditSale] = useState<LootItem | null>(null);
  const [editTreasury, setEditTreasury] = useState<LootItem | null>(null);
  const [priceTarget, setPriceTarget] = useState<StockGroup | null>(null);
  const [confirm, setConfirm] = useState<ConfirmRequest | null>(null);

  const refreshLoot = useCallback(async () => {
    setLoot((await getLoot()) as LootItem[]);
  }, []);
  const refreshExpenses = useCallback(async () => {
    setExpenses((await getExpenses()) as ExpenseItem[]);
  }, []);
  const refreshMisc = useCallback(async () => {
    setMisc(await getMiscLootTotals(month, year));
  }, [month, year]);

  useEffect(() => {
    Promise.all([getLoot(), getExpenses(), getItemTypes()])
      .then(([lootRows, expenseRows, types]) => {
        setLoot(lootRows as LootItem[]);
        setExpenses(expenseRows as ExpenseItem[]);
        setItemTypes(types as ItemType[]);
      })
      .catch((error) => {
        console.error(error);
        toast.error("Не удалось загрузить казну");
      })
      .finally(() => setLoaded(true));
  }, []);

  useEffect(() => {
    if (!isAdmin) return;
    getActiveUsers()
      .then(setUsers)
      .catch((error) => console.error(error));
  }, [isAdmin]);

  useEffect(() => {
    let cancelled = false;
    getMiscLootTotals(month, year)
      .then((rows) => {
        if (!cancelled) setMisc(rows);
      })
      .catch((error) => console.error(error));
    return () => {
      cancelled = true;
    };
  }, [month, year]);

  useVisiblePolling(() => {
    Promise.all([refreshLoot(), refreshExpenses(), refreshMisc()]).catch((error) =>
      console.error(error),
    );
  }, POLL_MS);

  const stock = useMemo(() => buildStockGroups(loot, new Date()), [loot]);
  const visibleStock = useMemo(() => {
    const query = search.trim().toLowerCase();
    const filtered = query
      ? stock.filter((group) => group.name.toLowerCase().includes(query))
      : stock;
    return sortStockGroups(filtered, sort);
  }, [stock, search, sort]);
  const stats = useMemo(
    () => buildMonthStats({ loot, expenses, misc, stock, month, year }),
    [loot, expenses, misc, stock, month, year],
  );
  const journal = useMemo(() => buildJournal(loot, month, year), [loot, month, year]);
  const bossSales = useMemo(() => buildBossSales(loot, month, year), [loot, month, year]);
  const monthExpenses = useMemo(
    () => expensesForMonth(expenses, month, year),
    [expenses, month, year],
  );
  const monthLabel = monthName(month);

  const editSaleValues = useMemo(
    () =>
      editSale
        ? {
            soldTo: editSale.sold_to ?? "",
            soldToId: editSale.sold_to_user_id || undefined,
            quantity: editSale.quantity,
            price: editSale.price ?? editSale.itemType.price ?? 0,
            comment: editSale.comment ?? "",
            isFree: editSale.status === "Выдано",
            soldAt: editSale.sold_at ?? undefined,
          }
        : undefined,
    [editSale],
  );

  const handleAddLoot = async (item: NewLootItem) => {
    try {
      await addLootItem(item);
      await refreshLoot();
      toast.success(
        item.status === "В казну" ? "Поступление добавлено" : "Дроп добавлен на склад",
      );
    } catch (error) {
      console.error(error);
      toast.error("Не удалось добавить");
    }
  };

  const handleSaveExpense = async (expense: ExpenseItem) => {
    const date = expenseDate(expense);
    try {
      if (expense.id) {
        await updateExpense({
          ...expense,
          id: expense.id,
          date,
          comment: expense.comment ?? undefined,
        });
      } else {
        await addExpense({ ...expense, date, comment: expense.comment ?? undefined });
      }
      await refreshExpenses();
      toast.success(expense.id ? "Расход изменён" : "Расход добавлен");
    } catch (error) {
      console.error(error);
      toast.error("Не удалось сохранить расход");
    }
  };

  const requestDeleteExpense = (expense: ExpenseItem) => {
    if (!expense.id) return;
    const id = expense.id;
    setConfirm({
      title: "Удалить расход?",
      description: `${expense.target} — ${formatGold(expense.amount)}. Это действие нельзя отменить.`,
      confirmLabel: "Удалить",
      errorMessage: "Не удалось удалить расход",
      onConfirm: async () => {
        await deleteExpense(id, expenseDate(expense));
        await refreshExpenses();
        toast.success("Расход удалён");
      },
    });
  };

  const requestDeleteLot = (group: StockGroup, lot: StockLot) => {
    const details = [
      lot.quantity > 1 ? `${group.name} ×${lot.quantity}` : group.name,
      lot.acquiredAt ? `получен ${formatDate(lot.acquiredAt)}` : null,
      lot.source,
    ]
      .filter(Boolean)
      .join(", ");
    setConfirm({
      title: "Удалить дроп со склада?",
      description: `${details}. Если предмет продали или выдали — оформите это через «Продать», а не удаляйте.`,
      confirmLabel: "Удалить",
      errorMessage: "Не удалось удалить дроп",
      onConfirm: async () => {
        await deleteLootItem(lot.id);
        await refreshLoot();
        toast.success("Дроп удалён");
      },
    });
  };

  const requestDeleteRecord = (record: LootItem, kind: JournalKind) => {
    const name = record.itemType.name;
    const price = formatGold(record.price ?? 0);
    const texts: Record<JournalKind, { title: string; description: string }> = {
      sale: {
        title: "Удалить запись о продаже?",
        description: `${name} → ${record.sold_to ?? "—"}, ${price}. Предмет на склад не вернётся, доход месяца уменьшится.`,
      },
      gift: {
        title: "Удалить запись о выдаче?",
        description: `${name} → ${record.sold_to ?? "—"}. Предмет на склад не вернётся.`,
      },
      treasury: {
        title: "Удалить поступление?",
        description: `${price} от ${record.source ?? "неизвестного источника"}. Сумма пропадёт из поступлений месяца.`,
      },
      drop: {
        title: "Удалить дроп со склада?",
        description: `${name}${(record.quantity ?? 0) > 1 ? ` ×${record.quantity}` : ""}. Если предмет продали или выдали — оформите это через «Продать», а не удаляйте.`,
      },
    };
    setConfirm({
      ...texts[kind],
      confirmLabel: "Удалить",
      errorMessage: "Не удалось удалить запись",
      onConfirm: async () => {
        await deleteLootItem(record.id);
        await refreshLoot();
        toast.success("Запись удалена");
      },
    });
  };

  const handleEditRecord = (record: LootItem) => {
    if (record.status === "В казну") {
      setEditTreasury(record);
    } else {
      setEditSale(record);
    }
  };

  const handleSavePrice = async (group: StockGroup, price: number | null) => {
    await updateItemTypePrice(group.name, price);
    await refreshLoot();
    toast.success("Цена сохранена");
  };

  const handleMiscSet = async (name: string, amount: number) => {
    await setMiscLootTotal({ name, month, year, amount });
    await refreshMisc();
    toast.success("Сумма сохранена");
  };

  return (
    <div className="mx-auto flex w-full max-w-6xl min-w-0 flex-col gap-6">
      <TreasuryHeader
        month={month}
        year={year}
        isAdmin={isAdmin}
        onMonthChange={(nextMonth, nextYear) => {
          setMonth(nextMonth);
          setYear(nextYear);
        }}
        onAddDrop={() => setAddLoot((prev) => ({ open: true, key: prev.key + 1 }))}
        onAddTreasury={() =>
          setAddLoot((prev) => ({ open: true, key: prev.key + 1, preset: "В казну" }))
        }
        onAddExpense={() => setExpenseDialog({})}
      />

      <TreasuryStats
        stats={stats}
        month={month}
        loading={!loaded}
        onShowStale={() => {
          setTab("stock");
          setSort("oldest");
          setSearch("");
        }}
      />

      <Tabs value={tab} onValueChange={(value) => setTab(value as Tab)} className="gap-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <TabsList>
            <TabsTrigger value="stock" className="cursor-pointer px-3">
              Склад
              <TabCount value={stock.length} />
            </TabsTrigger>
            <TabsTrigger value="journal" className="cursor-pointer px-3">
              Движение
            </TabsTrigger>
            <TabsTrigger value="expenses" className="cursor-pointer px-3">
              Расходы
              <TabCount value={monthExpenses.length} />
            </TabsTrigger>
          </TabsList>
          {tab === "stock" && (
            <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto">
              <div className="relative min-w-0 flex-1 sm:w-60 sm:flex-none">
                <Search
                  className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
                  aria-hidden
                />
                <Input
                  type="search"
                  aria-label="Найти предмет на складе"
                  placeholder="Найти предмет"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={sort} onValueChange={(value) => setSort(value as StockSort)}>
                <SelectTrigger className="cursor-pointer" aria-label="Сортировка склада">
                  <ArrowUpDown className="text-muted-foreground" aria-hidden />
                  <span className="hidden sm:inline">
                    <SelectValue />
                  </span>
                </SelectTrigger>
                <SelectContent align="end">
                  <SelectItem value="value">Сначала дорогие</SelectItem>
                  <SelectItem value="oldest">Сначала залежавшиеся</SelectItem>
                  <SelectItem value="name">По названию</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        <TabsContent value="stock">
          <StockTab
            groups={visibleStock}
            summary={{
              positions: stats.stockPositions,
              quantity: stats.stockQuantity,
              value: stats.stockValue,
            }}
            isAdmin={isAdmin}
            loading={!loaded}
            searching={search.trim() !== ""}
            onSell={(group) => setSellTarget({ group, mode: "sell" })}
            onGive={(group) => setSellTarget({ group, mode: "gift" })}
            onEditPrice={(group) => setPriceTarget({ ...group })}
            onDeleteLot={requestDeleteLot}
          />
        </TabsContent>

        <TabsContent value="journal">
          <JournalTab
            key={`${year}-${month}`}
            days={journal}
            misc={misc}
            itemTypes={itemTypes}
            bossSales={bossSales}
            isAdmin={isAdmin}
            loading={!loaded}
            monthLabel={monthLabel}
            onMiscSet={handleMiscSet}
            onEditRecord={handleEditRecord}
            onDeleteRecord={requestDeleteRecord}
          />
        </TabsContent>

        <TabsContent value="expenses">
          <ExpensesTab
            expenses={monthExpenses}
            isAdmin={isAdmin}
            loading={!loaded}
            monthLabel={monthLabel}
            onAdd={() => setExpenseDialog({})}
            onEdit={(expense) => setExpenseDialog({ expense })}
            onDelete={requestDeleteExpense}
          />
        </TabsContent>
      </Tabs>

      {isAdmin && (
        <>
          <AddLootDialog
            key={addLoot.key}
            open={addLoot.open}
            presetItemName={addLoot.preset}
            onClose={() => setAddLoot((prev) => ({ ...prev, open: false }))}
            onAdd={handleAddLoot}
            itemTypes={itemTypes}
          />

          <AddExpenseDialog
            open={!!expenseDialog}
            onClose={() => setExpenseDialog(null)}
            onAdd={handleSaveExpense}
            editMode={!!expenseDialog?.expense}
            initialValues={expenseDialog?.expense}
            users={users}
          />

          <SellStockDialog
            target={sellTarget}
            users={users}
            onClose={() => setSellTarget(null)}
            onDone={refreshLoot}
          />

          {editSale && editSaleValues && (
            <SellLootDialog
              open
              onClose={() => setEditSale(null)}
              itemName={editSale.itemType.name}
              initialPrice={editSaleValues.price}
              maxQuantity={editSale.quantity}
              users={users}
              editMode
              initialValues={editSaleValues}
              onConfirm={async (data) => {
                try {
                  await updateLootSale({
                    lootId: editSale.id,
                    quantity: data.quantity,
                    soldTo: data.soldTo,
                    soldToId: data.soldToId,
                    isFree: data.isFree ?? false,
                    comment: data.comment,
                    price: data.price,
                    soldAt: data.soldAt,
                  });
                  await refreshLoot();
                  toast.success("Запись изменена");
                } catch (error) {
                  console.error(error);
                  toast.error("Не удалось изменить запись");
                }
              }}
            />
          )}

          <EditTreasuryIncomeDialog
            open={!!editTreasury}
            onClose={() => setEditTreasury(null)}
            item={editTreasury}
            onSave={async (data) => {
              if (!editTreasury) return;
              try {
                await updateTreasuryIncome({ lootId: editTreasury.id, ...data });
                await refreshLoot();
                toast.success("Поступление изменено");
              } catch (error) {
                console.error(error);
                toast.error("Не удалось изменить поступление");
              }
            }}
          />

          <EditPriceDialog
            group={priceTarget}
            onClose={() => setPriceTarget(null)}
            onSave={handleSavePrice}
          />

          <ConfirmDialog request={confirm} onClose={() => setConfirm(null)} />
        </>
      )}
    </div>
  );
}
