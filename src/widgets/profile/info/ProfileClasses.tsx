import { ArchetypeSummary } from "@/widgets/profile/archetype/ArchetypeSummary";
import type { ArchetypeSlot, UserArchetype } from "@/actions/getUserArchetype";
import { classIcons } from "./roleClasses";

function RoleView({
  roleValue,
  gsValue,
  archetype,
}: {
  roleValue: string | null;
  gsValue: string | number | null;
  archetype: ArchetypeSlot;
}) {
  const hasArchetype =
    !!archetype.className ||
    !!archetype.specialization1 ||
    !!archetype.specialization2 ||
    !!archetype.specialization3;
  const gs = gsValue != null && gsValue !== "" ? Number(gsValue) : null;

  return (
    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
      <span className="inline-flex items-center gap-1.5 font-semibold">
        {classIcons[roleValue ?? ""] ?? null}
        {roleValue ?? "—"}
      </span>
      <span className="text-muted-foreground tabular-nums">
        {gs != null && !Number.isNaN(gs)
          ? `${gs.toLocaleString("ru-RU")} ГС`
          : "ГС не указан"}
      </span>
      {hasArchetype && <ArchetypeSummary archetype={archetype} size={18} />}
    </div>
  );
}

export default function ProfileClasses({
  user,
  archetype,
}: {
  user: any;
  archetype: UserArchetype;
}) {
  const hasSecondary =
    !!user.secondary_class || user.secondary_class_gear_score != null;
  const hasTertiary =
    !!user.tertiary_class || user.tertiary_class_gear_score != null;

  return (
    <div className="flex flex-wrap gap-x-6 gap-y-1.5">
      <RoleView
        roleValue={user.class}
        gsValue={user.class_gear_score}
        archetype={archetype[1]}
      />
      {hasSecondary && (
        <RoleView
          roleValue={user.secondary_class}
          gsValue={user.secondary_class_gear_score}
          archetype={archetype[2]}
        />
      )}
      {hasTertiary && (
        <RoleView
          roleValue={user.tertiary_class}
          gsValue={user.tertiary_class_gear_score}
          archetype={archetype[3]}
        />
      )}
    </div>
  );
}
