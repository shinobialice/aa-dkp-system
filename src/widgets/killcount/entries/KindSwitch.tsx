import Link from "next/link";
import { cn } from "@/shared/lib/tw-merge";
import { entryHref, type EntryKind } from "./killcountEntriesModel";

type Props = {
  kind: EntryKind;
  counts: Record<EntryKind, number>;
};

const KINDS: { kind: EntryKind; label: string }[] = [
  { kind: "prime", label: "Праймы" },
  { kind: "agl", label: "АГЛ" },
];

export default function KindSwitch({ kind, counts }: Props) {
  return (
    <nav
      aria-label="Тип киллкаунта"
      className="inline-flex gap-0.5 rounded-lg bg-muted p-0.75"
    >
      {KINDS.map((item) => {
        const isActive = item.kind === kind;
        return (
          <Link
            key={item.kind}
            href={entryHref(item.kind, null)}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "rounded-md px-3.5 py-1.5 text-sm font-medium whitespace-nowrap text-muted-foreground transition-colors hover:text-foreground",
              isActive && "bg-background text-foreground shadow-sm",
            )}
          >
            {item.label}
            <span className="ml-1.5 text-xs text-muted-foreground">
              {counts[item.kind]}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
