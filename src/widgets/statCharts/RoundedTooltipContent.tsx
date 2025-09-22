"use client";

import { ChartTooltipContent } from "@/shared/ui";

type Props = {
  payload?: { value: number }[];
  [key: string]: any;
};

export function RoundedTooltipContent(props: Props) {
  const newPayload = (props.payload || []).map((item) => ({
    ...item,
    value: `${Math.round(item.value)}%`,
  }));

  return <ChartTooltipContent {...props} payload={newPayload} />;
}
