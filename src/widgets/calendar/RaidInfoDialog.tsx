"use client";

import { useMemo, useState } from "react";
import { ArrowUpDown } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui";
import { Separator } from "@/shared/ui";
import { Badge, Button } from "@/shared/ui";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui";
import { classColors, classIcons } from "@/widgets/MembersTable/classStyles";
import { parseMoscowISOString } from "@/utils/getMoscowISOString";
import { LootIcon } from "@/widgets/Loot/LootBuy/icons/LootIconComponent";

type SortKey = "username" | "class";

const EMPTY_ATTENDANCE: any[] = [];
const EMPTY_LOOT: any[] = [];

export function RaidInfoDialog({
  open,
  setOpen,
  raid,
}: {
  open: boolean;
  setOpen: (v: boolean) => void;
  raid: any;
}) {
  const attendance = raid?.raid_attendance ?? EMPTY_ATTENDANCE;
  const loot = (raid?.loot ?? EMPTY_LOOT).filter(
    (item: any) => item.status !== "Распродано",
  );

  const [sortKey, setSortKey] = useState<SortKey | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const sortedAttendance = useMemo(() => {
    if (!sortKey) return attendance;
    return [...attendance].sort((a: any, b: any) => {
      const cmp = String(a.user?.[sortKey] ?? "").localeCompare(
        String(b.user?.[sortKey] ?? ""),
        "ru",
      );
      return sortDir === "asc" ? cmp : -cmp;
    });
  }, [attendance, sortKey, sortDir]);

  const sortHeader = (label: string, key: SortKey) => (
    <Button
      className="cursor-pointer"
      variant="ghost"
      onClick={() => toggleSort(key)}
    >
      {label}
      <ArrowUpDown className="ml-2 h-4 w-4" />
    </Button>
  );

  if (!raid) {
    return null;
  }

  const bosses =
    raid.raid_boss?.map((rb: any) => rb.boss?.boss_name).filter(Boolean) ??
    [];
  const date = raid.start_date ? parseMoscowISOString(raid.start_date) : null;
  const showLoot = raid.type !== "АГЛ";

  const attendanceTable = (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="sticky top-0 z-10 bg-background">
            {sortHeader("Ник", "username")}
          </TableHead>
          <TableHead className="sticky top-0 z-10 bg-background">
            {sortHeader("Класс", "class")}
          </TableHead>
          <TableHead className="sticky top-0 z-10 bg-background">
            Опоздал
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sortedAttendance.length > 0 ? (
          sortedAttendance.map((a: any) => (
            <TableRow key={a.user.id}>
              <TableCell>{a.user.username}</TableCell>
              <TableCell>
                {a.user.class ? (
                  <Badge
                    className="text-background gap-1"
                    style={{
                      backgroundColor:
                        classColors[a.user.class] ?? "rgb(120,120,120)",
                    }}
                  >
                    {classIcons[a.user.class]}
                    {a.user.class}
                  </Badge>
                ) : (
                  "—"
                )}
              </TableCell>
              <TableCell>{a.is_late ? "Да" : "Нет"}</TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={3} className="h-24 text-center">
              Нет участников
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-2xl max-h-[85vh] flex flex-col overflow-hidden">
        <DialogHeader className="shrink-0">
          <DialogTitle>
            {raid.type}
            {bosses.length > 0 ? ` — ${bosses.join(", ")}` : ""}
          </DialogTitle>
          <DialogDescription>Информация об активности</DialogDescription>
        </DialogHeader>
        <Separator className="shrink-0" />
        <div className="grid grid-cols-2 gap-4 text-sm shrink-0">
          <div>
            <span className="text-muted-foreground">Дата и время (МСК): </span>
            <strong>
              {date
                ? date.toLocaleString("ru-RU", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    timeZone: "Europe/Moscow",
                  })
                : "—"}
            </strong>
          </div>
          <div>
            <span className="text-muted-foreground">Ценность посещения: </span>
            <strong>{raid.dkp_summary ?? 0}</strong>
          </div>
        </div>

        {showLoot && (
          <div className="shrink-0">
            <h3 className="text-sm font-semibold mb-2">
              Лут{loot.length > 0 ? ` (${loot.length})` : ""}
            </h3>
            <div className="rounded-md border max-h-40 overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="sticky top-0 z-10 bg-background">
                      Предмет
                    </TableHead>
                    <TableHead className="sticky top-0 z-10 bg-background">
                      Кол-во
                    </TableHead>
                    <TableHead className="sticky top-0 z-10 bg-background">
                      Статус
                    </TableHead>
                    <TableHead className="sticky top-0 z-10 bg-background">
                      Кому
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loot.length > 0 ? (
                    loot.map((item: any) => (
                      <TableRow key={item.id}>
                        <TableCell className="flex items-center gap-2">
                          <LootIcon itemName={item.itemType?.name} size={28} />
                          <span>{item.itemType?.name ?? "—"}</span>
                        </TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell>{item.status ?? "—"}</TableCell>
                        <TableCell>{item.sold_to ?? "—"}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="h-24 text-center">
                        Лут не привязан к этому рейду
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        )}

        <div className="shrink-0">
          <h3 className="text-sm font-semibold mb-2">Участники</h3>
        </div>
        <div className="rounded-md border flex-1 min-h-0 overflow-y-auto">
          {attendanceTable}
        </div>
      </DialogContent>
    </Dialog>
  );
}
