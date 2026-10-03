import { formatNumber } from "@/shared/lib/format";
import { Checkbox, Input } from "@/shared/ui";
import type { SalaryEntry } from "../financeModel";

export type AdvanceHandlers = {
  isAdmin: boolean;
  onChange: (salaryId: number, sentAmount: number, sent: boolean) => void;
  onEditStart: (salaryId: number) => void;
  onEditEnd: () => void;
};

type Props = {
  row: SalaryEntry;
  handlers: AdvanceHandlers;
};

export default function AdvanceControls({ row, handlers }: Props) {
  if (!handlers.isAdmin) return <AdvanceBadge row={row} />;

  return (
    <span className="flex items-center gap-2">
      <Checkbox
        checked={row.sent}
        aria-label={`Выслано: ${row.username}`}
        onCheckedChange={(checked) =>
          handlers.onChange(row.id, row.sentAmount, checked === true)
        }
      />
      <Input
        type="number"
        value={row.sentAmount}
        aria-label={`Сумма аванса: ${row.username}`}
        onFocus={() => handlers.onEditStart(row.id)}
        onBlur={handlers.onEditEnd}
        onChange={(event) =>
          handlers.onChange(row.id, Number(event.target.value), row.sent)
        }
        className="h-8 w-26 tabular-nums"
      />
    </span>
  );
}

function AdvanceBadge({ row }: { row: SalaryEntry }) {
  if (row.sentAmount <= 0 && !row.sent) {
    return <span className="text-xs text-muted-foreground">—</span>;
  }
  return (
    <span className="rounded-full bg-green-50 px-2 py-0.5 text-xs font-medium text-green-700 dark:bg-green-500/10 dark:text-green-400">
      {row.sent ? "выслано" : "аванс"}{" "}
      {row.sentAmount > 0 && formatNumber(row.sentAmount, 0)}
    </span>
  );
}
