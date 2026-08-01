import { ArchNewsItem } from "@/actions/getArcheAgeNews";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui";

type Props = { news: ArchNewsItem[] };

export default function NewsList({ news }: Props) {
  if (news.length === 0) {
    return (
      <p className="text-muted-foreground">
        Не удалось загрузить новости с archeage.ru. Попробуйте зайти позже.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {news.map((item) => (
        <a key={item.id} href={item.url} target="_blank" rel="noopener noreferrer">
          <Card className="flex-row items-center gap-4 transition hover:border-primary hover:shadow-md">
            {item.image && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={item.image}
                alt={item.title}
                className="ml-6 h-24 w-32 shrink-0 rounded-lg object-cover"
              />
            )}
            <div className="min-w-0 flex-1">
              <CardHeader>
                <CardTitle className="text-base">{item.title}</CardTitle>
                {item.date && (
                  <div className="text-xs text-muted-foreground">
                    {item.date}
                  </div>
                )}
              </CardHeader>
              {item.teaser && (
                <CardContent className="text-sm text-muted-foreground line-clamp-2">
                  {item.teaser}
                </CardContent>
              )}
            </div>
          </Card>
        </a>
      ))}
    </div>
  );
}
