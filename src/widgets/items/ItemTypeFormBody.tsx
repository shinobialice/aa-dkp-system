"use client";

import { useState } from "react";
import { toast } from "sonner";
import { IconField } from "./IconField";
import GradeField from "./GradeField";
import SourceSelector from "@/widgets/Loot/GuildLoot/SourceSelector";
import {
  createItemType,
  updateItemType,
  uploadItemTypeIcon,
  type ItemTypeRow,
} from "@/actions/itemTypeAdmin";
import {
  Button,
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
import { errorMessage } from "@/shared/lib/errorMessage";

type Props = {
  item: ItemTypeRow | null;
  onClose: () => void;
  onSaved: () => void;
};

export default function ItemTypeFormBody({ item, onClose, onSaved }: Props) {
  const initial = toDraft(item);
  const [name, setName] = useState(initial.name);
  const [price, setPrice] = useState(initial.price);
  const [iconUrl, setIconUrl] = useState(initial.iconUrl);
  const [grade, setGrade] = useState(initial.grade);
  const [source, setSource] = useState(initial.source);
  const [showInBuy, setShowInBuy] = useState(initial.showInBuy);
  const [category, setCategory] = useState(initial.category);
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
        price: blankToNull(price) === null ? null : Number(price),
        iconUrl: blankToNull(iconUrl),
        grade: Number(grade),
        source: blankToNull(source),
        showInBuy,
        category: blankToNull(category),
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

        <GradeField value={grade} onChange={setGrade} />

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
            На какой вкладке инвентаря профиля предлагать этот предмет при
            добавлении («Добавить предмет»).
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

function toDraft(item: ItemTypeRow | null) {
  return {
    name: item?.name ?? "",
    price: item?.price == null ? "" : String(item.price),
    iconUrl: item?.icon_url ?? "",
    grade: String(item?.grade ?? 1),
    source: item?.source ?? "",
    showInBuy: item?.show_in_buy ?? true,
    category: item?.category ?? "",
  };
}

function blankToNull(value: string) {
  const trimmed = value.trim();
  return trimmed === "" ? null : trimmed;
}
