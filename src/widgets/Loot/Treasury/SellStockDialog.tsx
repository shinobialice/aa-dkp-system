"use client";

import { useMemo, useState } from "react";
import { Check, ChevronsUpDown, Info, Minus, Plus } from "lucide-react";
import { toast } from "sonner";
import {
  Button,
  Command,
  CommandInput,
  CommandItem,
  CommandList,
  DateTimePicker,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
  Label,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Tabs,
  TabsList,
  TabsTrigger,
  Textarea,
} from "@/shared/ui";
import { cn } from "@/shared/lib/tw-merge";
import { distributeLootStock } from "@/actions/distributeLootItems";
import { LootIcon } from "../LootBuy/icons/LootIconComponent";
import {
  formatGold,
  formatShortDate,
  plural,
  type StockGroup,
} from "./treasuryModel";

export type SellMode = "sell" | "gift";

type User = { id: number; username: string };

export function SellStockDialog({
  target,
  users,
  onClose,
  onDone,
}: {
  target: { group: StockGroup; mode: SellMode } | null;
  users: User[];
  onClose: () => void;
  onDone: () => Promise<void>;
}) {
  const [mode, setMode] = useState<SellMode>("sell");
  const [recipient, setRecipient] = useState("");
  const [recipientId, setRecipientId] = useState<number | undefined>();
  const [search, setSearch] = useState("");
  const [pickerOpen, setPickerOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [unitPrice, setUnitPrice] = useState(0);
  const [total, setTotal] = useState(0);
  const [totalEdited, setTotalEdited] = useState(false);
  const [soldAt, setSoldAt] = useState(() => new Date());
  const [comment, setComment] = useState("");
  const [saving, setSaving] = useState(false);

  const [lastTarget, setLastTarget] = useState(target);

  if (target && target !== lastTarget) {
    const price = target.group.unitPrice ?? 0;
    setLastTarget(target);
    setMode(target.mode);
    setRecipient("");
    setRecipientId(undefined);
    setSearch("");
    setQuantity(1);
    setUnitPrice(price);
    setTotal(price);
    setTotalEdited(false);
    setSoldAt(new Date());
    setComment("");
  }

  const group = (target ?? lastTarget)?.group ?? null;
  const max = group?.quantity ?? 1;
  const isSell = mode === "sell";

  const sortedUsers = useMemo(
    () => [...users].sort((a, b) => a.username.localeCompare(b.username, "ru")),
    [users],
  );

  const fifo = useMemo(() => {
    if (!group) return "";
    let left = quantity;
    const parts: string[] = [];
    for (const lot of group.lots) {
      if (left <= 0) break;
      const take = Math.min(lot.quantity, left);
      const date = lot.acquiredAt ? formatShortDate(lot.acquiredAt) : "без даты";
      parts.push(`${date} — ${take} шт.`);
      left -= take;
    }
    const rest = parts.length - 3;
    return rest > 0
      ? `${parts.slice(0, 3).join(", ")} и ещё ${rest} ${plural(rest, "дроп", "дропа", "дропов")}`
      : parts.join(", ");
  }, [group, quantity]);

  const quickPicks = useMemo(
    () =>
      [...new Set([1, 5, max])]
        .filter((value) => value <= max)
        .map((value) => ({
          value,
          label: value === max && max > 1 ? `Все ${max}` : String(value),
        })),
    [max],
  );

  const changeQuantity = (value: number) => {
    const next = Math.min(max, Math.max(1, Math.round(value) || 1));
    setQuantity(next);
    if (!totalEdited) setTotal(next * unitPrice);
  };

  const changeUnitPrice = (value: number) => {
    setUnitPrice(value);
    if (!totalEdited) setTotal(quantity * value);
  };

  const resetTotal = () => {
    setTotalEdited(false);
    setTotal(quantity * unitPrice);
  };

  const submit = async () => {
    if (!group) return;
    if (!recipient.trim()) {
      toast.error(isSell ? "Укажите, кому продали" : "Укажите, кому выдали");
      return;
    }
    if (isSell && total <= 0) {
      toast.error("Укажите сумму продажи");
      return;
    }
    setSaving(true);
    try {
      await distributeLootStock({
        itemTypeId: group.itemTypeId,
        quantity,
        soldTo: recipient.trim(),
        soldToId: recipientId,
        isFree: !isSell,
        comment: comment.trim() || undefined,
        price: isSell ? total : 0,
        soldAt: soldAt.toISOString(),
      });
      toast.success(
        `${isSell ? "Продано" : "Выдано"}: ${group.name}${quantity > 1 ? ` ×${quantity}` : ""}`,
      );
      onClose();
      await onDone();
    } catch (error) {
      console.error(error);
      toast.error(
        isSell
          ? "Не удалось продать — обновите страницу и попробуйте снова"
          : "Не удалось выдать — обновите страницу и попробуйте снова",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={!!target} onOpenChange={(open) => !open && !saving && onClose()}>
      <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-[480px]">
        {group && (
          <>
            <DialogHeader className="flex-row items-center gap-3 pr-8 text-left">
              <LootIcon
                itemName={group.name}
                iconUrl={group.iconUrl}
                grade={group.grade}
                size={44}
              />
              <div className="min-w-0 space-y-1">
                <DialogTitle className="leading-snug">{group.name}</DialogTitle>
                <DialogDescription>
                  {group.sources.length ? `${group.sources.join(", ")} · ` : ""}
                  на складе {group.quantity} шт.
                  {group.unitPrice !== null && ` по ${formatGold(group.unitPrice)}`}
                </DialogDescription>
              </div>
            </DialogHeader>

            <div className="flex flex-col gap-4">
              <Tabs value={mode} onValueChange={(value) => setMode(value as SellMode)}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="sell" className="cursor-pointer">
                    Продать
                  </TabsTrigger>
                  <TabsTrigger value="gift" className="cursor-pointer">
                    Выдать бесплатно
                  </TabsTrigger>
                </TabsList>
              </Tabs>

              <div className="flex flex-col gap-2">
                <Label htmlFor="stock-recipient">Кому</Label>
                <Popover open={pickerOpen} onOpenChange={setPickerOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      id="stock-recipient"
                      variant="outline"
                      role="combobox"
                      aria-expanded={pickerOpen}
                      className={cn(
                        "w-full justify-between font-normal",
                        !recipient && "text-muted-foreground",
                      )}
                    >
                      <span className="truncate">
                        {recipient || "Выберите или введите игрока"}
                      </span>
                      <ChevronsUpDown className="opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-[var(--radix-popover-trigger-width)] p-0"
                    align="start"
                  >
                    <Command>
                      <CommandInput
                        placeholder="Поиск игрока…"
                        value={search}
                        onValueChange={(value) => {
                          setSearch(value);
                          setRecipient(value);
                          setRecipientId(undefined);
                        }}
                      />
                      <CommandList>
                        {sortedUsers.map((user) => (
                          <CommandItem
                            key={user.id}
                            value={user.username}
                            className="cursor-pointer"
                            onSelect={() => {
                              setRecipient(user.username);
                              setRecipientId(user.id);
                              setSearch(user.username);
                              setPickerOpen(false);
                            }}
                          >
                            <Check
                              className={cn(
                                recipientId === user.id ? "opacity-100" : "opacity-0",
                              )}
                            />
                            {user.username}
                          </CommandItem>
                        ))}
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="stock-quantity">Количество</Label>
                <div className="flex flex-wrap items-center gap-2">
                  <div className="flex h-9 items-center rounded-md border shadow-xs">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-full rounded-r-none"
                      aria-label="Меньше"
                      disabled={quantity <= 1}
                      onClick={() => changeQuantity(quantity - 1)}
                    >
                      <Minus />
                    </Button>
                    <Input
                      id="stock-quantity"
                      inputMode="numeric"
                      value={quantity}
                      onChange={(event) =>
                        changeQuantity(Number(event.target.value.replace(/\D/g, "")))
                      }
                      className="h-full w-14 rounded-none border-y-0 text-center font-semibold shadow-none focus-visible:ring-0"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-full rounded-l-none"
                      aria-label="Больше"
                      disabled={quantity >= max}
                      onClick={() => changeQuantity(quantity + 1)}
                    >
                      <Plus />
                    </Button>
                  </div>
                  <span className="text-sm text-muted-foreground">из {max}</span>
                  {max > 1 && (
                    <div className="ml-auto flex gap-1.5">
                      {quickPicks.map((pick) => (
                        <Button
                          key={pick.value}
                          type="button"
                          size="sm"
                          variant={quantity === pick.value ? "secondary" : "outline"}
                          aria-pressed={quantity === pick.value}
                          onClick={() => changeQuantity(pick.value)}
                        >
                          {pick.label}
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {isSell && (
                <div className="flex flex-col gap-2">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="stock-unit">Цена за шт.</Label>
                      <Input
                        id="stock-unit"
                        type="number"
                        min={0}
                        inputMode="numeric"
                        value={unitPrice || ""}
                        onChange={(event) => changeUnitPrice(Number(event.target.value))}
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="stock-total">Сумма</Label>
                      <Input
                        id="stock-total"
                        type="number"
                        min={0}
                        inputMode="numeric"
                        value={total || ""}
                        className="font-semibold"
                        onChange={(event) => {
                          setTotalEdited(true);
                          setTotal(Number(event.target.value));
                        }}
                      />
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {totalEdited ? (
                      <>
                        Сумма изменена вручную.{" "}
                        <button
                          type="button"
                          onClick={resetTotal}
                          className="cursor-pointer font-medium text-foreground underline-offset-2 hover:underline"
                        >
                          Пересчитать
                        </button>
                      </>
                    ) : (
                      "Сумма считается сама — поправьте, если продали дешевле"
                    )}
                  </p>
                </div>
              )}

              <div className="flex flex-col gap-2">
                <Label>{isSell ? "Дата продажи" : "Дата выдачи"}</Label>
                <DateTimePicker
                  hideTime
                  value={soldAt}
                  onChange={(date) => date && setSoldAt(date)}
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="stock-comment">Комментарий</Label>
                <Textarea
                  id="stock-comment"
                  rows={2}
                  value={comment}
                  placeholder={
                    isSell ? "Например: выиграл ролл" : "Например: на пробуждение мантии"
                  }
                  onChange={(event) => setComment(event.target.value)}
                />
              </div>

              <div className="flex gap-2.5 rounded-lg border bg-muted/40 p-3 text-sm">
                <Info className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                <div>
                  <p className="font-medium">Спишутся самые старые дропы</p>
                  <p className="text-muted-foreground">{fifo}</p>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={onClose} disabled={saving}>
                Отмена
              </Button>
              <Button
                onClick={submit}
                disabled={saving}
                className={cn(
                  !isSell && "bg-violet-600 text-white hover:bg-violet-600/90",
                )}
              >
                {isSell
                  ? `Продать за ${formatGold(total)}`
                  : `Выдать ${quantity} шт.`}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
