import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  hint?: ReactNode;
};

export default function FieldLabel({ children, hint }: Props) {
  return (
    <div className="flex items-baseline justify-between gap-2 text-xs font-semibold text-muted-foreground">
      <span>{children}</span>
      {hint && <span className="font-normal">{hint}</span>}
    </div>
  );
}
