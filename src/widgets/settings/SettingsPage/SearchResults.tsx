import { ChevronRight } from "lucide-react";
import { sectionById, type SectionId } from "../settingsSections";
import { SEARCH_INDEX } from "../settingsSearchIndex";

export default function SearchResults({
  query,
  onOpen,
}: {
  query: string;
  onOpen: (id: SectionId) => void;
}) {
  const term = query.trim().toLowerCase();
  const hits = SEARCH_INDEX.filter(
    (item) =>
      item.label.toLowerCase().includes(term) ||
      item.keywords?.includes(term) ||
      sectionById(item.section).label.toLowerCase().includes(term),
  );
  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="text-xl font-semibold">Поиск</h2>
        <p className="text-sm text-muted-foreground">«{query.trim()}»</p>
      </div>
      <div className="divide-y overflow-hidden rounded-xl border bg-card">
        {hits.length === 0 ? (
          <p className="px-4 py-6 text-sm text-muted-foreground">
            Ничего не найдено
          </p>
        ) : (
          hits.map((hit) => (
            <button
              key={`${hit.section}-${hit.label}`}
              type="button"
              onClick={() => onOpen(hit.section)}
              className="flex w-full cursor-pointer items-center justify-between gap-3 px-4 py-2.5 text-left hover:bg-muted/50"
            >
              <span>
                <span className="block font-medium">{hit.label}</span>
                <span className="text-xs text-muted-foreground">
                  {sectionById(hit.section).label}
                </span>
              </span>
              <ChevronRight className="size-4 text-muted-foreground" />
            </button>
          ))
        )}
      </div>
    </div>
  );
}
