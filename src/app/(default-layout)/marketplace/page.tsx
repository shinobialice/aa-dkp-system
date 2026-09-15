import { cookies } from "next/headers";
import { getMarketplaceListings } from "@/actions/marketplaceActions";
import { getItemTypes } from "@/actions/lootActions";
import { getSessionUserId } from "@/actions/getSessionUserId";
import { hasTag } from "@/actions/hasTag";
import { MarketplaceBoard } from "@/widgets/Marketplace/MarketplaceBoard";

export default async function MarketplacePage() {
  const sessionToken = (await cookies()).get("session_token")?.value ?? "";
  const [listings, itemTypes, currentUserId, isAdmin] = await Promise.all([
    getMarketplaceListings(),
    getItemTypes(),
    getSessionUserId(),
    hasTag(sessionToken, ["Администратор"]),
  ]);

  return (
    <div className="flex min-h-screen flex-col bg-background text-onBackground p-8">
      <h1 className="text-3xl font-bold mb-2 text-primary">
        Доска объявлений
      </h1>
      <p className="text-sm text-muted-foreground mb-6">
        Продажа предметов между участниками гильдии.
      </p>
      <MarketplaceBoard
        initialListings={listings}
        itemTypes={itemTypes}
        currentUserId={currentUserId}
        isAdmin={isAdmin}
      />
    </div>
  );
}
