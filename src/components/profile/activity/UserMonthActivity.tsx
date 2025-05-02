"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
  aglPercent: number;
  primePercent: number;
  totalPercent: number;
  dkp: number;
};

export function UserMonthActivity({
  aglPercent,
  primePercent,
  totalPercent,
  dkp,
}: Props) {
  const monthName = months[new Date().getMonth()];

  const info = [
    { label: "АГЛ", value: `${aglPercent.toFixed(0)}%` },
    { label: "Прайм", value: `${primePercent.toFixed(0)}%` },
    { label: "Итого", value: `${totalPercent.toFixed(0)}%` },
    { label: "Учет баллов", value: `${dkp}` },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{monthName}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 h-[325px]">
          {info.map((item) => (
            <Card
              key={item.label}
              className="flex flex-col items-center justify-center p-4"
            >
              <div className="text-sm text-muted-foreground">{item.label}</div>
              <div className="text-2xl font-bold">{item.value}</div>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
