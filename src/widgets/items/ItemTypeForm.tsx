"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { IconField } from "./IconField";
import { SourceSelector } from "@/widgets/Loot/GuildLoot/SourceSelector";
import { getSealGradeLabel, getSealGradeColor } from "@/widgets/profile/seals/sealsData";
import {
  createItemType,
  updateItemType,
  uploadItemTypeIcon,
  ItemTypeRow,
} from "@/actions/itemTypeAdmin";
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
  Switch,
} from "@/shared/ui";

const GRADE_OPTIONS = Array.from({ length: 12 }, (_, i) => i + 1);

export function ItemTypeForm({
  open,
  onClose,
  onSaved,
  item,
}: {
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
  item: ItemTypeRow | null;
}) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [iconUrl, setIconUrl] = useState("");
  const [grade, setGrade] = useState("1");
  const [source, setSource] = useState("");
  const [showInBuy, setShowInBuy] = useState(true);
  const [category, setCategory] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    setName(item?.name ?? "");
    setPrice(item?.price != null ? String(item.price) : "");
    setIconUrl(item?.icon_url ?? "");
    setGrade(String(item?.grade ?? 1));
    setSource(item?.source ?? "");
    setShowInBuy(item?.show_in_buy ?? true);
    setCategory(item?.category ?? "");
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
        price: price.trim() === "" ? null : Number(price),
        iconUrl: iconUrl.trim() === "" ? null : iconUrl.trim(),
        grade: Number(grade),
        source: source.trim() === "" ? null : source.trim(),
        showInBuy,
        category: category === "" ? null : category,
      };
      if (item) {
        await updateItemType(item.id, payload);
      } else {
        await createItemType(payload);
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
      <DialogContent aria-describedby={undefined} className="sm:max-w-[425px]">
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

          <div className="space-y-2">
            <Label>Цена (в казне/покупке лута)</Label>
            <Input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Необязательно"
            />
          </div>

          <IconField
            value={iconUrl}
            onChange={setIconUrl}
            uploadAction={uploadItemTypeIcon}
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

          <div className="space-y-2">
            <Label>Источник (босс)</Label>
            <p className="text-xs text-muted-foreground">
              На какой вкладке боссов показывать предмет в «Покупке лута».
            </p>
            <SourceSelector value={source} onChange={setSource} />
          </div>

          <div className="space-y-2">
            <Label>Категория</Label>
            <p className="text-xs text-muted-foreground">
              На какой вкладке инвентаря профиля предлагать
              этот предмет при добавлении («Добавить предмет»).
            </p>
            <Select
              value={category === "" ? "none" : category}
              onValueChange={(v) => setCategory(v === "none" ? "" : v)}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">-</SelectItem>
                <SelectItem value="Другое">Другое</SelectItem>
                <SelectItem value="Глайдеры">Глайдер</SelectItem>
                <SelectItem value="Петы">Пет</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between rounded-lg border p-3">
            <div className="space-y-0.5">
              <Label>Показывать в покупке лута</Label>
            </div>
            <Switch checked={showInBuy} onCheckedChange={setShowInBuy} />
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
