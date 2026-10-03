import { cn } from "@/shared/lib/tw-merge";
import {
  salaryModifiers,
  type SalaryEntry,
  type SalaryModifier,
} from "../financeModel";

const MODIFIER_STYLES: Record<SalaryModifier["kind"], string> = {
  tenure: "bg-muted text-foreground/80",
  bonus: "bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-400",
  penalty: "bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400",
};

type Props = {
  row: SalaryEntry;
};

export default function SalaryModifiers({ row }: Props) {
  const modifiers = salaryModifiers(row);
  if (modifiers.length === 0) {
    return <span className="text-xs text-muted-foreground">—</span>;
  }

  return (
    <span className="flex flex-wrap gap-1">
      {modifiers.map((modifier) => (
        <span
          key={modifier.kind}
          className={cn(
            "rounded-full px-1.5 py-px text-xs font-medium whitespace-nowrap",
            MODIFIER_STYLES[modifier.kind],
          )}
        >
          {modifier.text}
        </span>
      ))}
    </span>
  );
}
