import type { ComponentProps } from "react";
import { Bell } from "lucide-react";
import { bellLabel } from "./notificationCenterModel";

type Props = ComponentProps<"button"> & {
  count: number;
};

export default function BellButton({ count, ...props }: Props) {
  return (
    <button
      type="button"
      aria-label={bellLabel(count)}
      title={bellLabel(count)}
      className="relative flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-full border bg-muted/50 text-muted-foreground transition hover:bg-muted hover:text-foreground data-[state=open]:bg-muted data-[state=open]:text-foreground"
      {...props}
    >
      <Bell className="size-4.5" />
      {count > 0 && (
        <span className="absolute -top-1 -right-1 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-red-500 px-1 text-2xs font-bold text-white tabular-nums ring-2 ring-background">
          {count}
        </span>
      )}
    </button>
  );
}
