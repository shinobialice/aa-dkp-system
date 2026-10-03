import type { ReactNode } from "react";
import { Coins } from "lucide-react";
import { formatNumber } from "@/shared/lib/format";
import { cn } from "@/shared/lib/tw-merge";
import { Card, Skeleton } from "@/shared/ui";

type Props = {
  label: string;
  value: number;
  hint: string;
  footer: ReactNode;
  footerOnMobile?: boolean;
  loading: boolean;
};

export default function StatCard({
  label,
  value,
  hint,
  footer,
  footerOnMobile,
  loading,
}: Props) {
  return (
    <Card className="gap-1.5 p-3 sm:p-5">
      <p className="text-xs text-muted-foreground sm:text-sm">{label}</p>
      {loading && <Skeleton className="h-7 w-28 sm:h-8 sm:w-32" />}
      {!loading && (
        <p className="flex items-center gap-1.5 text-xl font-semibold tracking-tight whitespace-nowrap sm:gap-2 sm:text-2xl xl:text-3xl xl:leading-9">
          {formatNumber(value)}
          <Coins className="size-4 text-amber-500 sm:size-4.5" aria-hidden />
        </p>
      )}
      <p className="text-xs text-muted-foreground">{hint}</p>
      <div
        className={cn(
          "mt-auto flex-wrap items-center justify-between gap-x-2 gap-y-1 border-t pt-3 text-xs",
          footerOnMobile ? "flex" : "hidden sm:flex",
        )}
      >
        {footer}
      </div>
    </Card>
  );
}
