import { cloneElement, type ReactNode } from "react";
import { classColors, classIcons } from "@/widgets/MembersTable/classStyles";
import { lookupClassSpecs } from "@/widgets/profile/archetype/classCombinations";
import { SpecializationIcon } from "@/widgets/profile/archetype/SpecializationIcon";
import { type KillRow } from "../killcountModel";

type Props = {
  row: KillRow;
  isStacked?: boolean;
};

export default function ClassBadge({ row, isStacked = false }: Props) {
  const specs = lookupClassSpecs(row.playerClass);
  if (specs && isStacked) {
    return (
      <span className="flex flex-col items-center gap-1">
        <SpecIcons specs={specs} size={18} />
        <Badge row={row} />
      </span>
    );
  }
  if (specs) {
    return <Badge row={row} icon={<SpecIcons specs={specs} size={12} />} />;
  }
  const roleIcon = classIcons[row.role ?? ""];
  return (
    <Badge
      row={row}
      icon={roleIcon && cloneElement(roleIcon, { className: "size-3" })}
    />
  );
}

function Badge({ row, icon }: { row: KillRow; icon?: ReactNode }) {
  const role = row.role ?? "";
  const color = classColors[role];
  if (!color) {
    return (
      <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
        {icon}
        {row.playerClass}
      </span>
    );
  }
  return (
    <span
      className="inline-flex items-center gap-1 rounded-full px-2 py-px text-2xs font-semibold whitespace-nowrap text-background"
      style={{ backgroundColor: color }}
    >
      {icon}
      {row.playerClass || role}
    </span>
  );
}

function SpecIcons({ specs, size }: { specs: string[]; size: number }) {
  return (
    <span className="flex items-center gap-px drop-shadow-[0_1px_1px_rgb(0_0_0/0.6)]">
      {specs.map((id) => (
        <SpecializationIcon key={id} id={id} size={size} />
      ))}
    </span>
  );
}
