import { type DisplaySkill } from "./skillBuildModel";

export default function SkillTooltipBody({
  skill,
  kind,
}: {
  skill: DisplaySkill;
  kind: "active" | "passive";
}) {
  return (
    <div className="w-72 space-y-1.5 text-left whitespace-normal">
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm font-semibold">{skill.name}</span>
        <span className="text-2xs font-medium tracking-wide text-muted-foreground uppercase">
          {kind === "active" ? "Активное" : "Пассивное"}
        </span>
      </div>
      {skill.meta.length > 0 && (
        <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-2xs text-muted-foreground">
          {skill.meta.map((m) => (
            <span key={m}>{m}</span>
          ))}
        </div>
      )}
      <div
        className="text-xs leading-snug"
        dangerouslySetInnerHTML={{ __html: skill.description }}
      />
    </div>
  );
}
