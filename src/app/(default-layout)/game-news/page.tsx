import { getArcheAgeNews } from "@/actions/getArcheAgeNews";
import NewsList from "@/widgets/News/NewsList";

export const revalidate = 1800;

export default async function GameNewsPage() {
  const news = await getArcheAgeNews();

  return (
    <div className="flex min-h-screen flex-col bg-background text-onBackground p-8">
      <h1 className="text-3xl font-bold mb-6 text-primary">Новости</h1>
      <NewsList news={news} />
    </div>
  );
}
