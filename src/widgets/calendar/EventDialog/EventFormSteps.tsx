import { cn } from "@/shared/lib/tw-merge";

export type EventFormStep = "raid" | "people";

type Props = {
  step: EventFormStep;
  participantCount: number;
  onStepChange: (step: EventFormStep) => void;
};

export default function EventFormSteps({
  step,
  participantCount,
  onStepChange,
}: Props) {
  const steps: [EventFormStep, string][] = [
    ["raid", "Рейд"],
    ["people", `Участники ${participantCount}`],
  ];

  return (
    <div
      role="tablist"
      className="mx-4 mt-3 grid shrink-0 grid-cols-2 gap-0.5 rounded-lg bg-muted p-0.75 md:hidden"
    >
      {steps.map(([key, label]) => (
        <button
          key={key}
          type="button"
          role="tab"
          aria-selected={step === key}
          onClick={() => onStepChange(key)}
          className={cn(
            "h-9 cursor-pointer rounded-md text-sm font-semibold transition-colors",
            step === key
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground",
          )}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
