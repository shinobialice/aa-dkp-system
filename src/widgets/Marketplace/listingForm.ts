import {
  type MarketplaceCurrency,
  type MarketplaceListing,
  type MarketplaceListingType,
} from "@/actions/marketplaceActions";

export type FormState = {
  listingType: MarketplaceListingType;
  itemName: string;
  quantity: number;
  price: string;
  currency: MarketplaceCurrency;
  description: string;
  imageUrl: string;
};

export function buildInitialForm(listing?: MarketplaceListing): FormState {
  if (!listing) {
    return {
      listingType: "sell",
      itemName: "",
      quantity: 1,
      price: "",
      currency: "gold",
      description: "",
      imageUrl: "",
    };
  }
  return {
    listingType: listing.listing_type,
    itemName: listing.item_name,
    quantity: listing.quantity,
    price: listing.price != null ? String(listing.price) : "",
    currency: listing.currency,
    description: listing.description ?? "",
    imageUrl: listing.image_url ?? "",
  };
}
