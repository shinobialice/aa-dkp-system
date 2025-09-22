"use client";
import inventoryItems from "./InventoryItems";
import InventoryRow from "./InventoryRow";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui";

export default function InventoryTab({
  type,
  inventory,
  userId,
  onChange,
  isAdmin,
}: {
  type: string;
  inventory: any[];
  userId: number;
  onChange: () => void;
  isAdmin: boolean;
}) {
  if (type === "Куплено") {
    const lootItems = inventory.filter((inv) => inv.type === "Куплено");
    return (
      <div className="border-t">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Название</TableHead>
              <TableHead>Дата покупки</TableHead>
              <TableHead>Количество</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {lootItems.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.name}</TableCell>
                <TableCell>
                  {new Date(item.created_at).toLocaleDateString("ru-RU")}
                </TableCell>
                <TableCell>{item.quantity ?? 1}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  if (type === "Выдано") {
    const givenItems = inventory.filter((inv) => inv.type === "Выдано");
    return (
      <div className="border-t">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Название</TableHead>
              <TableHead>Дата выдачи</TableHead>
              <TableHead>Количество</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {givenItems.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.name}</TableCell>
                <TableCell>
                  {new Date(item.created_at).toLocaleDateString("ru-RU")}
                </TableCell>
                <TableCell>{item.quantity ?? 1}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

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
    <div className="border-t">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Название</TableHead>
            <TableHead>Наличие</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredItems.map((item) => (
            <InventoryRow
              isAdmin={isAdmin}
              key={item.name}
              item={item}
              inventory={inventory}
              userId={userId}
              onChange={onChange}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
