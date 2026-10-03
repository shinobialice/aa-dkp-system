import { cn } from "@/shared/lib/tw-merge";
import type { JournalKind } from "../journalModel";
import { KIND_META } from "./journalMeta";

type Props = {
  kind: JournalKind;
  className?: string;
};

export default function KindChip({ kind, className }: Props) {
  const meta = KIND_META[kind];
  const Icon = meta.icon;

  return (
    <span
      className={cn(
        "inline-flex h-6 items-center gap-1.5 rounded-md px-2 text-xs font-medium whitespace-nowrap",
        meta.chip,
        className,
      )}
    >
      <Icon className="size-3.5" aria-hidden />
      {meta.label}
    </span>
  );
}
