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

function SealGradeContent({ data }: { data: SealGradeStat[] }) {
  if (data.length === 0) {
    return (
      <div className="py-8 text-center text-muted-foreground">
        У участников нет выбранных печатей
      </div>
    );
  }

  return (
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
            <TableCell className="text-right">{row.userCount}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export default function SealGradeStatsTable({
  data,
  className,
  bare,
}: {
  data: SealGradeStat[];
  className?: string;
  bare?: boolean;
}) {
  if (bare) {
    return (
      <CardContent>
        <SealGradeContent data={data} />
      </CardContent>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-base">Печати по редкости</CardTitle>
      </CardHeader>
      <CardContent>
        <SealGradeContent data={data} />
      </CardContent>
    </Card>
  );
}
