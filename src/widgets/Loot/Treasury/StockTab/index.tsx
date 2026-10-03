"use client";

import { useState } from "react";
import { formatNumber, plural } from "@/shared/lib/format";
import { Skeleton } from "@/shared/ui";
import type { StockGroup } from "../stockModel";
import StockCard from "./StockCard";
import type { StockActions } from "./StockRowActions";
import StockTable from "./StockTable";

const SKELETON_ROWS = 5;

export type StockSummary = {
  positions: number;
  quantity: number;
  value: number;
};

type Props = StockActions & {
  groups: StockGroup[];
  summary: StockSummary;
  isAdmin: boolean;
  loading: boolean;
  searching: boolean;
};

export default function StockTab({
  groups,
  summary,
  isAdmin,
  loading,
  searching,
  ...actions
}: Props) {
  const [expanded, setExpanded] = useState<number | null>(null);

  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: SKELETON_ROWS }, (_, index) => (
          <Skeleton key={index} className="h-16 w-full rounded-xl" />
        ))}
      </div>
    );
  }
  if (groups.length === 0) {
    return (
      <div className="rounded-xl border border-dashed px-4 py-12 text-center text-sm text-muted-foreground">
        {searching
          ? "Ничего не нашлось"
          : "На складе пусто — всё продано или выдано"}
      </div>
    );
  }

  const summaryText = summaryLabel(summary);
  const handleToggle = (id: number) => setExpanded(expanded === id ? null : id);

  return (
    <>
      <StockTable
        groups={groups}
        isAdmin={isAdmin}
        expanded={expanded}
        summaryText={summaryText}
        summaryValue={summary.value}
        onToggle={handleToggle}
        onExpand={setExpanded}
        {...actions}
      />
      <div className="space-y-3 xl:hidden">
        <div className="grid grid-cols-[repeat(auto-fill,minmax(min(320px,100%),1fr))] gap-3">
          {groups.map((group) => (
            <StockCard
              key={group.itemTypeId}
              group={group}
              isAdmin={isAdmin}
              open={expanded === group.itemTypeId}
              onToggle={() => handleToggle(group.itemTypeId)}
              onExpand={() => setExpanded(group.itemTypeId)}
              {...actions}
            />
          ))}
        </div>
        <div className="flex flex-wrap items-baseline justify-between gap-2 px-1 text-sm">
          <span className="text-muted-foreground">{summaryText}</span>
          <span className="font-bold tabular-nums">
            {formatNumber(summary.value)}
          </span>
        </div>
      </div>
    </>
  );
}

function summaryLabel(summary: StockSummary) {
  const today = new Date().toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
  });
  const positions = plural(summary.positions, "позиция", "позиции", "позиций");
  return `Склад на ${today} · ${summary.positions} ${positions} · ${summary.quantity} шт.`;
}
