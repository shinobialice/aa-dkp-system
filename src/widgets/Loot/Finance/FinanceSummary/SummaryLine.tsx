import type { ReactNode } from "react";
import { cn } from "@/shared/lib/tw-merge";

type Props = {
  label: string;
  value: ReactNode;
  swatch?: string;
  muted?: boolean;
};

export default function SummaryLine({ label, value, swatch, muted }: Props) {
  return (
    <div
      className={cn(
        "flex items-center justify-between gap-3 text-sm",
        muted && "text-muted-foreground",
      )}
    >
      <span className="flex items-center gap-1.5">
        {swatch && <span className={cn("size-2 rounded-xs", swatch)} />}
        {label}
      </span>
      <span className={cn("tabular-nums", !muted && "font-semibold")}>
        {value}
      </span>
    </div>
  );
}
