"use client";

import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui";
import type { InventoryStockStat } from "@/actions/guildStats";
import inventoryIcons from "@/widgets/profile/inventory/InventoryIcons";

const ITEM_ICONS: Record<string, string> = {
  Фрегат: inventoryIcons["Фрегат"],
  Кабуксон: inventoryIcons["Кобуксон"],
  "Танк(любой)": inventoryIcons["Танк"],
  Канонерка: inventoryIcons["Канонёрка"],
  "Баф фигура 3 эпоха": inventoryIcons["Бафалка"],
  "Баф фигура 4 эпоха": inventoryIcons["Бафалка"],
  "Баф фигура 5 эпоха": inventoryIcons["Бафалка"],
  "Коллеционный глайдер": inventoryIcons["Коллеционный глайдер"],
  "Коллеционный глайдер Т2": inventoryIcons["Коллеционный глайдер т2"],
  ККЛ: inventoryIcons["Крылья кровавого легиона"],
  "Драк. глайдер": inventoryIcons["Глайдер охотника на драконов"],
  "Глайдер Авиары": inventoryIcons["Авиара"],
  "Коллекционный фамильяр": inventoryIcons["Коллекционный фамильяр"],
  "Красный Дракон": inventoryIcons["Красный Дракон"],
  "Черный Дракон": inventoryIcons["Черный Дракон"],
  "Зеленый Дракон": inventoryIcons["Зеленый Дракон"],
  Рокана: "https://archeagecodex.com/items/icon_item_staff_1h_0058.png",
  "Кряк. щит": "https://archeagecodex.com/items/icon_item_shield_0055.png",
  "Коллекционный фамильяр Т2": inventoryIcons["Коллекционный фамильяр т2"],
};

const GRADE_FRAME_LABELS: Record<string, string> = {
  "Коллеционный глайдер": "https://archeagecodex.com/images/icon_grade10.png",
  "Коллеционный глайдер Т2":
    "https://archeagecodex.com/images/icon_grade11.png",
  "Коллекционный фамильяр":
    "https://archeagecodex.com/images/icon_grade10.png",
  "Коллекционный фамильяр Т2":
    "https://archeagecodex.com/images/icon_grade11.png",
  "Баф фигура 3 эпоха": "https://archeagecodex.com/images/icon_grade10.png",
  "Баф фигура 4 эпоха": "https://archeagecodex.com/images/icon_grade11.png",
  "Баф фигура 5 эпоха": "https://archeagecodex.com/images/icon_grade12.png",
  "Красный Дракон": "https://archeagecodex.com/images/icon_grade6.png",
  "Черный Дракон": "https://archeagecodex.com/images/icon_grade6.png",
  "Зеленый Дракон": "https://archeagecodex.com/images/icon_grade6.png",
  Рокана: "https://archeagecodex.com/images/icon_grade5.png",
  "Кряк. щит": "https://archeagecodex.com/images/icon_grade5.png",
};

export default function AvailableItemsTable({
  data,
  className,
}: {
  data: InventoryStockStat[];
  className?: string;
}) {
  const half = Math.ceil(data.length / 2);
  const left = data.slice(0, half);
  const right = data.slice(half);

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-base">Имеющиеся предметы</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {[left, right].map((column, columnIndex) => (
          <Table key={columnIndex}>
            <TableHeader>
              <TableRow>
                <TableHead>Наименование</TableHead>
                <TableHead className="text-right">Кол-во</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {column.map((item) => (
                <TableRow key={item.label}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {ITEM_ICONS[item.label] && (
                        <div className="relative size-6 shrink-0">
                          <Image
                            src={ITEM_ICONS[item.label]}
                            alt=""
                            width={24}
                            height={24}
                            className="rounded"
                          />
                          {GRADE_FRAME_LABELS[item.label] && (
                            <Image
                              src={GRADE_FRAME_LABELS[item.label]}
                              alt=""
                              width={24}
                              height={24}
                              className="pointer-events-none absolute inset-0"
                            />
                          )}
                        </div>
                      )}
                      {item.label}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">{item.count}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ))}
      </CardContent>
    </Card>
  );
}
