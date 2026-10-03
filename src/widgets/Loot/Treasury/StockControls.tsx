import { ArrowUpDown, Search } from "lucide-react";
import {
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui";
import type { StockSort } from "./stockModel";
import type { StockView } from "./treasuryView";

type Props = {
  view: StockView;
  onViewChange: (view: StockView) => void;
};

export default function StockControls({ view, onViewChange }: Props) {
  return (
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
          value={view.search}
          onChange={(event) =>
            onViewChange({ ...view, search: event.target.value })
          }
          className="pl-9"
        />
      </div>
      <Select
        value={view.sort}
        onValueChange={(sort) =>
          onViewChange({ ...view, sort: sort as StockSort })
        }
      >
        <SelectTrigger
          className="cursor-pointer"
          aria-label="Сортировка склада"
        >
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
  );
}
