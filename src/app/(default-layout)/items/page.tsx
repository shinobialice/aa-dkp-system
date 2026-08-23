import ensurePrivilieges from "@/actions/ensurePrivilieges";
import { ItemsPageContainer } from "@/widgets/items/ItemsPageContainer";

export default async function ItemsPage() {
  await ensurePrivilieges(["Администратор"]);

  return (
    <div className="max-w-6xl mx-auto mt-10">
      <ItemsPageContainer />
    </div>
  );
}
