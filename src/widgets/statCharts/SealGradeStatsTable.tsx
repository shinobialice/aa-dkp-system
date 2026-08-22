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
import type { SealGradeStat } from "@/actions/guildStats";
import SealIcon from "@/widgets/profile/seals/SealIcon";

export default function SealGradeStatsTable({
  data,
  className,
}: {
  data: SealGradeStat[];
  className?: string;
}) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-base">Печати по редкости</CardTitle>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <div className="py-8 text-center text-muted-foreground">
            У участников нет выбранных печатей
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Редкость</TableHead>
                <TableHead className="text-right">Кол-во печатей</TableHead>
                <TableHead className="text-right">Кол-во игроков</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((row) => (
                <TableRow key={row.grade}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <SealIcon grade={row.grade} size={28} />
                      {row.label}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">{row.count}</TableCell>
                  <TableCell className="text-right">
                    {row.userCount}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
