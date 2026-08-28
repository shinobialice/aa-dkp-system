import { Tooltip, TooltipTrigger, TooltipContent } from "@/shared/ui";
import { SpecializationIcon } from "./SpecializationIcon";
import { getSpecialization } from "./specializationsData";
import type { ArchetypeSlot } from "@/actions/getUserArchetype";

export function ArchetypeSummary({
  archetype,
  size = 28,
}: {
  archetype: ArchetypeSlot;
  size?: number;
}) {
  const specs = [
    archetype.specialization1,
    archetype.specialization2,
    archetype.specialization3,
  ];

  if (!specs.some(Boolean) && !archetype.className) {
    return (
      <div className="text-sm font-semibold text-muted-foreground">
        Не выбран
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="flex items-center gap-1.5">
        {specs.map((id, i) => {
          const spec = getSpecialization(id);
          if (!spec) {
            return (
              <div
                key={i}
                className="flex items-center justify-center"
                style={{ width: size * 0.55, height: size * 0.6 }}
              />
            );
          }
          return (
            <Tooltip key={id}>
              <TooltipTrigger asChild>
                <div
                  className="flex items-center justify-center"
                  style={{ width: size * 0.55, height: size * 0.6 }}
                >
                  <SpecializationIcon id={spec.id} size={size * 0.55} />
                </div>
              </TooltipTrigger>
              <TooltipContent>{spec.name}</TooltipContent>
            </Tooltip>
          );
        })}
      </div>
      {archetype.className && (
        <span className="text-xs font-normal text-muted-foreground">
          {archetype.className}
        </span>
      )}
    </div>
  );
}
