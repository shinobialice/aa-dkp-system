"use client";

import { useState } from "react";
import { cn } from "@/shared/lib/tw-merge";
import InventoryCategories from "./InventoryCategories";

const FILTERS = [
  { value: false, label: "Все" },
  { value: true, label: "Только есть" },
];

export default function InventoryTabsClient({
  inventory,
  userId,
}: {
  inventory: any[];
  userId: number;
}) {
  const [ownedOnly, setOwnedOnly] = useState(false);

  return (
    <section
      aria-label="Инвентарь"
      className="flex flex-col gap-4 rounded-xl border bg-card p-4 sm:p-5"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-[15px] font-semibold">Инвентарь</h2>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Техника, глайдеры и петы для коллекций
          </p>
        </div>
        <div
          role="group"
          aria-label="Что показать"
          className="inline-flex gap-0.5 rounded-lg bg-muted p-[3px]"
        >
          {FILTERS.map((filter) => {
            const active = filter.value === ownedOnly;
            return (
              <button
                key={filter.label}
                type="button"
                aria-pressed={active}
                onClick={() => setOwnedOnly(filter.value)}
                className={cn(
                  "h-8 cursor-pointer rounded-md px-3 text-sm transition-colors",
                  active
                    ? "bg-background font-semibold shadow-sm dark:bg-input/30"
                    : "font-medium text-muted-foreground hover:text-foreground",
                )}
              >
                {filter.label}
              </button>
            );
          })}
        </div>
      </div>
      <InventoryCategories
        canEdit={false}
        inventory={inventory}
        userId={userId}
        onChange={() => {}}
        ownedOnly={ownedOnly}
      />
    </section>
  );
}
