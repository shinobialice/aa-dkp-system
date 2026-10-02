"use client";
import Image from "next/image";
import inventoryIcons from "./InventoryIcons";
import ItemIcon from "./ItemIcon";
import ItemSelector from "./ItemSelector";
import addItemToUserInventory from "@/actions/addItemToUserInventory";
import deleteItemFromUserInventory from "@/actions/deleteItemFromUserInventory";
import setItemQuality from "@/actions/setItemQuality";

const DRAGONS = ["Красный Дракон", "Черный Дракон", "Зеленый Дракон"];

export function findUserItem(item: any, inventory: any[]) {
  if (item.name === "Дракон") {
    return inventory.find(
      (inv) => inv.type === item.type && DRAGONS.includes(inv.name),
    );
  }
  return inventory.find(
    (inv) => inv.name === item.name && inv.type === item.type,
  );
}

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

  const userItem = findUserItem(item, inventory);

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
      className={`flex min-h-[52px] items-center gap-2.5 rounded-lg border px-2.5 py-1.5 transition-colors ${
        isPresent
          ? "border-green-200 bg-green-50/70 dark:border-green-500/25 dark:bg-green-500/5"
          : "border-border/60"
      }`}
    >
      <div
        className={`relative shrink-0 ${isPresent ? "" : "opacity-55 grayscale"}`}
      >
        <ItemIcon
          itemName={displayIconName}
          itemIconUrl={itemIconUrl}
          quality={userItem?.quality || null}
        />
        {isDragon && userItem && (
          <Image
            width={40}
            height={40}
            src="/api/uploads/grade-icons/grade6.png"
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
      <span
        className={`min-w-0 flex-1 text-[13px] leading-snug ${isPresent ? "" : "text-muted-foreground"}`}
      >
        {isDragon && userItem ? userItem.name : (item.label ?? item.name)}
      </span>
      <div className="shrink-0">
        <ItemSelector
          item={item}
          userItem={userItem}
          onChange={handleChange}
          canEdit={canEdit}
        />
      </div>
    </div>
  );
}
