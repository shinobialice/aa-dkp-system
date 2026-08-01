"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui";
import type { RosterClassStat } from "@/actions/guildStats";

export default function RosterCompositionTable({
  data,
  className,
}: {
  data: RosterClassStat[];
  className?: string;
}) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-base">
          Общая информация по составу
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Класс</TableHead>
              <TableHead className="text-right">Кол-во</TableHead>
              <TableHead className="text-right">Средний ГС</TableHead>
              <TableHead className="text-right">Средняя пос.%</TableHead>
              <TableHead className="text-right">Кол-во получ. зп</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((row) => (
              <TableRow
                key={row.className}
                className={row.className === "Общее" ? "font-semibold" : ""}
              >
                <TableCell>{row.className}</TableCell>
                <TableCell className="text-right">{row.count}</TableCell>
                <TableCell className="text-right">
                  {row.avgGearScore != null
                    ? Math.round(row.avgGearScore).toLocaleString("ru-RU")
                    : "—"}
                </TableCell>
                <TableCell className="text-right">
                  {row.avgAttendancePercent.toFixed(2)}%
                </TableCell>
                <TableCell className="text-right">
                  {row.salaryCount}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
