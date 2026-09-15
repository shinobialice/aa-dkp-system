"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { IconField } from "./IconField";
import { getSealGradeLabel, getSealGradeColor } from "@/widgets/profile/seals/sealsData";
import {
  createMarketplaceItemType,
  updateMarketplaceItemType,
  uploadMarketplaceItemTypeIcon,
  MarketplaceItemTypeRow,
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

const GRADE_OPTIONS = Array.from({ length: 12 }, (_, i) => i + 1);

export function MarketplaceItemTypeForm({
  open,
  onClose,
  onSaved,
  item,
}: {
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
  item: MarketplaceItemTypeRow | null;
}) {
  const [name, setName] = useState("");
  const [iconUrl, setIconUrl] = useState("");
  const [grade, setGrade] = useState("1");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    setName(item?.name ?? "");
    setIconUrl(item?.icon_url ?? "");
    setGrade(String(item?.grade ?? 1));
  }, [open, item]);

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
      toast.error(
        error instanceof Error ? error.message : "Не удалось сохранить предмет",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent aria-describedby={undefined} className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>
            {item ? "Изменить предмет" : "Добавить предмет"}
          </DialogTitle>
        </DialogHeader>
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

          <div className="space-y-2">
            <Label>Рамка редкости</Label>
            <Select value={grade} onValueChange={setGrade}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {GRADE_OPTIONS.map((g) => {
                  const color = getSealGradeColor(g);
                  return (
                    <SelectItem key={g} value={String(g)}>
                      <span style={color ? { color } : undefined}>
                        {g} — {getSealGradeLabel(g)}
                      </span>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button
            className="cursor-pointer"
            variant="secondary"
            onClick={onClose}
          >
            Отмена
          </Button>
          <Button className="cursor-pointer" disabled={saving} onClick={handleSave}>
            {saving ? "Сохранение..." : "Сохранить"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
