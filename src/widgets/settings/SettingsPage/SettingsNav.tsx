import { cn } from "@/shared/lib/tw-merge";
import { useDirtySections } from "../settingsDraft";
import { SECTION_GROUPS, type SectionId } from "../settingsSections";
import { useNavHints } from "./useNavHints";

export default function SettingsNav({
  active,
  onOpen,
}: {
  active: SectionId | null;
  onOpen: (id: SectionId) => void;
}) {
  const dirty = useDirtySections();
  const hints = useNavHints();

  return (
    <nav
      aria-label="Разделы настроек"
      className="-mx-4 flex gap-1.5 overflow-x-auto px-4 [scrollbar-width:none] md:sticky md:top-6 md:mx-0 md:flex-col md:gap-3.5 md:overflow-visible md:px-0"
    >
      {SECTION_GROUPS.map((group) => (
        <div key={group.title || "top"} className="contents md:block">
          {group.title && (
            <h3 className="mb-1 hidden px-2.5 text-2xs font-semibold tracking-wider text-muted-foreground uppercase md:block">
              {group.title}
            </h3>
          )}
          {group.sections.map((section) => {
            const current = active === section.id;
            return (
              <button
                key={section.id}
                type="button"
                aria-current={current ? "page" : undefined}
                onClick={() => onOpen(section.id)}
                className={cn(
                  "flex shrink-0 cursor-pointer items-center gap-2 rounded-full border px-3 py-1.5 text-left text-sm whitespace-nowrap transition-colors hover:bg-muted md:grid md:w-full md:grid-cols-[1rem_minmax(0,1fr)_auto] md:gap-x-2.5 md:gap-y-0 md:rounded-lg md:border-0 md:px-2.5 md:py-1.5",
                  current && "bg-muted font-semibold",
                )}
              >
                <section.icon className="size-4 text-muted-foreground" />
                <span className="truncate md:text-sm">{section.label}</span>
                {dirty[section.id] ? (
                  <span
                    className="size-2 rounded-full bg-amber-500"
                    title="Есть несохранённые изменения"
                  />
                ) : (
                  <span />
                )}
                {hints[section.id] && (
                  <span className="col-start-2 col-end-4 hidden truncate text-2xs font-normal text-muted-foreground md:block">
                    {hints[section.id]}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      ))}
    </nav>
  );
}
