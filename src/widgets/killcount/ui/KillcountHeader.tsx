"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/shared/lib/tw-merge";

const TABS = [
  { href: "/kill-counter/current", label: "Сегодня" },
  { href: "/kill-counter/history", label: "История" },
];

export function KillcountHeader({
  title = "Киллкаунт",
  subtitle,
  children,
}: {
  title?: string;
  subtitle: string;
  children?: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
        </div>
        <nav
          aria-label="Раздел киллкаунта"
          className="inline-flex gap-0.5 rounded-lg bg-muted p-0.75"
        >
          {TABS.map((tab) => {
            const active = pathname.startsWith(tab.href);
            return (
              <Link
                key={tab.href}
                href={tab.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "rounded-md px-3.5 py-1.5 text-sm font-medium whitespace-nowrap text-muted-foreground transition-colors hover:text-foreground",
                  active && "bg-background text-foreground shadow-sm",
                )}
              >
                {tab.label}
              </Link>
            );
          })}
        </nav>
      </div>
      {children}
    </div>
  );
}
