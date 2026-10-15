import type { ReactNode } from "react";
import { cn } from "@/shared/lib/tw-merge";

type Props = {
  className?: string;
  children: ReactNode;
};

export default function SkewTag({ className, children }: Props) {
  return (
    <span
      className={cn(
        "inline-block -skew-x-12 px-3 py-0.5 font-display text-xs tracking-wide uppercase",
        className,
      )}
    >
      <span className="inline-flex skew-x-12 items-center gap-1.5">
        {children}
      </span>
    </span>
  );
}
