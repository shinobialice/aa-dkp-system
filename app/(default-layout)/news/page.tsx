import { getNews } from "@/src/actions/news";
import NewsPageClient from "@/src/components/news/NewsPageClient";

export default async function NewsPage() {
  const rawItems = await getNews();

  const newsItems = rawItems.map((item) => ({
    ...item,
    date: item.date.toISOString(),
  }));

  return <NewsPageClient items={newsItems} />;
}
