import { sectionById, type SectionId } from "../settingsSections";

export default function Section({
  id,
  active,
  children,
}: {
  id: SectionId;
  active: boolean;
  children: React.ReactNode;
}) {
  const meta = sectionById(id);
  return (
    <section hidden={!active} aria-labelledby={`settings-${id}`}>
      <div className="flex flex-col gap-4">
        <div>
          <h2 id={`settings-${id}`} className="text-xl font-semibold">
            {meta.label}
          </h2>
          <p className="mt-0.5 text-sm text-muted-foreground">
            {meta.description}
          </p>
        </div>
        {children}
      </div>
    </section>
  );
}
