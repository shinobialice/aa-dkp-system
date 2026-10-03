import { ArrowDown, ArrowUp } from "lucide-react";
import { cn } from "@/shared/lib/tw-merge";
import type { SalarySort, SalarySortKey } from "../financeModel";

const HEADERS: {
  key: SalarySortKey | null;
  label: string;
  alignRight?: boolean;
}[] = [
  { key: "class", label: "Игрок" },
  { key: "attendance", label: "Посещаемость" },
  { key: null, label: "Надбавки" },
  { key: "weight", label: "Вес", alignRight: true },
  { key: "total", label: "Зарплата", alignRight: true },
  { key: null, label: "Аванс" },
  { key: "rest", label: "Остаток", alignRight: true },
];

type Props = {
  sort: SalarySort;
  onSort: (key: SalarySortKey) => void;
};

export default function SortableHeaders({ sort, onSort }: Props) {
  const Arrow = sort.desc ? ArrowDown : ArrowUp;

  return HEADERS.map(({ key, label, alignRight }) => {
    if (!key) return <span key={label}>{label}</span>;
    const active = sort.key === key;
    return (
      <button
        key={label}
        type="button"
        onClick={() => onSort(key)}
        aria-label={`Сортировать: ${label}`}
        className={cn(
          "inline-flex cursor-pointer items-center gap-1 hover:text-foreground",
          alignRight && "justify-end",
          active && "text-foreground",
        )}
      >
        {label}
        {active && <Arrow className="size-3.5" />}
      </button>
    );
  });
}
