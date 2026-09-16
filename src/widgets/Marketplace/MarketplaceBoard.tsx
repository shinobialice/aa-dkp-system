"use client";

import { useMemo, useState } from "react";
import { Plus, ShoppingCart, Tag } from "lucide-react";
import { MarketplaceListing, getMarketplaceListings } from "@/actions/marketplaceActions";
import { MarketplaceItemTypeRow } from "@/actions/marketplaceItemTypeAdmin";
import { Button } from "@/shared/ui";
import { ListingFormDialog } from "./ListingFormDialog";
import { ListingCard } from "./ListingCard";

function ListingColumn({
  title,
  icon,
  listings,
  catalogItems,
  currentUserId,
  isAdmin,
  onChanged,
}: {
  title: string;
  icon: React.ReactNode;
  listings: MarketplaceListing[];
  catalogItems: MarketplaceItemTypeRow[];
  currentUserId: number | null;
  isAdmin: boolean;
  onChanged: () => void;
}) {
  return (
    <div className="flex flex-col gap-4 flex-1 min-w-0">
      <div className="flex items-center gap-2 font-semibold text-lg">
        {icon}
        {title}
      </div>
      {listings.length === 0 ? (
        <div className="text-muted-foreground text-sm">
          Нет объявлений в этой категории.
        </div>
      ) : (
        <div className="flex flex-col gap-4 overflow-y-auto max-h-[calc(100vh-260px)] pr-1">
          {listings.map((listing) => (
            <ListingCard
              key={listing.id}
              listing={listing}
              catalogItems={catalogItems}
              canEdit={listing.user_id === currentUserId}
              canDelete={isAdmin || listing.user_id === currentUserId}
              onChanged={onChanged}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function MarketplaceBoard({
  initialListings,
  catalogItems,
  currentUserId,
  isAdmin,
}: {
  initialListings: MarketplaceListing[];
  catalogItems: MarketplaceItemTypeRow[];
  currentUserId: number | null;
  isAdmin: boolean;
}) {
  const [listings, setListings] = useState(initialListings);

  const refresh = async () => {
    setListings(await getMarketplaceListings());
  };

  const sellListings = useMemo(
    () => listings.filter((listing) => listing.listing_type === "sell"),
    [listings],
  );
  const buyListings = useMemo(
    () => listings.filter((listing) => listing.listing_type === "buy"),
    [listings],
  );

  return (
    <div className="flex flex-col gap-6">
      <div>
        <ListingFormDialog
          catalogItems={catalogItems}
          onSaved={refresh}
          trigger={
            <Button className="cursor-pointer gap-1.5">
              <Plus className="h-4 w-4" />
              Разместить объявление
            </Button>
          }
        />
      </div>

      {listings.length === 0 ? (
        <div className="text-muted-foreground text-sm">
          Пока нет ни одного объявления.
        </div>
      ) : (
        <div className="flex flex-col md:flex-row gap-6">
          <ListingColumn
            title="Продам"
            icon={<Tag className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />}
            listings={sellListings}
            catalogItems={catalogItems}
            currentUserId={currentUserId}
            isAdmin={isAdmin}
            onChanged={refresh}
          />
          <div className="hidden md:block w-px bg-border" />
          <ListingColumn
            title="Куплю"
            icon={<ShoppingCart className="h-5 w-5 text-blue-600 dark:text-blue-400" />}
            listings={buyListings}
            catalogItems={catalogItems}
            currentUserId={currentUserId}
            isAdmin={isAdmin}
            onChanged={refresh}
          />
        </div>
      )}
    </div>
  );
}
