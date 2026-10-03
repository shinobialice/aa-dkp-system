import type { ReactNode } from "react";

type Props = {
  label: string;
  children: ReactNode;
};

export default function SummaryCard({ label, children }: Props) {
  return (
    <section
      aria-label={label}
      className="flex min-w-0 flex-col gap-2.5 rounded-xl border bg-card px-4 py-3.5 sm:px-4.5 sm:py-4"
    >
      <span className="text-sm font-medium text-muted-foreground">{label}</span>
      {children}
    </section>
  );
}
