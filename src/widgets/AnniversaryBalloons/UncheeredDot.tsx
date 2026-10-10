import { cn } from "@/shared/lib/tw-merge";

export default function UncheeredDot({ className }: { className: string }) {
  return (
    <span className={cn("flex size-2.5", className)}>
      <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary opacity-75" />
      <span className="relative inline-flex size-2.5 rounded-full bg-primary" />
    </span>
  );
}
