"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  Command,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Coins } from "lucide-react";

type User = { id: number; username: string };

export function SellLootDialog({
  open,
  onClose,
  onConfirm,
  initialPrice,
  users = [],
  maxQuantity,
  editMode, // ← ЭТО надо ДОБАВИТЬ
  initialValues, // ← ЭТО надо ДОБАВИТЬ
}: {
  open: boolean;
  onClose: () => void;
  initialPrice?: number;
  users?: User[];
  maxQuantity?: number;
  onConfirm: (data: {
    soldTo: string;
    soldToId?: number;
    price: number;
    comment?: string;
    quantity: number;
    isFree?: boolean;
  }) => void;
  editMode?: boolean;
  initialValues?: {
    soldTo?: string;
    soldToId?: number;
    quantity?: number;
    price?: number;
    comment?: string;
  };
}) {
  const [soldTo, setSoldTo] = useState("");
  const [soldToId, setSoldToId] = useState<number | undefined>(undefined);
  const [unitPrice, setUnitPrice] = useState(initialPrice ?? 0);
  const [price, setPrice] = useState(initialPrice ?? 0);
  const [quantity, setQuantity] = useState(1);
  const [comment, setComment] = useState("");
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [manualPriceEdit, setManualPriceEdit] = useState(false);
  const [isFree, setIsFree] = useState(false);

  // Fallback to default value (1) if maxQuantity is undefined
  const effectiveMaxQuantity = maxQuantity ?? 1;

  useEffect(() => {
    if (!manualPriceEdit) {
      setPrice(isFree ? 0 : quantity * unitPrice);
    }
  }, [quantity, unitPrice, manualPriceEdit, isFree]);

  useEffect(() => {
    if (open) {
      if (editMode && initialValues) {
        setSoldTo(initialValues.soldTo ?? "");
        setSoldToId(initialValues.soldToId);
        setQuantity(initialValues.quantity ?? 1);
        setPrice(initialValues.price ?? 0);
        setUnitPrice(initialValues.price ?? 0);
        setComment(initialValues.comment ?? "");
        setIsFree(false);
        setManualPriceEdit(false);
      } else {
        const startPrice = initialPrice ?? 0;
        setUnitPrice(startPrice);
        setQuantity(1);
        setPrice(startPrice);
        setSoldTo("");
        setSoldToId(undefined);
        setComment("");
        setIsFree(false);
        setManualPriceEdit(false);
      }
    }
  }, [open, editMode, initialValues, initialPrice]);

  const handleSubmit = () => {
    console.log("📤 SellLootDialog → onConfirm", {
      soldTo,
      price,
      quantity,
      isFree,
    });

    console.log("Проверка данных перед отправкой...");
    console.log("soldTo:", soldTo);
    console.log("price:", price);
    console.log("quantity:", quantity);
    console.log("isFree:", isFree);
    console.log("maxQuantity:", effectiveMaxQuantity);

    if (
      !soldTo ||
      quantity < 1 ||
      quantity > effectiveMaxQuantity ||
      (!isFree && price <= 0)
    ) {
      console.log("Ошибка валидации: данные не прошли проверку.");
      alert("Проверьте данные перед сохранением");
      return;
    }

    // Если все валидно, отправляем данные
    console.log("Данные прошли валидацию. Отправка...");
    onConfirm({
      soldTo,
      soldToId,
      price: isFree ? 0 : price, // Если бесплатно, то цена 0
      comment,
      quantity,
      isFree,
    });

    // Закрытие диалога и сброс полей
    console.log("Закрытие диалога и сброс данных");
    onClose();
    setSoldTo("");
    setSoldToId(undefined);
    setPrice(0);
    setQuantity(1);
    setComment("");
    setSearch("");
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent aria-describedby={undefined} className="max-w-[400px]">
        <DialogHeader>
          <DialogTitle>
            {editMode ? "Изменение предмета" : "Продажа предмета"}
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-2 py-2">
          <Label>Кому</Label>
          <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
              <button
                type="button"
                className={cn(
                  "w-full justify-between border rounded px-3 py-2 text-sm flex items-center",
                  !soldTo && "text-muted-foreground"
                )}
              >
                {soldTo || "Выберите или введите игрока"}
                <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-[300px] p-0">
              <Command>
                <CommandInput
                  placeholder="Поиск..."
                  value={search}
                  onValueChange={(val) => {
                    setSearch(val);
                    setSoldTo(val);
                    setSoldToId(undefined);
                  }}
                />
                <CommandList>
                  {users.map((user) => (
                    <CommandItem
                      key={user.id}
                      value={user.username}
                      onSelect={() => {
                        setSoldTo(user.username);
                        setSoldToId(user.id);
                        setSearch(user.username);
                        setIsOpen(false);
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          soldTo === user.username ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {user.username}
                    </CommandItem>
                  ))}
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>

          <Label className="flex items-center gap-2 mt-2">
            <input
              type="checkbox"
              checked={isFree}
              onChange={(e) => {
                setIsFree(e.target.checked);
                if (e.target.checked) {
                  setManualPriceEdit(false);
                  setPrice(0); // сбросить цену в 0 при выборе "выдать бесплатно"
                } else {
                  setPrice(quantity * unitPrice);
                }
              }}
            />
            Выдать бесплатно (0 голды)
          </Label>

          <Label>Цена за 1 шт</Label>
          <div className="text-sm text-muted-foreground font-semibold flex items-center gap-1">
            {unitPrice.toLocaleString("ru-RU")}
            <Coins className="w-4 h-4" />
          </div>

          <Label>Количество</Label>
          <Input
            type="number"
            min={1}
            max={effectiveMaxQuantity} // использует значение effectiveMaxQuantity
            value={quantity === 0 ? "" : quantity}
            onChange={(e) => {
              const val = Number(e.target.value);
              if (!isNaN(val)) {
                setQuantity(val);
                setPrice(val * unitPrice);
              }
            }}
          />

          <Label>Общая цена</Label>
          <Input
            type="number"
            min={0}
            value={price > 0 ? price : ""}
            disabled={isFree}
            onChange={(e) => {
              if (isFree) return;
              setManualPriceEdit(true);
              const val = Number(e.target.value);
              if (!Number.isNaN(val)) setPrice(val);
            }}
            onBlur={() => {
              if (!price || price < 1) {
                setManualPriceEdit(false);
                setPrice(quantity * unitPrice);
              }
            }}
          />

          <Label>Комментарий</Label>
          <Input value={comment} onChange={(e) => setComment(e.target.value)} />
        </div>

        <DialogFooter>
          <Button variant="secondary" onClick={onClose}>
            Отмена
          </Button>
          <Button onClick={handleSubmit}>Сохранить</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
