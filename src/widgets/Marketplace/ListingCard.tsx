"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Pencil, ShoppingCart, Tag, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  deleteMarketplaceListing,
  type MarketplaceListing,
} from "@/actions/marketplaceActions";
import type { MarketplaceItemTypeRow } from "@/actions/marketplaceItemTypeAdmin";
import { cn } from "@/shared/lib/tw-merge";
import { LootIcon } from "@/widgets/Loot/LootBuy/icons/LootIconComponent";
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
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/shared/ui";
import { formatListingDate } from "./marketplaceModel";

const GOLD_ICON = "https://archeagecodex.com/items/gold.png";

function ListingPicture({ listing }: { listing: MarketplaceListing }) {
  if (listing.catalog_item_id) {
    return (
      <LootIcon
        itemName={listing.item_name}
        iconUrl={listing.catalog_icon_url}
        grade={listing.catalog_grade}
        size={48}
      />
    );
  }
  if (listing.image_url) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={listing.image_url}
            alt={listing.item_name}
            className="size-12 shrink-0 rounded-md bg-muted object-cover"
          />
        </TooltipTrigger>
        <TooltipContent side="right" className="p-1">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={listing.image_url}
            alt={listing.item_name}
            className="max-h-80 max-w-80 rounded object-contain"
          />
        </TooltipContent>
      </Tooltip>
    );
  }
  const isBuy = listing.listing_type === "buy";
  const Icon = isBuy ? ShoppingCart : Tag;
  return (
    <span
      className={cn(
        "flex size-12 shrink-0 items-center justify-center rounded-md",
        isBuy
          ? "bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300"
          : "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",
      )}
    >
      <Icon className="size-5" />
    </span>
  );
}

function ListingPrice({ listing }: { listing: MarketplaceListing }) {
  if (listing.price === null) {
    return (
      <span className="text-[15px] font-semibold text-muted-foreground">
        Договорная
        {listing.currency === "rub" && (
          <span className="text-xs font-medium"> · в рублях</span>
        )}
      </span>
    );
  }
  const amount = listing.price.toLocaleString("ru-RU");
  if (listing.currency === "rub") {
    return <span className="text-lg font-bold tabular-nums">{amount} ₽</span>;
  }
  return (
    <span className="flex items-center gap-1.5 text-lg font-bold tabular-nums">
      <Image src={GOLD_ICON} alt="" width={16} height={16} />
      {amount}
    </span>
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
        error instanceof Error
          ? error.message
          : "Не удалось удалить объявление",
      );
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
            <h3 className="text-[15px] leading-snug font-semibold break-words">
              {listing.item_name}
            </h3>
            {listing.quantity > 1 && (
              <span className="text-[12.5px] font-semibold text-muted-foreground tabular-nums">
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
        <p className="text-[13px] break-words whitespace-pre-wrap text-muted-foreground">
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
              src={
                listing.seller_avatar_url ??
                `https://api.dicebear.com/6.x/initials/svg?seed=${listing.seller_username}`
              }
              alt=""
            />
            <AvatarFallback className="text-[10px]">
              {listing.seller_username.slice(0, 1)}
            </AvatarFallback>
          </Avatar>
          <span className="truncate text-[13px] font-medium">
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
            className="ml-auto inline-flex h-8 shrink-0 items-center rounded-lg bg-blue-50 px-2.5 text-[12.5px] font-semibold text-blue-700 transition-colors hover:bg-blue-100 dark:bg-blue-500/15 dark:text-blue-300 dark:hover:bg-blue-500/25"
          >
            Написать в VK
          </a>
        )}
      </div>
    </article>
  );
}
