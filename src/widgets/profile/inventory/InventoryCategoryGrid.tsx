"use client";
import inventoryItems from "./InventoryItems";
import InventoryItemCard from "./InventoryItemCard";
import {
  CATALOG_CATEGORIES,
  findUserItem,
  isShownInGrid,
  type CatalogItem,
} from "./inventoryModel";
import type { InventoryItem } from "@/actions/getUserInventory";
import { AddCustomInventoryItemDialog } from "./AddCustomInventoryItemDialog";
import { type ProfileItemTypeRow } from "@/actions/profileItemTypeAdmin";
import { type OtherInventoryCatalogItem } from "@/actions/getInventoryCatalog";

export default function InventoryCategoryGrid({
  type,
  inventory,
  userId,
  onChange,
  canEdit,
  extraItemTypes = [],
  catalog = [],
  onExtraItemTypesChange,
  ownedOnly = false,
}: {
  type: string;
  inventory: InventoryItem[];
  userId: number;
  onChange: () => void;
  canEdit: boolean;
  isAdmin?: boolean;
  extraItemTypes?: ProfileItemTypeRow[];
  catalog?: OtherInventoryCatalogItem[];
  onExtraItemTypesChange?: () => void;
  ownedOnly?: boolean;
}) {
  const hasCatalog = CATALOG_CATEGORIES.includes(type);

  // В категориях с каталогом карточки только для того, что уже есть у игрока,
  // иначе вкладка превратилась бы в список предметов всей гильдии.
  const fixedNames = new Set(
    inventoryItems
      .filter((item) => item.type === type)
      .map((item) => item.name),
  );
  const dynamicItems: CatalogItem[] = hasCatalog
    ? catalog
        .filter((t) => !fixedNames.has(t.name))
        .filter((t) =>
          inventory.find((inv) => inv.name === t.name && inv.type === type),
        )
        .map((t) => ({ type, name: t.name, iconUrl: t.icon_url }))
    : extraItemTypes
        .filter((t) => t.category === type)
        .map((t) => ({ type: t.category, name: t.name, iconUrl: t.icon_url }));

  const filteredItems = [...inventoryItems, ...dynamicItems].filter(
    (item) => item.type === type && isShownInGrid(item, inventory),
  );

  const ownedCount = filteredItems.filter((item) =>
    findUserItem(item, inventory),
  ).length;
  const visibleItems = ownedOnly
    ? filteredItems.filter((item) => findUserItem(item, inventory))
    : filteredItems;

  return (
    <div className="space-y-2">
      <div className="flex items-baseline gap-2">
        <h3 className="text-sm font-semibold">{type}</h3>
        {filteredItems.length > 0 && (
          <span className="text-xs text-muted-foreground tabular-nums">
            {ownedCount} из {filteredItems.length}
          </span>
        )}
      </div>
      {visibleItems.length === 0 && !(hasCatalog && canEdit) ? (
        <p className="text-sm text-muted-foreground">
          {ownedOnly ? "Ничего нет" : "Пусто"}
        </p>
      ) : (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(min(196px,100%),1fr))] gap-2">
          {visibleItems.map((item) => (
            <InventoryItemCard
              canEdit={canEdit}
              key={item.name}
              item={item}
              inventory={inventory}
              userId={userId}
              onChange={onChange}
            />
          ))}
          {hasCatalog && canEdit && (
            <AddCustomInventoryItemDialog
              userId={userId}
              type={type}
              catalog={catalog.filter(
                (t) =>
                  !fixedNames.has(t.name) &&
                  !inventory.find(
                    (inv) => inv.name === t.name && inv.type === type,
                  ),
              )}
              onAdded={() => {
                onChange();
                onExtraItemTypesChange?.();
              }}
            />
          )}
        </div>
      )}
    </div>
  );
}
