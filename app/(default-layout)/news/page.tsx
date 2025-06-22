import { hasTag } from "@/src/actions/hasTag";
import { getNews } from "@/src/actions/news";
import NewsPageClient from "@/src/components/news/NewsPageClient";
import { cookies } from "next/headers";

export default async function NewsPage() {
  const sessionToken = (await cookies()).get("session_token").value;
  const isAdmin = await hasTag(sessionToken, ["Администратор"]);
  const rawItems = await getNews();
  const newsItems = rawItems.map((item) => ({
    ...item,
    date: item.date,
  }));

  return <NewsPageClient isAdmin={isAdmin} items={newsItems} />;
}
