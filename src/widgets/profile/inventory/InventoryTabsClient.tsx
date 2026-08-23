"use client";

import { useCallback, useEffect, useState } from "react";
import { Pencil } from "lucide-react";
import InventoryCategoryGrid from "./InventoryCategoryGrid";
import {
  getProfileItemTypes,
  ProfileItemTypeRow,
} from "@/actions/profileItemTypeAdmin";
import {
  getOtherInventoryCatalog,
  OtherInventoryCatalogItem,
} from "@/actions/getOtherInventoryCatalog";
import { Button, Card, CardContent, CardHeader, CardTitle } from "@/shared/ui";

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
  // По умолчанию — чистый вью-режим (как у обычного зрителя), даже если
  // canEdit=true: карандаш открывает режим редактирования (есть/нет по
  // каждому предмету, добавление в "Другое"), чтобы не захламлять профиль
  // выпадающими списками каждый раз, когда его открывает админ/сам игрок.
  const [editMode, setEditMode] = useState(false);
  const effectiveCanEdit = canEdit && editMode;
  const effectiveIsAdmin = isAdmin && editMode;

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
        <div className="flex items-center justify-between gap-2">
          <CardTitle>Инвентарь игрока</CardTitle>
          {canEdit && (
            <Button
              variant={editMode ? "secondary" : "ghost"}
              size="icon"
              className="size-8 cursor-pointer"
              onClick={() => setEditMode((v) => !v)}
              title={editMode ? "Закончить редактирование" : "Редактировать"}
            >
              <Pencil className="size-4" />
            </Button>
          )}
        </div>
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
              canEdit={effectiveCanEdit}
              isAdmin={effectiveIsAdmin}
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
