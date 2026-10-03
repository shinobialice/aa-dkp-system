"use client";
import Image from "next/image";
import type { InventoryItem } from "@/actions/getUserInventory";
import addItemToUserInventory from "@/actions/addItemToUserInventory";
import deleteItemFromUserInventory from "@/actions/deleteItemFromUserInventory";
import setItemQuality from "@/actions/setItemQuality";
import inventoryIcons from "./InventoryIcons";
import ItemIcon from "./ItemIcon";
import ItemSelector from "./ItemSelector";
import {
  NONE,
  findUserItem,
  qualityForValue,
  selectorKind,
  type CatalogItem,
} from "./inventoryModel";

type Props = {
  item: CatalogItem;
  inventory: InventoryItem[];
  userId: number;
  onChange: () => void;
  canEdit: boolean;
};

export default function InventoryItemCard({
  item,
  inventory,
  userId,
  onChange,
  canEdit,
}: Props) {
  const userItem = findUserItem(item, inventory);
  const isPresent = !!userItem;
  const ownedDragon =
    selectorKind(item.name) === "dragon" ? userItem : undefined;
  const displayName = ownedDragon?.name ?? item.name;
  const itemIconUrl = item.iconUrl ?? inventoryIcons[displayName] ?? null;

  const handleChange = async (value: string) => {
    await applyInventoryChange(item, userItem, userId, value);
    onChange();
  };

  return (
    <div
      className={`flex min-h-13 items-center gap-2.5 rounded-lg border px-2.5 py-1.5 transition-colors ${
        isPresent
          ? "border-green-200 bg-green-50/70 dark:border-green-500/25 dark:bg-green-500/5"
          : "border-border/60"
      }`}
    >
      <div
        className={`relative shrink-0 ${isPresent ? "" : "opacity-55 grayscale"}`}
      >
        <ItemIcon
          itemName={displayName}
          itemIconUrl={itemIconUrl}
          quality={userItem?.quality || null}
        />
        {ownedDragon && (
          <Image
            width={40}
            height={40}
            src="/api/uploads/grade-icons/grade6.png"
            alt="legendary"
            className="pointer-events-none absolute top-0 left-0"
          />
        )}
      </div>
      <span
        className={`min-w-0 flex-1 text-sm leading-snug ${isPresent ? "" : "text-muted-foreground"}`}
      >
        {ownedDragon?.name ?? item.label ?? item.name}
      </span>
      <div className="shrink-0">
        <ItemSelector
          itemName={item.name}
          userItem={userItem}
          onChange={handleChange}
          canEdit={canEdit}
        />
      </div>
    </div>
  );
}

async function applyInventoryChange(
  item: CatalogItem,
  userItem: InventoryItem | undefined,
  userId: number,
  value: string,
) {
  const kind = selectorKind(item.name);

  if (value === NONE) {
    if (userItem) await deleteItemFromUserInventory(userItem.id);
    return;
  }
  if (kind === "presence") {
    if (!userItem) {
      await addItemToUserInventory(userId, item.name, item.type, null);
    }
    return;
  }
  if (kind === "dragon") {
    if (userItem) await deleteItemFromUserInventory(userItem.id);
    await addItemToUserInventory(userId, value, item.type, null);
    return;
  }

  const quality = qualityForValue(kind, value);
  if (userItem && quality) {
    await setItemQuality(userItem.id, quality);
  } else if (!userItem) {
    await addItemToUserInventory(userId, item.name, item.type, quality);
  }
}
