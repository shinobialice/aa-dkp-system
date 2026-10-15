import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/shared/lib/tw-merge";
import SectionEmpty from "./SectionEmpty";

type Props = {
  title: string;
  icon?: LucideIcon;
  description?: ReactNode;
  action?: ReactNode;
  empty?: string | null;
  className?: string;
  children: ReactNode;
};

export default function WarSection({
  title,
  icon: Icon,
  description,
  action,
  empty,
  className,
  children,
}: Props) {
  return (
    <section
      aria-label={title}
      className={cn(
        "arena-cut arena-enter flex min-w-0 flex-col border bg-card",
        className,
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2 px-4 pt-4 pb-3 sm:px-5">
        <div className="min-w-0">
          <h2 className="flex items-center gap-2 font-display text-lg tracking-wide uppercase">
            {Icon && <Icon className="size-4 shrink-0 text-muted-foreground" />}
            {title}
          </h2>
          {description && (
            <p className="mt-0.5 text-xs text-muted-foreground">
              {description}
            </p>
          )}
        </div>
        {action}
      </div>
      {empty ? <SectionEmpty>{empty}</SectionEmpty> : children}
    </section>
  );
}
