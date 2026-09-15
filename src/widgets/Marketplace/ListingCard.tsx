"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Trash2, Pencil, RussianRuble } from "lucide-react";
import { toast } from "sonner";
import { LootIcon } from "@/widgets/Loot/LootBuy/icons/LootIconComponent";
import { deleteMarketplaceListing } from "@/actions/marketplaceActions";
import { MarketplaceListing } from "@/actions/marketplaceActions";
import { ItemType } from "@/widgets/Loot/GuildLoot/LootTypes";
import { ListingFormDialog } from "./ListingFormDialog";
import { Card, CardContent } from "@/shared/ui";
import { Avatar, AvatarImage, AvatarFallback } from "@/shared/ui";
import { Badge } from "@/shared/ui";
import { Button } from "@/shared/ui";
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

export function ListingCard({
  listing,
  itemTypes,
  canEdit,
  canDelete,
  onChanged,
}: {
  listing: MarketplaceListing;
  itemTypes: ItemType[];
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
          {listing.image_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={listing.image_url}
              alt={listing.item_name}
              className="rounded object-cover shrink-0"
              style={{ width: 48, height: 48 }}
            />
          ) : (
            <LootIcon
              itemName={listing.item_name}
              iconUrl={listing.icon_url}
              grade={listing.grade}
              size={48}
            />
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
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
                itemTypes={itemTypes}
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
