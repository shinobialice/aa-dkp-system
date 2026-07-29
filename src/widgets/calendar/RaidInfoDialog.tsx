"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui";
import { Separator } from "@/shared/ui";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui";

export function RaidInfoDialog({
  open,
  setOpen,
  raid,
}: {
  open: boolean;
  setOpen: (v: boolean) => void;
  raid: any;
}) {
  if (!raid) {
    return null;
  }

  const bosses =
    raid.raid_boss?.map((rb: any) => rb.boss?.boss_name).filter(Boolean) ??
    [];
  const attendance = raid.raid_attendance ?? [];
  const date = raid.start_date ? new Date(raid.start_date) : null;

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
                <TableHead>Ник</TableHead>
                <TableHead>Класс</TableHead>
                <TableHead>Опоздал</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {attendance.length > 0 ? (
                attendance.map((a: any) => (
                  <TableRow key={a.user.id}>
                    <TableCell>{a.user.username}</TableCell>
                    <TableCell>{a.user.class}</TableCell>
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
