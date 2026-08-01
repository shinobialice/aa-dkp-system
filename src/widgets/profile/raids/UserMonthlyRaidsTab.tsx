"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowUpDown } from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/shared/ui/select";
import { Badge, Button } from "@/shared/ui";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui";
import {
  getUserMonthlyRaids,
  type UserMonthlyRaid,
} from "@/actions/getUserMonthlyRaids";

type SortKey = "startDate" | "type" | "bosses" | "isLate" | "dkpSummary";

const months = [
  "Январь",
  "Февраль",
  "Март",
  "Апрель",
  "Май",
  "Июнь",
  "Июль",
  "Август",
  "Сентябрь",
  "Октябрь",
  "Ноябрь",
  "Декабрь",
];

type Props = {
  userId: number;
};

export default function UserMonthlyRaidsTab({ userId }: Props) {
  const now = new Date();
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth());
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());
  const [loading, setLoading] = useState(false);
  const [raids, setRaids] = useState<UserMonthlyRaid[]>([]);
  const [sortKey, setSortKey] = useState<SortKey>("startDate");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const yearOptions = [];
  for (let y = now.getFullYear() - 3; y <= now.getFullYear() + 1; y++) {
    yearOptions.push(y);
  }

  useEffect(() => {
    setLoading(true);
    getUserMonthlyRaids(userId, selectedYear, selectedMonth + 1)
      .then(setRaids)
      .finally(() => setLoading(false));
  }, [userId, selectedMonth, selectedYear]);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const sortedRaids = useMemo(() => {
    const sorted = [...raids].sort((a, b) => {
      switch (sortKey) {
        case "type":
          return (a.type ?? "").localeCompare(b.type ?? "", "ru");
        case "bosses":
          return a.bosses.join(", ").localeCompare(b.bosses.join(", "), "ru");
        case "isLate":
          return Number(a.isLate) - Number(b.isLate);
        case "dkpSummary":
          return a.dkpSummary - b.dkpSummary;
        case "startDate":
        default:
          return (
            new Date(a.startDate ?? 0).getTime() -
            new Date(b.startDate ?? 0).getTime()
          );
      }
    });
    return sortDir === "asc" ? sorted : sorted.reverse();
  }, [raids, sortKey, sortDir]);

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

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Select
          value={String(selectedMonth)}
          onValueChange={(v) => setSelectedMonth(Number(v))}
        >
          <SelectTrigger className="min-w-[110px]">
            <SelectValue>{months[selectedMonth]}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            {months.map((m, idx) => (
              <SelectItem value={String(idx)} key={m}>
                {m}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={String(selectedYear)}
          onValueChange={(v) => setSelectedYear(Number(v))}
        >
          <SelectTrigger className="min-w-[80px]">
            <SelectValue>{selectedYear}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            {yearOptions.map((y) => (
              <SelectItem value={String(y)} key={y}>
                {y}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-24 text-muted-foreground">
          Загрузка...
        </div>
      ) : raids.length === 0 ? (
        <div className="text-sm text-muted-foreground text-center py-8">
          Нет посещённых рейдов за {months[selectedMonth].toLowerCase()}{" "}
          {selectedYear}
        </div>
      ) : (
        <div className="rounded-md border max-h-[400px] overflow-y-auto">
          <Table>
            <TableHeader className="sticky top-0 z-1 bg-background">
              <TableRow>
                <TableHead>{sortHeader("Дата", "startDate")}</TableHead>
                <TableHead>{sortHeader("Тип", "type")}</TableHead>
                <TableHead>{sortHeader("Боссы", "bosses")}</TableHead>
                <TableHead>{sortHeader("Опоздал", "isLate")}</TableHead>
                <TableHead>{sortHeader("DKP", "dkpSummary")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedRaids.map((raid) => (
                <TableRow key={raid.id}>
                  <TableCell>
                    {raid.startDate
                      ? new Date(raid.startDate).toLocaleString("ru-RU", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "—"}
                  </TableCell>
                  <TableCell>{raid.type ?? "—"}</TableCell>
                  <TableCell>
                    {raid.bosses.length > 0 ? raid.bosses.join(", ") : "—"}
                  </TableCell>
                  <TableCell>
                    {raid.isLate ? (
                      <Badge variant="destructive">Да</Badge>
                    ) : (
                      "Нет"
                    )}
                  </TableCell>
                  <TableCell>
                    {raid.isLate
                      ? (raid.dkpSummary / 2).toFixed(2)
                      : raid.dkpSummary}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
