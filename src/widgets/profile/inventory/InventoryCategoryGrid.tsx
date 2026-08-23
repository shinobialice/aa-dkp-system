"use client";
import inventoryItems from "./InventoryItems";
import InventoryItemCard from "./InventoryItemCard";
import { AddCustomInventoryItemDialog } from "./AddCustomInventoryItemDialog";
import { ProfileItemTypeRow } from "@/actions/profileItemTypeAdmin";
import { OtherInventoryCatalogItem } from "@/actions/getOtherInventoryCatalog";

export default function InventoryCategoryGrid({
  type,
  inventory,
  userId,
  onChange,
  canEdit,
  isAdmin,
  extraItemTypes = [],
  otherCatalog = [],
  onExtraItemTypesChange,
}: {
  type: string;
  inventory: any[];
  userId: number;
  onChange: () => void;
  canEdit: boolean;
  isAdmin?: boolean;
  extraItemTypes?: ProfileItemTypeRow[];
  otherCatalog?: OtherInventoryCatalogItem[];
  onExtraItemTypesChange?: () => void;
}) {
  const isOther = type === "Другое";

  // "Другое" — общий каталог (казна item_type + profile_item_type, см.
  // getOtherInventoryCatalog), который со временем растёт, поэтому
  // карточками тут показываем только то, что уже отмечено у игрока (иначе
  // вкладка превратилась бы в простыню из предметов всей гильдии).
  // Добавление — через AddCustomInventoryItemDialog (поиск и выбор из
  // каталога). Остальные категории — фиксированный список из
  // InventoryItems.tsx плюс то, что завели под них в profile_item_type,
  // показываем всё как обычно, есть/нет.
  const dynamicItems = isOther
    ? otherCatalog
        .filter((t) => inventory.find((inv) => inv.name === t.name && inv.type === type))
        .map((t) => ({ type, name: t.name, iconUrl: t.icon_url }))
    : extraItemTypes
        .filter((t) => t.category === type)
        .map((t) => ({ type: t.category, name: t.name, iconUrl: t.icon_url }));

  const filteredItems = [...inventoryItems, ...dynamicItems]
    .filter((item) => item.type === type)
    .filter((item) => {
      if (
        item.name === "Коллеционный глайдер" &&
        inventory.find((inv) => inv.name === "Коллеционный глайдер т2")
      ) {
        return false;
      }
      if (
        item.name === "Коллеционный глайдер т2" &&
        !inventory.find((inv) => inv.name === "Коллеционный глайдер т2")
      ) {
        return false;
      }
      if (
        item.name === "Коллекционный фамильяр" &&
        inventory.find((inv) => inv.name === "Коллекционный фамильяр т2")
      ) {
        return false;
      }
      if (
        item.name === "Коллекционный фамильяр т2" &&
        !inventory.find((inv) => inv.name === "Коллекционный фамильяр т2")
      ) {
        return false;
      }
      if (
        ["Красный Дракон", "Черный Дракон", "Зеленый Дракон"].includes(
          item.name,
        )
      ) {
        return false;
      }
      return true;
    });

  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(110px,1fr))] gap-3">
      {filteredItems.map((item) => (
        <InventoryItemCard
          canEdit={canEdit}
          key={item.name}
          item={item}
          inventory={inventory}
          userId={userId}
          onChange={onChange}
        />
      ))}
      {isOther && isAdmin && (
        <AddCustomInventoryItemDialog
          userId={userId}
          catalog={otherCatalog.filter(
            (t) => !inventory.find((inv) => inv.name === t.name && inv.type === type),
          )}
          onAdded={() => {
            onChange();
            onExtraItemTypesChange?.();
          }}
        />
      )}
    </div>
  );
}
