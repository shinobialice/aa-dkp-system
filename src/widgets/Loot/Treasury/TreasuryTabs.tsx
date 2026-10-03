import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui";
import type { ExpenseItem } from "../GuildLoot/ExpensesTypes";
import type { ItemType } from "../GuildLoot/LootTypes";
import ExpensesTab from "./ExpensesTab";
import type { JournalDay } from "./journalModel";
import JournalTab from "./JournalTab";
import StockControls from "./StockControls";
import type { StockGroup } from "./stockModel";
import StockTab from "./StockTab";
import type { BossSales, MiscTotal, MonthStats } from "./treasuryModel";
import { visibleStock, type StockView, type TreasuryTab } from "./treasuryView";
import type { TreasuryActions } from "./useTreasuryActions";

type Props = {
  view: StockView;
  onViewChange: (view: StockView) => void;
  stock: StockGroup[];
  stats: MonthStats;
  journal: JournalDay[];
  bossSales: BossSales[];
  monthExpenses: ExpenseItem[];
  misc: MiscTotal[];
  itemTypes: ItemType[];
  isAdmin: boolean;
  loading: boolean;
  periodKey: string;
  monthLabel: string;
  actions: TreasuryActions;
};

export default function TreasuryTabs({
  view,
  onViewChange,
  stock,
  stats,
  journal,
  bossSales,
  monthExpenses,
  misc,
  itemTypes,
  isAdmin,
  loading,
  periodKey,
  monthLabel,
  actions,
}: Props) {
  return (
    <Tabs
      value={view.tab}
      onValueChange={(tab) =>
        onViewChange({ ...view, tab: tab as TreasuryTab })
      }
      className="gap-3"
    >
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
        {view.tab === "stock" && (
          <StockControls view={view} onViewChange={onViewChange} />
        )}
      </div>

      <TabsContent value="stock">
        <StockTab
          groups={visibleStock(stock, view.search, view.sort)}
          summary={{
            positions: stats.stockPositions,
            quantity: stats.stockQuantity,
            value: stats.stockValue,
          }}
          isAdmin={isAdmin}
          loading={loading}
          searching={view.search.trim() !== ""}
          onSell={(group) => actions.openSell(group, "sell")}
          onGive={(group) => actions.openSell(group, "gift")}
          onEditPrice={actions.openPrice}
          onDeleteLot={actions.requestDeleteLot}
        />
      </TabsContent>

      <TabsContent value="journal">
        <JournalTab
          key={periodKey}
          days={journal}
          misc={misc}
          itemTypes={itemTypes}
          bossSales={bossSales}
          isAdmin={isAdmin}
          loading={loading}
          monthLabel={monthLabel}
          onMiscSet={actions.setMiscTotal}
          onEditRecord={actions.editRecord}
          onDeleteRecord={actions.requestDeleteRecord}
        />
      </TabsContent>

      <TabsContent value="expenses">
        <ExpensesTab
          expenses={monthExpenses}
          isAdmin={isAdmin}
          loading={loading}
          monthLabel={monthLabel}
          onAdd={() => actions.openExpense()}
          onEdit={actions.openExpense}
          onDelete={actions.requestDeleteExpense}
        />
      </TabsContent>
    </Tabs>
  );
}

function TabCount({ value }: { value: number }) {
  return (
    <span className="min-w-5 rounded-full bg-foreground/10 px-1.5 text-xs tabular-nums">
      {value}
    </span>
  );
}
