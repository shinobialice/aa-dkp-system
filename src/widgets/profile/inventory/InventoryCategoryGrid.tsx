"use client";
import inventoryItems from "./InventoryItems";
import InventoryItemCard from "./InventoryItemCard";

export default function InventoryCategoryGrid({
  type,
  inventory,
  userId,
  onChange,
  canEdit,
}: {
  type: string;
  inventory: any[];
  userId: number;
  onChange: () => void;
  canEdit: boolean;
}) {
  const filteredItems = inventoryItems
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
    </div>
  );
}
