import type { ArchetypeSlot, RoleSlot } from "@/actions/getUserArchetype";
import ArchetypeSpecPicker, { type SpecKey } from "./ArchetypeSpecPicker";
import { ROLE_LABELS } from "./archetypeRoles";

export default function BuildEditor({
  slot,
  showLabel,
  draft,
  onSpecChange,
}: {
  slot: RoleSlot;
  showLabel: boolean;
  draft: ArchetypeSlot;
  onSpecChange: (key: SpecKey, value: string | null) => void;
}) {
  return (
    <div className="space-y-3">
      {showLabel && (
        <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {ROLE_LABELS[slot]}
        </div>
      )}
      <ArchetypeSpecPicker value={draft} onChange={onSpecChange} />
    </div>
  );
}
