import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export default function SectionEmpty({ children }: Props) {
  return (
    <p className="mx-4 mb-4 rounded-lg border border-dashed px-3 py-6 text-center text-sm text-muted-foreground">
      {children}
    </p>
  );
}
