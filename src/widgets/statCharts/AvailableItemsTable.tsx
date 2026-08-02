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
import { getLootIconUrl } from "@/widgets/Loot/LootBuy/icons/LootIcons";

const ITEM_ICONS: Record<string, string> = {
  Фрегат: inventoryIcons["Фрегат"],
  Кабуксон: inventoryIcons["Кобуксон"],
  "Танк(любой)": inventoryIcons["Танк"],
  Канонерка: inventoryIcons["Канонёрка"],
  "Баф фигура": inventoryIcons["Бафалка"],
  "Колл. глайдер": inventoryIcons["Коллеционный глайдер"],
  "Колл. глайдер т2": inventoryIcons["Коллеционный глайдер т2"],
  ККЛ: inventoryIcons["Крылья кровавого легиона"],
  "Драк. глайдер": inventoryIcons["Глайдер охотника на драконов"],
  "Глайдер Авиары": inventoryIcons["Авиара"],
  "Колл. пет": inventoryIcons["Коллекционный фамильяр"],
  "Красный Дракон": inventoryIcons["Красный Дракон"],
  "Черный Дракон": inventoryIcons["Черный Дракон"],
  "Зеленый Дракон": inventoryIcons["Зеленый Дракон"],
  Рокана: getLootIconUrl("Ро'кана, Безумие морей"),
  "Кряк. щит": getLootIconUrl("Анд'хакар, Чернильная тьма"),
  "Коллекционный фамильяр": inventoryIcons["Коллекционный фамильяр т2"],
};

const T2_FRAME_URL = "https://archeagecodex.com/images/icon_grade11.png";
const T2_FRAME_LABELS = new Set([
  "Колл. глайдер т2",
  "Коллекционный фамильяр",
]);

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
                          {T2_FRAME_LABELS.has(item.label) && (
                            <Image
                              src={T2_FRAME_URL}
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
