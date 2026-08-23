"use client";

import { useCallback, useEffect, useState } from "react";
import InventoryCategoryGrid from "./InventoryCategoryGrid";
import {
  getProfileItemTypes,
  ProfileItemTypeRow,
} from "@/actions/profileItemTypeAdmin";
import {
  getOtherInventoryCatalog,
  OtherInventoryCatalogItem,
} from "@/actions/getOtherInventoryCatalog";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui";

const categories = ["Техника", "Глайдеры", "Петы", "Другое"];

export default function InventoryTabsClient({
  inventory,
  userId,
  onChange,
  canEdit,
  isAdmin,
}: {
  inventory: any[];
  userId: number;
  onChange: () => void;
  canEdit: boolean;
  isAdmin?: boolean;
}) {
  // Техника/Глайдеры/Петы — фиксированный список из InventoryItems.tsx,
  // дополняемый тут только тем, что специально завели под соответствующую
  // категорию напрямую в БД (profile_item_type) — своей админки для этого
  // сейчас нет.
  const [extraItemTypes, setExtraItemTypes] = useState<ProfileItemTypeRow[]>(
    [],
  );
  // "Другое" — своя вкладка: список для поиска/выбора там объединяет казну
  // (item_type) и profile_item_type, чтобы не заводить те же предметы
  // дважды (см. getOtherInventoryCatalog).
  const [otherCatalog, setOtherCatalog] = useState<OtherInventoryCatalogItem[]>(
    [],
  );

  const reloadExtraItemTypes = useCallback(() => {
    getProfileItemTypes().then(setExtraItemTypes);
    getOtherInventoryCatalog().then(setOtherCatalog);
  }, []);

  useEffect(() => {
    reloadExtraItemTypes();
  }, [reloadExtraItemTypes]);

  return (
    <Card className="gap-3 py-4">
      <CardHeader>
        <CardTitle>Инвентарь игрока</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {categories.map((type) => (
          <div
            key={type}
            className="space-y-2 border-t pt-4 first:border-t-0 first:pt-0"
          >
            <h3 className="text-sm font-semibold text-muted-foreground">
              {type}
            </h3>
            <InventoryCategoryGrid
              canEdit={canEdit}
              isAdmin={isAdmin}
              type={type}
              inventory={inventory}
              userId={userId}
              onChange={onChange}
              extraItemTypes={extraItemTypes}
              otherCatalog={otherCatalog}
              onExtraItemTypesChange={reloadExtraItemTypes}
            />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
