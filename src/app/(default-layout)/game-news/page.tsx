import { getArcheAgeNews } from "@/actions/getArcheAgeNews";
import NewsList from "@/widgets/News/NewsList";

export const revalidate = 1800;

export default async function GameNewsPage() {
  const news = await getArcheAgeNews();
  return <NewsList news={news} />;
}
