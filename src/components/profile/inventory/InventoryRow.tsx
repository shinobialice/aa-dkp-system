'use client";';
import Image from "next/image";
import inventoryIcons from "./InventoryIcons";
import ItemIcon from "./ItemIcon";
import ItemSelector from "./ItemSelector";
import { TableRow, TableCell } from "@/components/ui/table";
import addItemToUserInventory from "@/src/actions/addItemToUserInventory";
import deleteItemFromUserInventory from "@/src/actions/deleteItemFromUserInventory";
import setItemQuality from "@/src/actions/setItemQuality";

export default function InventoryRow({
  item,
  inventory,
  userId,
  onChange,
  isAdmin,
}: {
  item: any;
  inventory: any[];
  userId: number;
  onChange: () => void;
  isAdmin?: boolean;
}) {
  const isDragon = item.name === "Дракон";

  const userItem = isDragon
    ? inventory.find(
        (inv) =>
          inv.type === item.type &&
          ["Красный Дракон", "Черный Дракон", "Зеленый Дракон"].includes(
            inv.name
          )
      )
    : inventory.find((inv) => inv.name === item.name && inv.type === item.type);

  const displayIconName = isDragon && userItem ? userItem.name : item.name;
  const itemIconUrl = inventoryIcons[displayIconName] || null;

  const handleChange = async (value: string) => {
    if (item.name === "Бафалка") {
      if (value === "Нету") {
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
      ].includes(item.name)
    ) {
      if (value === "Нету") {
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
      if (value === "Нету") {
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

  return (
    <TableRow>
      <TableCell>
        <div className="flex items-center gap-2">
          <div style={{ position: "relative" }}>
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
          <span>{item.name}</span>
        </div>
      </TableCell>
      <TableCell>
        <ItemSelector
          item={item}
          userItem={userItem}
          onChange={handleChange}
          isAdmin={isAdmin}
        />
      </TableCell>
    </TableRow>
  );
}
