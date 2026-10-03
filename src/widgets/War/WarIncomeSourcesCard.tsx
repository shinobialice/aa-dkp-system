import { Coins } from "lucide-react";
import type { PeriodIncomeSourceEntry } from "@/actions/warEconomy";
import { formatNumber } from "@/shared/lib/format";
import { cn } from "@/shared/lib/tw-merge";
import MeterBar from "./MeterBar";
import { formatShare } from "./warModel";
import WarSection from "./WarSection";

type Props = {
  sources: PeriodIncomeSourceEntry[];
  totalEarned: number;
};

export default function WarIncomeSourcesCard({ sources, totalEarned }: Props) {
  const known = sources.reduce((sum, source) => sum + source.income, 0);
  const rest = totalEarned - known;
  const rows = [
    ...sources.map((source) => ({
      name: source.source,
      income: source.income,
      muted: false,
    })),
    ...(rest > 0 ? [{ name: "Без источника", income: rest, muted: true }] : []),
  ];
  const max = Math.max(1, ...rows.map((row) => row.income));

  return (
    <WarSection
      title="Доход по источникам"
      icon={Coins}
      empty={rows.length === 0 ? "Дохода за период пока нет" : null}
      action={
        totalEarned > 0 && (
          <span className="text-xs text-muted-foreground">
            доля от {formatNumber(totalEarned)}
          </span>
        )
      }
    >
      <ul className="flex flex-col gap-3 px-4 pb-4 sm:gap-2.5">
        {rows.map((row) => (
          <li
            key={row.name}
            className="grid grid-cols-[minmax(0,1fr)_auto_44px] items-center gap-x-3 gap-y-1.5 sm:grid-cols-[128px_minmax(0,1fr)_104px_44px]"
          >
            <span
              className={cn(
                "truncate font-medium",
                row.muted && "text-muted-foreground",
              )}
            >
              {row.name}
            </span>
            <span className="text-right font-semibold tabular-nums">
              {formatNumber(row.income)}
            </span>
            <span className="text-right text-xs text-muted-foreground tabular-nums">
              {formatShare(row.income, totalEarned)}
            </span>
            <MeterBar
              percent={(row.income / max) * 100}
              className="col-span-3 h-2 sm:col-span-1 sm:col-start-2 sm:row-start-1 sm:h-2.5"
              barClassName={
                row.muted ? "bg-muted-foreground/40" : "bg-green-500"
              }
            />
          </li>
        ))}
      </ul>
    </WarSection>
  );
}
