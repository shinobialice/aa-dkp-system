import { ArrowUpRight } from "lucide-react";
import type { ArchNewsItem } from "@/actions/getArcheAgeNews";

const ARCHEAGE_NEWS_URL = "https://archeage.ru/news/";
const MSK_OFFSET_MS = 3 * 60 * 60 * 1000;
const DAY_MS = 24 * 60 * 60 * 1000;

type NewsGroup = {
  key: number;
  label: string;
  sub: string | null;
  items: ArchNewsItem[];
};

function parseDate(date: string) {
  const [day, month, year] = date.split(".").map(Number);
  if (!day || !month || !year) return null;
  return Date.UTC(year, month - 1, day);
}

function longDate(time: number) {
  return new Date(time).toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
    timeZone: "UTC",
  });
}

function groupNews(news: ArchNewsItem[]): NewsGroup[] {
  const now = Date.now() + MSK_OFFSET_MS;
  const today = Date.UTC(
    new Date(now).getUTCFullYear(),
    new Date(now).getUTCMonth(),
    new Date(now).getUTCDate(),
  );
  const sorted = news
    .map((item, index) => ({ item, index, time: parseDate(item.date) }))
    .sort(
      (a, b) =>
        (b.time ?? -Infinity) - (a.time ?? -Infinity) || a.index - b.index,
    );

  const groups: NewsGroup[] = [];
  for (const { item, time } of sorted) {
    const key = time ?? 0;
    let group = groups[groups.length - 1];
    if (!group || group.key !== key) {
      const relative = relativeDayLabel(time, today);
      group = {
        key,
        label: relative ?? (time ? longDate(time) : "Без даты"),
        sub: relative && time ? longDate(time) : null,
        items: [],
      };
      groups.push(group);
    }
    group.items.push(item);
  }
  return groups;
}

function AllNewsLink({ className }: { className: string }) {
  return (
    <a
      href={ARCHEAGE_NEWS_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
    >
      Все новости на archeage.ru
      <ArrowUpRight className="size-3.5" />
    </a>
  );
}

export default function NewsList({ news }: { news: ArchNewsItem[] }) {
  const groups = groupNews(news);

  return (
    <div className="@container/news mx-auto flex w-full max-w-6xl min-w-0 flex-col gap-5 text-sm">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Новости</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Последние новости ArcheAge с archeage.ru · обновляются каждые
            полчаса
          </p>
        </div>
        <AllNewsLink className="hidden h-9 items-center gap-1.5 rounded-lg border px-3 text-sm font-medium transition-colors hover:bg-muted sm:inline-flex" />
      </div>

      {groups.length === 0 ? (
        <p className="rounded-xl border border-dashed px-4 py-8 text-center text-muted-foreground">
          Не удалось загрузить новости с archeage.ru. Попробуйте зайти позже.
        </p>
      ) : (
        groups.map((group) => (
          <section
            key={group.key}
            aria-label={group.label}
            className="flex flex-col gap-2.5"
          >
            <h2 className="flex items-baseline gap-2 text-base font-bold">
              {group.label}
              {group.sub && (
                <span className="text-sm font-medium text-muted-foreground">
                  {group.sub}
                </span>
              )}
            </h2>
            <div className="grid gap-3 @[52rem]/news:grid-cols-2">
              {group.items.map((item) => (
                <a
                  key={item.id}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex gap-3 rounded-xl border bg-card p-3 transition-colors hover:border-primary/60 hover:bg-muted/30 @[30rem]/news:gap-3.5"
                >
                  {item.image && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={item.image}
                      alt=""
                      loading="lazy"
                      className="h-17.5 w-24 shrink-0 rounded-lg bg-muted object-cover @[30rem]/news:h-25.5 @[30rem]/news:w-35"
                    />
                  )}
                  <span className="flex min-w-0 flex-col gap-1">
                    <span className="text-sm leading-snug font-bold group-hover:underline @[30rem]/news:text-base">
                      {item.title}
                    </span>
                    {item.teaser && (
                      <span className="line-clamp-2 text-xs leading-relaxed text-muted-foreground @[30rem]/news:line-clamp-3 @[30rem]/news:text-sm">
                        {item.teaser}
                      </span>
                    )}
                    <span className="mt-auto hidden items-center gap-1 pt-0.5 text-xs font-semibold text-primary @[30rem]/news:inline-flex">
                      Читать
                      <ArrowUpRight className="size-3.5" />
                    </span>
                  </span>
                </a>
              ))}
            </div>
          </section>
        ))
      )}

      <AllNewsLink className="flex h-11 items-center justify-center gap-1.5 rounded-xl border text-sm font-medium transition-colors hover:bg-muted sm:hidden" />
    </div>
  );
}

function relativeDayLabel(time: number | null, today: number) {
  if (time === today) return "Сегодня";
  if (time === today - DAY_MS) return "Вчера";
  return null;
}
