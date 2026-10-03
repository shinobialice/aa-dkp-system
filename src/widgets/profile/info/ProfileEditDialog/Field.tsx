import type { ReactNode } from "react";
import { Lock } from "lucide-react";

type Props = {
  label: string;
  required?: boolean;
  locked?: boolean;
  error?: string | null;
  hint?: string;
  children: ReactNode;
};

export default function Field({
  label,
  required,
  locked,
  error,
  hint,
  children,
}: Props) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
        {required && !locked && <span className="text-destructive">*</span>}
        {locked && <Lock className="size-3" />}
      </div>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
      {!error && hint && (
        <p className="text-xs text-muted-foreground">{hint}</p>
      )}
    </div>
  );
}
