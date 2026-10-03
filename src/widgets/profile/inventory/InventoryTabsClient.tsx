"use client";

import { useState } from "react";
import type { InventoryItem } from "@/actions/getUserInventory";
import InventoryCategories from "./InventoryCategories";
import { Segmented } from "@/shared/ui";

export default function InventoryTabsClient({
  inventory,
  userId,
}: {
  inventory: InventoryItem[];
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
          <h2 className="text-base font-semibold">Инвентарь</h2>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Техника, глайдеры и петы для коллекций
          </p>
        </div>
        <Segmented
          label="Что показать"
          value={ownedOnly ? "owned" : "all"}
          onChange={(value) => setOwnedOnly(value === "owned")}
          options={[
            { value: "all", label: "Все" },
            { value: "owned", label: "Только есть" },
          ]}
        />
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
