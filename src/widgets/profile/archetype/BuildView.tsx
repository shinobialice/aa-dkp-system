import type { ArchetypeSlot, RoleSlot } from "@/actions/getUserArchetype";
import { SpecializationIcon } from "./SpecializationIcon";
import { getSpecialization } from "./specializationsData";
import { Badge } from "@/shared/ui";
import { ROLE_LABELS } from "./archetypeRoles";

export default function BuildView({
  slot,
  showLabel,
  archetype,
}: {
  slot: RoleSlot;
  showLabel: boolean;
  archetype: ArchetypeSlot;
}) {
  const specs = [
    archetype.specialization1,
    archetype.specialization2,
    archetype.specialization3,
  ];

  return (
    <div className="space-y-3">
      {showLabel && (
        <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {ROLE_LABELS[slot]}
        </div>
      )}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {specs.map((id, i) => {
          const spec = getSpecialization(id);
          if (!spec) {
            return (
              <div
                key={i}
                className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed p-3 text-sm text-muted-foreground"
              >
                Не выбрано
              </div>
            );
          }
          return (
            <div
              key={i}
              className="flex flex-col items-center gap-2 rounded-lg border p-3"
            >
              <div className="flex size-10 items-center justify-center rounded-md bg-muted">
                <SpecializationIcon id={spec.id} size={22} />
              </div>
              <div className="text-sm font-semibold">{spec.name}</div>
            </div>
          );
        })}
      </div>

      {archetype.className && (
        <div className="flex items-center justify-center">
          <Badge className="text-sm">{archetype.className}</Badge>
        </div>
      )}
    </div>
  );
}
