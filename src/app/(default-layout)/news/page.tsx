import { hasTag } from "@/actions/hasTag";
import { getNews } from "@/actions/news";
import NewsPageClient from "@/widgets/news/NewsPageClient";
import { cookies } from "next/headers";

export default async function NewsPage() {
  const sessionToken = (await cookies()).get("session_token")?.value ?? "";
  const isAdmin = await hasTag(sessionToken, ["Администратор"]);
  const rawItems = await getNews();
  const newsItems = rawItems.map((item) => ({
    ...item,
    date: item.date,
  }));

  return <NewsPageClient isAdmin={isAdmin} items={newsItems} />;
}
