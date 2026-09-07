"use client";

import Image from "next/image";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/shared/ui";
import type { InventoryStockStat } from "@/actions/guildStats";
import PlayerNameList from "./PlayerNameList";
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
  // Совпадают с icon_url этих же предметов в item_type (id 40 и 39) на
  // момент переезда с archeagecodex.com — если админ перезальёт им иконку
  // на /items, тут путь придётся обновить руками (имя файла — случайный
  // UUID, не привязан к id).
  "Ро'кана, Безумие морей": "/api/uploads/item-icons/05acae8a-8535-40b2-a4a3-37456c6f2434.png",
  "Анд'хакар, Чернильная тьма":
    "/api/uploads/item-icons/6661372a-84b3-48ba-906d-104130988af2.png",
  "Коллекционный фамильяр (Т2)": inventoryIcons["Коллекционный фамильяр т2"],
  "Коллекционный пет": inventoryIcons["Коллекционный пет"],
  "Коллекционный пет (Т2)": inventoryIcons["Коллекционный пет т2"],
  "Глайдер-крылья «Паучья колония»":
    "/api/uploads/item-icons/28e3c898-b347-447a-9824-cb5cfa5eed99.png",
};

const GRADE_FRAME_LABELS: Record<string, string> = {
  "Коллеционный глайдер": "/api/uploads/grade-icons/grade10.png",
  "Коллеционный глайдер (Т2)": "/api/uploads/grade-icons/grade11.png",
  "Коллекционный фамильяр": "/api/uploads/grade-icons/grade10.png",
  "Коллекционный фамильяр (Т2)": "/api/uploads/grade-icons/grade11.png",
  "Бафалка (3 эпоха)": "/api/uploads/grade-icons/grade10.png",
  "Бафалка (4 эпоха)": "/api/uploads/grade-icons/grade11.png",
  "Бафалка (5 эпоха)": "/api/uploads/grade-icons/grade12.png",
  "Красный Дракон": "/api/uploads/grade-icons/grade6.png",
  "Черный Дракон": "/api/uploads/grade-icons/grade6.png",
  "Зеленый Дракон": "/api/uploads/grade-icons/grade6.png",
  "Ро'кана, Безумие морей": "/api/uploads/grade-icons/grade5.png",
  "Анд'хакар, Чернильная тьма": "/api/uploads/grade-icons/grade5.png",
  // Было icon_grade4 — не тот грейд, что у "Коллекционный фамильяр"/
  // "Коллеционный глайдер" (icon_grade10), хотя это тот же тип предмета.
  "Коллекционный пет": "/api/uploads/grade-icons/grade10.png",
  "Коллекционный пет (Т2)": "/api/uploads/grade-icons/grade11.png",
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
                          <Image
                            src={
                              GRADE_FRAME_LABELS[item.label] ??
                              "/api/uploads/grade-icons/grade1.png"
                            }
                            alt=""
                            width={24}
                            height={24}
                            className="pointer-events-none absolute inset-0"
                          />
                        </div>
                      )}
                      {item.players.length > 0 ? (
                        <Tooltip>
                          <TooltipTrigger className="cursor-default underline decoration-dotted underline-offset-4">
                            {item.label}
                          </TooltipTrigger>
                          <TooltipContent>
                            <PlayerNameList players={item.players} />
                          </TooltipContent>
                        </Tooltip>
                      ) : (
                        item.label
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      {item.count}
                      {item.missingPlayers && item.missingPlayers.length > 0 && (
                        <Tooltip>
                          <TooltipTrigger className="cursor-default text-xs text-red-500 underline decoration-dotted underline-offset-2">
                            −{item.missingPlayers.length}
                          </TooltipTrigger>
                          <TooltipContent>
                            <PlayerNameList players={item.missingPlayers} />
                          </TooltipContent>
                        </Tooltip>
                      )}
                    </div>
                  </TableCell>
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
