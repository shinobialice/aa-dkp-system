import { hasTag } from "@/src/actions/hasTag";
import LootTable from "@/src/components/Loot/GuildLoot/LootTable";
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
