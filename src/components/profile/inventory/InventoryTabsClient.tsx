import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import deleteItemFromUserInventory from "@/src/actions/deleteItemFromUserInventory";
import setItemQuality from "@/src/actions/setItemQuality";
import inventoryIcons from "./InventoryIcons";
import inventoryItems from "./InventoryItems";
import ItemIcon from "./ItemIcon";
import addItemToUserInventory from "@/src/actions/addItemToUserInventory";

export default function InventoryTabsClient({
  inventory,
  userId,
  onChange,
}: {
  inventory: any[];
  userId: number;
  onChange: () => {};
}) {
  const handleChange = async (item: any, userItem: any, value: string) => {
    try {
      if (item.name === "Бафалка") {
        if (value === "Нету") {
          if (userItem) {
            await deleteItemFromUserInventory(userItem.id);
          }
        } else {
          const quality = value[0];

          if (userItem) {
            if (quality) {
              await setItemQuality(userItem.id, quality);
            }
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
          let quality = null;

          if (value === "T1") {
            quality = "3";
          } else if (value === "T2") {
            quality = "4";
          }

          if (userItem) {
            await setItemQuality(userItem.id, quality as string);
          } else {
            await addItemToUserInventory(userId, item.name, item.type, quality);
          }
        }
      } else {
        if (value === "Есть" && !userItem) {
          await addItemToUserInventory(userId, item.name, item.type, null);
        } else if (value === "Нет" && userItem) {
          await deleteItemFromUserInventory(userItem.id);
        }
      }
      onChange();
    } catch (error) {
      console.error("Ошибка при обновлении инвентаря:", error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Инвентарь игрока</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="Техника">
          <TabsList className="mb-4">
            {["Техника", "Глайдеры", "Петы"].map((type) => (
              <TabsTrigger key={type} value={type}>
                {type}
              </TabsTrigger>
            ))}
          </TabsList>

          {["Техника", "Глайдеры", "Петы"].map((type) => (
            <TabsContent className="border-t" key={type} value={type}>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Название</TableHead>
                    <TableHead>Наличие</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {inventoryItems
                    .filter((item) => item.type === type)
                    .filter((item) => {
                      if (
                        item.name === "Коллеционный глайдер" &&
                        inventory.find(
                          (inv) => inv.name === "Коллеционный глайдер т2"
                        )
                      )
                        return false;

                      if (
                        item.name === "Коллеционный глайдер т2" &&
                        !inventory.find(
                          (inv) => inv.name === "Коллеционный глайдер т2"
                        )
                      )
                        return false;

                      if (
                        item.name === "Коллекционный фамильяр" &&
                        inventory.find(
                          (inv) => inv.name === "Коллекционный фамильяр т2"
                        )
                      )
                        return false;

                      if (
                        item.name === "Коллекционный фамильяр т2" &&
                        !inventory.find(
                          (inv) => inv.name === "Коллекционный фамильяр т2"
                        )
                      )
                        return false;

                      return true;
                    })
                    .map((item) => {
                      const userItem = inventory.find(
                        (inv) =>
                          inv.name === item.name && inv.type === item.type
                      );

                      const itemIconUrl = inventoryIcons[item.name] || null;
                      const isBafalka = item.name === "Бафалка";

                      const isSpecialItem = [
                        "Коллеционный глайдер",
                        "Коллеционный глайдер т2",
                        "Коллекционный фамильяр",
                        "Коллекционный фамильяр т2",
                      ].includes(item.name);

                      return (
                        <TableRow key={item.name}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <ItemIcon
                                itemName={item.name}
                                itemIconUrl={itemIconUrl}
                                quality={userItem?.quality || null}
                              />
                              <span>{item.name}</span>
                            </div>
                          </TableCell>

                          <TableCell>
                            {isBafalka ? (
                              <Select
                                value={
                                  !userItem
                                    ? "Нету"
                                    : userItem.quality === "3"
                                    ? "3 эпоха"
                                    : userItem.quality === "4"
                                    ? "4 эпоха"
                                    : userItem.quality === "5"
                                    ? "5 эпоха"
                                    : "Нету"
                                }
                                onValueChange={(value) =>
                                  handleChange(item, userItem, value)
                                }
                              >
                                <SelectTrigger className="w-[100px]">
                                  <SelectValue placeholder="Выбрать" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Нету">Нету</SelectItem>
                                  <SelectItem value="3 эпоха">
                                    3 эпоха
                                  </SelectItem>
                                  <SelectItem value="4 эпоха">
                                    4 эпоха
                                  </SelectItem>
                                  <SelectItem value="5 эпоха">
                                    5 эпоха
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            ) : isSpecialItem ? (
                              <Select
                                value={
                                  !userItem
                                    ? "Нету"
                                    : userItem.quality === "3"
                                    ? "T1"
                                    : userItem.quality === "4"
                                    ? "T2"
                                    : "Нету"
                                }
                                onValueChange={(value) =>
                                  handleChange(item, userItem, value)
                                }
                              >
                                <SelectTrigger className="w-[100px]">
                                  <SelectValue placeholder="Выбрать" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Нету">Нету</SelectItem>
                                  <SelectItem value="T1">T1</SelectItem>
                                  <SelectItem value="T2">T2</SelectItem>
                                </SelectContent>
                              </Select>
                            ) : (
                              <Select
                                value={userItem ? "Есть" : "Нет"}
                                onValueChange={(value) =>
                                  handleChange(item, userItem, value)
                                }
                              >
                                <SelectTrigger className="w-[100px]">
                                  <SelectValue placeholder="Выбрать" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Есть">Есть</SelectItem>
                                  <SelectItem value="Нет">Нет</SelectItem>
                                </SelectContent>
                              </Select>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
}
