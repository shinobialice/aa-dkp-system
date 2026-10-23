import Link from "next/link";
import { cn } from "@/shared/lib/tw-merge";
import {
  kindHref,
  type EntryKind,
  type KillcountPage,
} from "./killcountEntriesModel";

type Props = {
  page: KillcountPage;
  kind: EntryKind;
};

const KINDS: { kind: EntryKind; label: string }[] = [
  { kind: "prime", label: "Прайм" },
  { kind: "agl", label: "АГЛ" },
];

export default function KindSwitch({ page, kind }: Props) {
  return (
    <nav
      aria-label="Тип киллкаунта"
      className="inline-flex w-fit gap-0.5 rounded-lg bg-muted p-0.75"
    >
      {KINDS.map((item) => {
        const isActive = item.kind === kind;
        return (
          <Link
            key={item.kind}
            href={kindHref(page, item.kind)}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "rounded-md px-3.5 py-1.5 text-sm font-medium whitespace-nowrap text-muted-foreground transition-colors hover:text-foreground",
              isActive && "bg-background text-foreground shadow-sm",
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
