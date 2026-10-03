import { ChevronDown } from "lucide-react";
import { cn } from "@/shared/lib/tw-merge";

type Props = {
  count: number;
  open: boolean;
  onToggle: () => void;
  className?: string;
};

export default function UnpaidToggle({
  count,
  open,
  onToggle,
  className,
}: Props) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-expanded={open}
      className={cn(
        "flex w-full cursor-pointer items-center gap-2 text-left text-sm font-semibold",
        className,
      )}
    >
      <ChevronDown
        className={cn("size-4 transition-transform", !open && "-rotate-90")}
      />
      Без зарплаты в этом месяце
      <span className="font-medium text-muted-foreground">{count}</span>
    </button>
  );
}
