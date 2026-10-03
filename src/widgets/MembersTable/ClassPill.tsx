import { classColors, classIcons } from "./classStyles";

export function ClassPill({ cls }: { cls: string | null }) {
  if (!cls) return <span className="text-muted-foreground">—</span>;
  return (
    <span className="inline-flex h-6 items-center gap-1.5 rounded-full bg-muted px-2.5 text-xs font-medium whitespace-nowrap">
      <span style={{ color: classColors[cls] }} className="[&_svg]:size-3.5">
        {classIcons[cls]}
      </span>
      {cls}
    </span>
  );
}
