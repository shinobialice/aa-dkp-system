import type { MarketplaceItemTypeRow } from "@/actions/marketplaceItemTypeAdmin";
import { uploadMarketplaceListingImage } from "@/actions/marketplaceActions";
import { IconField } from "@/widgets/items/IconField";
import { LootIcon } from "@/widgets/Loot/LootBuy/icons/LootIconComponent";
import {
  Input,
  Label,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/shared/ui";
import { MarketplaceItemSelector } from "./MarketplaceItemSelector";
import type { FormState } from "./listingForm";

export type ListingMode = "catalog" | "custom";

type Props = {
  mode: ListingMode;
  form: FormState;
  catalogItems: MarketplaceItemTypeRow[];
  selectedCatalogItem: MarketplaceItemTypeRow | undefined;
  onModeChange: (mode: ListingMode) => void;
  onChange: (patch: Partial<FormState>) => void;
};

export default function ItemSourceTabs({
  mode,
  form,
  catalogItems,
  selectedCatalogItem,
  onModeChange,
  onChange,
}: Props) {
  return (
    <Tabs
      value={mode}
      onValueChange={(next) => onModeChange(next as ListingMode)}
    >
      <TabsList className="w-full">
        <TabsTrigger value="catalog">Предмет из базы</TabsTrigger>
        <TabsTrigger value="custom">Свой предмет</TabsTrigger>
      </TabsList>

      <TabsContent value="catalog" className="flex flex-col gap-2 pt-2">
        <Label>Предмет</Label>
        {form.itemName && (
          <div className="flex items-center gap-2">
            <LootIcon
              itemName={form.itemName}
              iconUrl={selectedCatalogItem?.icon_url}
              grade={selectedCatalogItem?.grade}
              size={32}
            />
            <span className="font-medium">{form.itemName}</span>
          </div>
        )}
        <MarketplaceItemSelector
          value={form.itemName}
          onSelect={(name) => onChange({ itemName: name })}
          catalogItems={catalogItems}
        />
      </TabsContent>

      <TabsContent value="custom" className="flex flex-col gap-2 pt-2">
        <Label>Название предмета</Label>
        <Input
          value={form.itemName}
          onChange={(e) => onChange({ itemName: e.target.value })}
          placeholder="Например: Голду"
        />
        <IconField
          value={form.imageUrl}
          onChange={(url) => onChange({ imageUrl: url })}
          uploadAction={uploadMarketplaceListingImage}
          label="Фото предмета (необязательно)"
          size={64}
        />
      </TabsContent>
    </Tabs>
  );
}
