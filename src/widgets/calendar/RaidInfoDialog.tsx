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

type SortKey = "username" | "class";

const EMPTY_ATTENDANCE: any[] = [];

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

        <div className="rounded-md border flex-1 min-h-0 overflow-y-auto">
          <Table>
            <TableHeader className="sticky top-0 z-1 bg-background">
              <TableRow>
                <TableHead>{sortHeader("Ник", "username")}</TableHead>
                <TableHead>{sortHeader("Класс", "class")}</TableHead>
                <TableHead>Опоздал</TableHead>
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
        </div>
      </DialogContent>
    </Dialog>
  );
}
