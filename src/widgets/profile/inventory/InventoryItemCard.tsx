"use client";
import Image from "next/image";
import inventoryIcons from "./InventoryIcons";
import ItemIcon from "./ItemIcon";
import ItemSelector from "./ItemSelector";
import addItemToUserInventory from "@/actions/addItemToUserInventory";
import deleteItemFromUserInventory from "@/actions/deleteItemFromUserInventory";
import setItemQuality from "@/actions/setItemQuality";

export default function InventoryItemCard({
  item,
  inventory,
  userId,
  onChange,
  canEdit,
}: {
  item: any;
  inventory: any[];
  userId: number;
  onChange: () => void;
  canEdit: boolean;
}) {
  const isDragon = item.name === "Дракон";

  const userItem = isDragon
    ? inventory.find(
        (inv) =>
          inv.type === item.type &&
          ["Красный Дракон", "Черный Дракон", "Зеленый Дракон"].includes(
            inv.name,
          ),
      )
    : inventory.find((inv) => inv.name === item.name && inv.type === item.type);

  const displayIconName = isDragon && userItem ? userItem.name : item.name;
  // item.iconUrl — предметы, заведённые админом на /items (см.
  // InventoryCategoryGrid). У фиксированных 16 вещей его нет — для них, как
  // и раньше, берём иконку из статического InventoryIcons.tsx.
  const itemIconUrl = item.iconUrl ?? inventoryIcons[displayIconName] ?? null;

  const handleChange = async (value: string) => {
    if (item.name === "Бафалка") {
      if (value === "Нет") {
        if (userItem) {
          await deleteItemFromUserInventory(userItem.id);
        }
      } else {
        const quality = value[0];
        if (userItem) {
          await setItemQuality(userItem.id, quality);
        } else {
          await addItemToUserInventory(userId, item.name, item.type, quality);
        }
      }
    } else if (
      [
        "Коллеционный глайдер",
        "Коллеционный глайдер т2",
        "Коллекционный фамильяр",
        "Коллекционный фамильяр т2",
        "Коллекционный пет",
        "Коллекционный пет т2",
      ].includes(item.name)
    ) {
      if (value === "Нет") {
        if (userItem) {
          await deleteItemFromUserInventory(userItem.id);
        }
      } else {
        const quality = value === "T1" ? "3" : value === "T2" ? "4" : null;
        if (userItem) {
          await setItemQuality(userItem.id, quality as string);
        } else {
          await addItemToUserInventory(userId, item.name, item.type, quality);
        }
      }
    } else if (isDragon) {
      if (value === "Нет") {
        if (userItem) {
          await deleteItemFromUserInventory(userItem.id);
        }
      } else {
        if (userItem) {
          await deleteItemFromUserInventory(userItem.id);
        }
        await addItemToUserInventory(userId, value, item.type, null);
      }
    } else if (value === "Есть" && !userItem) {
      await addItemToUserInventory(userId, item.name, item.type, null);
    } else if (value === "Нет" && userItem) {
      await deleteItemFromUserInventory(userItem.id);
    }
    onChange();
  };

  const isPresent = !!userItem;

  return (
    <div
      className={`flex flex-col items-center gap-2 rounded-lg border p-3 text-center transition-all duration-150 hover:-translate-y-0.5 hover:shadow-md ${
        isPresent
          ? "border-primary/30 bg-primary/5"
          : "border-dashed opacity-70"
      }`}
    >
      <div
        className={`flex items-center justify-center rounded-md border bg-card p-1 ${
          isPresent ? "border-primary/40" : "border-border"
        }`}
      >
        <div className="relative">
          <ItemIcon
            itemName={displayIconName}
            itemIconUrl={itemIconUrl}
            quality={userItem?.quality || null}
          />
          {isDragon && userItem && (
            <Image
              width={40}
              height={40}
              src="https://archeagecodex.com/images/icon_grade6.png"
              alt="legendary"
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                pointerEvents: "none",
              }}
            />
          )}
        </div>
      </div>
      <span className="text-xs leading-tight">{item.name}</span>
      <ItemSelector
        item={item}
        userItem={userItem}
        onChange={handleChange}
        canEdit={canEdit}
      />
    </div>
  );
}
