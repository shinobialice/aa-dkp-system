"use client";

import { useState } from "react";
import Image from "next/image";
import { RussianRuble, ShoppingCart, Tag } from "lucide-react";
import { toast } from "sonner";
import { type MarketplaceItemTypeRow } from "@/actions/marketplaceItemTypeAdmin";
import {
  createMarketplaceListing,
  updateMarketplaceListing,
  type MarketplaceListing,
} from "@/actions/marketplaceActions";
import { Button, GOLD_ICON_URL } from "@/shared/ui";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/shared/ui";
import { Input } from "@/shared/ui";
import { Label } from "@/shared/ui";
import { Textarea } from "@/shared/ui";
import { errorMessage } from "@/shared/lib/errorMessage";
import { type FormState, buildInitialForm } from "./listingForm";
import ChoiceToggle, { type Choice } from "./ChoiceToggle";
import ItemSourceTabs, { type ListingMode } from "./ItemSourceTabs";

const LISTING_TYPES: Choice<FormState["listingType"]>[] = [
  { value: "sell", label: "Продам", icon: <Tag className="h-4 w-4" /> },
  { value: "buy", label: "Куплю", icon: <ShoppingCart className="h-4 w-4" /> },
];

const CURRENCIES: Choice<FormState["currency"]>[] = [
  {
    value: "gold",
    label: "Голда",
    icon: <Image src={GOLD_ICON_URL} alt="" width={16} height={16} />,
  },
  { value: "rub", label: "Рубли", icon: <RussianRuble className="h-4 w-4" /> },
];

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
  const [mode, setMode] = useState<ListingMode>(
    !listing || listing.catalog_item_id ? "catalog" : "custom",
  );
  const [form, setForm] = useState<FormState>(() => buildInitialForm(listing));
  const [submitting, setSubmitting] = useState(false);
  const update = (patch: Partial<FormState>) =>
    setForm((current) => ({ ...current, ...patch }));

  const selectedCatalogItem = catalogItems.find(
    (item) => item.id === form.catalogItemId,
  );
  const isItemChosen =
    form.itemName.trim() !== "" &&
    (mode === "custom" || selectedCatalogItem !== undefined);

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
        catalogItemId: mode === "catalog" ? form.catalogItemId : null,
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
      toast.error(errorMessage(error, "Не удалось сохранить объявление"));
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
          <ChoiceToggle
            value={form.listingType}
            choices={LISTING_TYPES}
            onChange={(listingType) => update({ listingType })}
          />

          <ItemSourceTabs
            mode={mode}
            form={form}
            catalogItems={catalogItems}
            selectedCatalogItem={selectedCatalogItem}
            onModeChange={(next) => {
              setMode(next);
              update({ catalogItemId: null, itemName: "", imageUrl: "" });
            }}
            onChange={update}
          />

          <Label className="pt-2">Количество</Label>
          <Input
            type="number"
            min={1}
            value={form.quantity}
            onChange={(e) =>
              update({ quantity: Math.max(1, Number(e.target.value) || 1) })
            }
          />

          <Label>Цена (необязательно)</Label>
          <div className="flex gap-2">
            <Input
              type="number"
              min={0}
              value={form.price}
              onChange={(e) => update({ price: e.target.value })}
              placeholder="Оставьте пустым, если цена договорная"
            />
            <ChoiceToggle
              value={form.currency}
              choices={CURRENCIES}
              onChange={(currency) => update({ currency })}
              compact
            />
          </div>

          <Label>Комментарий</Label>
          <Textarea
            value={form.description}
            onChange={(e) => update({ description: e.target.value })}
            placeholder="Доп. информация"
          />
        </div>
        <DialogFooter>
          <Button
            className="cursor-pointer"
            disabled={submitting || !isItemChosen}
            onClick={handleSubmit}
          >
            {isEdit ? "Сохранить" : "Разместить"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
