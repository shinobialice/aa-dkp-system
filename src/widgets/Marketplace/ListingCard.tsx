"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Trash2, Pencil, RussianRuble, ShoppingCart, Tag } from "lucide-react";
import { toast } from "sonner";
import { deleteMarketplaceListing } from "@/actions/marketplaceActions";
import { MarketplaceListing } from "@/actions/marketplaceActions";
import { MarketplaceItemTypeRow } from "@/actions/marketplaceItemTypeAdmin";
import { LootIcon } from "@/widgets/Loot/LootBuy/icons/LootIconComponent";
import { ListingFormDialog } from "./ListingFormDialog";
import { Card, CardContent } from "@/shared/ui";
import { Avatar, AvatarImage, AvatarFallback } from "@/shared/ui";
import { Badge } from "@/shared/ui";
import { Button } from "@/shared/ui";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/shared/ui";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/shared/ui";

// Заглушка вместо картинки, когда её вообще нет ни у объявления (свой
// предмет без фото), ни у выбранного предмета каталога (marketplace_item_type
// без иконки) — показывает суть объявления (куплю/продам) вместо пустого
// места.
function ListingTypeIcon({
  listingType,
  size,
}: {
  listingType: MarketplaceListing["listing_type"];
  size: number;
}) {
  const isBuy = listingType === "buy";
  const Icon = isBuy ? ShoppingCart : Tag;
  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded ${
        isBuy
          ? "bg-blue-500/15 text-blue-600 dark:text-blue-400"
          : "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
      }`}
      style={{ width: size, height: size }}
    >
      <Icon style={{ width: size * 0.5, height: size * 0.5 }} />
    </div>
  );
}

export function ListingCard({
  listing,
  catalogItems,
  canEdit,
  canDelete,
  onChanged,
}: {
  listing: MarketplaceListing;
  catalogItems: MarketplaceItemTypeRow[];
  canEdit: boolean;
  canDelete: boolean;
  onChanged: () => void;
}) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  const vkHref = listing.seller_vk_name
    ? `https://vk.ru/${listing.seller_vk_name}`
    : listing.seller_vk_id
      ? `https://vk.com/id${listing.seller_vk_id}`
      : null;

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteMarketplaceListing(listing.id);
      toast.success("Объявление удалено");
      onChanged();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Не удалось удалить объявление",
      );
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Card className="relative">
      <CardContent className="flex flex-col gap-3">
        <div className="flex items-start gap-3">
          {listing.catalog_item_id ? (
            <LootIcon
              itemName={listing.item_name}
              iconUrl={listing.catalog_icon_url}
              grade={listing.catalog_grade}
              size={48}
            />
          ) : listing.image_url ? (
            <Tooltip>
              <TooltipTrigger asChild>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={listing.image_url}
                  alt={listing.item_name}
                  className="rounded object-cover shrink-0"
                  style={{ width: 48, height: 48 }}
                />
              </TooltipTrigger>
              <TooltipContent side="right" className="p-1">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={listing.image_url}
                  alt={listing.item_name}
                  className="rounded object-contain"
                  style={{ maxWidth: 320, maxHeight: 320 }}
                />
              </TooltipContent>
            </Tooltip>
          ) : (
            <ListingTypeIcon listingType={listing.listing_type} size={48} />
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant={listing.listing_type === "buy" ? "default" : "secondary"}>
                {listing.listing_type === "buy" ? "Куплю" : "Продам"}
              </Badge>
              <span className="font-semibold truncate">{listing.item_name}</span>
              {listing.quantity > 1 && (
                <Badge variant="secondary">x{listing.quantity}</Badge>
              )}
            </div>
            <div className="flex items-center gap-1.5 text-lg font-bold text-primary">
              {listing.price !== null ? (
                <>
                  {listing.currency === "gold" ? (
                    <Image
                      src="https://archeagecodex.com/items/gold.png"
                      alt=""
                      width={18}
                      height={18}
                    />
                  ) : (
                    <RussianRuble className="h-4 w-4" />
                  )}
                  {listing.price.toLocaleString("ru-RU")}
                </>
              ) : (
                "Договорная"
              )}
            </div>
          </div>
        </div>

        {listing.description && (
          <p className="text-sm text-muted-foreground whitespace-pre-wrap break-words">
            {listing.description}
          </p>
        )}

        <div className="flex items-center justify-between pt-2 border-t gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <button
              type="button"
              onClick={() => router.push(`/profile/${listing.user_id}`)}
              className="flex items-center gap-2 cursor-pointer min-w-0"
            >
              <Avatar className="h-6 w-6 shrink-0">
                <AvatarImage src={listing.seller_avatar_url ?? undefined} />
                <AvatarFallback>{listing.seller_username[0]}</AvatarFallback>
              </Avatar>
              <span className="text-sm truncate">{listing.seller_username}</span>
            </button>
            {vkHref && (
              <a
                href={vkHref}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-primary hover:underline shrink-0"
              >
                VK
              </a>
            )}
          </div>
          <span className="text-xs text-muted-foreground shrink-0">
            {new Date(listing.created_at).toLocaleDateString("ru-RU")}
          </span>
        </div>

        {(canEdit || canDelete) && (
          <div className="absolute top-2 right-2 flex gap-1">
            {canEdit && (
              <ListingFormDialog
                catalogItems={catalogItems}
                listing={listing}
                onSaved={onChanged}
                trigger={
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground cursor-pointer"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                }
              />
            )}
            {canDelete && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground cursor-pointer"
                    disabled={deleting}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Удалить объявление?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Это действие нельзя отменить.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Отмена</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete}>
                      Удалить
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
