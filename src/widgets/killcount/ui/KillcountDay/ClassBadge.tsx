import { cloneElement } from "react";
import { classColors, classIcons } from "@/widgets/MembersTable/classStyles";
import { type KillRow } from "../killcountModel";

export default function ClassBadge({ row }: { row: KillRow }) {
  const role = row.role ?? "";
  const color = classColors[role];
  if (!color) {
    return (
      <span className="text-xs text-muted-foreground">{row.playerClass}</span>
    );
  }
  const icon = classIcons[role];
  return (
    <span
      className="inline-flex items-center gap-1 rounded-full px-2 py-px text-2xs font-semibold whitespace-nowrap text-background"
      style={{ backgroundColor: color }}
    >
      {icon && cloneElement(icon, { className: "size-3" })}
      {row.playerClass || role}
    </span>
  );
}
