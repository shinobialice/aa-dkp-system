"use client";

import { useCallback, useEffect, useState } from "react";
import type { InventoryItem } from "@/actions/getUserInventory";
import InventoryCategoryGrid from "./InventoryCategoryGrid";
import { CATALOG_CATEGORIES, INVENTORY_CATEGORIES } from "./inventoryModel";
import {
  getProfileItemTypes,
  type ProfileItemTypeRow,
} from "@/actions/profileItemTypeAdmin";
import {
  getInventoryCatalog,
  type OtherInventoryCatalogItem,
} from "@/actions/getInventoryCatalog";

export default function InventoryCategories({
  inventory,
  userId,
  onChange,
  canEdit,
  isAdmin,
  ownedOnly = false,
}: {
  inventory: InventoryItem[];
  userId: number;
  onChange: () => void;
  canEdit: boolean;
  isAdmin?: boolean;
  ownedOnly?: boolean;
}) {
  const [extraItemTypes, setExtraItemTypes] = useState<ProfileItemTypeRow[]>(
    [],
  );
  const [catalogsByCategory, setCatalogsByCategory] = useState<
    Record<string, OtherInventoryCatalogItem[]>
  >({});

  const reloadExtraItemTypes = useCallback(() => {
    getProfileItemTypes().then(setExtraItemTypes);
    Promise.all(
      CATALOG_CATEGORIES.map((category) => getInventoryCatalog(category)),
    ).then((catalogs) => {
      setCatalogsByCategory(
        Object.fromEntries(
          CATALOG_CATEGORIES.map((category, i) => [category, catalogs[i]]),
        ),
      );
    });
  }, []);

  useEffect(() => {
    reloadExtraItemTypes();
  }, [reloadExtraItemTypes]);

  return (
    <div className="space-y-5">
      {INVENTORY_CATEGORIES.map((type) => (
        <div key={type}>
          <InventoryCategoryGrid
            ownedOnly={ownedOnly}
            canEdit={canEdit}
            isAdmin={isAdmin}
            type={type}
            inventory={inventory}
            userId={userId}
            onChange={onChange}
            extraItemTypes={extraItemTypes}
            catalog={catalogsByCategory[type] ?? []}
            onExtraItemTypesChange={reloadExtraItemTypes}
          />
        </div>
      ))}
    </div>
  );
}
