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

export function SellLootDialog({
  open,
  onClose,
  onConfirm,
  initialPrice,
  users = [],
}: {
  open: boolean;
  onClose: () => void;
  initialPrice?: number;
  users?: { id: number; username: string }[];
  onConfirm: (data: {
    soldTo: string;
    soldToId?: number;
    price: number;
    comment?: string;
  }) => void;
}) {
  const [soldTo, setSoldTo] = useState("");
  const [soldToId, setSoldToId] = useState<number | undefined>(undefined);
  const [price, setPrice] = useState(initialPrice ?? 0);
  const [comment, setComment] = useState("");
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (open) {
      setPrice(initialPrice ?? 0);
      setSoldTo("");
      setSoldToId(undefined);
      setSearch("");
      setComment("");
    }
  }, [initialPrice, open]);

  const handleSubmit = () => {
    if (!soldTo || price <= 0) return alert("Укажите покупателя и цену");
    onConfirm({ soldTo, soldToId, price, comment });
    onClose();
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
              <Command shouldFilter={false}>
                <CommandInput
                  placeholder="Поиск или ввод..."
                  value={search}
                  onValueChange={(val) => {
                    setSearch(val);
                    setSoldTo(val);
                    setSoldToId(undefined); // сбрасываем ID, если ввод ручной
                  }}
                />
                <CommandList>
                  {users
                    .filter((u) =>
                      u.username.toLowerCase().includes(search.toLowerCase())
                    )
                    .map((user) => (
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
                            soldTo === user.username
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                        {user.username}
                      </CommandItem>
                    ))}
                  {search &&
                    !users.some(
                      (u) => u.username.toLowerCase() === search.toLowerCase()
                    ) && (
                      <CommandItem
                        value={search}
                        onSelect={() => {
                          setSoldTo(search);
                          setSoldToId(undefined);
                          setIsOpen(false);
                        }}
                      >
                        <Check className="mr-2 h-4 w-4 opacity-100" />
                        Добавить:{" "}
                        <span className="ml-1 font-medium">{search}</span>
                      </CommandItem>
                    )}
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>

          <Label>Цена</Label>
          <Input
            type="number"
            min={1}
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
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
