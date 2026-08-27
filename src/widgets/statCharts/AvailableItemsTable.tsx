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
  Кобуксон: inventoryIcons["Кобуксон"],
  Танк: inventoryIcons["Танк"],
  Канонерка: inventoryIcons["Канонёрка"],
  "Глайдер «Рассекатель небес»": inventoryIcons["Глайдер «Рассекатель небес»"],
  "Бафалка (3 эпоха)": inventoryIcons["Бафалка"],
  "Бафалка (4 эпоха)": inventoryIcons["Бафалка"],
  "Бафалка (5 эпоха)": inventoryIcons["Бафалка"],
  "Коллеционный глайдер": inventoryIcons["Коллеционный глайдер"],
  "Коллеционный глайдер (Т2)": inventoryIcons["Коллеционный глайдер т2"],
  "Крылья кровавого легиона": inventoryIcons["Крылья кровавого легиона"],
  Авиара: inventoryIcons["Авиара"],
  "Коллекционный фамильяр": inventoryIcons["Коллекционный фамильяр"],
  "Красный Дракон": inventoryIcons["Красный Дракон"],
  "Черный Дракон": inventoryIcons["Черный Дракон"],
  "Зеленый Дракон": inventoryIcons["Зеленый Дракон"],
  "Ро'кана, Безумие морей":
    "https://archeagecodex.com/items/icon_item_staff_1h_0058.png",
  "Анд'хакар, Чернильная тьма":
    "https://archeagecodex.com/items/icon_item_shield_0055.png",
  "Коллекционный фамильяр (Т2)": inventoryIcons["Коллекционный фамильяр т2"],
  "Коллекционный пет": inventoryIcons["Коллекционный пет"],
  "Коллекционный пет (Т2)": inventoryIcons["Коллекционный пет т2"],
  "Глайдер-крылья «Паучья колония»":
    "/api/uploads/item-icons/28e3c898-b347-447a-9824-cb5cfa5eed99.png",
};

const GRADE_FRAME_LABELS: Record<string, string> = {
  "Коллеционный глайдер": "https://archeagecodex.com/images/icon_grade10.png",
  "Коллеционный глайдер (Т2)":
    "https://archeagecodex.com/images/icon_grade11.png",
  "Коллекционный фамильяр":
    "https://archeagecodex.com/images/icon_grade10.png",
  "Коллекционный фамильяр (Т2)":
    "https://archeagecodex.com/images/icon_grade11.png",
  "Бафалка (3 эпоха)": "https://archeagecodex.com/images/icon_grade10.png",
  "Бафалка (4 эпоха)": "https://archeagecodex.com/images/icon_grade11.png",
  "Бафалка (5 эпоха)": "https://archeagecodex.com/images/icon_grade12.png",
  "Красный Дракон": "https://archeagecodex.com/images/icon_grade6.png",
  "Черный Дракон": "https://archeagecodex.com/images/icon_grade6.png",
  "Зеленый Дракон": "https://archeagecodex.com/images/icon_grade6.png",
  "Ро'кана, Безумие морей": "https://archeagecodex.com/images/icon_grade5.png",
  "Анд'хакар, Чернильная тьма":
    "https://archeagecodex.com/images/icon_grade5.png",
  // Было icon_grade4 — не тот грейд, что у "Коллекционный фамильяр"/
  // "Коллеционный глайдер" (icon_grade10), хотя это тот же тип предмета.
  "Коллекционный пет": "https://archeagecodex.com/images/icon_grade10.png",
  "Коллекционный пет (Т2)": "https://archeagecodex.com/images/icon_grade11.png",
};

function AvailableItemsColumns({ data }: { data: InventoryStockStat[] }) {
  const half = Math.ceil(data.length / 2);
  const left = data.slice(0, half);
  const right = data.slice(half);

  return (
    <>
      {[left, right].map((column, columnIndex) => (
        <Table key={columnIndex}>
          <TableHeader>
            <TableRow>
              <TableHead>Наименование</TableHead>
              <TableHead className="text-right">Кол-во</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {column.map((item) => {
              const iconUrl = ITEM_ICONS[item.label] ?? item.iconUrl;
              return (
                <TableRow key={item.label}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {iconUrl && (
                        <div className="relative size-6 shrink-0">
                          <Image
                            src={iconUrl}
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
              );
            })}
          </TableBody>
        </Table>
      ))}
    </>
  );
}

export default function AvailableItemsTable({
  data,
  className,
  bare,
}: {
  data: InventoryStockStat[];
  className?: string;
  bare?: boolean;
}) {
  if (bare) {
    return (
      <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <AvailableItemsColumns data={data} />
      </CardContent>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-base">Имеющиеся предметы</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <AvailableItemsColumns data={data} />
      </CardContent>
    </Card>
  );
}
