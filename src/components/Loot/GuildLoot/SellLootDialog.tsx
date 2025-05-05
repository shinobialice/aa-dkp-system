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
  maxQuantity = 1,
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
  }) => void;
}) {
  const [soldTo, setSoldTo] = useState("");
  const [soldToId, setSoldToId] = useState<number | undefined>(undefined);
  const [unitPrice, setUnitPrice] = useState(initialPrice ?? 0);
  const [price, setPrice] = useState(initialPrice ?? 0);
  const [quantity, setQuantity] = useState(1);
  const [comment, setComment] = useState("");
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (open) {
      const startPrice = initialPrice ?? 0;
      setUnitPrice(startPrice);
      setQuantity(1);
      setPrice(startPrice);
    }
  }, [initialPrice, open]);

  const handleSubmit = () => {
    if (!soldTo || price <= 0 || quantity < 1 || quantity > maxQuantity) {
      alert("Проверьте данные перед сохранением");
      return;
    }

    onConfirm({ soldTo, soldToId, price, comment, quantity });
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
      <DialogContent className="max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Продажа предмета</DialogTitle>
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

          <Label>Цена за 1 шт</Label>
          <div className="text-sm text-muted-foreground font-semibold flex items-center gap-1">
            {unitPrice.toLocaleString("ru-RU")}
            <Coins className="w-4 h-4" />
          </div>

          <Label>Количество</Label>
          <Input
            type="number"
            min={1}
            max={maxQuantity}
            value={quantity === 0 ? "" : quantity}
            onChange={(e) => {
              const val = Number(e.target.value);
              if (!isNaN(val)) {
                setQuantity(val);
                setPrice(val * unitPrice);
              }
            }}
          />

          <Label>Общая цена (можно изменить)</Label>
          <Input
            type="number"
            min={1}
            value={price === 0 ? "" : price}
            onChange={(e) => {
              const val = Number(e.target.value);
              if (!isNaN(val)) setPrice(val);
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
