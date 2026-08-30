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
import type { SealGradeStat } from "@/actions/guildStats";
import PlayerNameList from "./PlayerNameList";
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
              {row.players.length > 0 ? (
                <Tooltip>
                  <TooltipTrigger className="flex cursor-default items-center gap-2 underline decoration-dotted underline-offset-4">
                    <SealIcon grade={row.grade} size={28} />
                    {row.label}
                  </TooltipTrigger>
                  <TooltipContent>
                    <PlayerNameList players={row.players} />
                  </TooltipContent>
                </Tooltip>
              ) : (
                <div className="flex items-center gap-2">
                  <SealIcon grade={row.grade} size={28} />
                  {row.label}
                </div>
              )}
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
