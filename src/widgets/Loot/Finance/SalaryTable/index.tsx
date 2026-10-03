"use client";

import { useRef, useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/shared/ui";
import {
  DEFAULT_SORT,
  groupSalariesByClass,
  monthLabel,
  nextSort,
  sortSalaries,
  type SalaryEntry,
  type SalarySortKey,
} from "../financeModel";
import type { AdvanceHandlers } from "./AdvanceControls";
import SalaryDesktopTable from "./SalaryDesktopTable";
import SalaryMobileList from "./SalaryMobileList";

type Props = {
  rows: SalaryEntry[];
  month: number;
  currentUserId: number | null;
  unpaidReasons: Record<number, string>;
  advance: AdvanceHandlers;
};

export default function SalaryTable({
  rows,
  month,
  currentUserId,
  unpaidReasons,
  advance,
}: Props) {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState(DEFAULT_SORT);
  const desktopRef = useRef<HTMLDivElement>(null);

  const query = search.trim().toLowerCase();
  const found = rows.filter(
    (row) => !query || row.username.toLowerCase().includes(query),
  );
  const paid = sortSalaries(
    found.filter((row) => row.total > 0),
    sort,
  );
  const unpaid = sortSalaries(
    found.filter((row) => row.total <= 0),
    DEFAULT_SORT,
  );
  const grouped = sort.key === "class";
  const groups = grouped
    ? groupSalariesByClass(paid)
    : [{ key: "all", title: "", className: null, rows: paid }];

  const handleSort = (key: SalarySortKey) => {
    desktopRef.current?.scrollTo({ top: 0 });
    setSort(nextSort(sort, key));
  };

  const listProps = {
    groups,
    grouped,
    unpaid,
    isEmpty: paid.length === 0 && unpaid.length === 0,
    currentUserId,
    unpaidReasons,
    advance,
  };

  return (
    <section aria-label="Зарплаты" className="flex min-w-0 flex-col gap-3">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold">
            Зарплаты за {monthLabel(month)}
          </h2>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Вес — посещаемость с надбавками; зарплата — доля фонда по весу
          </p>
        </div>
        <div className="relative w-full sm:w-60">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Найти игрока"
            aria-label="Найти игрока"
            className="pl-9"
          />
        </div>
      </div>

      <SalaryDesktopTable
        ref={desktopRef}
        sort={sort}
        onSort={handleSort}
        {...listProps}
      />
      <SalaryMobileList {...listProps} />
    </section>
  );
}
