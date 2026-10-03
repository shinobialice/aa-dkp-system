import type { ReactNode } from "react";
import { Button } from "@/shared/ui";
import { cn } from "@/shared/lib/tw-merge";

export type Choice<T extends string> = {
  value: T;
  label: string;
  icon: ReactNode;
};

type Props<T extends string> = {
  value: T;
  choices: Choice<T>[];
  onChange: (value: T) => void;
  compact?: boolean;
};

export default function ChoiceToggle<T extends string>({
  value,
  choices,
  onChange,
  compact,
}: Props<T>) {
  return (
    <div
      className={cn("flex gap-1 rounded-md border p-1", compact && "shrink-0")}
    >
      {choices.map((choice) => (
        <Button
          key={choice.value}
          type="button"
          size={compact ? "sm" : "default"}
          variant={value === choice.value ? "default" : "ghost"}
          className={cn("cursor-pointer gap-1.5", compact ? "px-2" : "flex-1")}
          onClick={() => onChange(choice.value)}
        >
          {choice.icon}
          {choice.label}
        </Button>
      ))}
    </div>
  );
}
