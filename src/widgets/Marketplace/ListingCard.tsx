"use client";

import { useState } from "react";
import Link from "next/link";
import { Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  deleteMarketplaceListing,
  type MarketplaceListing,
} from "@/actions/marketplaceActions";
import type { MarketplaceItemTypeRow } from "@/actions/marketplaceItemTypeAdmin";
import { ListingFormDialog } from "./ListingFormDialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
} from "@/shared/ui";
import { formatListingDate } from "./marketplaceModel";
import { avatarSrc, vkProfileUrl } from "@/shared/lib/format";
import ListingPicture from "./ListingPicture";
import ListingPrice from "./ListingPrice";
import { errorMessage } from "@/shared/lib/errorMessage";

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
  const [deleting, setDeleting] = useState(false);

  const vkHref = vkProfileUrl(listing.seller_vk_name, listing.seller_vk_id);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteMarketplaceListing(listing.id);
      toast.success("Объявление удалено");
      onChanged();
    } catch (error) {
      toast.error(errorMessage(error, "Не удалось удалить объявление"));
    } finally {
      setDeleting(false);
    }
  };

  return (
    <article className="flex flex-col gap-2.5 rounded-xl border bg-card px-3.5 py-3">
      <div className="flex gap-3">
        <ListingPicture listing={listing} />
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <div className="flex min-w-0 flex-wrap items-baseline gap-x-1.5">
            <h3 className="text-base leading-snug font-semibold break-words">
              {listing.item_name}
            </h3>
            {listing.quantity > 1 && (
              <span className="text-xs font-semibold text-muted-foreground tabular-nums">
                × {listing.quantity.toLocaleString("ru-RU")}
              </span>
            )}
          </div>
          <ListingPrice listing={listing} />
        </div>
        {(canEdit || canDelete) && (
          <div className="-mt-1 -mr-1.5 flex shrink-0 items-start">
            {canEdit && (
              <ListingFormDialog
                catalogItems={catalogItems}
                listing={listing}
                onSaved={onChanged}
                trigger={
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Изменить объявление"
                    className="size-8 cursor-pointer text-muted-foreground"
                  >
                    <Pencil />
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
                    aria-label="Удалить объявление"
                    className="size-8 cursor-pointer text-muted-foreground hover:text-destructive"
                    disabled={deleting}
                  >
                    <Trash2 />
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
      </div>

      {listing.description && (
        <p className="text-sm break-words whitespace-pre-wrap text-muted-foreground">
          {listing.description}
        </p>
      )}

      <div className="flex items-center gap-2 border-t pt-2.5">
        <Link
          href={`/profile/${listing.user_id}`}
          className="flex min-w-0 items-center gap-1.5 hover:underline"
        >
          <Avatar className="size-6 shrink-0">
            <AvatarImage
              src={avatarSrc(
                listing.seller_username,
                listing.seller_avatar_url,
              )}
              alt=""
            />
            <AvatarFallback className="text-2xs">
              {listing.seller_username.slice(0, 1)}
            </AvatarFallback>
          </Avatar>
          <span className="truncate text-sm font-medium">
            {listing.seller_username}
          </span>
        </Link>
        <span className="shrink-0 text-xs text-muted-foreground">
          · {formatListingDate(listing.created_at)}
        </span>
        {vkHref && (
          <a
            href={vkHref}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-auto inline-flex h-8 shrink-0 items-center rounded-lg bg-blue-50 px-2.5 text-xs font-semibold text-blue-700 transition-colors hover:bg-blue-100 dark:bg-blue-500/15 dark:text-blue-300 dark:hover:bg-blue-500/25"
          >
            Написать в VK
          </a>
        )}
      </div>
    </article>
  );
}
