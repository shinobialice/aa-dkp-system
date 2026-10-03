import { cn } from "@/shared/lib/tw-merge";
import { calculatePenaltyPercent } from "@/utils/calculateSalaryWeight";
import { formatPercent } from "@/shared/lib/format";
import { PENALTY_ALL, PENALTY_STEPS } from "./ruleFacts";

export default function PenaltyTable() {
  const cells = [
    ...PENALTY_STEPS.map((count) => ({
      count: String(count),
      cut: formatPercent(calculatePenaltyPercent(count), 1),
      total: false,
    })),
    { count: `${PENALTY_ALL}+`, cut: "вся", total: true },
  ];

  return (
    <div className="overflow-x-auto rounded-lg border text-sm">
      <table className="w-full min-w-105 border-collapse">
        <tbody>
          <tr className="bg-muted/50">
            <th
              scope="row"
              className="px-3 py-1.5 text-left font-normal text-muted-foreground"
            >
              Штрафов
            </th>
            {cells.map((cell) => (
              <td
                key={cell.count}
                className="border-l border-border/60 px-2 py-1.5 text-center font-semibold tabular-nums"
              >
                {cell.count}
              </td>
            ))}
          </tr>
          <tr className="border-t">
            <th
              scope="row"
              className="px-3 py-1.5 text-left font-normal whitespace-nowrap text-muted-foreground"
            >
              Минус к зарплате
            </th>
            {cells.map((cell) => (
              <td
                key={cell.count}
                className={cn(
                  "border-l border-border/60 px-2 py-1.5 text-center font-semibold tabular-nums",
                  cell.total && "text-red-700 dark:text-red-400",
                )}
              >
                {cell.cut}
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}
