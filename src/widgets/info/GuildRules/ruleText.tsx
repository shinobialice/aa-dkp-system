import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export function Items({ children }: { children: ReactNode }) {
  return <ol className="flex flex-col gap-1.5">{children}</ol>;
}

export function Item({ num, children }: { num: string; children: ReactNode }) {
  return (
    <li className="grid grid-cols-[38px_minmax(0,1fr)] gap-2 sm:grid-cols-[44px_minmax(0,1fr)] sm:gap-2.5">
      <span className="pt-px text-sm text-muted-foreground tabular-nums">
        {num}
      </span>
      <div className="min-w-0">{children}</div>
    </li>
  );
}

export function SubTitle({
  num,
  children,
}: {
  num: string;
  children: ReactNode;
}) {
  return (
    <h3 className="mt-1.5 text-base font-semibold">
      <span className="text-muted-foreground">{num}</span> {children}
    </h3>
  );
}

export function Lead({ children }: { children: ReactNode }) {
  return <p className="text-foreground/80">{children}</p>;
}

export function PageLink({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      className="font-medium text-green-700 underline-offset-2 hover:underline dark:text-green-400"
    >
      {children}
    </Link>
  );
}

export function AnchorLink({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <a
      href={href}
      className="font-medium text-green-700 underline-offset-2 hover:underline dark:text-green-400"
    >
      {children}
    </a>
  );
}
