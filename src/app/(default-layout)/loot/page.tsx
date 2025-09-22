import { hasTag } from "@/actions/hasTag";
import LootTable from "@/widgets/Loot/GuildLoot/LootTable";
import { cookies } from "next/headers";

const LootPage = async () => {
  const sessionToken = (await cookies()).get("session_token")?.value;
  const isAdmin = await hasTag(sessionToken, ["Администратор"]);
  return (
    <>
      <LootTable isAdmin={isAdmin} />
    </>
  );
};

export default LootPage;
