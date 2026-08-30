"use client";

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
import type { ClassArchetypeStat } from "@/actions/guildStats";
import PlayerNameList from "./PlayerNameList";

function ClassArchetypeContent({ data }: { data: ClassArchetypeStat[] }) {
  if (data.length === 0) {
    return (
      <div className="py-8 text-center text-muted-foreground">
        У участников не выбран класс
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Класс</TableHead>
          <TableHead className="text-right">Кол-во игроков</TableHead>
          <TableHead className="text-right">Доля состава</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((row) => (
          <TableRow
            key={row.className}
            className={row.className === "Не выбран" ? "text-muted-foreground" : ""}
          >
            <TableCell>
              {row.players.length > 0 ? (
                <Tooltip>
                  <TooltipTrigger className="cursor-default underline decoration-dotted underline-offset-4">
                    {row.className}
                  </TooltipTrigger>
                  <TooltipContent>
                    <PlayerNameList players={row.players} />
                  </TooltipContent>
                </Tooltip>
              ) : (
                row.className
              )}
            </TableCell>
            <TableCell className="text-right">{row.count}</TableCell>
            <TableCell className="text-right">
              {row.percent.toFixed(1)}%
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export default function ClassArchetypeStatsTable({
  data,
  className,
  bare,
}: {
  data: ClassArchetypeStat[];
  className?: string;
  bare?: boolean;
}) {
  if (bare) {
    return (
      <CardContent>
        <ClassArchetypeContent data={data} />
      </CardContent>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-base">Статистика по классам</CardTitle>
      </CardHeader>
      <CardContent>
        <ClassArchetypeContent data={data} />
      </CardContent>
    </Card>
  );
}
