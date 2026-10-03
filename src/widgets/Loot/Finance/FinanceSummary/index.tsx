import { formatNumber } from "@/shared/lib/format";
import { GoldAmount } from "@/shared/ui";
import { monthLabel, type Fund, type SalaryEntry } from "../financeModel";
import SplitBar from "./SplitBar";
import SummaryCard from "./SummaryCard";
import SummaryLine from "./SummaryLine";

type Props = {
  fund: Fund;
  salaries: SalaryEntry[];
  month: number;
};

export default function FinanceSummary({ fund, salaries, month }: Props) {
  const totalSalaries = salaries.length
    ? salaries.reduce((sum, row) => sum + row.total, 0)
    : fund.salaryBudget;
  const advanceSent = fund.advanceSent ?? 0;
  const inTreasury = fund.inTreasury ?? 0;
  const remainingSalaries = totalSalaries - advanceSent;
  const freeGold = inTreasury - remainingSalaries;
  const paidCount = salaries.filter((row) => row.total > 0).length;
  const paidShare =
    totalSalaries > 0 ? Math.min(100, (advanceSent / totalSalaries) * 100) : 0;
  const name = monthLabel(month);

  return (
    <div className="grid gap-3 md:grid-cols-3">
      <SummaryCard label={`Заработано за ${name}`}>
        <GoldAmount value={fund.totalIncome} size="lg" />
        <SplitBar
          parts={[
            { value: fund.salaryBudget, className: "bg-green-600" },
            {
              value: fund.treasuryBudget ?? 0,
              className: "bg-muted-foreground/40",
            },
          ]}
        />
        <div className="flex flex-col gap-1">
          <SummaryLine
            label="Зарплатный фонд · 70%"
            value={formatNumber(fund.salaryBudget, 0)}
            swatch="bg-green-600"
          />
          <SummaryLine
            label="Доход казны · 30%"
            value={formatNumber(fund.treasuryBudget ?? 0, 0)}
            swatch="bg-muted-foreground/40"
          />
          <SummaryLine
            label="Расходы"
            value={formatNumber(fund.totalExpenses, 0)}
            muted
          />
        </div>
      </SummaryCard>

      <SummaryCard label="В казне сейчас">
        <GoldAmount value={inTreasury} size="lg" />
        <SplitBar
          parts={[
            {
              value: Math.max(0, remainingSalaries),
              className: "bg-amber-500",
            },
            { value: Math.max(0, freeGold), className: "bg-green-600" },
          ]}
        />
        <div className="flex flex-col gap-1">
          <SummaryLine
            label="Отложено на зарплаты"
            value={formatNumber(remainingSalaries, 0)}
            swatch="bg-amber-500"
          />
          <SummaryLine
            label="Свободно"
            value={formatNumber(freeGold, 0)}
            swatch="bg-green-600"
          />
          <SummaryLine
            label="Перенесено с прошлого месяца"
            value={formatNumber(fund.carryOver, 0)}
            muted
          />
        </div>
      </SummaryCard>

      <SummaryCard label={`Выплаты за ${name}`}>
        <span className="text-2xl leading-tight font-bold tabular-nums sm:text-3xl">
          {formatNumber(advanceSent, 0)}{" "}
          <span className="text-base font-medium text-muted-foreground">
            из {formatNumber(totalSalaries, 0)}
          </span>
        </span>
        <span className="relative block h-2.5 overflow-hidden rounded bg-muted">
          <span
            className="absolute inset-y-0 left-0 rounded bg-green-600"
            style={{ width: `${paidShare}%` }}
          />
        </span>
        <div className="flex flex-col gap-1">
          <SummaryLine
            label="Осталось выплатить"
            value={formatNumber(remainingSalaries, 0)}
          />
          <SummaryLine
            label="Выслано авансом"
            value={formatNumber(advanceSent, 0)}
          />
          <SummaryLine
            label="Получают зарплату"
            value={`${paidCount} из ${salaries.length}`}
            muted
          />
        </div>
      </SummaryCard>
    </div>
  );
}
