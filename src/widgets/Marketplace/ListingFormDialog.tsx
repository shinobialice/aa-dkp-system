"use client";

import { useState } from "react";
import Image from "next/image";
import { RussianRuble, ShoppingCart, Tag, Package } from "lucide-react";
import { toast } from "sonner";
import { MarketplaceItemSelector } from "./MarketplaceItemSelector";
import { IconField } from "@/widgets/items/IconField";
import { MarketplaceItemTypeRow } from "@/actions/marketplaceItemTypeAdmin";
import {
  createMarketplaceListing,
  updateMarketplaceListing,
  uploadMarketplaceListingImage,
  MarketplaceCurrency,
  MarketplaceListing,
  MarketplaceListingType,
} from "@/actions/marketplaceActions";
import { Button } from "@/shared/ui";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/shared/ui";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/shared/ui";
import { Input } from "@/shared/ui";
import { Label } from "@/shared/ui";
import { Textarea } from "@/shared/ui";

type FormState = {
  listingType: MarketplaceListingType;
  itemName: string;
  quantity: number;
  price: string;
  currency: MarketplaceCurrency;
  description: string;
  imageUrl: string;
};

function buildInitialForm(listing?: MarketplaceListing): FormState {
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

export function ListingFormDialog({
  catalogItems,
  onSaved,
  listing,
  trigger,
}: {
  catalogItems: MarketplaceItemTypeRow[];
  onSaved: () => void;
  listing?: MarketplaceListing;
  trigger: React.ReactNode;
}) {
  const isEdit = !!listing;
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<"catalog" | "custom">(
    !listing || listing.catalog_item_id ? "catalog" : "custom",
  );
  const [form, setForm] = useState<FormState>(() => buildInitialForm(listing));
  const [submitting, setSubmitting] = useState(false);

  const selectedCatalogItem = catalogItems.find(
    (item) => item.name === form.itemName,
  );

  const reset = () => {
    setForm(buildInitialForm(listing));
    setMode(!listing || listing.catalog_item_id ? "catalog" : "custom");
  };

  const handleSubmit = async () => {
    const price = form.price.trim() ? Number(form.price) : null;
    if (price !== null && (Number.isNaN(price) || price < 0)) {
      toast.error("Некорректная цена");
      return;
    }

    setSubmitting(true);
    try {
      const input = {
        listingType: form.listingType,
        catalogItemId: mode === "catalog" ? (selectedCatalogItem?.id ?? null) : null,
        itemName: form.itemName,
        quantity: form.quantity,
        price,
        currency: form.currency,
        description: form.description || null,
        imageUrl: mode === "custom" ? form.imageUrl || null : null,
      };
      if (isEdit) {
        await updateMarketplaceListing(listing.id, input);
        toast.success("Объявление обновлено");
      } else {
        await createMarketplaceListing(input);
        toast.success("Объявление размещено");
      }
      setOpen(false);
      onSaved();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Не удалось сохранить объявление",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        setOpen(o);
        if (!o) reset();
      }}
    >
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent aria-describedby={undefined} className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Редактировать объявление" : "Новое объявление"}
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-3">
          <div className="flex rounded-md border p-1 gap-1">
            <Button
              type="button"
              variant={form.listingType === "sell" ? "default" : "ghost"}
              className="flex-1 cursor-pointer gap-1.5"
              onClick={() => setForm((prev) => ({ ...prev, listingType: "sell" }))}
            >
              <Tag className="h-4 w-4" />
              Продам
            </Button>
            <Button
              type="button"
              variant={form.listingType === "buy" ? "default" : "ghost"}
              className="flex-1 cursor-pointer gap-1.5"
              onClick={() => setForm((prev) => ({ ...prev, listingType: "buy" }))}
            >
              <ShoppingCart className="h-4 w-4" />
              Куплю
            </Button>
          </div>

          <Tabs
            value={mode}
            onValueChange={(v) => {
              setMode(v as "catalog" | "custom");
              setForm((prev) => ({ ...prev, itemName: "", imageUrl: "" }));
            }}
          >
            <TabsList className="w-full">
              <TabsTrigger value="catalog">Предмет из базы</TabsTrigger>
              <TabsTrigger value="custom">Свой предмет</TabsTrigger>
            </TabsList>

            <TabsContent value="catalog" className="flex flex-col gap-2 pt-2">
              <Label>Предмет</Label>
              {form.itemName && (
                <div className="flex items-center gap-2">
                  {selectedCatalogItem?.icon_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={selectedCatalogItem.icon_url}
                      alt=""
                      className="rounded object-cover"
                      style={{ width: 32, height: 32 }}
                    />
                  ) : (
                    <Package className="size-8 text-muted-foreground" />
                  )}
                  <span className="font-medium">{form.itemName}</span>
                </div>
              )}
              <MarketplaceItemSelector
                value={form.itemName}
                onSelect={(name) => setForm((prev) => ({ ...prev, itemName: name }))}
                catalogItems={catalogItems}
              />
            </TabsContent>

            <TabsContent value="custom" className="flex flex-col gap-2 pt-2">
              <Label>Название предмета</Label>
              <Input
                value={form.itemName}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, itemName: e.target.value }))
                }
                placeholder="Например: Голду"
              />
              <IconField
                value={form.imageUrl}
                onChange={(url) =>
                  setForm((prev) => ({ ...prev, imageUrl: url }))
                }
                uploadAction={uploadMarketplaceListingImage}
                label="Фото предмета (необязательно)"
                size={64}
              />
            </TabsContent>
          </Tabs>

          <Label className="pt-2">Количество</Label>
          <Input
            type="number"
            min={1}
            value={form.quantity}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                quantity: Math.max(1, Number(e.target.value) || 1),
              }))
            }
          />

          <Label>Цена (необязательно)</Label>
          <div className="flex gap-2">
            <Input
              type="number"
              min={0}
              value={form.price}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, price: e.target.value }))
              }
              placeholder="Оставьте пустым, если цена договорная"
            />
            <div className="flex rounded-md border p-1 gap-1 shrink-0">
              <Button
                type="button"
                size="sm"
                variant={form.currency === "gold" ? "default" : "ghost"}
                className="cursor-pointer gap-1.5 px-2"
                onClick={() => setForm((prev) => ({ ...prev, currency: "gold" }))}
              >
                <Image
                  src="https://archeagecodex.com/items/gold.png"
                  alt=""
                  width={16}
                  height={16}
                />
                Голда
              </Button>
              <Button
                type="button"
                size="sm"
                variant={form.currency === "rub" ? "default" : "ghost"}
                className="cursor-pointer gap-1.5 px-2"
                onClick={() => setForm((prev) => ({ ...prev, currency: "rub" }))}
              >
                <RussianRuble className="h-4 w-4" />
                Рубли
              </Button>
            </div>
          </div>

          <Label>Комментарий</Label>
          <Textarea
            value={form.description}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, description: e.target.value }))
            }
            placeholder="Доп. информация"
          />
        </div>
        <DialogFooter>
          <Button
            className="cursor-pointer"
            disabled={submitting || !form.itemName.trim()}
            onClick={handleSubmit}
          >
            {isEdit ? "Сохранить" : "Разместить"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
