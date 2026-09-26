import ensurePrivilieges from "@/actions/ensurePrivilieges";
import { Badge } from "@/shared/ui/badge";
import { changelog, type ChangelogEntryType } from "@/shared/config/changelog";

const typeLabels: Record<ChangelogEntryType, string> = {
  feature: "Новое",
  improvement: "Улучшение",
  fix: "Фикс",
};

const typeClasses: Record<ChangelogEntryType, string> = {
  feature: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
  improvement: "bg-sky-500/15 text-sky-600 dark:text-sky-400",
  fix: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
};

const formatDate = (date: string) =>
  new Date(`${date}T00:00:00`).toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

const ChangelogPage = async () => {
  await ensurePrivilieges(["Администратор"]);

  return (
    <div className="flex min-h-screen flex-col bg-background text-onBackground p-8">
      <h1 className="text-3xl font-bold mb-6 text-primary">Список изменений</h1>
      <div className="flex max-w-3xl flex-col gap-8">
        {changelog.map((day) => (
          <section key={day.date}>
            <h2 className="mb-3 border-b pb-2 text-lg font-semibold">
              {formatDate(day.date)}
            </h2>
            <ul className="flex flex-col gap-2">
              {day.entries.map((entry, index) => (
                <li key={index} className="flex items-start gap-3">
                  <Badge
                    className={`mt-0.5 w-24 border-transparent ${typeClasses[entry.type]}`}
                  >
                    {typeLabels[entry.type]}
                  </Badge>
                  <span>{entry.text}</span>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
};

export default ChangelogPage;
