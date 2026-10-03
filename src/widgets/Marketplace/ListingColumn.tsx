import type { ReactNode } from "react";
import type {
  MarketplaceListing,
  MarketplaceListingType,
} from "@/actions/marketplaceActions";
import type { MarketplaceItemTypeRow } from "@/actions/marketplaceItemTypeAdmin";
import { cn } from "@/shared/lib/tw-merge";
import { ListingCard } from "./ListingCard";

export type BoardColumn = {
  type: MarketplaceListingType;
  title: string;
  icon: ReactNode;
  iconClass: string;
};

type Props = {
  column: BoardColumn;
  listings: MarketplaceListing[];
  catalogItems: MarketplaceItemTypeRow[];
  currentUserId: number | null;
  isAdmin: boolean;
  filtered: boolean;
  onChanged: () => void;
};

export default function ListingColumn({
  column,
  listings,
  catalogItems,
  currentUserId,
  isAdmin,
  filtered,
  onChanged,
}: Props) {
  return (
    <section
      aria-label={column.title}
      className="flex min-w-0 flex-col gap-2.5"
    >
      <h2 className="hidden items-center gap-2 text-base font-bold @[48rem]/board:flex">
        <span
          className={cn(
            "flex size-6.5 items-center justify-center rounded-lg",
            column.iconClass,
          )}
        >
          {column.icon}
        </span>
        {column.title}
        <span className="text-sm font-medium text-muted-foreground">
          {listings.length}
        </span>
      </h2>
      {listings.length === 0 && (
        <p className="rounded-xl border border-dashed px-4 py-6 text-center text-sm text-muted-foreground">
          {filtered ? "Ничего не найдено" : "Пока нет объявлений"}
        </p>
      )}
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
    </section>
  );
}
