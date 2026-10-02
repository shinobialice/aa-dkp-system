"use client";

import { useCallback, useEffect, useState } from "react";
import InventoryCategoryGrid from "./InventoryCategoryGrid";
import {
  getProfileItemTypes,
  ProfileItemTypeRow,
} from "@/actions/profileItemTypeAdmin";
import {
  getInventoryCatalog,
  OtherInventoryCatalogItem,
} from "@/actions/getInventoryCatalog";

const categories = ["Техника", "Глайдеры", "Петы", "Другое"];

const catalogCategories = ["Глайдеры", "Петы", "Другое"];

export default function InventoryCategories({
  inventory,
  userId,
  onChange,
  canEdit,
  isAdmin,
  ownedOnly = false,
}: {
  inventory: any[];
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
      catalogCategories.map((category) => getInventoryCatalog(category)),
    ).then((catalogs) => {
      setCatalogsByCategory(
        Object.fromEntries(
          catalogCategories.map((category, i) => [category, catalogs[i]]),
        ),
      );
    });
  }, []);

  useEffect(() => {
    reloadExtraItemTypes();
  }, [reloadExtraItemTypes]);

  return (
    <div className="space-y-5">
      {categories.map((type) => (
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
