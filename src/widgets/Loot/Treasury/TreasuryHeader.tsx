import TreasuryAddMenu from "./TreasuryAddMenu";
import TreasuryMonthPicker from "./TreasuryMonthPicker";

type Props = {
  month: number;
  year: number;
  isAdmin: boolean;
  onMonthChange: (month: number, year: number) => void;
  onAddDrop: () => void;
  onAddTreasury: () => void;
  onAddExpense: () => void;
};

export default function TreasuryHeader({
  month,
  year,
  isAdmin,
  onMonthChange,
  onAddDrop,
  onAddTreasury,
  onAddExpense,
}: Props) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">Казна</h1>
        <p className="text-sm text-muted-foreground">
          Склад лута гильдии, продажи и расходы
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <TreasuryMonthPicker
          month={month}
          year={year}
          onChange={onMonthChange}
        />
        {isAdmin && (
          <TreasuryAddMenu
            onAddDrop={onAddDrop}
            onAddTreasury={onAddTreasury}
            onAddExpense={onAddExpense}
          />
        )}
      </div>
    </div>
  );
}
