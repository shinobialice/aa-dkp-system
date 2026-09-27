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
  return (
    <div className="min-w-[140px] space-y-1">
      <div className="flex items-baseline gap-1.5 text-sm font-semibold">
        <span className="inline-flex items-center">
          {classIcons[roleValue ?? ""] ?? "❓"}
        </span>
        <span>{roleValue ?? "—"}</span>
        <span className="text-xs font-normal text-muted-foreground">
          {gsValue ?? "нет данных"} ГС
        </span>
      </div>
      <ArchetypeSummary archetype={archetype} size={22} />
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
    <>
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
    </>
  );
}
