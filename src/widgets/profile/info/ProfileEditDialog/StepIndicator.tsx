import { cn } from "@/shared/lib/tw-merge";
import type { Step } from "./profileDraft";

const STEPS: { id: Step; label: string }[] = [
  { id: "main", label: "Основное" },
  { id: "inventory", label: "Инвентарь" },
];

export default function StepIndicator({ step }: { step: Step }) {
  return (
    <div className="flex items-center gap-2 text-sm">
      {STEPS.map((item, index) => (
        <div key={item.id} className="flex items-center gap-2">
          {index > 0 && <div className="h-px w-6 bg-border" />}
          <span
            className={cn(
              "flex size-5 items-center justify-center rounded-full text-xs font-semibold",
              item.id === step
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground",
            )}
          >
            {index + 1}
          </span>
          <span
            className={
              item.id === step ? "font-medium" : "text-muted-foreground"
            }
          >
            {item.label}
          </span>
        </div>
      ))}
    </div>
  );
}
