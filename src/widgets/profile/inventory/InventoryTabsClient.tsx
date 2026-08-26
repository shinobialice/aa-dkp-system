"use client";

import { useCallback, useEffect, useState } from "react";
import { Pencil } from "lucide-react";
import InventoryCategoryGrid from "./InventoryCategoryGrid";
import {
  getProfileItemTypes,
  ProfileItemTypeRow,
} from "@/actions/profileItemTypeAdmin";
import {
  getInventoryCatalog,
  OtherInventoryCatalogItem,
} from "@/actions/getInventoryCatalog";
import { Button, Card, CardContent, CardHeader, CardTitle } from "@/shared/ui";

const categories = ["Техника", "Глайдеры", "Петы", "Другое"];

// Категории, у которых добавление предмета идёт через поиск по общему
// каталогу (казна item_type + profile_item_type под эту категорию, см.
// getInventoryCatalog) — карточками показываем только то, что уже отмечено
// у игрока, иначе вкладка превратилась бы в простыню из предметов всей
// гильдии. "Техника" — единственная категория без каталога: там по-прежнему
// фиксированный список из InventoryItems.tsx, дополняемый только тем, что
// завели напрямую в БД (profile_item_type) — своей админки для этого
// сейчас нет.
const catalogCategories = ["Глайдеры", "Петы", "Другое"];

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
  // каждому предмету, добавление в категории с каталогом), чтобы не
  // захламлять профиль выпадающими списками каждый раз, когда его
  // открывает админ/сам игрок.
  const [editMode, setEditMode] = useState(false);
  const effectiveCanEdit = canEdit && editMode;
  const effectiveIsAdmin = isAdmin && editMode;

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
              catalog={catalogsByCategory[type] ?? []}
              onExtraItemTypesChange={reloadExtraItemTypes}
            />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
