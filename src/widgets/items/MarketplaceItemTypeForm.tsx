"use client";

import { useState } from "react";
import { toast } from "sonner";
import { IconField } from "./IconField";
import GradeField from "./GradeField";
import {
  createMarketplaceItemType,
  updateMarketplaceItemType,
  uploadMarketplaceItemTypeIcon,
  type MarketplaceItemTypeRow,
} from "@/actions/marketplaceItemTypeAdmin";
import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui";
import { errorMessage } from "@/shared/lib/errorMessage";

type Props = {
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
  item: MarketplaceItemTypeRow | null;
};

export function MarketplaceItemTypeForm({
  open,
  onClose,
  onSaved,
  item,
}: Props) {
  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent aria-describedby={undefined} className="sm:max-w-100">
        <DialogHeader>
          <DialogTitle>
            {item ? "Изменить предмет" : "Добавить предмет"}
          </DialogTitle>
        </DialogHeader>
        <FormBody item={item} onClose={onClose} onSaved={onSaved} />
      </DialogContent>
    </Dialog>
  );
}

function FormBody({ item, onClose, onSaved }: Omit<Props, "open">) {
  const [name, setName] = useState(item?.name ?? "");
  const [iconUrl, setIconUrl] = useState(item?.icon_url ?? "");
  const [grade, setGrade] = useState(String(item?.grade ?? 1));
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!name.trim()) {
      toast.error("Введите название предмета");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        name,
        iconUrl: iconUrl.trim() === "" ? null : iconUrl.trim(),
        grade: Number(grade),
      };
      if (item) {
        await updateMarketplaceItemType(item.id, payload);
      } else {
        await createMarketplaceItemType(payload);
      }
      toast.success("Предмет сохранён");
      onSaved();
      onClose();
    } catch (error) {
      toast.error(errorMessage(error, "Не удалось сохранить предмет"));
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <div className="flex flex-col gap-3 py-2">
        <div className="space-y-2">
          <Label>Название</Label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Название предмета"
          />
        </div>

        <IconField
          value={iconUrl}
          onChange={setIconUrl}
          uploadAction={uploadMarketplaceItemTypeIcon}
        />

        <GradeField value={grade} onChange={setGrade} />
      </div>
      <DialogFooter>
        <Button
          className="cursor-pointer"
          variant="secondary"
          onClick={onClose}
        >
          Отмена
        </Button>
        <Button
          className="cursor-pointer"
          disabled={saving}
          onClick={handleSave}
        >
          {saving ? "Сохранение..." : "Сохранить"}
        </Button>
      </DialogFooter>
    </>
  );
}
