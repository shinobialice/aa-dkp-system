"use client";
import inventoryItems from "./InventoryItems";
import InventoryItemCard from "./InventoryItemCard";
import { AddCustomInventoryItemDialog } from "./AddCustomInventoryItemDialog";
import { ProfileItemTypeRow } from "@/actions/profileItemTypeAdmin";
import { OtherInventoryCatalogItem } from "@/actions/getInventoryCatalog";

// Категории, где добавление предмета идёт через поиск по каталогу (казна +
// profile_item_type под эту категорию, см. getInventoryCatalog в
// InventoryTabsClient) — совпадает с catalogCategories там.
const catalogCategories = ["Глайдеры", "Петы", "Другое"];

export default function InventoryCategoryGrid({
  type,
  inventory,
  userId,
  onChange,
  canEdit,
  extraItemTypes = [],
  catalog = [],
  onExtraItemTypesChange,
}: {
  type: string;
  inventory: any[];
  userId: number;
  onChange: () => void;
  canEdit: boolean;
  isAdmin?: boolean;
  extraItemTypes?: ProfileItemTypeRow[];
  catalog?: OtherInventoryCatalogItem[];
  onExtraItemTypesChange?: () => void;
}) {
  const hasCatalog = catalogCategories.includes(type);

  // Категории с каталогом: карточками показываем только то, что уже
  // отмечено у игрока (иначе вкладка превратилась бы в простыню из
  // предметов всей гильдии), добавление — через
  // AddCustomInventoryItemDialog (поиск и выбор из каталога). Имена, уже
  // покрытые фиксированным списком (inventoryItems), из каталога убираем,
  // чтобы не задваивать карточку. "Техника" — фиксированный список из
  // InventoryItems.tsx плюс то, что завели под неё в profile_item_type,
  // показываем всё как обычно, есть/нет.
  const fixedNames = new Set(
    inventoryItems.filter((item) => item.type === type).map((item) => item.name),
  );
  const dynamicItems = hasCatalog
    ? catalog
        .filter((t) => !fixedNames.has(t.name))
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
        item.name === "Коллекционный пет" &&
        inventory.find((inv) => inv.name === "Коллекционный пет т2")
      ) {
        return false;
      }
      if (
        item.name === "Коллекционный пет т2" &&
        !inventory.find((inv) => inv.name === "Коллекционный пет т2")
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
      {hasCatalog && canEdit && (
        <AddCustomInventoryItemDialog
          userId={userId}
          type={type}
          catalog={catalog.filter(
            (t) =>
              !fixedNames.has(t.name) &&
              !inventory.find((inv) => inv.name === t.name && inv.type === type),
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
